import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { buildGraph } from '../../../../engine/graph/buildGraph';
import { calculateMetrics } from '../../../../engine/graph/calculateMetrics';
import type { NormalizedModel, AnalysisGraph } from '../../../../engine/types';
import ELK from 'elkjs/lib/elk.bundled.js';
import { colorForType } from '../nodeStyles';

// Replicate layout logic without React hooks for testability
async function layoutGraph(graph: AnalysisGraph) {
  const elk = new ELK();

  const elkNodes = Array.from(graph.nodes).map(([id, node]) => ({
    id,
    width: Math.max(180, node.element.name.length * 8 + 32),
    height: 40,
  }));

  const elkEdges = graph.edges.map((e) => ({
    id: e.relationship.id,
    sources: [e.relationship.sourceId],
    targets: [e.relationship.targetId],
  }));

  const laid = await elk.layout({
    id: 'root',
    layoutOptions: {
      'elk.algorithm': 'layered',
      'elk.direction': 'DOWN',
      'elk.spacing.nodeNode': '50',
      'elk.layered.spacing.nodeNodeBetweenLayers': '80',
    },
    children: elkNodes,
    edges: elkEdges,
  });

  const rfNodes = (laid.children ?? []).map((n) => {
    const gNode = graph.nodes.get(n.id)!;
    return {
      id: n.id,
      position: { x: n.x ?? 0, y: n.y ?? 0 },
      data: { label: gNode.element.name },
      style: { background: colorForType(gNode.element.type) },
    };
  });

  const rfEdges = graph.edges.map((e) => ({
    id: e.relationship.id,
    source: e.relationship.sourceId,
    target: e.relationship.targetId,
  }));

  return { rfNodes, rfEdges };
}

describe('useGraphLayout (logic)', () => {
  it('produces correct node/edge count from demo dataset', async () => {
    const demoJson: NormalizedModel = JSON.parse(
      readFileSync(resolve(__dirname, '../../../../../demo/digital-bank.json'), 'utf-8'),
    );

    const { graph } = buildGraph(demoJson);
    calculateMetrics(graph);

    const { rfNodes, rfEdges } = await layoutGraph(graph);

    expect(rfNodes.length).toBe(102);
    expect(rfEdges.length).toBe(160);
  });

  it('nodes have non-zero positions (not all at origin)', async () => {
    const demoJson: NormalizedModel = JSON.parse(
      readFileSync(resolve(__dirname, '../../../../../demo/digital-bank.json'), 'utf-8'),
    );

    const { graph } = buildGraph(demoJson);
    calculateMetrics(graph);

    const { rfNodes } = await layoutGraph(graph);

    const nonOrigin = rfNodes.filter((n) => n.position.x !== 0 || n.position.y !== 0);
    expect(nonOrigin.length).toBeGreaterThan(rfNodes.length * 0.5);
  });

  it('nodes have layer-appropriate colors', async () => {
    const demoJson: NormalizedModel = JSON.parse(
      readFileSync(resolve(__dirname, '../../../../../demo/digital-bank.json'), 'utf-8'),
    );

    const { graph } = buildGraph(demoJson);
    calculateMetrics(graph);

    const { rfNodes } = await layoutGraph(graph);

    // Every node should have a valid background color
    const validColors = new Set([
      '#FFFFB5', '#B5FFFF', '#B5FFB5', '#FFB5B5',
      '#CCCCFF', '#FFD4B5', '#C9E7CB', '#E0E0E0',
    ]);
    for (const node of rfNodes) {
      expect(validColors.has(node.style.background)).toBe(true);
    }
  });

  it('handles empty graph', async () => {
    const graph: AnalysisGraph = {
      nodes: new Map(),
      edges: [],
      adjacencyOut: new Map(),
      adjacencyIn: new Map(),
    };

    const { rfNodes, rfEdges } = await layoutGraph(graph);
    expect(rfNodes.length).toBe(0);
    expect(rfEdges.length).toBe(0);
  });

  it('completes layout for demo dataset in under 5 seconds', async () => {
    const demoJson: NormalizedModel = JSON.parse(
      readFileSync(resolve(__dirname, '../../../../../demo/digital-bank.json'), 'utf-8'),
    );

    const { graph } = buildGraph(demoJson);
    calculateMetrics(graph);

    const start = performance.now();
    await layoutGraph(graph);
    const elapsed = performance.now() - start;

    expect(elapsed).toBeLessThan(5000);
  });
});
