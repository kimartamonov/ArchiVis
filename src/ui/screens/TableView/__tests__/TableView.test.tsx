// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TableView } from '../TableView';
import { useGraphStore } from '../../../../stores/graphStore';
import { useAnalysisStore } from '../../../../stores/analysisStore';
import { useUIStore } from '../../../../stores/uiStore';
import { buildGraph } from '../../../../engine/graph/buildGraph';
import { calculateMetrics } from '../../../../engine/graph/calculateMetrics';
import { makeElement, makeRelationship, makeModel } from '../../../../engine/graph/__tests__/fixtures';

// Storage mocks
const storageMock = {
  getItem: vi.fn(() => null), setItem: vi.fn(), removeItem: vi.fn(), clear: vi.fn(),
  get length() { return 0; }, key: vi.fn(() => null),
};
if (!globalThis.localStorage) Object.defineProperty(globalThis, 'localStorage', { value: storageMock, writable: true });
if (!globalThis.sessionStorage) Object.defineProperty(globalThis, 'sessionStorage', { value: storageMock, writable: true });

function loadTestGraph() {
  const model = makeModel(
    [
      makeElement('pg', 'Payment Gateway', 'ApplicationComponent', ['d1']),
      makeElement('ps', 'Payment Service', 'ApplicationService', ['d1']),
      makeElement('ob', 'Order Backend', 'ApplicationComponent', []),
      makeElement('bp', 'Order Process', 'BusinessProcess', []),
      makeElement('nd', 'Web Server', 'Node', ['d1']),
    ],
    [
      makeRelationship('r1', 'pg', 'ps'),
      makeRelationship('r2', 'ps', 'ob'),
      makeRelationship('r3', 'bp', 'ps'),
    ],
  );
  const { graph } = buildGraph(model);
  calculateMetrics(graph);
  useGraphStore.getState().setGraph(graph);
}

describe('TableView', () => {
  beforeEach(() => {
    useGraphStore.getState().reset();
    useAnalysisStore.getState().reset();
    useUIStore.getState().reset();
  });

  it('renders correct number of rows', () => {
    loadTestGraph();
    render(<TableView />);
    // 5 elements = 5 rows
    const rows = screen.getAllByRole('row');
    // header + 5 data rows = 6
    expect(rows.length).toBe(6);
  });

  it('displays all seven column headers', () => {
    loadTestGraph();
    render(<TableView />);
    expect(screen.getByText('Name')).toBeTruthy();
    expect(screen.getByText('Type')).toBeTruthy();
    expect(screen.getByText('Layer')).toBeTruthy();
    expect(screen.getByText('Degree')).toBeTruthy();
    expect(screen.getByText('In')).toBeTruthy();
    expect(screen.getByText('Out')).toBeTruthy();
    expect(screen.getByText('Diagrams')).toBeTruthy();
  });

  it('shows element names in rows', () => {
    loadTestGraph();
    render(<TableView />);
    expect(screen.getByText('Payment Gateway')).toBeTruthy();
    expect(screen.getByText('Payment Service')).toBeTruthy();
    expect(screen.getByText('Order Backend')).toBeTruthy();
    expect(screen.getByText('Order Process')).toBeTruthy();
    expect(screen.getByText('Web Server')).toBeTruthy();
  });

  it('sorting by Degree changes row order', () => {
    loadTestGraph();
    render(<TableView />);
    const degreeHeader = screen.getByText('Degree');

    // Get initial first data row
    const rowsBefore = screen.getAllByRole('row');
    const firstBefore = rowsBefore[1].textContent;

    // Click to sort
    fireEvent.click(degreeHeader);
    const rowsAfter = screen.getAllByRole('row');
    const firstAfter = rowsAfter[1].textContent;

    // At least one sort should change the order (unless already sorted that way)
    // Click again to reverse
    fireEvent.click(degreeHeader);
    const rowsReversed = screen.getAllByRole('row');
    const firstReversed = rowsReversed[1].textContent;

    // Asc and desc should produce different first rows (if data varies)
    expect(firstAfter !== firstReversed || firstBefore !== firstAfter).toBe(true);
  });

  it('filtering by layer works', () => {
    loadTestGraph();
    render(<TableView />);
    const layerSelect = screen.getByLabelText('Filter by layer');
    fireEvent.change(layerSelect, { target: { value: 'Technology' } });
    // Only Web Server (Node → Technology)
    const rows = screen.getAllByRole('row');
    expect(rows.length).toBe(2); // header + 1 data row
    expect(screen.getByText('Web Server')).toBeTruthy();
  });

  it('filtering by type works', () => {
    loadTestGraph();
    render(<TableView />);
    const typeSelect = screen.getByLabelText('Filter by type');
    fireEvent.change(typeSelect, { target: { value: 'ApplicationComponent' } });
    // Payment Gateway + Order Backend
    const rows = screen.getAllByRole('row');
    expect(rows.length).toBe(3); // header + 2 data rows
  });

  it('clicking a row navigates to impact analyzer', () => {
    loadTestGraph();
    render(<TableView />);
    fireEvent.click(screen.getByText('Payment Gateway'));
    expect(useAnalysisStore.getState().selectedElementId).toBe('pg');
    expect(useUIStore.getState().activeScreen).toBe('impact');
  });

  it('renders without crash when no graph loaded', () => {
    render(<TableView />);
    expect(screen.getByText(/0 \/ 0 elements/)).toBeTruthy();
  });
});
