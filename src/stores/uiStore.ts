import { create } from 'zustand';

export type ActiveScreen = 'connection' | 'graph' | 'impact' | 'table' | 'coverage';

export interface UIState {
  activeScreen: ActiveScreen;
  sidebarOpen: boolean;
  searchQuery: string;
  setScreen: (screen: ActiveScreen) => void;
  toggleSidebar: () => void;
  setSearchQuery: (query: string) => void;
  reset: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeScreen: 'connection',
  sidebarOpen: false,
  searchQuery: '',

  setScreen: (screen: ActiveScreen) => set({ activeScreen: screen }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSearchQuery: (query: string) => set({ searchQuery: query }),

  reset: () => set({ activeScreen: 'connection', sidebarOpen: false, searchQuery: '' }),
}));
