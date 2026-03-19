import { createColumnHelper } from '@tanstack/react-table';
import type { GraphNode, Layer } from '../../../engine/types';
import { elementTypeToLayer } from '../../../engine/types';

export interface TableRow {
  id: string;
  name: string;
  type: string;
  layer: Layer;
  degree: number;
  inDegree: number;
  outDegree: number;
  diagramsCount: number;
}

export function graphNodesToRows(nodes: Map<string, GraphNode>): TableRow[] {
  const rows: TableRow[] = [];
  for (const [id, node] of nodes) {
    rows.push({
      id,
      name: node.element.name,
      type: node.element.type,
      layer: elementTypeToLayer(node.element.type),
      degree: node.degree,
      inDegree: node.inDegree,
      outDegree: node.outDegree,
      diagramsCount: node.diagramsCount,
    });
  }
  return rows;
}

const col = createColumnHelper<TableRow>();

export const columns = [
  col.accessor('name', { header: 'Name', enableSorting: true }),
  col.accessor('type', { header: 'Type', enableSorting: true }),
  col.accessor('layer', { header: 'Layer', enableSorting: true }),
  col.accessor('degree', { header: 'Degree', enableSorting: true }),
  col.accessor('inDegree', { header: 'In', enableSorting: true }),
  col.accessor('outDegree', { header: 'Out', enableSorting: true }),
  col.accessor('diagramsCount', { header: 'Diagrams', enableSorting: true }),
];
