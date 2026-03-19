# M3-01 Implementation Report

## Issue

| Field | Value |
|-------|-------|
| **Issue ID** | M3-01 |
| **Title** | Build Table View with TanStack Table |
| **Milestone** | M3 — Quality Assessment |
| **Type** | UI |
| **Status** | Done |

## What Was Done

1. **Created TableView screen** (`src/ui/screens/TableView/TableView.tsx`):
   - TanStack Table with 7 columns: Name, Type, Layer, Degree, In, Out, Diagrams
   - Client-side sorting (click header to toggle asc/desc)
   - Layer filter dropdown and Type filter dropdown
   - Row count display (filtered / total)
   - Row click → `analysisStore.selectElement` + navigate to Impact Analyzer
   - Layer column rendered with color badge

2. **Created column definitions** (`src/ui/screens/TableView/columns.ts`):
   - `TableRow` interface
   - `graphNodesToRows()` — converts `Map<string, GraphNode>` to flat array
   - TanStack `createColumnHelper` column definitions

3. **Extended `ActiveScreen` type** — added `'table'` to `uiStore`

4. **Updated App.tsx** — added `case 'table': return <TableView />`

5. **Updated GlobalGraphView** — added "Table" button to toolbar for navigation

6. **Installed `@tanstack/react-table`**

7. **Created 8 UI tests** (`TableView.test.tsx`):
   - Correct row count
   - All 7 column headers visible
   - Element names in rows
   - Sorting changes order
   - Layer filter works
   - Type filter works
   - Row click → impact analyzer
   - No crash when no graph

## Files Changed

| Path | Change |
|------|--------|
| `src/ui/screens/TableView/TableView.tsx` | Created |
| `src/ui/screens/TableView/columns.ts` | Created |
| `src/ui/screens/TableView/index.ts` | Created |
| `src/ui/screens/TableView/__tests__/TableView.test.tsx` | Created |
| `src/stores/uiStore.ts` | Updated (added 'table' screen) |
| `src/App.tsx` | Updated (table route) |
| `src/ui/screens/GlobalGraph/GlobalGraphView.tsx` | Updated (Table nav button) |
| `package.json` | Updated (@tanstack/react-table) |

## Acceptance Criteria Status

| Criteria | Status |
|----------|--------|
| All elements displayed as rows | Done (tested) |
| All 7 columns visible | Done (tested) |
| Sorting by degree works | Done (tested) |
| Filter by Technology layer | Done (tested) |
| Filter by type | Done (tested) |
| Click row → impact analyzer | Done (tested) |

## Checks Performed

- `npm run test` — 170/170 passed
- `npm run build` — successful
- `npm run lint` — 0 errors

## Unblocked

- **M3-02** (Coverage Report Engine)
- **M4-02** (CSV Export)
