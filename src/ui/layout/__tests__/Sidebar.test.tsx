// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Sidebar } from '../Sidebar';
import { useUIStore } from '../../../stores/uiStore';
import { useGraphStore } from '../../../stores/graphStore';
import { buildGraph } from '../../../engine/graph/buildGraph';
import { calculateMetrics } from '../../../engine/graph/calculateMetrics';
import { makeElement, makeModel } from '../../../engine/graph/__tests__/fixtures';

// Storage mocks
const storageMock = {
  getItem: vi.fn(() => null), setItem: vi.fn(), removeItem: vi.fn(), clear: vi.fn(),
  get length() { return 0; }, key: vi.fn(() => null),
};
if (!globalThis.localStorage) Object.defineProperty(globalThis, 'localStorage', { value: storageMock, writable: true });
if (!globalThis.sessionStorage) Object.defineProperty(globalThis, 'sessionStorage', { value: storageMock, writable: true });

function loadGraph() {
  const model = makeModel([makeElement('a', 'A')]);
  const { graph } = buildGraph(model);
  calculateMetrics(graph);
  useGraphStore.getState().setGraph(graph);
}

describe('Sidebar', () => {
  beforeEach(() => {
    useUIStore.getState().reset();
    useGraphStore.getState().reset();
  });

  it('renders all 5 navigation items', () => {
    render(<Sidebar />);
    expect(screen.getByText('Connection')).toBeTruthy();
    expect(screen.getByText('Graph')).toBeTruthy();
    expect(screen.getByText('Impact')).toBeTruthy();
    expect(screen.getByText('Table')).toBeTruthy();
    expect(screen.getByText('Coverage')).toBeTruthy();
  });

  it('shows brand name', () => {
    render(<Sidebar />);
    expect(screen.getByText('ArchiLens')).toBeTruthy();
  });

  it('Connection is active by default', () => {
    render(<Sidebar />);
    const btn = screen.getByText('Connection');
    expect(btn.getAttribute('aria-current')).toBe('page');
  });

  it('model-dependent screens are disabled without a model', () => {
    render(<Sidebar />);
    expect((screen.getByText('Graph') as HTMLButtonElement).disabled).toBe(true);
    expect((screen.getByText('Impact') as HTMLButtonElement).disabled).toBe(true);
    expect((screen.getByText('Table') as HTMLButtonElement).disabled).toBe(true);
    expect((screen.getByText('Coverage') as HTMLButtonElement).disabled).toBe(true);
  });

  it('model-dependent screens are enabled with a model', () => {
    loadGraph();
    render(<Sidebar />);
    expect((screen.getByText('Graph') as HTMLButtonElement).disabled).toBe(false);
    expect((screen.getByText('Table') as HTMLButtonElement).disabled).toBe(false);
  });

  it('clicking a nav item switches screen', () => {
    loadGraph();
    render(<Sidebar />);
    fireEvent.click(screen.getByText('Graph'));
    expect(useUIStore.getState().activeScreen).toBe('graph');
  });

  it('clicking Table then Coverage switches correctly', () => {
    loadGraph();
    render(<Sidebar />);
    fireEvent.click(screen.getByText('Table'));
    expect(useUIStore.getState().activeScreen).toBe('table');
    fireEvent.click(screen.getByText('Coverage'));
    expect(useUIStore.getState().activeScreen).toBe('coverage');
  });

  it('active item updates after navigation', () => {
    loadGraph();
    const { rerender } = render(<Sidebar />);
    fireEvent.click(screen.getByText('Graph'));
    rerender(<Sidebar />);
    expect(screen.getByText('Graph').getAttribute('aria-current')).toBe('page');
    expect(screen.getByText('Connection').getAttribute('aria-current')).toBeNull();
  });
});
