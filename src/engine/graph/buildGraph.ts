import type {
  NormalizedModel,
  AnalysisGraph,
  GraphNode,
  GraphEdge,
  BrokenReference,
} from '../types';

export function buildGraph(model: NormalizedModel): {
  graph: AnalysisGraph;
  warnings: BrokenReference[];
} {
  const nodes = new Map<string, GraphNode>();
  const edges: GraphEdge[] = [];
  const adjacencyOut = new Map<string, string[]>();
  const adjacencyIn = new Map<string, string[]>();
  const warnings: BrokenReference[] = [];

  // Step 1: Create nodes from elements
  for (const element of model.elements) {
    const node: GraphNode = {
      element,
      degree: 0,
      inDegree: 0,
      outDegree: 0,
      diagramsCount: element.diagramIds.length,
      isOrphan: false,
    };
    nodes.set(element.id, node);
    adjacencyOut.set(element.id, []);
    adjacencyIn.set(element.id, []);
  }

  // Step 2: Create edges from relationships
  for (const rel of model.relationships) {
    const sourceNode = nodes.get(rel.sourceId);
    const targetNode = nodes.get(rel.targetId);

    if (!sourceNode || !targetNode) {
      warnings.push({
        sourceId: rel.sourceId,
        targetId: rel.targetId,
        type: rel.type,
        reason: !sourceNode
          ? `Source element ${rel.sourceId} not found`
          : `Target element ${rel.targetId} not found`,
      });
      continue;
    }

    const edge: GraphEdge = {
      relationship: rel,
      source: sourceNode,
      target: targetNode,
    };
    edges.push(edge);

    adjacencyOut.get(rel.sourceId)!.push(rel.targetId);
    adjacencyIn.get(rel.targetId)!.push(rel.sourceId);

    sourceNode.outDegree++;
    targetNode.inDegree++;
    sourceNode.degree++;
    targetNode.degree++;
  }

  // Step 3: Preliminary orphan mark (degree === 0).
  // Call calculateMetrics() after buildGraph() for full orphan definition
  // (degree === 0 OR diagramsCount === 0).
  for (const node of nodes.values()) {
    node.isOrphan = node.degree === 0;
  }

  const graph: AnalysisGraph = { nodes, edges, adjacencyOut, adjacencyIn };
  return { graph, warnings };
}
