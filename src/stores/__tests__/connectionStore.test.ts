import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useConnectionStore } from '../connectionStore';

// Mock localStorage and sessionStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
    get length() { return Object.keys(store).length; },
    key: vi.fn((_i: number) => null),
  };
})();

const sessionStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
    get length() { return Object.keys(store).length; },
    key: vi.fn((_i: number) => null),
  };
})();

Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });
Object.defineProperty(globalThis, 'sessionStorage', { value: sessionStorageMock });

describe('connectionStore', () => {
  beforeEach(() => {
    useConnectionStore.getState().reset();
    localStorageMock.clear();
    sessionStorageMock.clear();
    vi.clearAllMocks();
  });

  it('initializes with default values', () => {
    const state = useConnectionStore.getState();
    expect(state.url).toBe('');
    expect(state.token).toBe('');
    expect(state.status).toBe('disconnected');
    expect(state.error).toBeNull();
  });

  it('setConnection updates url and token, persists to storage', () => {
    useConnectionStore.getState().setConnection('https://example.com', 'my-token');

    const state = useConnectionStore.getState();
    expect(state.url).toBe('https://example.com');
    expect(state.token).toBe('my-token');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('archilens:url', 'https://example.com');
    expect(sessionStorageMock.setItem).toHaveBeenCalledWith('archilens:token', 'my-token');
  });

  it('setStatus updates status', () => {
    useConnectionStore.getState().setStatus('connecting');
    expect(useConnectionStore.getState().status).toBe('connecting');

    useConnectionStore.getState().setStatus('connected');
    expect(useConnectionStore.getState().status).toBe('connected');
  });

  it('setError sets error and status to error', () => {
    useConnectionStore.getState().setError('Connection failed');
    const state = useConnectionStore.getState();
    expect(state.error).toBe('Connection failed');
    expect(state.status).toBe('error');
  });

  it('setError(null) clears error and sets status to disconnected', () => {
    useConnectionStore.getState().setError('some error');
    useConnectionStore.getState().setError(null);
    const state = useConnectionStore.getState();
    expect(state.error).toBeNull();
    expect(state.status).toBe('disconnected');
  });

  it('reset clears state and removes from storage', () => {
    useConnectionStore.getState().setConnection('https://x.com', 'tok');
    useConnectionStore.getState().setStatus('connected');
    useConnectionStore.getState().reset();

    const state = useConnectionStore.getState();
    expect(state.url).toBe('');
    expect(state.token).toBe('');
    expect(state.status).toBe('disconnected');
    expect(state.error).toBeNull();
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('archilens:url');
    expect(sessionStorageMock.removeItem).toHaveBeenCalledWith('archilens:token');
  });
});
