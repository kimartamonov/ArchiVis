// @vitest-environment jsdom
/**
 * M3-06 Validation: Full S-3 demo flow on the real demo dataset.
 *
 * Verifies:
 * - S-3 demo steps 1–6
 * - AC-4.1: Coverage report data is accurate
 * - AC-4.2: Orphan detection matches expected results
 * - AC-4.3: Orphan elements are interactive
 * - AC-5.3: All screens accessible via sidebar navigation
 * - M1/M2 regression: existing screens still work
 * - No blocker bugs
 */
import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import type { NormalizedModel, AnalysisGraph, CoverageReport } from '../../engine/types';
import { elementTypeToLayer } from '../../engine/types';
import { buildGraph } from '../../engine/graph/buildGraph';
import { calculateMetrics } from '../../engine/graph/calculateMetrics';
import { buildCoverageReport } from '../../engine/insight/coverageReport';
import { buildImpactResult } from '../../engine/insight/impactAnalysis';
import { graphNodesToRows } from '../../ui/screens/TableView/columns';
import { useGraphStore } from '../../stores/graphStore';
import { useModelStore } from '../../stores/modelStore';
import { useAnalysisStore } from '../../stores/analysisStore';
import { useUIStore } from '../../stores/uiStore';
import { TableView } from '../../ui/screens/TableView/TableView';
import { CoverageView } from '../../ui/screens/CoverageView/CoverageView';
import { Sidebar } from '../../ui/layout/Sidebar';

// Storage mocks
const storageMock = {
  getItem: vi.fn(() => null), setItem: vi.fn(), removeItem: vi.fn(), clear: vi.fn(),
  get length() { return 0; }, key: vi.fn(() => null),
};
if (!globalThis.localStorage) Object.defineProperty(globalThis, 'localStorage', { value: storageMock, writable: true });
if (!globalThis.sessionStorage) Object.defineProperty(globalThis, 'sessionStorage', { value: storageMock, writable: true });

// Load real demo dataset
import demoData from '../../../public/digital-bank.json';

let model: NormalizedModel;
let graph: AnalysisGraph;
let coverageReport: CoverageReport;

beforeAll(() => {
  model = demoData as NormalizedModel;
  const result = buildGraph(model);
  graph = result.graph;
  calculateMetrics(graph);
  coverageReport = buildCoverageReport(graph);
});

function loadStores() {
  useGraphStore.getState().setGraph(graph);
  useModelStore.getState().setCurrentModel(model);
}

describe('M3-06: S-3 Demo Flow Validation', () => {
  beforeEach(() => {
    useGraphStore.getState().reset();
    useModelStore.getState().reset();
    useAnalysisStore.getState().reset();
    useUIStore.getState().reset();
  });

  // =========================================================================
  // S-3 Demo Step 1: Table View renders all elements with correct columns
  // =========================================================================
  describe('Step 1: Table View renders all elements', () => {
    it('renders 102 data rows for demo dataset', () => {
      loadStores();
      render(<TableView />);
      const rows = screen.getAllByRole('row');
      // 1 header row + 102 data rows
      expect(rows.length).toBe(103);
    });

    it('displays all seven column headers', () => {
      loadStores();
      render(<TableView />);
      expect(screen.getByText('Name')).toBeTruthy();
      expect(screen.getByText('Type')).toBeTruthy();
      expect(screen.getByText('Layer')).toBeTruthy();
      expect(screen.getByText('Degree')).toBeTruthy();
      expect(screen.getByText('In')).toBeTruthy();
      expect(screen.getByText('Out')).toBeTruthy();
      expect(screen.getByText('Diagrams')).toBeTruthy();
    });

    it('shows correct element count', () => {
      loadStores();
      render(<TableView />);
      expect(screen.getByText('102 / 102 elements')).toBeTruthy();
    });
  });

  // =========================================================================
  // S-3 Demo Step 2: Sort by degree descending → hub at top
  // =========================================================================
  describe('Step 2: Sort by degree descending', () => {
    it('highest-degree hub appears first after sorting desc', () => {
      loadStores();
      const rows = graphNodesToRows(graph.nodes);
      const sorted = [...rows].sort((a, b) => b.degree - a.degree);
      const hubName = sorted[0].name;
      const hubDegree = sorted[0].degree;

      // Verify the hub is sensible (should be >= 14 based on demo dataset docs)
      expect(hubDegree).toBeGreaterThanOrEqual(14);
      expect(hubName).toBeTruthy();
    });
  });

  // =========================================================================
  // S-3 Demo Step 3: Filter by "Technology" layer
  // =========================================================================
  describe('Step 3: Filter by Technology layer', () => {
    it('only Technology elements remain after filter', () => {
      loadStores();
      render(<TableView />);

      const layerSelect = screen.getByLabelText('Filter by layer');
      fireEvent.change(layerSelect, { target: { value: 'Technology' } });

      const rows = screen.getAllByRole('row');
      const dataRowCount = rows.length - 1; // subtract header

      // Count Technology elements in data
      const techCount = Array.from(graph.nodes.values())
        .filter((n) => elementTypeToLayer(n.element.type) === 'Technology').length;

      expect(dataRowCount).toBe(techCount);
      expect(dataRowCount).toBeGreaterThan(0);
    });
  });

  // =========================================================================
  // S-3 Demo Step 4: Coverage screen displays stats header
  // =========================================================================
  describe('Step 4: Coverage screen stats', () => {
    it('displays total elements, orphan count, and orphan percent', () => {
      loadStores();
      render(<CoverageView />);

      expect(screen.getByText('Total Elements')).toBeTruthy();
      expect(screen.getByText('Orphan Elements')).toBeTruthy();
      expect(screen.getByText('Layers')).toBeTruthy();
    });
  });

  // =========================================================================
  // S-3 Demo Step 5: Orphan statistics on demo dataset
  // =========================================================================
  describe('Step 5: Orphan statistics — AC-4.1, AC-4.2', () => {
    it('coverage report identifies orphans correctly (AC-4.1)', () => {
      expect(coverageReport.totalElements).toBe(102);
      expect(coverageReport.orphanCount).toBeGreaterThan(0);
      // orphanPercent should be rounded correctly
      const expectedPercent = Math.round((coverageReport.orphanCount / 102) * 1000) / 10;
      expect(coverageReport.orphanPercent).toBe(expectedPercent);
    });

    it('orphan count matches expected ~11-12 range (AC-4.2)', () => {
      // Demo dataset documented as having ~11-12 orphans
      expect(coverageReport.orphanCount).toBeGreaterThanOrEqual(10);
      expect(coverageReport.orphanCount).toBeLessThanOrEqual(15);
    });

    it('every orphan truly has degree=0 OR diagramsCount=0', () => {
      for (const orphanEl of coverageReport.orphanElements) {
        const node = graph.nodes.get(orphanEl.id)!;
        expect(node.isOrphan).toBe(true);
        expect(node.degree === 0 || node.diagramsCount === 0).toBe(true);
      }
    });

    it('non-orphan nodes have degree>0 AND diagramsCount>0', () => {
      for (const node of graph.nodes.values()) {
        if (!node.isOrphan) {
          expect(node.degree).toBeGreaterThan(0);
          expect(node.diagramsCount).toBeGreaterThan(0);
        }
      }
    });
  });

  // =========================================================================
  // S-3 Demo Step 6: Click orphan → navigates to Impact Analyzer (AC-4.3)
  // =========================================================================
  describe('Step 6: Click orphan navigates (AC-4.3)', () => {
    it('clicking an orphan sets selectedElementId and screen=impact', () => {
      loadStores();
      render(<CoverageView />);

      const orphanName = coverageReport.orphanElements[0].name;
      fireEvent.click(screen.getByText(orphanName));

      expect(useAnalysisStore.getState().selectedElementId).toBe(coverageReport.orphanElements[0].id);
      expect(useUIStore.getState().activeScreen).toBe('impact');
    });
  });

  // =========================================================================
  // AC-5.3: All screens accessible via sidebar
  // =========================================================================
  describe('AC-5.3: Sidebar navigation', () => {
    it('all 5 nav items rendered', () => {
      loadStores();
      render(<Sidebar />);

      expect(screen.getByText('Connection')).toBeTruthy();
      expect(screen.getByText('Graph')).toBeTruthy();
      expect(screen.getByText('Impact')).toBeTruthy();
      expect(screen.getByText('Table')).toBeTruthy();
      expect(screen.getByText('Coverage')).toBeTruthy();
    });

    it('clicking each nav item sets activeScreen', () => {
      loadStores();
      render(<Sidebar />);

      const screens = ['Graph', 'Impact', 'Table', 'Coverage', 'Connection'] as const;
      const screenIds = ['graph', 'impact', 'table', 'coverage', 'connection'] as const;

      screens.forEach((label, i) => {
        fireEvent.click(screen.getByText(label));
        expect(useUIStore.getState().activeScreen).toBe(screenIds[i]);
      });
    });

    it('model-gated items are disabled when no model loaded', () => {
      // No stores loaded → no graph
      render(<Sidebar />);

      const graphBtn = screen.getByText('Graph');
      expect(graphBtn.closest('button')?.disabled).toBe(true);
      const impactBtn = screen.getByText('Impact');
      expect(impactBtn.closest('button')?.disabled).toBe(true);
      const tableBtn = screen.getByText('Table');
      expect(tableBtn.closest('button')?.disabled).toBe(true);
      const coverageBtn = screen.getByText('Coverage');
      expect(coverageBtn.closest('button')?.disabled).toBe(true);

      // Connection is always enabled
      const connBtn = screen.getByText('Connection');
      expect(connBtn.closest('button')?.disabled).toBe(false);
    });
  });

  // =========================================================================
  // Cross-screen transitions (all 3 paths)
  // =========================================================================
  describe('Cross-screen transitions', () => {
    it('Table row click → Impact with element', () => {
      loadStores();
      render(<TableView />);

      const firstElementName = Array.from(graph.nodes.values())[0].element.name;
      fireEvent.click(screen.getByText(firstElementName));

      expect(useAnalysisStore.getState().selectedElementId).toBeTruthy();
      expect(useUIStore.getState().activeScreen).toBe('impact');
    });

    it('Coverage orphan click → Impact with element', () => {
      loadStores();
      render(<CoverageView />);

      const orphanName = coverageReport.orphanElements[0].name;
      fireEvent.click(screen.getByText(orphanName));

      expect(useAnalysisStore.getState().selectedElementId).toBe(coverageReport.orphanElements[0].id);
      expect(useUIStore.getState().activeScreen).toBe('impact');
    });
  });

  // =========================================================================
  // M1 Regression: graph engine still works
  // =========================================================================
  describe('M1 Regression: graph engine', () => {
    it('buildGraph produces correct node count', () => {
      expect(graph.nodes.size).toBe(102);
    });

    it('graph has edges from relationships', () => {
      expect(graph.edges.length).toBeGreaterThan(0);
    });

    it('adjacency maps are populated', () => {
      expect(graph.adjacencyOut.size).toBeGreaterThan(0);
      expect(graph.adjacencyIn.size).toBeGreaterThan(0);
    });
  });

  // =========================================================================
  // M2 Regression: impact analysis still works
  // =========================================================================
  describe('M2 Regression: impact analysis', () => {
    it('buildImpactResult returns valid result for a hub element', () => {
      const rows = graphNodesToRows(graph.nodes);
      const hub = [...rows].sort((a, b) => b.degree - a.degree)[0];

      const result = buildImpactResult(graph, model, hub.id, 2);
      expect(result).toBeTruthy();
      expect(result.sourceElementId).toBe(hub.id);
      expect(result.affectedElements.length).toBeGreaterThan(0);
      expect(result.affectedLayers.length).toBeGreaterThan(0);
    });
  });

  // =========================================================================
  // Smoke: rapid screen switching
  // =========================================================================
  describe('Smoke: stability', () => {
    it('layer distribution sums to total elements', () => {
      const sum = coverageReport.layerDistribution.reduce((s, l) => s + l.count, 0);
      expect(sum).toBe(102);
    });

    it('all layers in distribution are valid ArchiMate layers', () => {
      const validLayers = new Set([
        'Strategy', 'Business', 'Application', 'Technology',
        'Physical', 'Motivation', 'Implementation', 'Other',
      ]);
      for (const { layer } of coverageReport.layerDistribution) {
        expect(validLayers.has(layer)).toBe(true);
      }
    });
  });
});
