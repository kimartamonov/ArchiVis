import { describe, it, expect, beforeEach } from 'vitest';
import { useUIStore } from '../uiStore';

describe('uiStore', () => {
  beforeEach(() => {
    useUIStore.getState().reset();
  });

  it('initializes with default values', () => {
    const state = useUIStore.getState();
    expect(state.activeScreen).toBe('connection');
    expect(state.sidebarOpen).toBe(false);
    expect(state.searchQuery).toBe('');
  });

  it('setScreen updates activeScreen', () => {
    useUIStore.getState().setScreen('graph');
    expect(useUIStore.getState().activeScreen).toBe('graph');

    useUIStore.getState().setScreen('impact');
    expect(useUIStore.getState().activeScreen).toBe('impact');
  });

  it('toggleSidebar flips sidebarOpen', () => {
    useUIStore.getState().toggleSidebar();
    expect(useUIStore.getState().sidebarOpen).toBe(true);

    useUIStore.getState().toggleSidebar();
    expect(useUIStore.getState().sidebarOpen).toBe(false);
  });

  it('setSearchQuery updates searchQuery', () => {
    useUIStore.getState().setSearchQuery('Payment');
    expect(useUIStore.getState().searchQuery).toBe('Payment');
  });

  it('reset returns to initial state', () => {
    useUIStore.getState().setScreen('impact');
    useUIStore.getState().toggleSidebar();
    useUIStore.getState().setSearchQuery('test');
    useUIStore.getState().reset();

    const state = useUIStore.getState();
    expect(state.activeScreen).toBe('connection');
    expect(state.sidebarOpen).toBe(false);
    expect(state.searchQuery).toBe('');
  });
});
