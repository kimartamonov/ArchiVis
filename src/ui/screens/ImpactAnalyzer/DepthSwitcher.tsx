import { useAnalysisStore } from '../../../stores/analysisStore';

const DEPTHS = [1, 2, 3] as const;

export function DepthSwitcher() {
  const depth = useAnalysisStore((s) => s.depth);
  const setDepth = useAnalysisStore((s) => s.setDepth);

  return (
    <div style={styles.container} role="group" aria-label="Analysis depth">
      <span style={styles.label}>Depth:</span>
      {DEPTHS.map((d) => (
        <button
          key={d}
          onClick={() => setDepth(d)}
          style={{
            ...styles.btn,
            ...(depth === d ? styles.btnActive : {}),
          }}
          aria-pressed={depth === d}
        >
          {d}
        </button>
      ))}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    flexShrink: 0,
  },
  label: {
    fontSize: 13,
    color: 'var(--text)',
    marginRight: 2,
  },
  btn: {
    width: 28,
    height: 28,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 13,
    fontWeight: 600,
    fontFamily: 'var(--mono)',
    border: '1px solid var(--border)',
    borderRadius: 6,
    background: 'var(--bg)',
    color: 'var(--text)',
    cursor: 'pointer',
    transition: 'background 0.1s, color 0.1s',
  },
  btnActive: {
    background: 'var(--accent)',
    color: '#fff',
    borderColor: 'var(--accent)',
  },
};
