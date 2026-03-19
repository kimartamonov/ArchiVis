import type { LayerSummary } from '../../../engine/types';
import { colorForLayer } from '../GlobalGraph/nodeStyles';

interface Props {
  layers: LayerSummary[];
  total: number;
}

export function LayerDistribution({ layers, total }: Props) {
  if (layers.length === 0) return null;

  const maxCount = Math.max(...layers.map((l) => l.count));

  return (
    <div>
      <h3 style={styles.heading}>Layer Distribution</h3>
      <div style={styles.chart}>
        {layers.map((l) => {
          const pct = total > 0 ? (l.count / total) * 100 : 0;
          const barWidth = maxCount > 0 ? (l.count / maxCount) * 100 : 0;
          return (
            <div key={l.layer} style={styles.row}>
              <span style={styles.label}>
                <span style={{ ...styles.dot, background: colorForLayer(l.layer) }} />
                {l.layer}
              </span>
              <div style={styles.barContainer}>
                <div
                  style={{
                    ...styles.bar,
                    width: `${barWidth}%`,
                    background: colorForLayer(l.layer),
                  }}
                />
              </div>
              <span style={styles.count}>
                {l.count} ({pct.toFixed(1)}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  heading: { margin: '0 0 12px', fontSize: 16, color: 'var(--text-h)' },
  chart: { display: 'flex', flexDirection: 'column', gap: 6 },
  row: { display: 'flex', alignItems: 'center', gap: 8 },
  label: {
    width: 120,
    fontSize: 13,
    color: 'var(--text-h)',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    flexShrink: 0,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: '50%',
    display: 'inline-block',
    flexShrink: 0,
  },
  barContainer: {
    flex: 1,
    height: 18,
    background: 'var(--code-bg, #f4f3ec)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 4,
    transition: 'width 0.2s',
  },
  count: {
    width: 80,
    fontSize: 13,
    color: 'var(--text)',
    textAlign: 'right' as const,
    fontFamily: 'var(--mono)',
    flexShrink: 0,
  },
};
