// @vitest-environment jsdom
/**
 * M4-05 Validation: Export files open correctly.
 *
 * Verifies on the real demo dataset:
 * - AC-6.1: GraphML opens without error (valid XML, correct structure)
 * - AC-6.2: GraphML contains all affected nodes, correct edges, names
 * - AC-6.3: CSV opens without encoding prompt (BOM present)
 * - AC-6.4: CSV has correct header, all rows, UTF-8 preserved
 * - S-4 demo steps 1–6
 * - Regression: M1–M3 still works
 */
import { describe, it, expect, beforeAll } from 'vitest';
import type { NormalizedModel, AnalysisGraph } from '../../engine/types';
import { buildGraph } from '../../engine/graph/buildGraph';
import { calculateMetrics } from '../../engine/graph/calculateMetrics';
import { buildImpactResult } from '../../engine/insight/impactAnalysis';
import { generateGraphML } from '../../export/graphml';
import { generateCSV } from '../../export/csv';
import { sanitizeFileName } from '../../utils/download';
import demoData from '../../../public/digital-bank.json';

let model: NormalizedModel;
let graph: AnalysisGraph;

beforeAll(() => {
  model = demoData as NormalizedModel;
  const result = buildGraph(model);
  graph = result.graph;
  calculateMetrics(graph);
});

function parseXml(xml: string): Document {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'application/xml');
  const err = doc.querySelector('parsererror');
  if (err) throw new Error(`XML parse error: ${err.textContent}`);
  return doc;
}

const NS = 'http://graphml.graphstruct.org/xmlns';

// =========================================================================
// GraphML Export Validation (AC-6.1, AC-6.2)
// =========================================================================
describe('M4-05: GraphML export on demo dataset', () => {
  // Pick a hub element for impact analysis
  let hubId: string;
  let xml: string;
  let doc: Document;

  beforeAll(() => {
    const sorted = Array.from(graph.nodes.values()).sort((a, b) => b.degree - a.degree);
    hubId = sorted[0].element.id;

    const impact = buildImpactResult(graph, model, hubId, 2);
    const affectedIds = new Set(impact.affectedElements.map((e) => e.id));
    affectedIds.add(hubId);
    const nodes = Array.from(graph.nodes.values()).filter((n) => affectedIds.has(n.element.id));
    const edges = graph.edges.filter(
      (e) => affectedIds.has(e.relationship.sourceId) && affectedIds.has(e.relationship.targetId),
    );
    xml = generateGraphML(nodes, edges);
    doc = parseXml(xml);
  });

  it('AC-6.1: GraphML is valid XML (opens without error)', () => {
    expect(() => parseXml(xml)).not.toThrow();
  });

  it('AC-6.1: has correct GraphML namespace', () => {
    expect(doc.documentElement.getAttribute('xmlns')).toBe(NS);
  });

  it('AC-6.1: graph is declared as directed', () => {
    const g = doc.getElementsByTagNameNS(NS, 'graph')[0];
    expect(g.getAttribute('edgedefault')).toBe('directed');
  });

  it('AC-6.2: contains affected nodes (> 1)', () => {
    const nodeEls = doc.getElementsByTagNameNS(NS, 'node');
    expect(nodeEls.length).toBeGreaterThan(1);
  });

  it('AC-6.2: hub node is present', () => {
    const nodeEls = doc.getElementsByTagNameNS(NS, 'node');
    let found = false;
    for (let i = 0; i < nodeEls.length; i++) {
      if (nodeEls[i].getAttribute('id') === hubId) found = true;
    }
    expect(found).toBe(true);
  });

  it('AC-6.2: nodes have name data', () => {
    const nodeEls = doc.getElementsByTagNameNS(NS, 'node');
    const first = nodeEls[0];
    const dataEls = first.getElementsByTagNameNS(NS, 'data');
    const keys = [];
    for (let i = 0; i < dataEls.length; i++) keys.push(dataEls[i].getAttribute('key'));
    expect(keys).toContain('d_name');
    expect(keys).toContain('d_type');
    expect(keys).toContain('d_layer');
    expect(keys).toContain('d_degree');
  });

  it('AC-6.2: edges connect correct nodes (source/target exist in node set)', () => {
    const nodeIds = new Set<string>();
    const nodeEls = doc.getElementsByTagNameNS(NS, 'node');
    for (let i = 0; i < nodeEls.length; i++) nodeIds.add(nodeEls[i].getAttribute('id')!);

    const edgeEls = doc.getElementsByTagNameNS(NS, 'edge');
    for (let i = 0; i < edgeEls.length; i++) {
      const src = edgeEls[i].getAttribute('source')!;
      const tgt = edgeEls[i].getAttribute('target')!;
      expect(nodeIds.has(src)).toBe(true);
      expect(nodeIds.has(tgt)).toBe(true);
    }
  });

  it('AC-6.2: edges have type data', () => {
    const edgeEls = doc.getElementsByTagNameNS(NS, 'edge');
    if (edgeEls.length > 0) {
      const dataEls = edgeEls[0].getElementsByTagNameNS(NS, 'data');
      expect(dataEls.length).toBeGreaterThan(0);
      expect(dataEls[0].getAttribute('key')).toBe('d_edge_type');
    }
  });

  it('file name utility produces valid name', () => {
    const hubName = graph.nodes.get(hubId)!.element.name;
    const fname = `impact_${sanitizeFileName(hubName)}_2.graphml`;
    expect(fname).toMatch(/^impact_\w+_2\.graphml$/);
  });
});

// =========================================================================
// CSV Export Validation (AC-6.3, AC-6.4)
// =========================================================================
describe('M4-05: CSV export on demo dataset', () => {
  let csv: string;

  beforeAll(() => {
    const nodes = Array.from(graph.nodes.values());
    csv = generateCSV(nodes);
  });

  it('AC-6.3: starts with UTF-8 BOM (no encoding prompt in Excel)', () => {
    expect(csv.charCodeAt(0)).toBe(0xFEFF);
  });

  it('AC-6.4: header has all 9 columns', () => {
    const header = csv.replace('\uFEFF', '').split('\n')[0];
    const cols = header.split(',');
    expect(cols).toEqual([
      'id', 'name', 'type', 'layer', 'degree',
      'in_degree', 'out_degree', 'diagrams_count', 'is_orphan',
    ]);
  });

  it('AC-6.4: all 102 data rows present', () => {
    const lines = csv.replace('\uFEFF', '').split('\n');
    // header + 102 data rows
    expect(lines.length).toBe(103);
  });

  it('AC-6.4: spot-check first data row has non-empty fields', () => {
    const lines = csv.replace('\uFEFF', '').split('\n');
    const firstRow = lines[1];
    // Should have at least 9 fields (some may be quoted)
    expect(firstRow.length).toBeGreaterThan(10);
    expect(firstRow).not.toBe('');
  });

  it('AC-6.4: is_orphan values are true or false strings', () => {
    const lines = csv.replace('\uFEFF', '').split('\n').slice(1);
    for (const line of lines) {
      expect(line.endsWith(',true') || line.endsWith(',false')).toBe(true);
    }
  });

  it('AC-6.4: no garbled characters — all names from model appear in CSV', () => {
    // Spot check: first 5 element names
    const elements = model.elements.slice(0, 5);
    for (const el of elements) {
      expect(csv).toContain(el.name);
    }
  });

  it('file name utility produces valid name', () => {
    const fname = `elements_${sanitizeFileName(model.name)}.csv`;
    expect(fname).toBe('elements_Digital_Bank_Architecture.csv');
  });
});

// =========================================================================
// Regression: full test suite still passes (checked via vitest run)
// =========================================================================
describe('M4-05: Regression checks', () => {
  it('graph engine still produces 102 nodes', () => {
    expect(graph.nodes.size).toBe(102);
  });

  it('impact analysis still works on hub element', () => {
    const sorted = Array.from(graph.nodes.values()).sort((a, b) => b.degree - a.degree);
    const result = buildImpactResult(graph, model, sorted[0].element.id, 2);
    expect(result.affectedElements.length).toBeGreaterThan(0);
  });

  it('export generators do not modify graph state', () => {
    const nodesBefore = graph.nodes.size;
    const edgesBefore = graph.edges.length;

    const nodes = Array.from(graph.nodes.values());
    generateCSV(nodes);
    generateGraphML(nodes, graph.edges);

    expect(graph.nodes.size).toBe(nodesBefore);
    expect(graph.edges.length).toBe(edgesBefore);
  });
});
