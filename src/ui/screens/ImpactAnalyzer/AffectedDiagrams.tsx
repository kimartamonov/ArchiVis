import type { DiagramRef } from '../../../engine/types';

interface Props {
  diagrams: DiagramRef[];
}

export function AffectedDiagrams({ diagrams }: Props) {
  if (diagrams.length === 0) return null;

  return (
    <div>
      <h3 style={styles.heading}>Affected Diagrams</h3>
      <ul style={styles.list}>
        {diagrams.map((d) => (
          <li key={d.id} style={styles.item}>
            {d.name}
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
    fontSize: 14,
    color: 'var(--text-h)',
  },
};
