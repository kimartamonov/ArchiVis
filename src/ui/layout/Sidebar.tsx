import { useUIStore, type ActiveScreen } from '../../stores/uiStore';
import { useGraphStore } from '../../stores/graphStore';

interface NavItem {
  id: ActiveScreen;
  label: string;
  requiresModel: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'connection', label: 'Connection', requiresModel: false },
  { id: 'graph', label: 'Graph', requiresModel: true },
  { id: 'impact', label: 'Impact', requiresModel: true },
  { id: 'table', label: 'Table', requiresModel: true },
  { id: 'coverage', label: 'Coverage', requiresModel: true },
];

export function Sidebar() {
  const activeScreen = useUIStore((s) => s.activeScreen);
  const setScreen = useUIStore((s) => s.setScreen);
  const graph = useGraphStore((s) => s.graph);
  const hasModel = graph !== null;

  return (
    <nav style={styles.sidebar} aria-label="Main navigation">
      <div style={styles.brand}>ArchiLens</div>
      <ul style={styles.list}>
        {NAV_ITEMS.map((item) => {
          const disabled = item.requiresModel && !hasModel;
          const active = activeScreen === item.id;
          return (
            <li key={item.id}>
              <button
                onClick={() => !disabled && setScreen(item.id)}
                disabled={disabled}
                style={{
                  ...styles.btn,
                  ...(active ? styles.btnActive : {}),
                  ...(disabled ? styles.btnDisabled : {}),
                }}
                aria-current={active ? 'page' : undefined}
              >
                {item.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

const styles: Record<string, React.CSSProperties> = {
  sidebar: {
    width: 160,
    flexShrink: 0,
    borderRight: '1px solid var(--border)',
    background: 'var(--bg)',
    display: 'flex',
    flexDirection: 'column',
    padding: '0.75rem 0',
  },
  brand: {
    fontSize: 16,
    fontWeight: 700,
    color: 'var(--accent)',
    padding: '0 1rem 0.75rem',
    borderBottom: '1px solid var(--border)',
    marginBottom: '0.5rem',
  },
  list: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  btn: {
    display: 'block',
    width: '100%',
    textAlign: 'left' as const,
    padding: '0.5rem 1rem',
    fontSize: 14,
    fontFamily: 'var(--sans)',
    border: 'none',
    background: 'transparent',
    color: 'var(--text)',
    cursor: 'pointer',
    borderRadius: 0,
    borderLeft: '3px solid transparent',
  },
  btnActive: {
    fontWeight: 600,
    color: 'var(--accent)',
    background: 'var(--accent-bg)',
    borderLeftColor: 'var(--accent)',
  },
  btnDisabled: {
    opacity: 0.4,
    cursor: 'default',
  },
};
