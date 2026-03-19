// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { generateGraphML } from '../graphml';
import {
  makeExportNode,
  makeExportEdge,
  NODE_PG,
  NODE_PS,
  NODE_SPECIAL,
  NODE_CYRILLIC,
  NODE_EMPTY_NAME,
  NODE_ZERO_DEGREE,
  EDGE_PG_PS,
} from './fixtures';

function parseXml(xml: string): Document {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'application/xml');
  const parseError = doc.querySelector('parsererror');
  if (parseError) {
    throw new Error(`XML parse error: ${parseError.textContent}`);
  }
  return doc;
}

const NS = 'http://graphml.graphstruct.org/xmlns';

describe('generateGraphML', () => {
  // ---- Structure ----

  it('returns valid parseable XML', () => {
    const xml = generateGraphML([NODE_PG, NODE_PS], [EDGE_PG_PS]);
    expect(() => parseXml(xml)).not.toThrow();
  });

  it('starts with XML declaration', () => {
    const xml = generateGraphML([NODE_PG], []);
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
  });

  it('has graphml root with correct namespace', () => {
    const doc = parseXml(generateGraphML([NODE_PG], []));
    expect(doc.documentElement.tagName).toBe('graphml');
    expect(doc.documentElement.getAttribute('xmlns')).toBe(NS);
  });

  it('graph element has edgedefault="directed"', () => {
    const doc = parseXml(generateGraphML([NODE_PG], []));
    const graph = doc.getElementsByTagNameNS(NS, 'graph')[0];
    expect(graph.getAttribute('edgedefault')).toBe('directed');
  });

  // ---- Key definitions ----

  it('contains key definitions for node attributes', () => {
    const xml = generateGraphML([NODE_PG], []);
    expect(xml).toContain('attr.name="name"');
    expect(xml).toContain('attr.name="type"');
    expect(xml).toContain('attr.name="layer"');
    expect(xml).toContain('attr.name="degree"');
  });

  it('contains key definition for edge type', () => {
    const xml = generateGraphML([], [EDGE_PG_PS]);
    expect(xml).toContain('id="d_edge_type"');
    expect(xml).toContain('for="edge"');
  });

  // ---- Nodes ----

  it('produces correct number of node elements', () => {
    const doc = parseXml(generateGraphML([NODE_PG, NODE_PS], [EDGE_PG_PS]));
    expect(doc.getElementsByTagNameNS(NS, 'node').length).toBe(2);
  });

  it('node elements have correct data values', () => {
    const doc = parseXml(generateGraphML([NODE_PG], []));
    const node = doc.getElementsByTagNameNS(NS, 'node')[0];
    expect(node.getAttribute('id')).toBe('pg');

    const dataElements = node.getElementsByTagNameNS(NS, 'data');
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

  // ---- Edges ----

  it('produces correct number of edge elements', () => {
    const doc = parseXml(generateGraphML([NODE_PG, NODE_PS], [EDGE_PG_PS]));
    expect(doc.getElementsByTagNameNS(NS, 'edge').length).toBe(1);
  });

  it('edge elements have correct source, target, and type', () => {
    const doc = parseXml(generateGraphML([NODE_PG, NODE_PS], [EDGE_PG_PS]));
    const edge = doc.getElementsByTagNameNS(NS, 'edge')[0];
    expect(edge.getAttribute('source')).toBe('pg');
    expect(edge.getAttribute('target')).toBe('ps');
    const data = edge.getElementsByTagNameNS(NS, 'data')[0];
    expect(data.getAttribute('key')).toBe('d_edge_type');
    expect(data.textContent).toBe('ServingRelationship');
  });

  // ---- Escaping ----

  it('escapes XML special characters in names', () => {
    const xml = generateGraphML([NODE_SPECIAL], []);
    expect(xml).toContain('&amp;');
    expect(xml).toContain('&lt;');
    expect(xml).toContain('&gt;');
    expect(xml).toContain('&quot;');
    expect(() => parseXml(xml)).not.toThrow();
  });

  it('preserves Cyrillic characters', () => {
    const xml = generateGraphML([NODE_CYRILLIC], []);
    expect(() => parseXml(xml)).not.toThrow();
    const doc = parseXml(xml);
    const node = doc.getElementsByTagNameNS(NS, 'node')[0];
    const dataElements = node.getElementsByTagNameNS(NS, 'data');
    let nameValue = '';
    for (let i = 0; i < dataElements.length; i++) {
      if (dataElements[i].getAttribute('key') === 'd_name') {
        nameValue = dataElements[i].textContent!;
      }
    }
    expect(nameValue).toBe('Платёжный Шлюз');
  });

  // ---- Edge cases ----

  it('handles empty input gracefully', () => {
    const xml = generateGraphML([], []);
    expect(() => parseXml(xml)).not.toThrow();
    const doc = parseXml(xml);
    expect(doc.getElementsByTagNameNS(NS, 'node').length).toBe(0);
    expect(doc.getElementsByTagNameNS(NS, 'edge').length).toBe(0);
  });

  it('handles single node with no edges', () => {
    const doc = parseXml(generateGraphML([NODE_PG], []));
    expect(doc.getElementsByTagNameNS(NS, 'node').length).toBe(1);
    expect(doc.getElementsByTagNameNS(NS, 'edge').length).toBe(0);
  });

  it('handles node with empty name', () => {
    const xml = generateGraphML([NODE_EMPTY_NAME], []);
    expect(() => parseXml(xml)).not.toThrow();
    const doc = parseXml(xml);
    const node = doc.getElementsByTagNameNS(NS, 'node')[0];
    expect(node.getAttribute('id')).toBe('empty');
  });

  it('handles zero-degree orphan node', () => {
    const xml = generateGraphML([NODE_ZERO_DEGREE], []);
    expect(() => parseXml(xml)).not.toThrow();
    const doc = parseXml(xml);
    const node = doc.getElementsByTagNameNS(NS, 'node')[0];
    const dataElements = node.getElementsByTagNameNS(NS, 'data');
    let degreeValue = '';
    for (let i = 0; i < dataElements.length; i++) {
      if (dataElements[i].getAttribute('key') === 'd_degree') {
        degreeValue = dataElements[i].textContent!;
      }
    }
    expect(degreeValue).toBe('0');
  });

  it('handles multiple edges between different nodes', () => {
    const nodeC = makeExportNode('ob', 'Order Backend', 'ApplicationComponent');
    const edge2 = makeExportEdge('r2', NODE_PS, nodeC);
    const xml = generateGraphML([NODE_PG, NODE_PS, nodeC], [EDGE_PG_PS, edge2]);
    const doc = parseXml(xml);
    expect(doc.getElementsByTagNameNS(NS, 'node').length).toBe(3);
    expect(doc.getElementsByTagNameNS(NS, 'edge').length).toBe(2);
  });
});
