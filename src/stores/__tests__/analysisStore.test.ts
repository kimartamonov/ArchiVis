import { describe, it, expect, beforeEach } from 'vitest';
import { useAnalysisStore } from '../analysisStore';
import type { ImpactResult } from '../../engine/types';

describe('analysisStore', () => {
  beforeEach(() => {
    useAnalysisStore.getState().reset();
  });

  it('initializes with default values', () => {
    const state = useAnalysisStore.getState();
    expect(state.selectedElementId).toBeNull();
    expect(state.impactResult).toBeNull();
    expect(state.depth).toBe(1);
  });

  it('selectElement updates selectedElementId', () => {
    useAnalysisStore.getState().selectElement('elem-1');
    expect(useAnalysisStore.getState().selectedElementId).toBe('elem-1');
  });

  it('selectElement(null) clears selection', () => {
    useAnalysisStore.getState().selectElement('elem-1');
    useAnalysisStore.getState().selectElement(null);
    expect(useAnalysisStore.getState().selectedElementId).toBeNull();
  });

  it('setImpactResult updates impactResult', () => {
    const result: ImpactResult = {
      sourceElementId: 'elem-1',
      depth: 2,
      affectedElements: [],
      affectedLayers: [],
      affectedDiagrams: [],
    };
    useAnalysisStore.getState().setImpactResult(result);
    expect(useAnalysisStore.getState().impactResult).toBe(result);
  });

  it('setDepth updates depth', () => {
    useAnalysisStore.getState().setDepth(3);
    expect(useAnalysisStore.getState().depth).toBe(3);
  });

  it('reset returns to initial state', () => {
    useAnalysisStore.getState().selectElement('elem-1');
    useAnalysisStore.getState().setDepth(3);
    useAnalysisStore.getState().reset();

    const state = useAnalysisStore.getState();
    expect(state.selectedElementId).toBeNull();
    expect(state.impactResult).toBeNull();
    expect(state.depth).toBe(1);
  });
});
