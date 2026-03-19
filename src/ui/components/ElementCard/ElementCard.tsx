import type { GraphNode } from '../../../engine/types';
import { elementTypeToLayer } from '../../../engine/types';
import { colorForLayer } from '../../screens/GlobalGraph/nodeStyles';

export interface ElementCardProps {
  node: GraphNode;
  onClose: () => void;
  onAnalyzeImpact?: (elementId: string) => void;
}

export function ElementCard({ node, onClose, onAnalyzeImpact }: ElementCardProps) {
  const { element, degree, inDegree, outDegree, diagramsCount, isOrphan } = node;
  const layer = elementTypeToLayer(element.type);
  const layerColor = colorForLayer(layer);

  return (
    <div style={styles.overlay} onClick={onClose} data-testid="element-card-overlay">
      <div
        style={styles.card}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label={`Element info: ${element.name}`}
      >
        <div style={styles.header}>
          <div style={{ ...styles.layerBadge, background: layerColor }}>{layer}</div>
          <button onClick={onClose} style={styles.closeBtn} aria-label="Close">
            &times;
          </button>
        </div>

        <h3 style={styles.name}>{element.name}</h3>
        <p style={styles.type}>{element.type}</p>

        {isOrphan && <div style={styles.orphanBadge}>Orphan</div>}

        <table style={styles.table}>
          <tbody>
            <tr>
              <td style={styles.metricLabel}>Total degree</td>
              <td style={styles.metricValue}>{degree}</td>
            </tr>
            <tr>
              <td style={styles.metricLabel}>In-degree</td>
              <td style={styles.metricValue}>{inDegree}</td>
            </tr>
            <tr>
              <td style={styles.metricLabel}>Out-degree</td>
              <td style={styles.metricValue}>{outDegree}</td>
            </tr>
            <tr>
              <td style={styles.metricLabel}>Diagrams</td>
              <td style={styles.metricValue}>{diagramsCount}</td>
            </tr>
          </tbody>
        </table>

        <button
          onClick={() => onAnalyzeImpact?.(element.id)}
          disabled={!onAnalyzeImpact}
          style={{
            ...styles.impactBtn,
            opacity: onAnalyzeImpact ? 1 : 0.5,
            cursor: onAnalyzeImpact ? 'pointer' : 'default',
          }}
          title={onAnalyzeImpact ? 'Open Impact Analyzer' : 'Coming in M2'}
        >
          Analyze Impact
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    padding: '1rem',
    pointerEvents: 'auto',
  },
  card: {
    background: 'var(--bg, #fff)',
    border: '1px solid var(--border, #e5e4e7)',
    borderRadius: 12,
    padding: '1rem',
    width: 280,
    boxShadow: 'var(--shadow, 0 4px 12px rgba(0,0,0,0.1))',
    pointerEvents: 'auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
  },
  layerBadge: {
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 600,
    color: '#1a1a1a',
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    fontSize: 20,
    cursor: 'pointer',
    color: 'var(--text, #6b6375)',
    lineHeight: 1,
    padding: '0 4px',
  },
  name: {
    margin: '0 0 4px',
    fontSize: 18,
    fontWeight: 600,
    color: 'var(--text-h, #08060d)',
  },
  type: {
    margin: '0 0 0.75rem',
    fontSize: 13,
    color: 'var(--text, #6b6375)',
  },
  orphanBadge: {
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 600,
    background: '#fef2f2',
    color: '#dc2626',
    marginBottom: '0.75rem',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '0.75rem',
    fontSize: 14,
  },
  metricLabel: {
    padding: '4px 0',
    color: 'var(--text, #6b6375)',
  },
  metricValue: {
    padding: '4px 0',
    textAlign: 'right' as const,
    fontWeight: 600,
    fontFamily: 'var(--mono, monospace)',
    color: 'var(--text-h, #08060d)',
  },
  impactBtn: {
    width: '100%',
    padding: '0.5rem',
    fontSize: 14,
    fontWeight: 500,
    borderRadius: 8,
    border: '1px solid var(--accent-border, rgba(170,59,255,0.5))',
    background: 'var(--accent-bg, rgba(170,59,255,0.1))',
    color: 'var(--accent, #aa3bff)',
    fontFamily: 'var(--sans)',
  },
};
