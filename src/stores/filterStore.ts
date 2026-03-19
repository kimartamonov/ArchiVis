import { create } from 'zustand';

export interface FilterState {
  layerFilters: Record<string, boolean>;
  typeFilters: Record<string, boolean>;
  toggleLayer: (layer: string) => void;
  toggleType: (type: string) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  layerFilters: {},
  typeFilters: {},

  toggleLayer: (layer: string) =>
    set((state) => ({
      layerFilters: {
        ...state.layerFilters,
        [layer]: !state.layerFilters[layer],
      },
    })),

  toggleType: (type: string) =>
    set((state) => ({
      typeFilters: {
        ...state.typeFilters,
        [type]: !state.typeFilters[type],
      },
    })),

  resetFilters: () => set({ layerFilters: {}, typeFilters: {} }),
}));
