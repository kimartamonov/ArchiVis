import { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from '@tanstack/react-table';
import type { SortingState, ColumnFiltersState } from '@tanstack/react-table';
import { useGraphStore } from '../../../stores/graphStore';
import { useAnalysisStore } from '../../../stores/analysisStore';
import { useUIStore } from '../../../stores/uiStore';
import { columns, graphNodesToRows } from './columns';
import { colorForLayer } from '../GlobalGraph/nodeStyles';

export function TableView() {
  const graph = useGraphStore((s) => s.graph);
  const selectElement = useAnalysisStore((s) => s.selectElement);
  const setScreen = useUIStore((s) => s.setScreen);

  const data = useMemo(() => (graph ? graphNodesToRows(graph.nodes) : []), [graph]);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // Extract unique layers and types for filter dropdowns
  const layers = useMemo(() => [...new Set(data.map((r) => r.layer))].sort(), [data]);
  const types = useMemo(() => [...new Set(data.map((r) => r.type))].sort(), [data]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const handleRowClick = (elementId: string) => {
    selectElement(elementId);
    setScreen('impact');
  };

  const layerFilter = (columnFilters.find((f) => f.id === 'layer')?.value as string) ?? '';
  const typeFilter = (columnFilters.find((f) => f.id === 'type')?.value as string) ?? '';

  const setLayerFilter = (value: string) => {
    setColumnFilters((prev) => {
      const without = prev.filter((f) => f.id !== 'layer');
      return value ? [...without, { id: 'layer', value }] : without;
    });
  };

  const setTypeFilter = (value: string) => {
    setColumnFilters((prev) => {
      const without = prev.filter((f) => f.id !== 'type');
      return value ? [...without, { id: 'type', value }] : without;
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.toolbar}>
        <button onClick={() => setScreen('graph')} style={styles.toolbarBtn}>
          &larr; Graph
        </button>
        <select
          value={layerFilter}
          onChange={(e) => setLayerFilter(e.target.value)}
          style={styles.select}
          aria-label="Filter by layer"
        >
          <option value="">All layers</option>
          {layers.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          style={styles.select}
          aria-label="Filter by type"
        >
          <option value="">All types</option>
          {types.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <span style={styles.count}>
          {table.getRowModel().rows.length} / {data.length} elements
        </span>
      </div>

      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    style={{
                      ...styles.th,
                      cursor: header.column.getCanSort() ? 'pointer' : 'default',
                    }}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getIsSorted() === 'asc' ? ' ▲' : ''}
                    {header.column.getIsSorted() === 'desc' ? ' ▼' : ''}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                onClick={() => handleRowClick(row.original.id)}
                style={styles.tr}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} style={styles.td}>
                    {cell.column.id === 'layer' ? (
                      <span
                        style={{
                          ...styles.badge,
                          background: colorForLayer(cell.getValue() as string),
                        }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </span>
                    ) : (
                      flexRender(cell.column.columnDef.cell, cell.getContext())
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '100%',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.5rem 1rem',
    borderBottom: '1px solid var(--border)',
    background: 'var(--bg)',
    flexShrink: 0,
    flexWrap: 'wrap',
  },
  toolbarBtn: {
    background: 'transparent',
    border: '1px solid var(--border)',
    borderRadius: 6,
    padding: '0.3rem 0.75rem',
    cursor: 'pointer',
    fontFamily: 'var(--sans)',
    fontSize: 14,
    color: 'var(--text-h)',
  },
  select: {
    padding: '0.3rem 0.5rem',
    fontSize: 13,
    border: '1px solid var(--border)',
    borderRadius: 6,
    background: 'var(--bg)',
    color: 'var(--text-h)',
    fontFamily: 'var(--sans)',
  },
  count: { fontSize: 13, color: 'var(--text)', marginLeft: 'auto' },
  tableWrap: { flex: 1, overflow: 'auto', padding: '0 1rem 1rem' },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 14,
    fontFamily: 'var(--sans)',
  },
  th: {
    textAlign: 'left',
    padding: '8px 12px',
    borderBottom: '2px solid var(--border)',
    fontWeight: 600,
    fontSize: 13,
    color: 'var(--text-h)',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    position: 'sticky' as const,
    top: 0,
    background: 'var(--bg)',
  },
  tr: {
    cursor: 'pointer',
    borderBottom: '1px solid var(--border)',
  },
  td: {
    padding: '6px 12px',
    color: 'var(--text-h)',
  },
  badge: {
    display: 'inline-block',
    padding: '1px 6px',
    borderRadius: 3,
    fontSize: 12,
    fontWeight: 600,
    color: '#1a1a1a',
  },
};
