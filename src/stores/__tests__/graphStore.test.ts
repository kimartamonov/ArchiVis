import { describe, it, expect, beforeEach } from 'vitest';
import { useGraphStore } from '../graphStore';
import type { AnalysisGraph } from '../../engine/types';
import type { RFNode, RFEdge } from '../graphStore';

describe('graphStore', () => {
  beforeEach(() => {
    useGraphStore.getState().reset();
  });

  it('initializes with default values', () => {
    const state = useGraphStore.getState();
    expect(state.graph).toBeNull();
    expect(state.rfNodes).toEqual([]);
    expect(state.rfEdges).toEqual([]);
    expect(state.loading).toBe(false);
  });

  it('setGraph updates graph', () => {
    const graph: AnalysisGraph = {
      nodes: new Map(),
      edges: [],
      adjacencyOut: new Map(),
      adjacencyIn: new Map(),
    };
    useGraphStore.getState().setGraph(graph);
    expect(useGraphStore.getState().graph).toBe(graph);
  });

  it('setRFNodes updates rfNodes', () => {
    const nodes: RFNode[] = [
      { id: 'n1', position: { x: 0, y: 0 }, data: { label: 'A' } },
    ];
    useGraphStore.getState().setRFNodes(nodes);
    expect(useGraphStore.getState().rfNodes).toEqual(nodes);
  });

  it('setRFEdges updates rfEdges', () => {
    const edges: RFEdge[] = [
      { id: 'e1', source: 'n1', target: 'n2' },
    ];
    useGraphStore.getState().setRFEdges(edges);
    expect(useGraphStore.getState().rfEdges).toEqual(edges);
  });

  it('setLoading updates loading flag', () => {
    useGraphStore.getState().setLoading(true);
    expect(useGraphStore.getState().loading).toBe(true);
  });

  it('reset returns to initial state', () => {
    useGraphStore.getState().setGraph({
      nodes: new Map(),
      edges: [],
      adjacencyOut: new Map(),
      adjacencyIn: new Map(),
    });
    useGraphStore.getState().setLoading(true);
    useGraphStore.getState().reset();

    const state = useGraphStore.getState();
    expect(state.graph).toBeNull();
    expect(state.rfNodes).toEqual([]);
    expect(state.rfEdges).toEqual([]);
    expect(state.loading).toBe(false);
  });
});
