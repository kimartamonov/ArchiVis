import { create } from 'zustand';
import type { ImpactResult } from '../engine/types';

export interface AnalysisState {
  selectedElementId: string | null;
  impactResult: ImpactResult | null;
  depth: number;
  selectElement: (id: string | null) => void;
  setImpactResult: (result: ImpactResult | null) => void;
  setDepth: (depth: number) => void;
  reset: () => void;
}

export const useAnalysisStore = create<AnalysisState>((set) => ({
  selectedElementId: null,
  impactResult: null,
  depth: 1,

  selectElement: (id: string | null) => set({ selectedElementId: id }),
  setImpactResult: (result: ImpactResult | null) => set({ impactResult: result }),
  setDepth: (depth: number) => set({ depth }),

  reset: () => set({ selectedElementId: null, impactResult: null, depth: 1 }),
}));
