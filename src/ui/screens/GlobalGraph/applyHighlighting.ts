import type { Node as RFNode, Edge as RFEdge } from '@xyflow/react';

/**
 * Applies impact highlighting styles to React Flow nodes and edges.
 *
 * - If `highlightIds` is empty/null, returns the original arrays unchanged.
 * - Affected nodes: full opacity, accent border.
 * - Source node: thicker accent border.
 * - Non-affected nodes: reduced opacity (0.2).
 * - Edges between two affected nodes: full opacity.
 * - Other edges: dimmed.
 */
export function applyNodeHighlighting(
  nodes: RFNode[],
  highlightIds: Set<string> | null,
  sourceId: string | null,
): RFNode[] {
  if (!highlightIds || highlightIds.size === 0) return nodes;

  return nodes.map((node) => {
    const isSource = node.id === sourceId;
    const isAffected = highlightIds.has(node.id) || isSource;

    if (isSource) {
      return {
        ...node,
        style: {
          ...node.style,
          border: '3px solid #aa3bff',
          opacity: 1,
          boxShadow: '0 0 8px rgba(170,59,255,0.4)',
        },
      };
    }

    if (isAffected) {
      return {
        ...node,
        style: {
          ...node.style,
          border: '2px solid #aa3bff',
          opacity: 1,
        },
      };
    }

    return {
      ...node,
      style: {
        ...node.style,
        opacity: 0.2,
      },
    };
  });
}

export function applyEdgeHighlighting(
  edges: RFEdge[],
  highlightIds: Set<string> | null,
  sourceId: string | null,
): RFEdge[] {
  if (!highlightIds || highlightIds.size === 0) return edges;

  const fullSet = new Set(highlightIds);
  if (sourceId) fullSet.add(sourceId);

  return edges.map((edge) => {
    const bothAffected = fullSet.has(edge.source) && fullSet.has(edge.target);

    return {
      ...edge,
      style: {
        ...((edge.style as Record<string, unknown>) ?? {}),
        opacity: bothAffected ? 1 : 0.1,
        strokeWidth: bothAffected ? 2 : 1,
      },
    };
  });
}
