// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ConnectionScreen } from '../ConnectionScreen';
import { useConnectionStore } from '../../../../stores/connectionStore';
import { useModelStore } from '../../../../stores/modelStore';
import { useUIStore } from '../../../../stores/uiStore';

// --- Storage mocks ---
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: vi.fn((_i: number) => null),
  };
})();

const sessionStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: vi.fn((_i: number) => null),
  };
})();

Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock, writable: true });
Object.defineProperty(globalThis, 'sessionStorage', { value: sessionStorageMock, writable: true });

// --- Mock connector behaviour ---
const mockConnect = vi.fn();
const mockListModels = vi.fn().mockResolvedValue([
  { id: 'model-1', name: 'Test Model A' },
  { id: 'model-2', name: 'Test Model B' },
]);
const mockLoadModel = vi.fn().mockResolvedValue({
  id: 'model-1',
  name: 'Test Model A',
  elements: [],
  relationships: [],
  diagrams: [],
  warnings: [],
});

const mockDemoLoadModel = vi.fn().mockResolvedValue({
  id: 'demo',
  name: 'Digital Bank',
  elements: [{ id: 'e1', name: 'E1', type: 'X', diagramIds: [] }],
  relationships: [],
  diagrams: [],
  warnings: [],
});

vi.mock('../../../../connectors/architeezy/ArchiteezyConnector', () => ({
  ArchiteezyConnector: class {
    connect = mockConnect;
    listModels = mockListModels;
    loadModel = mockLoadModel;
  },
}));

vi.mock('../../../../connectors/demo/DemoConnector', () => ({
  DemoConnector: class {
    connect = vi.fn();
    listModels = vi.fn();
    loadModel = mockDemoLoadModel;
  },
}));

describe('ConnectionScreen', () => {
  beforeEach(() => {
    useConnectionStore.getState().reset();
    useModelStore.getState().reset();
    useUIStore.getState().reset();
    localStorageMock.clear();
    sessionStorageMock.clear();
    vi.clearAllMocks();

    // Re-set default happy-path mocks
    mockConnect.mockResolvedValue(undefined);
    mockListModels.mockResolvedValue([
      { id: 'model-1', name: 'Test Model A' },
      { id: 'model-2', name: 'Test Model B' },
    ]);
    mockLoadModel.mockResolvedValue({
      id: 'model-1',
      name: 'Test Model A',
      elements: [],
      relationships: [],
      diagrams: [],
      warnings: [],
    });
    mockDemoLoadModel.mockResolvedValue({
      id: 'demo',
      name: 'Digital Bank',
      elements: [{ id: 'e1', name: 'E1', type: 'X', diagramIds: [] }],
      relationships: [],
      diagrams: [],
      warnings: [],
    });
  });

  // ----- Smoke -----

  it('renders without crash', () => {
    render(<ConnectionScreen />);
    expect(screen.getByText('ArchiLens')).toBeTruthy();
  });

  it('shows all interactive elements', () => {
    render(<ConnectionScreen />);
    expect(screen.getByLabelText('Server URL')).toBeTruthy();
    expect(screen.getByLabelText('API Token')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Connect' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Load Demo Dataset' })).toBeTruthy();
  });

  // ----- Demo flow -----

  it('loads demo dataset and navigates to graph screen', async () => {
    render(<ConnectionScreen />);
    fireEvent.click(screen.getByRole('button', { name: 'Load Demo Dataset' }));

    await waitFor(() => {
      expect(useModelStore.getState().currentModel).not.toBeNull();
      expect(useUIStore.getState().activeScreen).toBe('graph');
    });
  });

  // ----- Connect flow (success) -----

  it('connects to Architeezy and shows model list', async () => {
    render(<ConnectionScreen />);

    fireEvent.change(screen.getByLabelText('Server URL'), {
      target: { value: 'https://example.com' },
    });
    fireEvent.change(screen.getByLabelText('API Token'), {
      target: { value: 'my-token' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Connect' }));

    await waitFor(() => {
      expect(screen.getByLabelText('Select Model')).toBeTruthy();
    });

    const options = screen.getAllByRole('option');
    expect(options.length).toBe(3); // placeholder + 2 models
  });

  // ----- Connect flow (error) -----

  it('shows error message on connect failure', async () => {
    mockConnect.mockRejectedValueOnce(new Error('Connection refused'));

    render(<ConnectionScreen />);

    fireEvent.change(screen.getByLabelText('Server URL'), {
      target: { value: 'https://bad.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Connect' }));

    await waitFor(() => {
      expect(screen.getByRole('alert').textContent).toContain('Connection refused');
    });
  });

  // ----- Empty URL validation -----

  it('shows error when URL is empty', async () => {
    render(<ConnectionScreen />);
    fireEvent.click(screen.getByRole('button', { name: 'Connect' }));

    await waitFor(() => {
      expect(screen.getByRole('alert').textContent).toContain('Please enter');
    });
  });

  // ----- Connect sets store status to 'connecting' -----

  it('sets store status to connecting when Connect is clicked', async () => {
    mockConnect.mockImplementationOnce(() => new Promise(() => {})); // never resolves

    render(<ConnectionScreen />);
    fireEvent.change(screen.getByLabelText('Server URL'), {
      target: { value: 'https://slow.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Connect' }));

    await waitFor(() => {
      expect(useConnectionStore.getState().status).toBe('connecting');
    });
  });
});
