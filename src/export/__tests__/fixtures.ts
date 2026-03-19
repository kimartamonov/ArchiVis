import type { GraphNode, GraphEdge } from '../../engine/types';
import { makeElement, makeRelationship } from '../../engine/graph/__tests__/fixtures';

/** Create a GraphNode with sensible defaults for export tests. */
export function makeExportNode(
  id: string,
  name: string,
  type: string = 'ApplicationComponent',
  opts: Partial<Pick<GraphNode, 'degree' | 'inDegree' | 'outDegree' | 'diagramsCount' | 'isOrphan'>> = {},
  diagramIds: string[] = ['d1'],
): GraphNode {
  return {
    element: makeElement(id, name, type, diagramIds),
    degree: opts.degree ?? 2,
    inDegree: opts.inDegree ?? 1,
    outDegree: opts.outDegree ?? 1,
    diagramsCount: opts.diagramsCount ?? diagramIds.length,
    isOrphan: opts.isOrphan ?? false,
  };
}

/** Create a GraphEdge linking two nodes. */
export function makeExportEdge(
  relId: string,
  sourceNode: GraphNode,
  targetNode: GraphNode,
  type: string = 'ServingRelationship',
): GraphEdge {
  return {
    relationship: makeRelationship(relId, sourceNode.element.id, targetNode.element.id, type),
    source: sourceNode,
    target: targetNode,
  };
}

// ---- Pre-built fixtures ----

export const NODE_PG = makeExportNode('pg', 'Payment Gateway', 'ApplicationComponent', { degree: 8, inDegree: 3, outDegree: 5 });
export const NODE_PS = makeExportNode('ps', 'Payment Service', 'ApplicationService', { degree: 4, isOrphan: true }, []);
export const NODE_CYRILLIC = makeExportNode('cyr', 'Платёжный Шлюз', 'ApplicationComponent');
export const NODE_SPECIAL = makeExportNode('sp', 'Risk & Return <Analysis> "Test"', 'ApplicationComponent');
export const NODE_EMPTY_NAME = makeExportNode('empty', '', 'BusinessProcess');
export const NODE_ZERO_DEGREE = makeExportNode('zd', 'Isolated Node', 'Node', { degree: 0, inDegree: 0, outDegree: 0, isOrphan: true }, []);
export const EDGE_PG_PS = makeExportEdge('r1', NODE_PG, NODE_PS);
