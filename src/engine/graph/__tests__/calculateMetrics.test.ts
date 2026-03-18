import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { buildGraph } from '../buildGraph';
import { calculateMetrics } from '../calculateMetrics';
import type { NormalizedModel } from '../../types';

function makeModel(
  elements: NormalizedModel['elements'],
  relationships: NormalizedModel['relationships'] = [],
): NormalizedModel {
  return { id: 'test', name: 'Test', elements, relationships, diagrams: [], warnings: [] };
}

describe('calculateMetrics', () => {
  // -----------------------------------------------------------------------
  // Degree values on known graph
  // -----------------------------------------------------------------------

  it('computes correct degree values for known graph (3 nodes, 2 edges)', () => {
    const model = makeModel(
      [
        { id: 'a', name: 'A', type: 'X', diagramIds: ['d1'] },
        { id: 'b', name: 'B', type: 'X', diagramIds: ['d1'] },
        { id: 'c', name: 'C', type: 'X', diagramIds: ['d1'] },
      ],
      [
        { id: 'r1', sourceId: 'a', targetId: 'b', type: 'R' },
        { id: 'r2', sourceId: 'b', targetId: 'c', type: 'R' },
      ],
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
    const model = makeModel([{ id: 'lonely', name: 'Lonely', type: 'X', diagramIds: [] }]);

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
      [
        { id: 'a', name: 'A', type: 'X', diagramIds: [] },
        { id: 'b', name: 'B', type: 'X', diagramIds: [] },
      ],
      [{ id: 'r1', sourceId: 'a', targetId: 'b', type: 'R' }],
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
    const model = makeModel([
      { id: 'a', name: 'A', type: 'X', diagramIds: ['d1', 'd2'] },
    ]);

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
      [
        { id: 'a', name: 'A', type: 'X', diagramIds: ['d1'] },
        { id: 'b', name: 'B', type: 'X', diagramIds: ['d1'] },
      ],
      [{ id: 'r1', sourceId: 'a', targetId: 'b', type: 'R' }],
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
      { id: 'a', name: 'A', type: 'X', diagramIds: ['d1', 'd2', 'd3'] },
      { id: 'b', name: 'B', type: 'X', diagramIds: [] },
    ]);

    const { graph } = buildGraph(model);
    calculateMetrics(graph);

    expect(graph.nodes.get('a')!.diagramsCount).toBe(3);
    expect(graph.nodes.get('b')!.diagramsCount).toBe(0);
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

    // Verify no crash and all nodes have metrics
    for (const node of graph.nodes.values()) {
      expect(node.degree).toBeGreaterThanOrEqual(0);
      expect(node.inDegree).toBeGreaterThanOrEqual(0);
      expect(node.outDegree).toBeGreaterThanOrEqual(0);
      expect(node.diagramsCount).toBeGreaterThanOrEqual(0);
      expect(typeof node.isOrphan).toBe('boolean');
    }
  });
});
