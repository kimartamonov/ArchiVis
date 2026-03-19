import { useCallback, useEffect } from 'react';
import {
  ReactFlow,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
} from '@xyflow/react';
import type { NodeMouseHandler } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useModelStore } from '../../../stores/modelStore';
import { useGraphStore } from '../../../stores/graphStore';
import { useAnalysisStore } from '../../../stores/analysisStore';
import { useUIStore } from '../../../stores/uiStore';
import { buildGraph } from '../../../engine/graph/buildGraph';
import { calculateMetrics } from '../../../engine/graph/calculateMetrics';
import { useGraphLayout } from './useGraphLayout';
import { colorForLayer } from './nodeStyles';
import { ElementCard } from '../../components/ElementCard';
import { SearchBar } from '../../components/Search';

export function GlobalGraphView() {
  const currentModel = useModelStore((s) => s.currentModel);
  const graph = useGraphStore((s) => s.graph);
  const setGraph = useGraphStore((s) => s.setGraph);
  const setScreen = useUIStore((s) => s.setScreen);
  const selectedElementId = useAnalysisStore((s) => s.selectedElementId);
  const selectElement = useAnalysisStore((s) => s.selectElement);

  const selectedNode = graph && selectedElementId ? graph.nodes.get(selectedElementId) ?? null : null;

  // Build graph from model on mount / model change
  useEffect(() => {
    if (!currentModel) return;
    const { graph: g } = buildGraph(currentModel);
    calculateMetrics(g);
    setGraph(g);
  }, [currentModel, setGraph]);

  const { nodes, edges, loading } = useGraphLayout(graph);

  const handleNodeClick: NodeMouseHandler = useCallback(
    (_event, node) => {
      selectElement(node.id);
    },
    [selectElement],
  );

  const handlePaneClick = useCallback(() => {
    selectElement(null);
  }, [selectElement]);

  if (!currentModel) {
    return (
      <div style={styles.empty}>
        <p>No model loaded.</p>
        <button onClick={() => setScreen('connection')} style={styles.backBtn}>
          Back to Connection
        </button>
      </div>
    );
  }

  if (loading || nodes.length === 0) {
    return (
      <div style={styles.loading}>
        <p>Laying out graph{loading ? '…' : ''}</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.toolbar}>
        <button onClick={() => setScreen('connection')} style={styles.toolbarBtn}>
          &larr; Connection
        </button>
        <SearchBar />
        <span style={styles.stats}>
          {nodes.length} nodes &middot; {edges.length} edges
        </span>
      </div>

      <div style={styles.flowContainer}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodeClick={handleNodeClick}
          onPaneClick={handlePaneClick}
          fitView
          minZoom={0.05}
          maxZoom={4}
          proOptions={{ hideAttribution: true }}
        >
          <Controls position="bottom-left" />
          <MiniMap
            nodeColor={(n) => {
              const layer = (n.data as Record<string, unknown>)?.element
                ? ((n.data as Record<string, { type: string }>).element as { type: string })?.type
                : undefined;
              return layer ? colorForLayer(layer) : '#e0e0e0';
            }}
            maskColor="rgba(0,0,0,0.08)"
            position="bottom-right"
          />
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
        </ReactFlow>

        {selectedNode && (
          <ElementCard
            node={selectedNode}
            onClose={() => selectElement(null)}
          />
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '100%',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '0.5rem 1rem',
    borderBottom: '1px solid var(--border)',
    background: 'var(--bg)',
    flexShrink: 0,
  },
  toolbarBtn: {
    background: 'transparent',
    border: '1px solid var(--border)',
    borderRadius: 6,
    padding: '0.3rem 0.75rem',
    cursor: 'pointer',
    fontFamily: 'var(--sans)',
    fontSize: 14,
    color: 'var(--text-h)',
  },
  stats: {
    fontSize: 14,
    color: 'var(--text)',
  },
  flowContainer: {
    flex: 1,
    width: '100%',
    position: 'relative',
  },
  loading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    color: 'var(--text)',
  },
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    gap: '1rem',
    color: 'var(--text)',
  },
  backBtn: {
    background: 'var(--accent)',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '0.5rem 1.25rem',
    cursor: 'pointer',
    fontFamily: 'var(--sans)',
    fontSize: 16,
  },
};
