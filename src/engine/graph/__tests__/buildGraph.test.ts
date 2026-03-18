import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { buildGraph } from '../buildGraph';
import type { NormalizedModel } from '../../types';

function makeModel(
  elements: NormalizedModel['elements'],
  relationships: NormalizedModel['relationships'] = [],
  diagrams: NormalizedModel['diagrams'] = [],
): NormalizedModel {
  return {
    id: 'test',
    name: 'Test Model',
    elements,
    relationships,
    diagrams,
    warnings: [],
  };
}

describe('buildGraph', () => {
  // -----------------------------------------------------------------------
  // Basic construction
  // -----------------------------------------------------------------------

  it('creates correct number of nodes and edges for known input', () => {
    const model = makeModel(
      [
        { id: 'a', name: 'A', type: 'ApplicationComponent', diagramIds: [] },
        { id: 'b', name: 'B', type: 'ApplicationService', diagramIds: [] },
        { id: 'c', name: 'C', type: 'BusinessProcess', diagramIds: [] },
      ],
      [
        { id: 'r1', sourceId: 'a', targetId: 'b', type: 'ServingRelationship' },
        { id: 'r2', sourceId: 'b', targetId: 'c', type: 'FlowRelationship' },
      ],
    );

    const { graph, warnings } = buildGraph(model);
    expect(graph.nodes.size).toBe(3);
    expect(graph.edges.length).toBe(2);
    expect(warnings.length).toBe(0);
  });

  it('builds correct adjacency lists', () => {
    const model = makeModel(
      [
        { id: 'a', name: 'A', type: 'X', diagramIds: [] },
        { id: 'b', name: 'B', type: 'X', diagramIds: [] },
        { id: 'c', name: 'C', type: 'X', diagramIds: [] },
      ],
      [
        { id: 'r1', sourceId: 'a', targetId: 'b', type: 'R' },
        { id: 'r2', sourceId: 'a', targetId: 'c', type: 'R' },
        { id: 'r3', sourceId: 'b', targetId: 'c', type: 'R' },
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
      [
        { id: 'a', name: 'A', type: 'X', diagramIds: [] },
        { id: 'b', name: 'B', type: 'X', diagramIds: [] },
      ],
      [{ id: 'r1', sourceId: 'a', targetId: 'b', type: 'R' }],
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
      [
        { id: 'a', name: 'A', type: 'X', diagramIds: [] },
        { id: 'b', name: 'B', type: 'X', diagramIds: [] },
      ],
      [
        { id: 'r1', sourceId: 'a', targetId: 'b', type: 'R' },
        { id: 'r2', sourceId: 'a', targetId: 'missing', type: 'R' },
        { id: 'r3', sourceId: 'ghost', targetId: 'b', type: 'R' },
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
  // Cycles
  // -----------------------------------------------------------------------

  it('handles cycles correctly', () => {
    const model = makeModel(
      [
        { id: 'a', name: 'A', type: 'X', diagramIds: [] },
        { id: 'b', name: 'B', type: 'X', diagramIds: [] },
        { id: 'c', name: 'C', type: 'X', diagramIds: [] },
      ],
      [
        { id: 'r1', sourceId: 'a', targetId: 'b', type: 'R' },
        { id: 'r2', sourceId: 'b', targetId: 'c', type: 'R' },
        { id: 'r3', sourceId: 'c', targetId: 'a', type: 'R' },
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

  // -----------------------------------------------------------------------
  // Orphan detection
  // -----------------------------------------------------------------------

  it('marks orphan nodes correctly', () => {
    const model = makeModel(
      [
        { id: 'a', name: 'A', type: 'X', diagramIds: [] },
        { id: 'b', name: 'B', type: 'X', diagramIds: [] },
        { id: 'orphan', name: 'Orphan', type: 'X', diagramIds: [] },
      ],
      [{ id: 'r1', sourceId: 'a', targetId: 'b', type: 'R' }],
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
      { id: 'a', name: 'A', type: 'X', diagramIds: ['d1', 'd2'] },
      { id: 'b', name: 'B', type: 'X', diagramIds: [] },
    ]);

    const { graph } = buildGraph(model);
    expect(graph.nodes.get('a')!.diagramsCount).toBe(2);
    expect(graph.nodes.get('b')!.diagramsCount).toBe(0);
  });

  // -----------------------------------------------------------------------
  // Smoke: demo dataset
  // -----------------------------------------------------------------------

  it('does not crash on demo dataset', () => {
    const demoJson: NormalizedModel = JSON.parse(
      readFileSync(resolve(__dirname, '../../../../demo/digital-bank.json'), 'utf-8'),
    );

    const { graph, warnings } = buildGraph(demoJson);
    expect(graph.nodes.size).toBe(102);
    expect(graph.edges.length).toBe(160);
    expect(warnings.length).toBe(0);
  });
});
