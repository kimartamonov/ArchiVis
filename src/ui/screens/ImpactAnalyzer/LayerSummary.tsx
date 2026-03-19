import type { LayerSummary as LayerSummaryType } from '../../../engine/types';
import { colorForLayer } from '../GlobalGraph/nodeStyles';

interface Props {
  layers: LayerSummaryType[];
}

export function LayerSummary({ layers }: Props) {
  if (layers.length === 0) return null;

  return (
    <div>
      <h3 style={styles.heading}>Layer Summary</h3>
      <ul style={styles.list}>
        {layers.map((l) => (
          <li key={l.layer} style={styles.item}>
            <span style={{ ...styles.badge, background: colorForLayer(l.layer) }}>
              {l.layer}
            </span>
            <span style={styles.count}>{l.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  heading: { margin: '0 0 8px', fontSize: 16, color: 'var(--text-h)' },
  list: { listStyle: 'none', padding: 0, margin: 0 },
  item: {
    padding: '6px 0',
    borderBottom: '1px solid var(--border)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    fontSize: 12,
    fontWeight: 600,
    padding: '2px 8px',
    borderRadius: 4,
    color: '#1a1a1a',
  },
  count: {
    fontSize: 16,
    fontWeight: 700,
    fontFamily: 'var(--mono)',
    color: 'var(--text-h)',
  },
};
