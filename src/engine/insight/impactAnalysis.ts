import type {
  AnalysisGraph,
  NormalizedModel,
  AffectedElement,
  ImpactResult,
  LayerSummary,
  DiagramRef,
  Layer,
} from '../types';
import { elementTypeToLayer } from '../types';

/**
 * BFS impact analysis: finds all elements reachable from `elementId`
 * within `maxDepth` hops (undirected — traverses both in and out edges).
 *
 * The source element itself is NOT included in the result.
 * Cycles are handled via a visited set — no duplicates, no infinite loops.
 */
export function analyzeImpact(
  graph: AnalysisGraph,
  elementId: string,
  maxDepth: 1 | 2 | 3,
): AffectedElement[] {
  const sourceNode = graph.nodes.get(elementId);
  if (!sourceNode) return [];

  const visited = new Set<string>([elementId]);
  const result: AffectedElement[] = [];

  // BFS queue: [nodeId, distance]
  let currentLevel: string[] = [elementId];

  for (let depth = 1; depth <= maxDepth; depth++) {
    const nextLevel: string[] = [];

    for (const nodeId of currentLevel) {
      // Gather undirected neighbors (both in and out)
      const outNeighbors = graph.adjacencyOut.get(nodeId) ?? [];
      const inNeighbors = graph.adjacencyIn.get(nodeId) ?? [];

      for (const neighborId of outNeighbors) {
        if (visited.has(neighborId)) continue;
        visited.add(neighborId);
        nextLevel.push(neighborId);

        const node = graph.nodes.get(neighborId);
        if (node) {
          result.push({
            id: neighborId,
            name: node.element.name,
            type: node.element.type,
            layer: elementTypeToLayer(node.element.type),
            distance: depth,
          });
        }
      }

      for (const neighborId of inNeighbors) {
        if (visited.has(neighborId)) continue;
        visited.add(neighborId);
        nextLevel.push(neighborId);

        const node = graph.nodes.get(neighborId);
        if (node) {
          result.push({
            id: neighborId,
            name: node.element.name,
            type: node.element.type,
            layer: elementTypeToLayer(node.element.type),
            distance: depth,
          });
        }
      }
    }

    currentLevel = nextLevel;
    if (currentLevel.length === 0) break;
  }

  return result;
}

/**
 * Builds a complete ImpactResult: runs BFS, groups by layer, resolves diagrams.
 *
 * `model` is needed to resolve diagram names from the source element's diagramIds.
 */
export function buildImpactResult(
  graph: AnalysisGraph,
  model: NormalizedModel,
  elementId: string,
  depth: 1 | 2 | 3,
): ImpactResult {
  const affectedElements = analyzeImpact(graph, elementId, depth);

  // Layer summary: count affected elements per layer
  const layerCounts = new Map<Layer, number>();
  for (const elem of affectedElements) {
    layerCounts.set(elem.layer, (layerCounts.get(elem.layer) ?? 0) + 1);
  }
  const affectedLayers: LayerSummary[] = Array.from(layerCounts.entries())
    .map(([layer, count]) => ({ layer, count }))
    .sort((a, b) => b.count - a.count);

  // Affected diagrams: diagrams that contain the SOURCE element
  const sourceNode = graph.nodes.get(elementId);
  const diagramIds = sourceNode?.element.diagramIds ?? [];
  const diagramMap = new Map(model.diagrams.map((d) => [d.id, d.name]));
  const affectedDiagrams: DiagramRef[] = diagramIds
    .map((id) => ({ id, name: diagramMap.get(id) ?? id }))
    .filter((d) => d.name);

  return {
    sourceElementId: elementId,
    depth,
    affectedElements,
    affectedLayers,
    affectedDiagrams,
  };
}
