import type { GraphNode } from '../engine/types';
import { elementTypeToLayer } from '../engine/types';

const HEADER = 'id,name,type,layer,degree,in_degree,out_degree,diagrams_count,is_orphan';
const BOM = '\uFEFF';

/**
 * Escape a CSV field value.
 * If the value contains a comma, double quote, or newline, wrap in quotes
 * and escape internal double quotes by doubling them.
 */
function escapeCsvField(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return '"' + value.replace(/"/g, '""') + '"';
  }
  return value;
}

/**
 * Generate a CSV string from an array of GraphNodes.
 *
 * - UTF-8 BOM prefix for Excel compatibility
 * - Comma separator
 * - Columns: id, name, type, layer, degree, in_degree, out_degree, diagrams_count, is_orphan
 */
export function generateCSV(nodes: GraphNode[]): string {
  const lines: string[] = [HEADER];

  for (const node of nodes) {
    const { element, degree, inDegree, outDegree, diagramsCount, isOrphan } = node;
    const layer = elementTypeToLayer(element.type);
    const row = [
      escapeCsvField(element.id),
      escapeCsvField(element.name),
      escapeCsvField(element.type),
      escapeCsvField(layer),
      String(degree),
      String(inDegree),
      String(outDegree),
      String(diagramsCount),
      String(isOrphan),
    ].join(',');
    lines.push(row);
  }

  return BOM + lines.join('\n');
}
