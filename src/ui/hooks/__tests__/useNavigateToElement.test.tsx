// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useNavigateToElement } from '../useNavigateToElement';
import { useAnalysisStore } from '../../../stores/analysisStore';
import { useUIStore } from '../../../stores/uiStore';
import { useGraphStore } from '../../../stores/graphStore';
import { buildGraph } from '../../../engine/graph/buildGraph';
import { calculateMetrics } from '../../../engine/graph/calculateMetrics';
import { makeElement, makeRelationship, makeModel } from '../../../engine/graph/__tests__/fixtures';
import { TableView } from '../../screens/TableView/TableView';
import { CoverageView } from '../../screens/CoverageView/CoverageView';

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
      makeElement('orphan1', 'Orphan Node', 'Node', []),
    ],
    [
      makeRelationship('r1', 'pg', 'ps'),
      makeRelationship('r2', 'ps', 'ob'),
    ],
  );
  const { graph } = buildGraph(model);
  calculateMetrics(graph);
  useGraphStore.getState().setGraph(graph);
}

describe('useNavigateToElement', () => {
  beforeEach(() => {
    useAnalysisStore.getState().reset();
    useUIStore.getState().reset();
    useGraphStore.getState().reset();
  });

  it('sets selectedElementId and activeScreen on call', () => {
    const { result } = renderHook(() => useNavigateToElement());

    act(() => {
      result.current('pg', 'impact');
    });

    expect(useAnalysisStore.getState().selectedElementId).toBe('pg');
    expect(useUIStore.getState().activeScreen).toBe('impact');
  });

  it('defaults target screen to impact', () => {
    const { result } = renderHook(() => useNavigateToElement());

    act(() => {
      result.current('ps');
    });

    expect(useAnalysisStore.getState().selectedElementId).toBe('ps');
    expect(useUIStore.getState().activeScreen).toBe('impact');
  });

  it('can navigate to any screen', () => {
    const { result } = renderHook(() => useNavigateToElement());

    act(() => {
      result.current('pg', 'graph');
    });

    expect(useAnalysisStore.getState().selectedElementId).toBe('pg');
    expect(useUIStore.getState().activeScreen).toBe('graph');
  });

  it('table row click sets element and screen via hook', () => {
    loadTestGraph();
    render(<TableView />);

    fireEvent.click(screen.getByText('Payment Gateway'));

    expect(useAnalysisStore.getState().selectedElementId).toBe('pg');
    expect(useUIStore.getState().activeScreen).toBe('impact');
  });

  it('coverage orphan click sets element and screen via hook', () => {
    loadTestGraph();
    render(<CoverageView />);

    fireEvent.click(screen.getByText('Orphan Node'));

    expect(useAnalysisStore.getState().selectedElementId).toBe('orphan1');
    expect(useUIStore.getState().activeScreen).toBe('impact');
  });

  it('sequential transitions preserve correct element selection', () => {
    const { result } = renderHook(() => useNavigateToElement());

    act(() => {
      result.current('pg', 'impact');
    });
    expect(useAnalysisStore.getState().selectedElementId).toBe('pg');

    act(() => {
      result.current('ps', 'graph');
    });
    expect(useAnalysisStore.getState().selectedElementId).toBe('ps');
    expect(useUIStore.getState().activeScreen).toBe('graph');

    act(() => {
      result.current('ob', 'impact');
    });
    expect(useAnalysisStore.getState().selectedElementId).toBe('ob');
    expect(useUIStore.getState().activeScreen).toBe('impact');
  });

  it('sidebar navigation still works independently', () => {
    // Direct setScreen without element selection
    act(() => {
      useUIStore.getState().setScreen('table');
    });
    expect(useUIStore.getState().activeScreen).toBe('table');
    expect(useAnalysisStore.getState().selectedElementId).toBeNull();
  });
});
