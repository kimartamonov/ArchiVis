import type { GraphNode, GraphEdge } from '../engine/types';
import { elementTypeToLayer } from '../engine/types';

/**
 * Escape XML special characters in text content and attribute values.
 */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Generate a valid GraphML XML string from a set of nodes and edges.
 *
 * The output is compatible with yEd and contains:
 * - Node attributes: name, type, layer, degree
 * - Edge attribute: type
 * - Directed graph
 * - UTF-8 XML declaration
 */
export function generateGraphML(nodes: GraphNode[], edges: GraphEdge[]): string {
  const lines: string[] = [];

  // XML declaration
  lines.push('<?xml version="1.0" encoding="UTF-8"?>');

  // GraphML root with namespace
  lines.push(
    '<graphml xmlns="http://graphml.graphstruct.org/xmlns"' +
    ' xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"' +
    ' xsi:schemaLocation="http://graphml.graphstruct.org/xmlns http://graphml.graphstruct.org/xmlns/1.0/graphml.xsd">',
  );

  // Key definitions — node attributes
  lines.push('  <key id="d_name" for="node" attr.name="name" attr.type="string"/>');
  lines.push('  <key id="d_type" for="node" attr.name="type" attr.type="string"/>');
  lines.push('  <key id="d_layer" for="node" attr.name="layer" attr.type="string"/>');
  lines.push('  <key id="d_degree" for="node" attr.name="degree" attr.type="int"/>');

  // Key definition — edge attribute
  lines.push('  <key id="d_edge_type" for="edge" attr.name="type" attr.type="string"/>');

  // Graph element (directed)
  lines.push('  <graph id="G" edgedefault="directed">');

  // Nodes
  for (const node of nodes) {
    const { element, degree } = node;
    const layer = elementTypeToLayer(element.type);
    lines.push(`    <node id="${escapeXml(element.id)}">`);
    lines.push(`      <data key="d_name">${escapeXml(element.name)}</data>`);
    lines.push(`      <data key="d_type">${escapeXml(element.type)}</data>`);
    lines.push(`      <data key="d_layer">${escapeXml(layer)}</data>`);
    lines.push(`      <data key="d_degree">${degree}</data>`);
    lines.push('    </node>');
  }

  // Edges
  edges.forEach((edge, i) => {
    const { relationship } = edge;
    lines.push(
      `    <edge id="e${i}" source="${escapeXml(relationship.sourceId)}" target="${escapeXml(relationship.targetId)}">`,
    );
    lines.push(`      <data key="d_edge_type">${escapeXml(relationship.type)}</data>`);
    lines.push('    </edge>');
  });

  // Close graph and graphml
  lines.push('  </graph>');
  lines.push('</graphml>');

  return lines.join('\n');
}
