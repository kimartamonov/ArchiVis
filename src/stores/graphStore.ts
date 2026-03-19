import { create } from 'zustand';
import type { AnalysisGraph } from '../engine/types';

export interface RFNode {
  id: string;
  type?: string;
  position: { x: number; y: number };
  data: Record<string, unknown>;
}

export interface RFEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
  data?: Record<string, unknown>;
}

export interface GraphState {
  graph: AnalysisGraph | null;
  rfNodes: RFNode[];
  rfEdges: RFEdge[];
  loading: boolean;
  setGraph: (graph: AnalysisGraph | null) => void;
  setRFNodes: (nodes: RFNode[]) => void;
  setRFEdges: (edges: RFEdge[]) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useGraphStore = create<GraphState>((set) => ({
  graph: null,
  rfNodes: [],
  rfEdges: [],
  loading: false,

  setGraph: (graph: AnalysisGraph | null) => set({ graph }),
  setRFNodes: (nodes: RFNode[]) => set({ rfNodes: nodes }),
  setRFEdges: (edges: RFEdge[]) => set({ rfEdges: edges }),
  setLoading: (loading: boolean) => set({ loading }),

  reset: () => set({ graph: null, rfNodes: [], rfEdges: [], loading: false }),
}));
