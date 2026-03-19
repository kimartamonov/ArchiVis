import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { buildGraph } from '../buildGraph';
import type { NormalizedModel } from '../../types';
import { makeElement, makeRelationship, makeModel } from './fixtures';

describe('buildGraph', () => {
  // -----------------------------------------------------------------------
  // Basic construction
  // -----------------------------------------------------------------------

  it('builds a graph from a minimal model (1 element, 0 relationships)', () => {
    const model = makeModel([makeElement('a', 'A')]);

    const { graph, warnings } = buildGraph(model);

    expect(graph.nodes.size).toBe(1);
    expect(graph.edges.length).toBe(0);
    expect(warnings.length).toBe(0);
    expect(graph.nodes.get('a')!.degree).toBe(0);
    expect(graph.nodes.get('a')!.isOrphan).toBe(true);
  });

  it('creates correct number of nodes and edges for known input', () => {
    const model = makeModel(
      [
        makeElement('a', 'A', 'ApplicationComponent'),
        makeElement('b', 'B', 'ApplicationService'),
        makeElement('c', 'C', 'BusinessProcess'),
      ],
      [
        makeRelationship('r1', 'a', 'b', 'ServingRelationship'),
        makeRelationship('r2', 'b', 'c', 'FlowRelationship'),
      ],
    );

    const { graph, warnings } = buildGraph(model);
    expect(graph.nodes.size).toBe(3);
    expect(graph.edges.length).toBe(2);
    expect(warnings.length).toBe(0);
  });

  it('builds correct adjacency lists', () => {
    const model = makeModel(
      [makeElement('a', 'A'), makeElement('b', 'B'), makeElement('c', 'C')],
      [
        makeRelationship('r1', 'a', 'b'),
        makeRelationship('r2', 'a', 'c'),
        makeRelationship('r3', 'b', 'c'),
      ],
    );

    const { graph } = buildGraph(model);

    expect(graph.adjacencyOut.get('a')).toEqual(['b', 'c']);
    expect(graph.adjacencyOut.get('b')).toEqual(['c']);
    expect(graph.adjacencyOut.get('c')).toEqual([]);

    expect(graph.adjacencyIn.get('a')).toEqual([]);
    expect(graph.adjacencyIn.get('b')).toEqual(['a']);
    expect(graph.adjacencyIn.get('c')).toEqual(['a', 'b']);
  });

  it('computes correct degree metrics', () => {
    const model = makeModel(
      [makeElement('a', 'A'), makeElement('b', 'B')],
      [makeRelationship('r1', 'a', 'b')],
    );

    const { graph } = buildGraph(model);
    const nodeA = graph.nodes.get('a')!;
    const nodeB = graph.nodes.get('b')!;

    expect(nodeA.outDegree).toBe(1);
    expect(nodeA.inDegree).toBe(0);
    expect(nodeA.degree).toBe(1);

    expect(nodeB.outDegree).toBe(0);
    expect(nodeB.inDegree).toBe(1);
    expect(nodeB.degree).toBe(1);
  });

  // -----------------------------------------------------------------------
  // Broken references
  // -----------------------------------------------------------------------

  it('collects broken reference warnings and skips invalid edges', () => {
    const model = makeModel(
      [makeElement('a', 'A'), makeElement('b', 'B')],
      [
        makeRelationship('r1', 'a', 'b'),
        makeRelationship('r2', 'a', 'missing'),
        makeRelationship('r3', 'ghost', 'b'),
      ],
    );

    const { graph, warnings } = buildGraph(model);
    expect(graph.edges.length).toBe(1);
    expect(warnings.length).toBe(2);
    expect(warnings[0].targetId).toBe('missing');
    expect(warnings[1].sourceId).toBe('ghost');
  });

  // -----------------------------------------------------------------------
  // Empty model
  // -----------------------------------------------------------------------

  it('handles empty model without error', () => {
    const model = makeModel([], []);
    const { graph, warnings } = buildGraph(model);

    expect(graph.nodes.size).toBe(0);
    expect(graph.edges.length).toBe(0);
    expect(warnings.length).toBe(0);
  });

  // -----------------------------------------------------------------------
  // Duplicate element IDs
  // -----------------------------------------------------------------------

  it('handles duplicate element IDs gracefully (last wins)', () => {
    const model = makeModel(
      [
        makeElement('a', 'First A', 'ApplicationComponent', ['d1']),
        makeElement('b', 'B'),
        makeElement('a', 'Second A', 'BusinessProcess', ['d1', 'd2']),
      ],
      [makeRelationship('r1', 'a', 'b')],
    );

    const { graph, warnings } = buildGraph(model);

    // Map.set with same key overwrites — last element with id 'a' wins
    expect(graph.nodes.size).toBe(2);
    expect(graph.nodes.get('a')!.element.name).toBe('Second A');
    expect(graph.nodes.get('a')!.element.type).toBe('BusinessProcess');
    expect(graph.edges.length).toBe(1);
    expect(warnings.length).toBe(0);
  });

  // -----------------------------------------------------------------------
  // Cycles
  // -----------------------------------------------------------------------

  it('handles cycles correctly (A → B → C → A)', () => {
    const model = makeModel(
      [makeElement('a', 'A'), makeElement('b', 'B'), makeElement('c', 'C')],
      [
        makeRelationship('r1', 'a', 'b'),
        makeRelationship('r2', 'b', 'c'),
        makeRelationship('r3', 'c', 'a'),
      ],
    );

    const { graph, warnings } = buildGraph(model);
    expect(graph.nodes.size).toBe(3);
    expect(graph.edges.length).toBe(3);
    expect(warnings.length).toBe(0);

    // Each node should have degree 2 (1 in + 1 out)
    for (const node of graph.nodes.values()) {
      expect(node.degree).toBe(2);
      expect(node.inDegree).toBe(1);
      expect(node.outDegree).toBe(1);
    }
  });

  it('handles self-loop (A → A) without infinite loop', () => {
    const model = makeModel(
      [makeElement('a', 'A', 'ApplicationComponent', ['d1'])],
      [makeRelationship('r1', 'a', 'a')],
    );

    const { graph, warnings } = buildGraph(model);
    expect(graph.nodes.size).toBe(1);
    expect(graph.edges.length).toBe(1);
    expect(warnings.length).toBe(0);

    const nodeA = graph.nodes.get('a')!;
    expect(nodeA.inDegree).toBe(1);
    expect(nodeA.outDegree).toBe(1);
    expect(nodeA.degree).toBe(2);
  });

  // -----------------------------------------------------------------------
  // Orphan detection (preliminary — degree === 0 only)
  // -----------------------------------------------------------------------

  it('marks orphan nodes correctly (degree === 0)', () => {
    const model = makeModel(
      [makeElement('a', 'A'), makeElement('b', 'B'), makeElement('orphan', 'Orphan')],
      [makeRelationship('r1', 'a', 'b')],
    );

    const { graph } = buildGraph(model);
    expect(graph.nodes.get('a')!.isOrphan).toBe(false);
    expect(graph.nodes.get('b')!.isOrphan).toBe(false);
    expect(graph.nodes.get('orphan')!.isOrphan).toBe(true);
  });

  // -----------------------------------------------------------------------
  // diagramsCount
  // -----------------------------------------------------------------------

  it('sets diagramsCount from element.diagramIds', () => {
    const model = makeModel([
      makeElement('a', 'A', 'X', ['d1', 'd2']),
      makeElement('b', 'B', 'X', []),
    ]);

    const { graph } = buildGraph(model);
    expect(graph.nodes.get('a')!.diagramsCount).toBe(2);
    expect(graph.nodes.get('b')!.diagramsCount).toBe(0);
  });

  // -----------------------------------------------------------------------
  // Edge references point to the same node objects
  // -----------------------------------------------------------------------

  it('edge source/target reference the same GraphNode objects in the nodes map', () => {
    const model = makeModel(
      [makeElement('a', 'A'), makeElement('b', 'B')],
      [makeRelationship('r1', 'a', 'b')],
    );

    const { graph } = buildGraph(model);
    const edge = graph.edges[0];
    expect(edge.source).toBe(graph.nodes.get('a'));
    expect(edge.target).toBe(graph.nodes.get('b'));
  });

  // -----------------------------------------------------------------------
  // Smoke: demo dataset
  // -----------------------------------------------------------------------

  it('builds graph from demo dataset with expected counts', () => {
    const demoJson: NormalizedModel = JSON.parse(
      readFileSync(resolve(__dirname, '../../../../demo/digital-bank.json'), 'utf-8'),
    );

    const { graph, warnings } = buildGraph(demoJson);
    expect(graph.nodes.size).toBe(102);
    expect(graph.edges.length).toBe(160);
    expect(warnings.length).toBe(0);
  });
});
