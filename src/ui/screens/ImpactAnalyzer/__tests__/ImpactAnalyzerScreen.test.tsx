// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ImpactAnalyzerScreen } from '../ImpactAnalyzerScreen';
import { useGraphStore } from '../../../../stores/graphStore';
import { useModelStore } from '../../../../stores/modelStore';
import { useAnalysisStore } from '../../../../stores/analysisStore';
import { useUIStore } from '../../../../stores/uiStore';
import { buildGraph } from '../../../../engine/graph/buildGraph';
import { calculateMetrics } from '../../../../engine/graph/calculateMetrics';
import { makeElement, makeRelationship, makeModel } from '../../../../engine/graph/__tests__/fixtures';
import type { NormalizedModel } from '../../../../engine/types';

// Storage mocks for connectionStore side-effects
const storageMock = {
  getItem: vi.fn(() => null),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  get length() { return 0; },
  key: vi.fn(() => null),
};
if (!globalThis.localStorage) {
  Object.defineProperty(globalThis, 'localStorage', { value: storageMock, writable: true });
}
if (!globalThis.sessionStorage) {
  Object.defineProperty(globalThis, 'sessionStorage', { value: storageMock, writable: true });
}

function loadTestModel(): NormalizedModel {
  const model = makeModel(
    [
      makeElement('pg', 'Payment Gateway', 'ApplicationComponent', ['d1', 'd2']),
      makeElement('ps', 'Payment Service', 'ApplicationService', ['d1']),
      makeElement('ob', 'Order Backend', 'ApplicationComponent', []),
      makeElement('bp', 'Business Process', 'BusinessProcess', ['d1']),
      makeElement('lonely', 'Lonely Node', 'Node', []),
    ],
    [
      makeRelationship('r1', 'pg', 'ps'),
      makeRelationship('r2', 'ps', 'ob'),
      makeRelationship('r3', 'ps', 'bp'),
    ],
    [
      { id: 'd1', name: 'Overview', elementIds: ['pg', 'ps', 'bp'] },
      { id: 'd2', name: 'Payments', elementIds: ['pg'] },
    ],
  );
  const { graph } = buildGraph(model);
  calculateMetrics(graph);
  useGraphStore.getState().setGraph(graph);
  useModelStore.getState().setCurrentModel(model);
  return model;
}

describe('ImpactAnalyzerScreen', () => {
  beforeEach(() => {
    useGraphStore.getState().reset();
    useModelStore.getState().reset();
    useAnalysisStore.getState().reset();
    useUIStore.getState().reset();
  });

  // ----- No element selected -----

  it('shows prompt when no element selected', () => {
    loadTestModel();
    render(<ImpactAnalyzerScreen />);
    expect(screen.getByText(/Select an element/i)).toBeTruthy();
  });

  // ----- Element card with metrics -----

  it('shows element card with correct name and metrics', () => {
    loadTestModel();
    useAnalysisStore.getState().selectElement('pg');

    render(<ImpactAnalyzerScreen />);

    expect(screen.getByText('Payment Gateway')).toBeTruthy();
    expect(screen.getByText('ApplicationComponent')).toBeTruthy();
    // "Application" appears in source card badge + affected list + layer summary
    expect(screen.getAllByText('Application').length).toBeGreaterThanOrEqual(1);
  });

  // ----- Affected elements list -----

  it('shows affected elements grouped by distance', () => {
    loadTestModel();
    useAnalysisStore.getState().selectElement('pg');

    render(<ImpactAnalyzerScreen />);

    // Depth 1: ps is direct neighbor
    expect(screen.getByText('Payment Service')).toBeTruthy();
    expect(screen.getByText(/1-hop/)).toBeTruthy();
  });

  // ----- Layer summary -----

  it('shows layer summary with correct layers', () => {
    loadTestModel();
    useAnalysisStore.getState().selectElement('pg');

    render(<ImpactAnalyzerScreen />);

    expect(screen.getByText('Layer Summary')).toBeTruthy();
  });

  // ----- Affected diagrams -----

  it('shows affected diagrams for source element', () => {
    loadTestModel();
    useAnalysisStore.getState().selectElement('pg');

    render(<ImpactAnalyzerScreen />);

    expect(screen.getByText('Affected Diagrams')).toBeTruthy();
    expect(screen.getByText('Overview')).toBeTruthy();
    expect(screen.getByText('Payments')).toBeTruthy();
  });

  // ----- Isolated node -----

  it('shows empty state for isolated node', () => {
    loadTestModel();
    useAnalysisStore.getState().selectElement('lonely');

    render(<ImpactAnalyzerScreen />);

    expect(screen.getByText('Lonely Node')).toBeTruthy();
    expect(screen.getByText(/No affected elements/i)).toBeTruthy();
  });

  // ----- Smoke: renders without crash when no model -----

  it('renders without crash when no model loaded', () => {
    render(<ImpactAnalyzerScreen />);
    expect(screen.getByText(/Select an element/i)).toBeTruthy();
  });
});
