import { useCallback, useEffect, useMemo } from 'react';
import { useAnalysisStore } from '../../../stores/analysisStore';
import { useGraphStore } from '../../../stores/graphStore';
import { useModelStore } from '../../../stores/modelStore';
import { useUIStore } from '../../../stores/uiStore';
import { buildImpactResult } from '../../../engine/insight/impactAnalysis';
import { SourceCard } from './SourceCard';
import { AffectedList } from './AffectedList';
import { LayerSummary } from './LayerSummary';
import { AffectedDiagrams } from './AffectedDiagrams';
import { SearchBar } from '../../components/Search';
import { DepthSwitcher } from './DepthSwitcher';

export function ImpactAnalyzerScreen() {
  const selectedElementId = useAnalysisStore((s) => s.selectedElementId);
  const depth = useAnalysisStore((s) => s.depth) as 1 | 2 | 3;
  const setImpactResult = useAnalysisStore((s) => s.setImpactResult);
  const impactResult = useAnalysisStore((s) => s.impactResult);
  const graph = useGraphStore((s) => s.graph);
  const currentModel = useModelStore((s) => s.currentModel);
  const setScreen = useUIStore((s) => s.setScreen);

  const selectedNode = useMemo(
    () => (graph && selectedElementId ? graph.nodes.get(selectedElementId) ?? null : null),
    [graph, selectedElementId],
  );

  // Run impact analysis when element or depth changes
  useEffect(() => {
    if (!graph || !currentModel || !selectedElementId) {
      setImpactResult(null);
      return;
    }
    const result = buildImpactResult(graph, currentModel, selectedElementId, depth);
    setImpactResult(result);
  }, [graph, currentModel, selectedElementId, depth, setImpactResult]);

  const handleBackToGraph = useCallback(() => {
    setImpactResult(null);
    setScreen('graph');
  }, [setImpactResult, setScreen]);

  // No element selected
  if (!selectedNode || !graph) {
    return (
      <div style={styles.container}>
        <div style={styles.toolbar}>
          <button onClick={handleBackToGraph} style={styles.toolbarBtn}>
            &larr; Graph
          </button>
          <SearchBar />
        </div>
        <div style={styles.empty}>
          <p>Select an element using the search bar to analyze its impact.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.toolbar}>
        <button onClick={handleBackToGraph} style={styles.toolbarBtn}>
          &larr; Graph
        </button>
        <SearchBar />
        <DepthSwitcher />
      </div>

      <div style={styles.content}>
        <div style={styles.mainPanel}>
          <SourceCard
            node={selectedNode}
            affectedCount={impactResult?.affectedElements.length ?? 0}
          />

          <div style={styles.section}>
            <AffectedList elements={impactResult?.affectedElements ?? []} />
          </div>
        </div>

        <div style={styles.sidePanel}>
          <div style={styles.section}>
            <LayerSummary layers={impactResult?.affectedLayers ?? []} />
          </div>
          <div style={styles.section}>
            <AffectedDiagrams diagrams={impactResult?.affectedDiagrams ?? []} />
          </div>
        </div>
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
  content: {
    display: 'flex',
    flex: 1,
    overflow: 'auto',
    gap: '1rem',
    padding: '1rem',
  },
  mainPanel: {
    flex: 2,
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  sidePanel: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    minWidth: 220,
  },
  section: {},
  empty: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text)',
  },
};
