import type { AffectedElement } from '../../../engine/types';
import { colorForLayer } from '../GlobalGraph/nodeStyles';

interface Props {
  elements: AffectedElement[];
}

export function AffectedList({ elements }: Props) {
  if (elements.length === 0) {
    return <p style={styles.empty}>No affected elements at this depth.</p>;
  }

  // Group by distance
  const groups = new Map<number, AffectedElement[]>();
  for (const el of elements) {
    const list = groups.get(el.distance) ?? [];
    list.push(el);
    groups.set(el.distance, list);
  }

  return (
    <div>
      <h3 style={styles.heading}>
        Affected Elements <span style={styles.count}>({elements.length})</span>
      </h3>
      {Array.from(groups.entries())
        .sort(([a], [b]) => a - b)
        .map(([distance, group]) => (
          <div key={distance} style={styles.group}>
            <h4 style={styles.distLabel}>
              {distance}-hop ({group.length})
            </h4>
            <ul style={styles.list}>
              {group.map((el) => (
                <li key={el.id} style={styles.item}>
                  <span style={styles.name}>{el.name}</span>
                  <span style={styles.meta}>
                    <span style={styles.type}>{el.type}</span>
                    <span style={{ ...styles.badge, background: colorForLayer(el.layer) }}>
                      {el.layer}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  heading: { margin: '0 0 8px', fontSize: 16, color: 'var(--text-h)' },
  count: { fontWeight: 400, color: 'var(--text)' },
  group: { marginBottom: '1rem' },
  distLabel: { margin: '0 0 4px', fontSize: 13, color: 'var(--text)', fontWeight: 600 },
  list: { listStyle: 'none', padding: 0, margin: 0 },
  item: {
    padding: '6px 0',
    borderBottom: '1px solid var(--border)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  name: { fontSize: 14, color: 'var(--text-h)', fontWeight: 500 },
  meta: { display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 },
  type: { fontSize: 12, color: 'var(--text)' },
  badge: {
    fontSize: 11,
    fontWeight: 600,
    padding: '1px 6px',
    borderRadius: 3,
    color: '#1a1a1a',
  },
  empty: { color: 'var(--text)', fontSize: 14, fontStyle: 'italic' },
};
