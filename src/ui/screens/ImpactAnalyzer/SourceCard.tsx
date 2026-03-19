import type { GraphNode } from '../../../engine/types';
import { elementTypeToLayer } from '../../../engine/types';
import { colorForLayer } from '../GlobalGraph/nodeStyles';

interface Props {
  node: GraphNode;
  affectedCount: number;
}

export function SourceCard({ node, affectedCount }: Props) {
  const { element, degree, inDegree, outDegree, diagramsCount } = node;
  const layer = elementTypeToLayer(element.type);

  return (
    <div style={styles.card}>
      <div style={{ ...styles.badge, background: colorForLayer(layer) }}>{layer}</div>
      <h2 style={styles.name}>{element.name}</h2>
      <p style={styles.type}>{element.type}</p>
      <div style={styles.metrics}>
        <Metric label="Degree" value={degree} />
        <Metric label="In" value={inDegree} />
        <Metric label="Out" value={outDegree} />
        <Metric label="Diagrams" value={diagramsCount} />
        <Metric label="Affected" value={affectedCount} />
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div style={styles.metric}>
      <span style={styles.metricValue}>{value}</span>
      <span style={styles.metricLabel}>{label}</span>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    border: '1px solid var(--border)',
    borderRadius: 12,
    padding: '1rem',
  },
  badge: {
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 600,
    color: '#1a1a1a',
    marginBottom: 8,
  },
  name: { margin: '0 0 4px', fontSize: 20, fontWeight: 600, color: 'var(--text-h)' },
  type: { margin: '0 0 12px', fontSize: 13, color: 'var(--text)' },
  metrics: { display: 'flex', gap: '1rem', flexWrap: 'wrap' },
  metric: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minWidth: 48,
  },
  metricValue: { fontSize: 20, fontWeight: 700, fontFamily: 'var(--mono)', color: 'var(--text-h)' },
  metricLabel: { fontSize: 11, color: 'var(--text)', textTransform: 'uppercase' as const },
};
