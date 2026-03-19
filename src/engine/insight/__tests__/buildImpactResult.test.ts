import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { buildImpactResult } from '../impactAnalysis';
import { buildGraph } from '../../graph/buildGraph';
import { calculateMetrics } from '../../graph/calculateMetrics';
import { makeElement, makeRelationship, makeModel } from '../../graph/__tests__/fixtures';
import type { NormalizedModel } from '../../types';

describe('buildImpactResult', () => {
  // -----------------------------------------------------------------------
  // Basic: returns ImpactResult with all fields
  // -----------------------------------------------------------------------

  it('returns ImpactResult with all required fields', () => {
    const model = makeModel(
      [
        makeElement('a', 'A', 'ApplicationComponent', ['d1']),
        makeElement('b', 'B', 'BusinessProcess', ['d1']),
        makeElement('c', 'C', 'Node', ['d2']),
      ],
      [
        makeRelationship('r1', 'a', 'b'),
        makeRelationship('r2', 'b', 'c'),
      ],
      [
        { id: 'd1', name: 'Overview Diagram', elementIds: ['a', 'b'] },
        { id: 'd2', name: 'Tech Diagram', elementIds: ['c'] },
      ],
    );
    const { graph } = buildGraph(model);
    calculateMetrics(graph);

    const result = buildImpactResult(graph, model, 'a', 2);

    expect(result.sourceElementId).toBe('a');
    expect(result.depth).toBe(2);
    expect(result.affectedElements.length).toBe(2); // b, c
    expect(result.affectedLayers.length).toBeGreaterThan(0);
    expect(result.affectedDiagrams.length).toBeGreaterThan(0);
  });

  // -----------------------------------------------------------------------
  // Layer summary: counts match
  // -----------------------------------------------------------------------

  it('layer summary counts sum to total affected elements', () => {
    const model = makeModel(
      [
        makeElement('a', 'A', 'ApplicationComponent', ['d1']),
        makeElement('b', 'B', 'BusinessProcess', []),
        makeElement('c', 'C', 'ApplicationService', []),
        makeElement('d', 'D', 'Node', []),
      ],
      [
        makeRelationship('r1', 'a', 'b'),
        makeRelationship('r2', 'a', 'c'),
        makeRelationship('r3', 'a', 'd'),
      ],
    );
    const { graph } = buildGraph(model);
    calculateMetrics(graph);

    const result = buildImpactResult(graph, model, 'a', 1);

    const sum = result.affectedLayers.reduce((s, l) => s + l.count, 0);
    expect(sum).toBe(result.affectedElements.length);
    expect(sum).toBe(3);
  });

  it('layer summary has correct layer names', () => {
    const model = makeModel(
      [
        makeElement('a', 'A', 'ApplicationComponent', []),
        makeElement('b', 'B', 'BusinessProcess', []),
        makeElement('c', 'C', 'Node', []),
      ],
      [
        makeRelationship('r1', 'a', 'b'),
        makeRelationship('r2', 'a', 'c'),
      ],
    );
    const { graph } = buildGraph(model);
    calculateMetrics(graph);

    const result = buildImpactResult(graph, model, 'a', 1);

    const layerNames = result.affectedLayers.map((l) => l.layer);
    expect(layerNames).toContain('Business');
    expect(layerNames).toContain('Technology');
  });

  // -----------------------------------------------------------------------
  // Affected diagrams: source element's diagrams only
  // -----------------------------------------------------------------------

  it('affected diagrams lists diagrams of source element only', () => {
    const model = makeModel(
      [
        makeElement('a', 'A', 'ApplicationComponent', ['d1', 'd2']),
        makeElement('b', 'B', 'BusinessProcess', ['d3']),
      ],
      [makeRelationship('r1', 'a', 'b')],
      [
        { id: 'd1', name: 'Diagram One', elementIds: ['a'] },
        { id: 'd2', name: 'Diagram Two', elementIds: ['a'] },
        { id: 'd3', name: 'Diagram Three', elementIds: ['b'] },
      ],
    );
    const { graph } = buildGraph(model);
    calculateMetrics(graph);

    const result = buildImpactResult(graph, model, 'a', 1);

    expect(result.affectedDiagrams.length).toBe(2);
    const diagramNames = result.affectedDiagrams.map((d) => d.name);
    expect(diagramNames).toContain('Diagram One');
    expect(diagramNames).toContain('Diagram Two');
    expect(diagramNames).not.toContain('Diagram Three');
  });

  it('element with no diagrams produces empty affectedDiagrams', () => {
    const model = makeModel(
      [
        makeElement('a', 'A', 'ApplicationComponent', []),
        makeElement('b', 'B', 'BusinessProcess', ['d1']),
      ],
      [makeRelationship('r1', 'a', 'b')],
      [{ id: 'd1', name: 'Diagram One', elementIds: ['b'] }],
    );
    const { graph } = buildGraph(model);
    calculateMetrics(graph);

    const result = buildImpactResult(graph, model, 'a', 1);

    expect(result.affectedDiagrams).toEqual([]);
  });

  // -----------------------------------------------------------------------
  // Demo dataset: smoke
  // -----------------------------------------------------------------------

  it('demo dataset: Core Banking Platform produces valid ImpactResult', () => {
    const demoJson: NormalizedModel = JSON.parse(
      readFileSync(resolve(__dirname, '../../../../demo/digital-bank.json'), 'utf-8'),
    );
    const { graph } = buildGraph(demoJson);
    calculateMetrics(graph);

    // Find Core Banking Platform
    let coreId = '';
    for (const [id, node] of graph.nodes) {
      if (node.element.name === 'Core Banking Platform') {
        coreId = id;
        break;
      }
    }

    const result = buildImpactResult(graph, demoJson, coreId, 2);

    // Basic sanity
    expect(result.sourceElementId).toBe(coreId);
    expect(result.depth).toBe(2);
    expect(result.affectedElements.length).toBe(47);

    // Layer summary sums to total
    const sum = result.affectedLayers.reduce((s, l) => s + l.count, 0);
    expect(sum).toBe(47);

    // At least some layers present
    expect(result.affectedLayers.length).toBeGreaterThanOrEqual(2);

    // Diagrams present (Core Banking Platform should be in diagrams)
    expect(result.affectedDiagrams.length).toBeGreaterThan(0);
    for (const d of result.affectedDiagrams) {
      expect(d.id).toBeTruthy();
      expect(d.name).toBeTruthy();
    }
  });
});
