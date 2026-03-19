import { useEffect, useRef, useState } from 'react';
import ELK from 'elkjs/lib/elk.bundled.js';
import type { AnalysisGraph } from '../../../engine/types';
import { colorForType } from './nodeStyles';
import type { Node as RFNode, Edge as RFEdge } from '@xyflow/react';

const elk = new ELK();

const NODE_WIDTH = 180;
const NODE_HEIGHT = 40;

export interface LayoutResult {
  nodes: RFNode[];
  edges: RFEdge[];
  loading: boolean;
}

function toRFNodes(
  graph: AnalysisGraph,
  laid: { children?: { id: string; x?: number; y?: number; width?: number; height?: number }[] },
): RFNode[] {
  return (laid.children ?? []).map((n) => {
    const gNode = graph.nodes.get(n.id)!;
    return {
      id: n.id,
      position: { x: n.x ?? 0, y: n.y ?? 0 },
      data: {
        label: gNode.element.name,
        element: gNode.element,
        degree: gNode.degree,
        isOrphan: gNode.isOrphan,
      },
      style: {
        background: colorForType(gNode.element.type),
        border: '1px solid #999',
        borderRadius: 6,
        padding: '6px 10px',
        fontSize: 12,
        width: n.width,
        minHeight: n.height,
        color: '#1a1a1a',
      },
    };
  });
}

function toRFEdges(graph: AnalysisGraph): RFEdge[] {
  return graph.edges.map((e) => ({
    id: e.relationship.id,
    source: e.relationship.sourceId,
    target: e.relationship.targetId,
    type: 'default',
  }));
}

/**
 * Converts an AnalysisGraph to React Flow nodes/edges with elkjs layout.
 *
 * `loading` is derived: true when graph is non-empty but layout result hasn't
 * arrived yet for that graph instance.
 */
export function useGraphLayout(graph: AnalysisGraph | null): LayoutResult {
  const [result, setResult] = useState<{
    nodes: RFNode[];
    edges: RFEdge[];
    forGraph: AnalysisGraph | null;
  }>({ nodes: [], edges: [], forGraph: null });

  const graphIdRef = useRef(0);

  useEffect(() => {
    if (!graph || graph.nodes.size === 0) return;

    const currentId = ++graphIdRef.current;

    const elkNodes: { id: string; width: number; height: number }[] = [];
    const elkEdges: { id: string; sources: string[]; targets: string[] }[] = [];

    for (const [id, node] of graph.nodes) {
      const labelLen = node.element.name.length;
      const w = Math.max(NODE_WIDTH, labelLen * 8 + 32);
      elkNodes.push({ id, width: w, height: NODE_HEIGHT });
    }

    for (const edge of graph.edges) {
      elkEdges.push({
        id: edge.relationship.id,
        sources: [edge.relationship.sourceId],
        targets: [edge.relationship.targetId],
      });
    }

    elk
      .layout({
        id: 'root',
        layoutOptions: {
          'elk.algorithm': 'layered',
          'elk.direction': 'DOWN',
          'elk.spacing.nodeNode': '50',
          'elk.layered.spacing.nodeNodeBetweenLayers': '80',
        },
        children: elkNodes,
        edges: elkEdges,
      })
      .then((laid) => {
        if (currentId !== graphIdRef.current) return;
        setResult({
          nodes: toRFNodes(graph, laid),
          edges: toRFEdges(graph),
          forGraph: graph,
        });
      })
      .catch(() => {
        // Layout failed — leave previous result
      });
  }, [graph]);

  // Empty / null graph → immediate empty result
  if (!graph || graph.nodes.size === 0) {
    return { nodes: [], edges: [], loading: false };
  }

  // Loading = graph exists but layout result is for a different graph
  const loading = result.forGraph !== graph;

  return { nodes: result.nodes, edges: result.edges, loading };
}
