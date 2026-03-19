// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SearchBar } from '../SearchBar';
import { useGraphStore } from '../../../../stores/graphStore';
import { useAnalysisStore } from '../../../../stores/analysisStore';
import { useUIStore } from '../../../../stores/uiStore';
import { buildGraph } from '../../../../engine/graph/buildGraph';
import { calculateMetrics } from '../../../../engine/graph/calculateMetrics';
import { makeElement, makeRelationship, makeModel } from '../../../../engine/graph/__tests__/fixtures';

function loadTestGraph() {
  const model = makeModel(
    [
      makeElement('pg', 'Payment Gateway', 'ApplicationComponent', ['d1']),
      makeElement('ps', 'Payment Service', 'ApplicationService', ['d1']),
      makeElement('ob', 'Order Backend', 'ApplicationComponent', []),
      makeElement('bp', 'Business Process', 'BusinessProcess', []),
      makeElement('cb', 'Core Banking Platform', 'ApplicationComponent', ['d1']),
      ...Array.from({ length: 9 }, (_, i) =>
        makeElement(`ax${i}`, `App Element ${i}`, 'ApplicationComponent', []),
      ),
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

describe('SearchBar', () => {
  beforeEach(() => {
    useGraphStore.getState().reset();
    useAnalysisStore.getState().reset();
    useUIStore.getState().reset();
  });

  it('renders search input', () => {
    render(<SearchBar />);
    expect(screen.getByLabelText('Search elements')).toBeTruthy();
  });

  it('renders without crash when no model loaded', () => {
    render(<SearchBar />);
    fireEvent.change(screen.getByLabelText('Search elements'), {
      target: { value: 'pay' },
    });
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('finds "Payment Gateway" when typing "pay"', async () => {
    loadTestGraph();
    render(<SearchBar />);

    fireEvent.change(screen.getByLabelText('Search elements'), {
      target: { value: 'pay' },
    });

    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeTruthy();
    });

    expect(screen.getByText('Payment Gateway')).toBeTruthy();
    expect(screen.getByText('Payment Service')).toBeTruthy();
  });

  it('search is case-insensitive', async () => {
    loadTestGraph();
    render(<SearchBar />);

    fireEvent.change(screen.getByLabelText('Search elements'), {
      target: { value: 'PAY' },
    });

    await waitFor(() => {
      expect(screen.getByText('Payment Gateway')).toBeTruthy();
    });
  });

  it('limits results to 10', async () => {
    loadTestGraph();
    render(<SearchBar />);

    fireEvent.change(screen.getByLabelText('Search elements'), {
      target: { value: 'a' },
    });

    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeTruthy();
    });

    const options = screen.getAllByRole('option');
    expect(options.length).toBeLessThanOrEqual(10);
  });

  it('selecting a result navigates to impact screen', async () => {
    loadTestGraph();
    render(<SearchBar />);

    fireEvent.change(screen.getByLabelText('Search elements'), {
      target: { value: 'Payment Gateway' },
    });

    await waitFor(() => {
      expect(screen.getByText('Payment Gateway')).toBeTruthy();
    });

    fireEvent.click(screen.getByText('Payment Gateway'));

    expect(useAnalysisStore.getState().selectedElementId).toBe('pg');
    expect(useUIStore.getState().activeScreen).toBe('impact');
  });

  it('empty query shows no dropdown', async () => {
    loadTestGraph();
    render(<SearchBar />);

    fireEvent.change(screen.getByLabelText('Search elements'), {
      target: { value: 'pay' },
    });

    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeTruthy();
    });

    fireEvent.change(screen.getByLabelText('Search elements'), {
      target: { value: '' },
    });

    await waitFor(() => {
      expect(screen.queryByRole('listbox')).toBeNull();
    });
  });

  it('each result shows type and layer badge', async () => {
    loadTestGraph();
    render(<SearchBar />);

    fireEvent.change(screen.getByLabelText('Search elements'), {
      target: { value: 'Payment Gateway' },
    });

    await waitFor(() => {
      expect(screen.getByText('Payment Gateway')).toBeTruthy();
    });

    expect(screen.getByText('ApplicationComponent')).toBeTruthy();
    expect(screen.getByText('Application')).toBeTruthy();
  });
});
