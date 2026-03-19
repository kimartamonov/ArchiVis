import { describe, it, expect, beforeEach } from 'vitest';
import { useFilterStore } from '../filterStore';

describe('filterStore', () => {
  beforeEach(() => {
    useFilterStore.getState().resetFilters();
  });

  it('initializes with empty filters', () => {
    const state = useFilterStore.getState();
    expect(state.layerFilters).toEqual({});
    expect(state.typeFilters).toEqual({});
  });

  it('toggleLayer adds layer filter as true', () => {
    useFilterStore.getState().toggleLayer('Application');
    expect(useFilterStore.getState().layerFilters['Application']).toBe(true);
  });

  it('toggleLayer twice toggles back to false', () => {
    useFilterStore.getState().toggleLayer('Business');
    useFilterStore.getState().toggleLayer('Business');
    expect(useFilterStore.getState().layerFilters['Business']).toBe(false);
  });

  it('toggleType adds type filter as true', () => {
    useFilterStore.getState().toggleType('ApplicationComponent');
    expect(useFilterStore.getState().typeFilters['ApplicationComponent']).toBe(true);
  });

  it('toggleType twice toggles back to false', () => {
    useFilterStore.getState().toggleType('BusinessProcess');
    useFilterStore.getState().toggleType('BusinessProcess');
    expect(useFilterStore.getState().typeFilters['BusinessProcess']).toBe(false);
  });

  it('resetFilters clears all filters', () => {
    useFilterStore.getState().toggleLayer('Application');
    useFilterStore.getState().toggleType('DataObject');
    useFilterStore.getState().resetFilters();

    const state = useFilterStore.getState();
    expect(state.layerFilters).toEqual({});
    expect(state.typeFilters).toEqual({});
  });
});
