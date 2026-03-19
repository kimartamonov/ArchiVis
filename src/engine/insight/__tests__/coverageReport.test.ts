import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { buildCoverageReport } from '../coverageReport';
import { buildGraph } from '../../graph/buildGraph';
import { calculateMetrics } from '../../graph/calculateMetrics';
import { makeElement, makeRelationship, makeModel } from '../../graph/__tests__/fixtures';
import type { NormalizedModel, AnalysisGraph } from '../../types';

describe('buildCoverageReport', () => {
  // -----------------------------------------------------------------------
  // Known graph with orphans
  // -----------------------------------------------------------------------

  it('counts orphans correctly (degree=0 or diagrams=0)', () => {
    const model = makeModel(
      [
        makeElement('a', 'A', 'ApplicationComponent', ['d1']),
        makeElement('b', 'B', 'ApplicationService', ['d1']),
        makeElement('orphan1', 'O1', 'Node', []),             // degree=0, diagrams=0
        makeElement('orphan2', 'O2', 'BusinessProcess', ['d1']), // has diagrams but degree=0
        makeElement('orphan3', 'O3', 'DataObject', []),        // degree will be >0 but no diagrams
      ],
      [
        makeRelationship('r1', 'a', 'b'),
        makeRelationship('r2', 'a', 'orphan3'),
      ],
    );
    const { graph } = buildGraph(model);
    calculateMetrics(graph);

    const report = buildCoverageReport(graph);

    expect(report.totalElements).toBe(5);
    // orphan1: degree=0 → true; orphan2: degree=0 → true; orphan3: diagrams=0 → true
    // a: degree>0, diagrams>0 → false; b: degree>0, diagrams>0 → false
    expect(report.orphanCount).toBe(3);
    expect(report.orphanElements.length).toBe(3);
    const orphanIds = report.orphanElements.map((e) => e.id);
    expect(orphanIds).toContain('orphan1');
    expect(orphanIds).toContain('orphan2');
    expect(orphanIds).toContain('orphan3');
  });

  // -----------------------------------------------------------------------
  // Orphan percent calculation
  // -----------------------------------------------------------------------

  it('calculates orphanPercent correctly', () => {
    const model = makeModel(
      Array.from({ length: 10 }, (_, i) =>
        makeElement(`e${i}`, `E${i}`, 'ApplicationComponent', i < 5 ? ['d1'] : []),
      ),
      [makeRelationship('r1', 'e0', 'e1')],
    );
    const { graph } = buildGraph(model);
    calculateMetrics(graph);

    const report = buildCoverageReport(graph);
    // e0: degree=1, diagrams=1 → not orphan
    // e1: degree=1, diagrams=1 → not orphan
    // e2,e3,e4: degree=0, diagrams=1 → orphan (degree=0)
    // e5..e9: degree=0, diagrams=0 → orphan
    // Total orphans: 8 out of 10 = 80.0%
    expect(report.orphanPercent).toBe(80);
  });

  // -----------------------------------------------------------------------
  // Layer distribution
  // -----------------------------------------------------------------------

  it('produces correct layer distribution', () => {
    const model = makeModel([
      makeElement('a', 'A', 'ApplicationComponent', ['d1']),
      makeElement('b', 'B', 'ApplicationService', ['d1']),
      makeElement('c', 'C', 'BusinessProcess', ['d1']),
      makeElement('d', 'D', 'Node', ['d1']),
      makeElement('e', 'E', 'Node', ['d1']),
    ]);
    const { graph } = buildGraph(model);
    calculateMetrics(graph);

    const report = buildCoverageReport(graph);

    const sum = report.layerDistribution.reduce((s, l) => s + l.count, 0);
    expect(sum).toBe(5);

    const app = report.layerDistribution.find((l) => l.layer === 'Application');
    expect(app?.count).toBe(2); // ApplicationComponent + ApplicationService
    const biz = report.layerDistribution.find((l) => l.layer === 'Business');
    expect(biz?.count).toBe(1);
    const tech = report.layerDistribution.find((l) => l.layer === 'Technology');
    expect(tech?.count).toBe(2); // 2 Nodes
  });

  it('layer distribution sorted by count descending', () => {
    const model = makeModel([
      makeElement('a', 'A', 'ApplicationComponent', []),
      makeElement('b', 'B', 'ApplicationService', []),
      makeElement('c', 'C', 'ApplicationComponent', []),
      makeElement('d', 'D', 'Node', []),
    ]);
    const { graph } = buildGraph(model);
    calculateMetrics(graph);

    const report = buildCoverageReport(graph);
    // Application:3, Technology:1 → Application first
    expect(report.layerDistribution[0].layer).toBe('Application');
  });

  // -----------------------------------------------------------------------
  // Empty graph
  // -----------------------------------------------------------------------

  it('handles empty graph', () => {
    const graph: AnalysisGraph = {
      nodes: new Map(),
      edges: [],
      adjacencyOut: new Map(),
      adjacencyIn: new Map(),
    };
    const report = buildCoverageReport(graph);

    expect(report.totalElements).toBe(0);
    expect(report.orphanCount).toBe(0);
    expect(report.orphanPercent).toBe(0);
    expect(report.orphanElements).toEqual([]);
    expect(report.layerDistribution).toEqual([]);
  });

  // -----------------------------------------------------------------------
  // Broken references passed through
  // -----------------------------------------------------------------------

  it('passes through broken references', () => {
    const model = makeModel([makeElement('a', 'A')]);
    const { graph } = buildGraph(model);
    calculateMetrics(graph);

    const fakeWarnings = [
      { sourceId: 'x', targetId: 'y', type: 'R', reason: 'missing' },
    ];
    const report = buildCoverageReport(graph, fakeWarnings);

    expect(report.brokenReferences.length).toBe(1);
    expect(report.brokenReferences[0].sourceId).toBe('x');
  });

  // -----------------------------------------------------------------------
  // Demo dataset
  // -----------------------------------------------------------------------

  it('demo dataset: produces expected orphan count', () => {
    const demoJson: NormalizedModel = JSON.parse(
      readFileSync(resolve(__dirname, '../../../../demo/digital-bank.json'), 'utf-8'),
    );
    const { graph, warnings } = buildGraph(demoJson);
    calculateMetrics(graph);

    const report = buildCoverageReport(graph, warnings);

    expect(report.totalElements).toBe(102);
    expect(report.orphanCount).toBe(12);
    expect(report.orphanPercent).toBe(11.8);
    expect(report.orphanElements.length).toBe(12);
    expect(report.brokenReferences.length).toBe(0);

    // Layer distribution sums to total
    const sum = report.layerDistribution.reduce((s, l) => s + l.count, 0);
    expect(sum).toBe(102);
  });
});
