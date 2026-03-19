// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { generateGraphML } from '../graphml';
import type { GraphNode, GraphEdge } from '../../engine/types';
import { makeElement, makeRelationship } from '../../engine/graph/__tests__/fixtures';

function makeNode(
  id: string,
  name: string,
  type: string,
  degree: number = 2,
  diagramIds: string[] = ['d1'],
): GraphNode {
  return {
    element: makeElement(id, name, type, diagramIds),
    degree,
    inDegree: 1,
    outDegree: 1,
    diagramsCount: diagramIds.length,
    isOrphan: false,
  };
}

function makeEdge(
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

function parseXml(xml: string): Document {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'application/xml');
  const parseError = doc.querySelector('parsererror');
  if (parseError) {
    throw new Error(`XML parse error: ${parseError.textContent}`);
  }
  return doc;
}

describe('generateGraphML', () => {
  const nodeA = makeNode('pg', 'Payment Gateway', 'ApplicationComponent', 8);
  const nodeB = makeNode('ps', 'Payment Service', 'ApplicationService', 4);
  const edge1 = makeEdge('r1', nodeA, nodeB);

  it('returns valid parseable XML', () => {
    const xml = generateGraphML([nodeA, nodeB], [edge1]);
    expect(() => parseXml(xml)).not.toThrow();
  });

  it('starts with XML declaration', () => {
    const xml = generateGraphML([nodeA], []);
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
  });

  it('has graphml root with correct namespace', () => {
    const xml = generateGraphML([nodeA], []);
    const doc = parseXml(xml);
    const root = doc.documentElement;
    expect(root.tagName).toBe('graphml');
    expect(root.getAttribute('xmlns')).toBe('http://graphml.graphstruct.org/xmlns');
  });

  it('contains key definitions for node attributes', () => {
    const xml = generateGraphML([nodeA], []);
    expect(xml).toContain('attr.name="name"');
    expect(xml).toContain('attr.name="type"');
    expect(xml).toContain('attr.name="layer"');
    expect(xml).toContain('attr.name="degree"');
  });

  it('contains key definition for edge type', () => {
    const xml = generateGraphML([], [edge1]);
    expect(xml).toContain('id="d_edge_type"');
    expect(xml).toContain('for="edge"');
  });

  it('graph element has edgedefault="directed"', () => {
    const xml = generateGraphML([nodeA], []);
    const doc = parseXml(xml);
    const ns = 'http://graphml.graphstruct.org/xmlns';
    const graph = doc.getElementsByTagNameNS(ns, 'graph')[0];
    expect(graph.getAttribute('edgedefault')).toBe('directed');
  });

  it('produces correct number of node elements', () => {
    const xml = generateGraphML([nodeA, nodeB], [edge1]);
    const doc = parseXml(xml);
    const ns = 'http://graphml.graphstruct.org/xmlns';
    const nodes = doc.getElementsByTagNameNS(ns, 'node');
    expect(nodes.length).toBe(2);
  });

  it('node elements have correct data values', () => {
    const xml = generateGraphML([nodeA], []);
    const doc = parseXml(xml);
    const ns = 'http://graphml.graphstruct.org/xmlns';
    const node = doc.getElementsByTagNameNS(ns, 'node')[0];
    expect(node.getAttribute('id')).toBe('pg');

    const dataElements = node.getElementsByTagNameNS(ns, 'data');
    const dataMap = new Map<string, string>();
    for (let i = 0; i < dataElements.length; i++) {
      const d = dataElements[i];
      dataMap.set(d.getAttribute('key')!, d.textContent!);
    }

    expect(dataMap.get('d_name')).toBe('Payment Gateway');
    expect(dataMap.get('d_type')).toBe('ApplicationComponent');
    expect(dataMap.get('d_layer')).toBe('Application');
    expect(dataMap.get('d_degree')).toBe('8');
  });

  it('produces correct number of edge elements', () => {
    const xml = generateGraphML([nodeA, nodeB], [edge1]);
    const doc = parseXml(xml);
    const ns = 'http://graphml.graphstruct.org/xmlns';
    const edges = doc.getElementsByTagNameNS(ns, 'edge');
    expect(edges.length).toBe(1);
  });

  it('edge elements have correct source, target, and type', () => {
    const xml = generateGraphML([nodeA, nodeB], [edge1]);
    const doc = parseXml(xml);
    const ns = 'http://graphml.graphstruct.org/xmlns';
    const edge = doc.getElementsByTagNameNS(ns, 'edge')[0];
    expect(edge.getAttribute('source')).toBe('pg');
    expect(edge.getAttribute('target')).toBe('ps');

    const data = edge.getElementsByTagNameNS(ns, 'data')[0];
    expect(data.getAttribute('key')).toBe('d_edge_type');
    expect(data.textContent).toBe('ServingRelationship');
  });

  it('escapes XML special characters in names', () => {
    const special = makeNode('x', 'Risk & Return <Analysis> "Test"', 'ApplicationComponent');
    const xml = generateGraphML([special], []);
    expect(xml).toContain('&amp;');
    expect(xml).toContain('&lt;');
    expect(xml).toContain('&gt;');
    expect(xml).toContain('&quot;');
    // Should still parse
    expect(() => parseXml(xml)).not.toThrow();
  });

  it('handles empty input gracefully', () => {
    const xml = generateGraphML([], []);
    expect(() => parseXml(xml)).not.toThrow();
    const doc = parseXml(xml);
    const ns = 'http://graphml.graphstruct.org/xmlns';
    expect(doc.getElementsByTagNameNS(ns, 'node').length).toBe(0);
    expect(doc.getElementsByTagNameNS(ns, 'edge').length).toBe(0);
  });

  it('handles single node with no edges', () => {
    const xml = generateGraphML([nodeA], []);
    expect(() => parseXml(xml)).not.toThrow();
    const doc = parseXml(xml);
    const ns = 'http://graphml.graphstruct.org/xmlns';
    expect(doc.getElementsByTagNameNS(ns, 'node').length).toBe(1);
    expect(doc.getElementsByTagNameNS(ns, 'edge').length).toBe(0);
  });
});
