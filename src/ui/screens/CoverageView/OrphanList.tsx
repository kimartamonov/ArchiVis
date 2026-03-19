import type { NormalizedElement } from '../../../engine/types';
import { elementTypeToLayer } from '../../../engine/types';
import { colorForLayer } from '../GlobalGraph/nodeStyles';

interface Props {
  orphans: NormalizedElement[];
  onSelect: (id: string) => void;
}

export function OrphanList({ orphans, onSelect }: Props) {
  if (orphans.length === 0) {
    return <p style={styles.empty}>No orphan elements found.</p>;
  }

  return (
    <div>
      <h3 style={styles.heading}>Orphan Elements ({orphans.length})</h3>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Type</th>
            <th style={styles.th}>Layer</th>
          </tr>
        </thead>
        <tbody>
          {orphans.map((el) => {
            const layer = elementTypeToLayer(el.type);
            return (
              <tr key={el.id} onClick={() => onSelect(el.id)} style={styles.tr}>
                <td style={styles.td}>{el.name}</td>
                <td style={styles.tdType}>{el.type}</td>
                <td style={styles.td}>
                  <span style={{ ...styles.badge, background: colorForLayer(layer) }}>
                    {layer}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  heading: { margin: '0 0 8px', fontSize: 16, color: 'var(--text-h)' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 14 },
  th: {
    textAlign: 'left',
    padding: '6px 10px',
    borderBottom: '2px solid var(--border)',
    fontSize: 13,
    color: 'var(--text-h)',
    fontWeight: 600,
  },
  tr: { cursor: 'pointer', borderBottom: '1px solid var(--border)' },
  td: { padding: '6px 10px', color: 'var(--text-h)' },
  tdType: { padding: '6px 10px', color: 'var(--text)', fontSize: 13 },
  badge: {
    display: 'inline-block',
    padding: '1px 6px',
    borderRadius: 3,
    fontSize: 12,
    fontWeight: 600,
    color: '#1a1a1a',
  },
  empty: { color: 'var(--text)', fontSize: 14, fontStyle: 'italic' },
};
