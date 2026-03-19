import { useMemo } from 'react';
import { useGraphStore } from '../../../stores/graphStore';
import { useUIStore } from '../../../stores/uiStore';
import { useNavigateToElement } from '../../hooks/useNavigateToElement';
import { buildCoverageReport } from '../../../engine/insight/coverageReport';
import { OrphanList } from './OrphanList';
import { LayerDistribution } from './LayerDistribution';

export function CoverageView() {
  const graph = useGraphStore((s) => s.graph);
  const setScreen = useUIStore((s) => s.setScreen);
  const navigateToElement = useNavigateToElement();

  const report = useMemo(() => (graph ? buildCoverageReport(graph) : null), [graph]);

  const handleOrphanClick = (id: string) => {
    navigateToElement(id, 'impact');
  };

  return (
    <div style={styles.container}>
      <div style={styles.toolbar}>
        <button onClick={() => setScreen('graph')} style={styles.toolbarBtn}>
          &larr; Graph
        </button>
        <span style={styles.title}>Coverage Report</span>
      </div>

      {!report ? (
        <div style={styles.empty}>
          <p>No model loaded. Load a model to see coverage metrics.</p>
        </div>
      ) : (
        <div style={styles.content}>
          <div style={styles.statsRow}>
            <StatCard label="Total Elements" value={report.totalElements} />
            <StatCard
              label="Orphan Elements"
              value={report.orphanCount}
              sub={`${report.orphanPercent}%`}
              accent
            />
            <StatCard label="Broken Refs" value={report.brokenReferences.length} />
            <StatCard label="Layers" value={report.layerDistribution.length} />
          </div>

          <div style={styles.panels}>
            <div style={styles.mainPanel}>
              <OrphanList orphans={report.orphanElements} onSelect={handleOrphanClick} />
            </div>
            <div style={styles.sidePanel}>
              <LayerDistribution layers={report.layerDistribution} total={report.totalElements} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: number;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div style={{ ...styles.stat, ...(accent ? styles.statAccent : {}) }}>
      <span style={styles.statValue}>
        {value}
        {sub && <span style={styles.statSub}> {sub}</span>}
      </span>
      <span style={styles.statLabel}>{label}</span>
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
  title: { fontSize: 16, fontWeight: 600, color: 'var(--text-h)' },
  content: { flex: 1, overflow: 'auto', padding: '1rem' },
  statsRow: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
  },
  stat: {
    flex: 1,
    minWidth: 120,
    border: '1px solid var(--border)',
    borderRadius: 10,
    padding: '0.75rem 1rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  statAccent: {
    borderColor: 'var(--accent-border)',
    background: 'var(--accent-bg)',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 700,
    fontFamily: 'var(--mono)',
    color: 'var(--text-h)',
  },
  statSub: { fontSize: 14, fontWeight: 400, color: 'var(--text)' },
  statLabel: { fontSize: 12, color: 'var(--text)', textTransform: 'uppercase' as const },
  panels: { display: 'flex', gap: '1.5rem', flexWrap: 'wrap' },
  mainPanel: { flex: 2, minWidth: 300 },
  sidePanel: { flex: 1, minWidth: 250 },
  empty: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text)',
  },
};
