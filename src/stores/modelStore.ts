import { create } from 'zustand';
import type { NormalizedModel } from '../engine/types';
import type { ModelSummary } from '../connectors/types';

export interface ModelState {
  models: ModelSummary[];
  currentModel: NormalizedModel | null;
  loading: boolean;
  error: string | null;
  setModels: (models: ModelSummary[]) => void;
  setCurrentModel: (model: NormalizedModel | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useModelStore = create<ModelState>((set) => ({
  models: [],
  currentModel: null,
  loading: false,
  error: null,

  setModels: (models: ModelSummary[]) => set({ models }),
  setCurrentModel: (model: NormalizedModel | null) => set({ currentModel: model }),
  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),

  reset: () => set({ models: [], currentModel: null, loading: false, error: null }),
}));
