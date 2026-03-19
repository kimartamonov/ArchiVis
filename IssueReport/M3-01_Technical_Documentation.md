# M3-01 Technical Documentation

## Purpose

Table View screen displaying all model elements in a sortable, filterable table using TanStack Table. Enables architects to scan, rank, and drill into elements.

## Architecture

```
src/ui/screens/TableView/
├── TableView.tsx   # Main screen (TanStack Table + filters)
├── columns.ts      # Column definitions + graphNodesToRows converter
├── index.ts        # Barrel export
└── __tests__/
    └── TableView.test.tsx
```

### Data Flow

```
graphStore.graph.nodes (Map<string, GraphNode>)
    ↓ graphNodesToRows()
TableRow[] (flat array)
    ↓ useReactTable
TanStack Table (sorted + filtered)
    ↓
<table> render with flexRender
```

### Columns

| Column | Accessor | Sortable |
|--------|----------|----------|
| Name | `name` | Yes |
| Type | `type` | Yes |
| Layer | `layer` | Yes |
| Degree | `degree` | Yes |
| In | `inDegree` | Yes |
| Out | `outDegree` | Yes |
| Diagrams | `diagramsCount` | Yes |

### Filtering

Two dropdown selectors in toolbar:
- **Layer filter:** extracted from unique layers in data
- **Type filter:** extracted from unique types in data

Uses TanStack Table's `getFilteredRowModel()` with `columnFilters` state.

### Row Interaction

Click any row → `analysisStore.selectElement(id)` + `uiStore.setScreen('impact')` → Impact Analyzer opens for that element.

### Screen Navigation

- `GlobalGraphView` toolbar has "Table" button → `setScreen('table')`
- `TableView` toolbar has "← Graph" button → `setScreen('graph')`

## Integration Points

- **M3-02 (Coverage Report):** Uses same graph data
- **M3-04 (Screen Navigation):** Table View accessible from sidebar/tabs
- **M4-02 (CSV Export):** Can export from `graphNodesToRows()` data
