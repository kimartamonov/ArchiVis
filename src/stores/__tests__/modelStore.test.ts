import { describe, it, expect, beforeEach } from 'vitest';
import { useModelStore } from '../modelStore';
import type { NormalizedModel } from '../../engine/types';
import type { ModelSummary } from '../../connectors/types';

describe('modelStore', () => {
  beforeEach(() => {
    useModelStore.getState().reset();
  });

  it('initializes with default values', () => {
    const state = useModelStore.getState();
    expect(state.models).toEqual([]);
    expect(state.currentModel).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('setModels updates models list', () => {
    const models: ModelSummary[] = [
      { id: '1', name: 'Model A' },
      { id: '2', name: 'Model B' },
    ];
    useModelStore.getState().setModels(models);
    expect(useModelStore.getState().models).toEqual(models);
  });

  it('setCurrentModel updates currentModel', () => {
    const model: NormalizedModel = {
      id: 'test',
      name: 'Test',
      elements: [],
      relationships: [],
      diagrams: [],
      warnings: [],
    };
    useModelStore.getState().setCurrentModel(model);
    expect(useModelStore.getState().currentModel).toBe(model);
  });

  it('setLoading updates loading flag', () => {
    useModelStore.getState().setLoading(true);
    expect(useModelStore.getState().loading).toBe(true);
  });

  it('setError updates error', () => {
    useModelStore.getState().setError('Load failed');
    expect(useModelStore.getState().error).toBe('Load failed');
  });

  it('reset returns to initial state', () => {
    useModelStore.getState().setModels([{ id: '1', name: 'M' }]);
    useModelStore.getState().setLoading(true);
    useModelStore.getState().setError('err');
    useModelStore.getState().reset();

    const state = useModelStore.getState();
    expect(state.models).toEqual([]);
    expect(state.currentModel).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });
});
