# M3-01: Build Table View with TanStack Table

## Metadata

| Field                | Value                                             |
|----------------------|---------------------------------------------------|
| **Issue ID**         | M3-01                                             |
| **Type**             | UI                                                |
| **Status**           | Proposed                                          |
| **Milestone**        | M3 — Quality Assessment                           |
| **Capability Slice** | S-3 ("Оцениваю качество модели")                  |
| **Priority**         | P0                                                |
| **Sequence Order**   | 1                                                 |
| **Depends On**       | M1-03 (Graph Engine), M1-04 (Base Metrics), M1-06 (Zustand Stores) |
| **Unlocks**          | M3-02, M4-02                                      |
| **FR References**    | FR-4.1, FR-4.2, FR-4.3, FR-4.4, FR-4.5           |
| **AC References**    | —                                                 |
| **Decision Refs**    | D-14 (TanStack Table preferred)                   |
| **Demo Refs**        | S-3 demo steps 1–3                                |
| **Risk Refs**        | —                                                 |

## Goal

Build a Table View screen that displays all model elements in a tabular format using TanStack Table, with sortable and filterable columns, enabling architects to quickly scan, rank, and drill into any element.

## Why Now

The graph view (M1) provides a visual overview, but architects need a structured, scannable list to compare metrics across elements, find hubs, and spot anomalies. The Table View is a prerequisite for the Coverage Report and CSV export features.

## User / System Outcome

A user navigates to Table View and sees every element in the loaded model listed with key metrics. They click a column header to sort (e.g., degree descending to find hubs), apply layer or type filters to narrow the list, and click any row to jump to the Impact Analyzer for that element.

## Scope

- `src/ui/screens/TableView/TableView.tsx` — main screen component.
- `src/ui/screens/TableView/columns.ts` — TanStack Table column definitions.
- `src/ui/screens/TableView/index.ts` — barrel export.
- Columns displayed: name, type, layer, degree, inDegree, outDegree, diagramsCount.
- Sorting: click any column header to sort ascending/descending.
- Filtering: dropdown selectors for layer and type.
- Row interaction: click row → navigate to Impact Analyzer for that element (FR-4.5).

## Out of Scope

- Orphan marking / highlighting in table rows (P1, deferred).
- Free-text search within the table (P1).
- Pagination (not needed for datasets under 500 elements).
- CSV export (M4).

## Preconditions

- M1-03: `AnalysisGraph` with nodes containing all required metric fields.
- M1-04: Base metrics (degree, inDegree, outDegree, diagramsCount) computed and stored on graph nodes.
- M1-06: `graphStore` populated with loaded model data; `filterStore` available for filter state.

## Implementation Notes

- Install `@tanstack/react-table` as a dependency.
- Read element data from `graphStore.nodes` (or equivalent selector).
- Define column definitions in a separate file for maintainability.
- Use TanStack Table's built-in sorting (`getSortedRowModel`) and filtering (`getFilteredRowModel`).
- Filter state (layer, type dropdowns) should be synced with `filterStore` so filters persist across screen switches.
- Row click handler: call `analysisStore.selectElement(elementId)` then navigate to Impact Analyzer screen via `uiStore.setScreen('impact')`.

## Files and Artifacts Expected to Change

| Path                                        | Change   |
|---------------------------------------------|----------|
| `src/ui/screens/TableView/TableView.tsx`    | Create   |
| `src/ui/screens/TableView/columns.ts`       | Create   |
| `src/ui/screens/TableView/index.ts`         | Create   |
| `package.json`                              | Modify   |

## Acceptance Criteria

- [ ] All elements from the loaded model are displayed as rows in the table.
- [ ] All seven columns (name, type, layer, degree, inDegree, outDegree, diagramsCount) are visible.
- [ ] Sorting by degree (descending) places the highest-degree element first.
- [ ] Filtering by "Technology" layer shows only Technology-layer elements.
- [ ] Filtering by element type works correctly.
- [ ] Clicking a row navigates to Impact Analyzer with that element selected.

## Required Tests

### Functional

- Table renders the correct number of rows matching the loaded model's element count.
- Sorting by each column produces correct order (ascending and descending).
- Filtering by layer reduces the row set to only elements of that layer.
- Filtering by type reduces the row set to only elements of that type.
- Clicking a row calls `analysisStore.selectElement` with the correct element ID and navigates to Impact Analyzer.

### Smoke

- Table View renders without errors with the demo dataset loaded.
- All column headers are visible and clickable.

### Performance

- Table renders 200 elements without perceptible lag (< 1 second render time).

### Regression

- Global Graph view still renders correctly after Table View is added.
- Element Info popup still works from graph nodes.

## Handoff to Next Issue

Table View is operational with sort and filter. M3-02 can compute the Coverage Report using the same graph data. M3-04 will add navigation to reach Table View from the sidebar. M4-02 can add CSV export from the table data.

## Done Definition

- All acceptance criteria checked.
- Code compiles without errors.
- Tests pass.
- `TableView` exported from `src/ui/screens/TableView/index.ts`.
- TanStack Table dependency added to `package.json`.
