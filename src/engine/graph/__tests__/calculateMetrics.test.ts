import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { buildGraph } from '../buildGraph';
import { calculateMetrics } from '../calculateMetrics';
import type { NormalizedModel } from '../../types';
import { makeElement, makeRelationship, makeModel } from './fixtures';

describe('calculateMetrics', () => {
  // -----------------------------------------------------------------------
  // Degree values on known graph
  // -----------------------------------------------------------------------

  it('computes correct degree values for known graph (3 nodes, 2 edges)', () => {
    const model = makeModel(
      [
        makeElement('a', 'A', 'X', ['d1']),
        makeElement('b', 'B', 'X', ['d1']),
        makeElement('c', 'C', 'X', ['d1']),
      ],
      [makeRelationship('r1', 'a', 'b'), makeRelationship('r2', 'b', 'c')],
    );

    const { graph } = buildGraph(model);
    calculateMetrics(graph);

    const a = graph.nodes.get('a')!;
    expect(a.inDegree).toBe(0);
    expect(a.outDegree).toBe(1);
    expect(a.degree).toBe(1);

    const b = graph.nodes.get('b')!;
    expect(b.inDegree).toBe(1);
    expect(b.outDegree).toBe(1);
    expect(b.degree).toBe(2);

    const c = graph.nodes.get('c')!;
    expect(c.inDegree).toBe(1);
    expect(c.outDegree).toBe(0);
    expect(c.degree).toBe(1);
  });

  // -----------------------------------------------------------------------
  // Orphan: no edges, no diagrams → isOrphan = true
  // -----------------------------------------------------------------------

  it('marks node with zero edges and zero diagrams as orphan', () => {
    const model = makeModel([makeElement('lonely', 'Lonely', 'X', [])]);

    const { graph } = buildGraph(model);
    calculateMetrics(graph);

    const node = graph.nodes.get('lonely')!;
    expect(node.isOrphan).toBe(true);
    expect(node.degree).toBe(0);
    expect(node.diagramsCount).toBe(0);
  });

  // -----------------------------------------------------------------------
  // Orphan: has edges but no diagrams → isOrphan = true
  // -----------------------------------------------------------------------

  it('marks node with edges but no diagrams as orphan', () => {
    const model = makeModel(
      [makeElement('a', 'A', 'X', []), makeElement('b', 'B', 'X', [])],
      [makeRelationship('r1', 'a', 'b')],
    );

    const { graph } = buildGraph(model);
    calculateMetrics(graph);

    expect(graph.nodes.get('a')!.isOrphan).toBe(true);
    expect(graph.nodes.get('a')!.degree).toBe(1);
    expect(graph.nodes.get('a')!.diagramsCount).toBe(0);
  });

  // -----------------------------------------------------------------------
  // Orphan: has diagrams but no edges → isOrphan = true
  // -----------------------------------------------------------------------

  it('marks node with diagrams but no edges as orphan', () => {
    const model = makeModel([makeElement('a', 'A', 'X', ['d1', 'd2'])]);

    const { graph } = buildGraph(model);
    calculateMetrics(graph);

    const node = graph.nodes.get('a')!;
    expect(node.isOrphan).toBe(true);
    expect(node.degree).toBe(0);
    expect(node.diagramsCount).toBe(2);
  });

  // -----------------------------------------------------------------------
  // Well-connected node in diagrams → isOrphan = false
  // -----------------------------------------------------------------------

  it('marks well-connected node in diagrams as NOT orphan', () => {
    const model = makeModel(
      [makeElement('a', 'A', 'X', ['d1']), makeElement('b', 'B', 'X', ['d1'])],
      [makeRelationship('r1', 'a', 'b')],
    );

    const { graph } = buildGraph(model);
    calculateMetrics(graph);

    expect(graph.nodes.get('a')!.isOrphan).toBe(false);
    expect(graph.nodes.get('b')!.isOrphan).toBe(false);
  });

  // -----------------------------------------------------------------------
  // diagramsCount
  // -----------------------------------------------------------------------

  it('sets diagramsCount from element.diagramIds', () => {
    const model = makeModel([
      makeElement('a', 'A', 'X', ['d1', 'd2', 'd3']),
      makeElement('b', 'B', 'X', []),
    ]);

    const { graph } = buildGraph(model);
    calculateMetrics(graph);

    expect(graph.nodes.get('a')!.diagramsCount).toBe(3);
    expect(graph.nodes.get('b')!.diagramsCount).toBe(0);
  });

  // -----------------------------------------------------------------------
  // Defensive: missing adjacency entries and undefined diagramIds
  // -----------------------------------------------------------------------

  it('handles missing adjacency entries gracefully (defaults to degree 0)', () => {
    // Manually construct a graph where adjacency maps lack entries for a node
    const { graph } = buildGraph(makeModel([makeElement('a', 'A', 'X', ['d1'])]));

    // Remove adjacency entries to simulate an inconsistent state
    graph.adjacencyIn.delete('a');
    graph.adjacencyOut.delete('a');

    calculateMetrics(graph);

    const node = graph.nodes.get('a')!;
    expect(node.inDegree).toBe(0);
    expect(node.outDegree).toBe(0);
    expect(node.degree).toBe(0);
    expect(node.isOrphan).toBe(true);
  });

  it('handles element with undefined diagramIds (defaults to 0)', () => {
    const { graph } = buildGraph(makeModel([makeElement('a', 'A')]));

    // Simulate element where diagramIds is undefined (e.g. malformed input)
    (graph.nodes.get('a')!.element as { diagramIds?: string[] }).diagramIds = undefined;

    calculateMetrics(graph);

    const node = graph.nodes.get('a')!;
    expect(node.diagramsCount).toBe(0);
    expect(node.isOrphan).toBe(true);
  });

  // -----------------------------------------------------------------------
  // Idempotency — calling calculateMetrics twice gives same results
  // -----------------------------------------------------------------------

  it('is idempotent — calling twice produces the same metrics', () => {
    const model = makeModel(
      [
        makeElement('a', 'A', 'X', ['d1']),
        makeElement('b', 'B', 'X', []),
        makeElement('c', 'C', 'X', ['d1']),
      ],
      [
        makeRelationship('r1', 'a', 'b'),
        makeRelationship('r2', 'b', 'c'),
      ],
    );

    const { graph } = buildGraph(model);
    calculateMetrics(graph);

    // Snapshot after first call
    const firstPass = Array.from(graph.nodes.values()).map((n) => ({
      id: n.element.id,
      degree: n.degree,
      inDegree: n.inDegree,
      outDegree: n.outDegree,
      diagramsCount: n.diagramsCount,
      isOrphan: n.isOrphan,
    }));

    calculateMetrics(graph);

    const secondPass = Array.from(graph.nodes.values()).map((n) => ({
      id: n.element.id,
      degree: n.degree,
      inDegree: n.inDegree,
      outDegree: n.outDegree,
      diagramsCount: n.diagramsCount,
      isOrphan: n.isOrphan,
    }));

    expect(secondPass).toEqual(firstPass);
  });

  // -----------------------------------------------------------------------
  // Smoke: demo dataset — hub element has high degree
  // -----------------------------------------------------------------------

  it('demo dataset hub element has expected high degree', () => {
    const demoJson: NormalizedModel = JSON.parse(
      readFileSync(resolve(__dirname, '../../../../demo/digital-bank.json'), 'utf-8'),
    );

    const { graph } = buildGraph(demoJson);
    calculateMetrics(graph);

    // Find the node with highest degree
    let maxDegree = 0;
    let hubId = '';
    for (const [id, node] of graph.nodes) {
      if (node.degree > maxDegree) {
        maxDegree = node.degree;
        hubId = id;
      }
    }

    expect(maxDegree).toBeGreaterThanOrEqual(14);
    expect(hubId).toBeTruthy();

    // Verify all nodes have valid metrics
    for (const node of graph.nodes.values()) {
      expect(node.degree).toBeGreaterThanOrEqual(0);
      expect(node.inDegree).toBeGreaterThanOrEqual(0);
      expect(node.outDegree).toBeGreaterThanOrEqual(0);
      expect(node.diagramsCount).toBeGreaterThanOrEqual(0);
      expect(typeof node.isOrphan).toBe('boolean');
    }
  });
});
