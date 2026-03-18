import type { AnalysisGraph } from '../types';

/**
 * Recalculates base metrics on every GraphNode in the graph.
 *
 * Metrics computed:
 * - inDegree:      adjacencyIn[id].length
 * - outDegree:     adjacencyOut[id].length
 * - degree:        inDegree + outDegree
 * - diagramsCount: element.diagramIds.length
 * - isOrphan:      degree === 0 OR diagramsCount === 0
 *
 * Mutates nodes in place. O(n) where n = number of nodes.
 */
export function calculateMetrics(graph: AnalysisGraph): void {
  for (const [id, node] of graph.nodes) {
    const inList = graph.adjacencyIn.get(id);
    const outList = graph.adjacencyOut.get(id);

    node.inDegree = inList ? inList.length : 0;
    node.outDegree = outList ? outList.length : 0;
    node.degree = node.inDegree + node.outDegree;
    node.diagramsCount = node.element.diagramIds?.length ?? 0;
    node.isOrphan = node.degree === 0 || node.diagramsCount === 0;
  }
}
