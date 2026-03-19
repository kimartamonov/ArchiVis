import { useState, useRef, useCallback, useEffect } from 'react';
import { useGraphStore } from '../../../stores/graphStore';
import { useAnalysisStore } from '../../../stores/analysisStore';
import { useUIStore } from '../../../stores/uiStore';
import { elementTypeToLayer } from '../../../engine/types';
import { colorForLayer } from '../../screens/GlobalGraph/nodeStyles';
import type { GraphNode } from '../../../engine/types';

const MAX_RESULTS = 10;
const DEBOUNCE_MS = 200;

export function SearchBar() {
  const graph = useGraphStore((s) => s.graph);
  const selectElement = useAnalysisStore((s) => s.selectElement);
  const setScreen = useUIStore((s) => s.setScreen);

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GraphNode[]>([]);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);

  const search = useCallback(
    (q: string) => {
      if (!q.trim() || !graph) {
        setResults([]);
        setOpen(false);
        return;
      }
      const lower = q.toLowerCase();
      const matched: GraphNode[] = [];
      for (const node of graph.nodes.values()) {
        if (node.element.name.toLowerCase().includes(lower)) {
          matched.push(node);
          if (matched.length >= MAX_RESULTS) break;
        }
      }
      setResults(matched);
      setOpen(matched.length > 0);
    },
    [graph],
  );

  const handleChange = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(value), DEBOUNCE_MS);
  };

  const handleSelect = (elementId: string) => {
    selectElement(elementId);
    setScreen('impact');
    setQuery('');
    setResults([]);
    setOpen(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on Escape
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} style={styles.container}>
      <input
        type="text"
        placeholder="Search elements…"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (results.length > 0) setOpen(true);
        }}
        style={styles.input}
        aria-label="Search elements"
      />
      {open && results.length > 0 && (
        <ul style={styles.dropdown} role="listbox">
          {results.map((node) => {
            const layer = elementTypeToLayer(node.element.type);
            return (
              <li
                key={node.element.id}
                role="option"
                aria-selected={false}
                onClick={() => handleSelect(node.element.id)}
                style={styles.item}
              >
                <span style={styles.name}>{node.element.name}</span>
                <span style={styles.meta}>
                  <span style={styles.type}>{node.element.type}</span>
                  <span style={{ ...styles.badge, background: colorForLayer(layer) }}>
                    {layer}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'relative',
    flex: 1,
    maxWidth: 360,
  },
  input: {
    width: '100%',
    padding: '0.35rem 0.75rem',
    fontSize: 14,
    border: '1px solid var(--border)',
    borderRadius: 6,
    background: 'var(--bg)',
    color: 'var(--text-h)',
    boxSizing: 'border-box',
    fontFamily: 'var(--sans)',
    outline: 'none',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: 4,
    background: 'var(--bg)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    boxShadow: 'var(--shadow)',
    listStyle: 'none',
    padding: '4px 0',
    zIndex: 50,
    maxHeight: 320,
    overflowY: 'auto',
  },
  item: {
    padding: '0.4rem 0.75rem',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    borderBottom: '1px solid var(--border)',
  },
  name: {
    fontWeight: 600,
    fontSize: 14,
    color: 'var(--text-h)',
  },
  meta: {
    display: 'flex',
    gap: 6,
    alignItems: 'center',
  },
  type: {
    fontSize: 12,
    color: 'var(--text)',
  },
  badge: {
    fontSize: 11,
    fontWeight: 600,
    padding: '1px 6px',
    borderRadius: 3,
    color: '#1a1a1a',
  },
};
