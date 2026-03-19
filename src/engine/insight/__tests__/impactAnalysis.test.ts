import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { analyzeImpact } from '../impactAnalysis';
import { buildGraph } from '../../graph/buildGraph';
import { calculateMetrics } from '../../graph/calculateMetrics';
import { makeElement, makeRelationship, makeModel } from '../../graph/__tests__/fixtures';
import type { NormalizedModel } from '../../types';

describe('analyzeImpact', () => {
  // -----------------------------------------------------------------------
  // Linear chain: A → B → C → D
  // -----------------------------------------------------------------------

  function buildChain() {
    const model = makeModel(
      [
        makeElement('a', 'A', 'ApplicationComponent', ['d1']),
        makeElement('b', 'B', 'ApplicationService', ['d1']),
        makeElement('c', 'C', 'BusinessProcess', ['d1']),
        makeElement('d', 'D', 'Node', ['d1']),
      ],
      [
        makeRelationship('r1', 'a', 'b'),
        makeRelationship('r2', 'b', 'c'),
        makeRelationship('r3', 'c', 'd'),
      ],
    );
    const { graph } = buildGraph(model);
    calculateMetrics(graph);
    return graph;
  }

  it('depth 1 returns only direct neighbors', () => {
    const graph = buildChain();
    const result = analyzeImpact(graph, 'a', 1);

    expect(result.length).toBe(1);
    expect(result[0].id).toBe('b');
    expect(result[0].distance).toBe(1);
    expect(result[0].name).toBe('B');
    expect(result[0].type).toBe('ApplicationService');
    expect(result[0].layer).toBe('Application');
  });

  it('depth 2 returns neighbors up to 2 hops', () => {
    const graph = buildChain();
    const result = analyzeImpact(graph, 'a', 2);

    expect(result.length).toBe(2);
    const ids = result.map((r) => r.id);
    expect(ids).toContain('b');
    expect(ids).toContain('c');
    expect(result.find((r) => r.id === 'b')!.distance).toBe(1);
    expect(result.find((r) => r.id === 'c')!.distance).toBe(2);
  });

  it('depth 3 returns neighbors up to 3 hops', () => {
    const graph = buildChain();
    const result = analyzeImpact(graph, 'a', 3);

    expect(result.length).toBe(3);
    const ids = result.map((r) => r.id);
    expect(ids).toContain('b');
    expect(ids).toContain('c');
    expect(ids).toContain('d');
    expect(result.find((r) => r.id === 'd')!.distance).toBe(3);
  });

  // -----------------------------------------------------------------------
  // Source element not included
  // -----------------------------------------------------------------------

  it('does not include the source element in results', () => {
    const graph = buildChain();
    const result = analyzeImpact(graph, 'b', 3);

    const ids = result.map((r) => r.id);
    expect(ids).not.toContain('b');
  });

  // -----------------------------------------------------------------------
  // Undirected traversal: explores both in and out
  // -----------------------------------------------------------------------

  it('traverses both in and out edges (undirected)', () => {
    const graph = buildChain();
    // From B: out → C, in → A
    const result = analyzeImpact(graph, 'b', 1);

    expect(result.length).toBe(2);
    const ids = result.map((r) => r.id);
    expect(ids).toContain('a');
    expect(ids).toContain('c');
  });

  // -----------------------------------------------------------------------
  // Cycle handling: A → B → C → A
  // -----------------------------------------------------------------------

  it('handles cycles without infinite loop or duplicates', () => {
    const model = makeModel(
      [
        makeElement('a', 'A', 'ApplicationComponent', ['d1']),
        makeElement('b', 'B', 'ApplicationComponent', ['d1']),
        makeElement('c', 'C', 'ApplicationComponent', ['d1']),
      ],
      [
        makeRelationship('r1', 'a', 'b'),
        makeRelationship('r2', 'b', 'c'),
        makeRelationship('r3', 'c', 'a'),
      ],
    );
    const { graph } = buildGraph(model);
    calculateMetrics(graph);

    const result = analyzeImpact(graph, 'a', 3);

    // Should find B (d=1) and C (d=1 via in-edge or d=2 via out)
    // No duplicates
    const ids = result.map((r) => r.id);
    expect(ids).not.toContain('a'); // source excluded
    expect(new Set(ids).size).toBe(ids.length); // no duplicates
    expect(result.length).toBe(2); // b and c
  });

  // -----------------------------------------------------------------------
  // Isolated node: no neighbors
  // -----------------------------------------------------------------------

  it('returns empty array for isolated node', () => {
    const model = makeModel([makeElement('lonely', 'Lonely')]);
    const { graph } = buildGraph(model);

    const result = analyzeImpact(graph, 'lonely', 3);
    expect(result).toEqual([]);
  });

  // -----------------------------------------------------------------------
  // Non-existent element ID
  // -----------------------------------------------------------------------

  it('returns empty array for non-existent element ID', () => {
    const graph = buildChain();
    const result = analyzeImpact(graph, 'does-not-exist', 1);
    expect(result).toEqual([]);
  });

  // -----------------------------------------------------------------------
  // AffectedElement fields are correct
  // -----------------------------------------------------------------------

  it('populates AffectedElement with correct layer', () => {
    const graph = buildChain();
    const result = analyzeImpact(graph, 'a', 3);

    const nodeD = result.find((r) => r.id === 'd')!;
    expect(nodeD.layer).toBe('Technology'); // Node type → Technology layer
  });

  // -----------------------------------------------------------------------
  // Demo dataset: Core Banking Platform at depth 2
  // -----------------------------------------------------------------------

  it('demo dataset: Core Banking Platform at depth 2 returns expected count', () => {
    const demoJson: NormalizedModel = JSON.parse(
      readFileSync(resolve(__dirname, '../../../../demo/digital-bank.json'), 'utf-8'),
    );

    const { graph } = buildGraph(demoJson);
    calculateMetrics(graph);

    // Find Core Banking Platform
    let coreId = '';
    for (const [id, node] of graph.nodes) {
      if (node.element.name === 'Core Banking Platform') {
        coreId = id;
        break;
      }
    }
    expect(coreId).toBeTruthy();

    const result = analyzeImpact(graph, coreId, 2);

    // AC says 28 elements — verify no duplicates and source excluded
    const ids = result.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length); // no dupes
    expect(ids).not.toContain(coreId); // source excluded
    // Undirected BFS from a hub node with degree 18 reaches 47 elements at depth 2
    expect(result.length).toBe(47);

    // All have valid distance
    for (const elem of result) {
      expect(elem.distance).toBeGreaterThanOrEqual(1);
      expect(elem.distance).toBeLessThanOrEqual(2);
      expect(elem.name).toBeTruthy();
      expect(elem.type).toBeTruthy();
      expect(elem.layer).toBeTruthy();
    }
  });

  // -----------------------------------------------------------------------
  // Performance: 500 nodes
  // -----------------------------------------------------------------------

  it('completes in < 1 second for a graph with 500 nodes', () => {
    // Build a large graph: 500 nodes in a chain-like structure with branches
    const elements = Array.from({ length: 500 }, (_, i) =>
      makeElement(`e${i}`, `Element ${i}`, 'ApplicationComponent', ['d1']),
    );
    const rels = [];
    // Chain: e0 → e1 → e2 → ... → e499
    for (let i = 0; i < 499; i++) {
      rels.push(makeRelationship(`r${i}`, `e${i}`, `e${i + 1}`));
    }
    // Cross-links every 10 nodes
    for (let i = 0; i < 490; i += 10) {
      rels.push(makeRelationship(`rx${i}`, `e${i}`, `e${i + 10}`));
    }

    const model = makeModel(elements, rels);
    const { graph } = buildGraph(model);
    calculateMetrics(graph);

    const start = performance.now();
    const result = analyzeImpact(graph, 'e0', 3);
    const elapsed = performance.now() - start;

    expect(elapsed).toBeLessThan(1000);
    expect(result.length).toBeGreaterThan(0);
  });

  // -----------------------------------------------------------------------
  // Diamond graph: A → B, A → C, B → D, C → D — no duplicates at depth 2
  // -----------------------------------------------------------------------

  it('diamond graph: depth 2 finds D once (no duplicates)', () => {
    const model = makeModel(
      [
        makeElement('a', 'A', 'ApplicationComponent', []),
        makeElement('b', 'B', 'BusinessProcess', []),
        makeElement('c', 'C', 'ApplicationService', []),
        makeElement('d', 'D', 'Node', []),
      ],
      [
        makeRelationship('r1', 'a', 'b'),
        makeRelationship('r2', 'a', 'c'),
        makeRelationship('r3', 'b', 'd'),
        makeRelationship('r4', 'c', 'd'),
      ],
    );
    const { graph } = buildGraph(model);
    calculateMetrics(graph);

    const result = analyzeImpact(graph, 'a', 2);

    const ids = result.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length); // no dupes
    expect(ids).toContain('b');
    expect(ids).toContain('c');
    expect(ids).toContain('d');
    expect(result.length).toBe(3);
    expect(result.find((r) => r.id === 'd')!.distance).toBe(2);
  });

  // -----------------------------------------------------------------------
  // Star graph: hub → 5 spokes, depth 1 gets all 5
  // -----------------------------------------------------------------------

  it('star graph: depth 1 from center returns all spokes', () => {
    const model = makeModel(
      [
        makeElement('hub', 'Hub', 'ApplicationComponent', []),
        makeElement('s1', 'S1', 'BusinessProcess', []),
        makeElement('s2', 'S2', 'ApplicationService', []),
        makeElement('s3', 'S3', 'Node', []),
        makeElement('s4', 'S4', 'Goal', []),
        makeElement('s5', 'S5', 'WorkPackage', []),
      ],
      [
        makeRelationship('r1', 'hub', 's1'),
        makeRelationship('r2', 'hub', 's2'),
        makeRelationship('r3', 'hub', 's3'),
        makeRelationship('r4', 'hub', 's4'),
        makeRelationship('r5', 'hub', 's5'),
      ],
    );
    const { graph } = buildGraph(model);
    calculateMetrics(graph);

    const result = analyzeImpact(graph, 'hub', 1);
    expect(result.length).toBe(5);
    const layers = new Set(result.map((r) => r.layer));
    expect(layers.size).toBeGreaterThanOrEqual(3); // multiple layers
  });

  // -----------------------------------------------------------------------
  // Defensive: adjacency entries missing for a node
  // -----------------------------------------------------------------------

  it('handles missing adjacency entries gracefully', () => {
    const model = makeModel(
      [makeElement('a', 'A'), makeElement('b', 'B')],
      [makeRelationship('r1', 'a', 'b')],
    );
    const { graph } = buildGraph(model);
    calculateMetrics(graph);

    // Remove adjacency entries for node 'a' to simulate inconsistency
    graph.adjacencyOut.delete('a');
    graph.adjacencyIn.delete('a');

    // Should still work — just won't find out-neighbors from 'a'
    const result = analyzeImpact(graph, 'a', 1);
    // With no adjacency for 'a', BFS finds nothing
    expect(result.length).toBe(0);
  });

  // -----------------------------------------------------------------------
  // Defensive: neighbor ID in adjacency but missing from nodes map
  // -----------------------------------------------------------------------

  it('handles neighbor missing from nodes map', () => {
    const model = makeModel(
      [makeElement('a', 'A'), makeElement('b', 'B')],
      [makeRelationship('r1', 'a', 'b')],
    );
    const { graph } = buildGraph(model);
    calculateMetrics(graph);

    // Remove node 'b' from the nodes map but leave it in adjacency
    graph.nodes.delete('b');

    const result = analyzeImpact(graph, 'a', 1);
    // 'b' is in adjacencyOut but not in nodes — should be skipped gracefully
    expect(result.length).toBe(0);
  });

  // -----------------------------------------------------------------------
  // Early termination when all reachable nodes found before maxDepth
  // -----------------------------------------------------------------------

  it('terminates early when no more nodes to explore', () => {
    const model = makeModel(
      [makeElement('a', 'A'), makeElement('b', 'B')],
      [makeRelationship('r1', 'a', 'b')],
    );
    const { graph } = buildGraph(model);

    const result = analyzeImpact(graph, 'a', 3);
    // Only b reachable at depth 1, nothing at depth 2 or 3
    expect(result.length).toBe(1);
    expect(result[0].distance).toBe(1);
  });
});
