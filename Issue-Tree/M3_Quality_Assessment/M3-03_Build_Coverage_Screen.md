# M3-03: Build Coverage Screen

## Metadata

| Field                | Value                                             |
|----------------------|---------------------------------------------------|
| **Issue ID**         | M3-03                                             |
| **Type**             | UI                                                |
| **Status**           | Proposed                                          |
| **Milestone**        | M3 — Quality Assessment                           |
| **Capability Slice** | S-3 ("Оцениваю качество модели")                  |
| **Priority**         | P0                                                |
| **Sequence Order**   | 3                                                 |
| **Depends On**       | M3-02 (Coverage Report)                           |
| **Unlocks**          | M3-04                                             |
| **FR References**    | FR-5.2, FR-5.3                                    |
| **AC References**    | AC-4.1, AC-4.2, AC-4.3                            |
| **Decision Refs**    | —                                                 |
| **Demo Refs**        | S-3 demo steps 4–6                                |
| **Risk Refs**        | —                                                 |

## Goal

Build the Coverage screen that displays orphan statistics, an orphan element list, and layer distribution — giving architects an immediate view of model quality and structural gaps.

## Why Now

The Coverage Report engine (M3-02) computes the data; now it needs a visual representation. The Coverage screen is the primary deliverable of the S-3 quality assessment slice and directly addresses the architect's question: "How complete and well-connected is my model?"

## User / System Outcome

A user navigates to the Coverage screen and sees a summary header with total elements, orphan count, and orphan percentage. Below, a list of orphan elements (with name, type, layer) lets them identify gaps. Clicking an orphan navigates to its element card or Impact Analyzer. A layer distribution summary shows how elements are spread across ArchiMate layers.

## Scope

- `src/ui/screens/CoverageView/CoverageView.tsx` — main screen component.
- `src/ui/screens/CoverageView/OrphanList.tsx` — orphan elements list sub-component.
- `src/ui/screens/CoverageView/LayerDistribution.tsx` — layer distribution display (bar chart or summary table).
- `src/ui/screens/CoverageView/index.ts` — barrel export.
- Header section: total elements count, orphan count, orphan percentage (e.g., "11 orphan elements (11.6 %)").
- Orphan elements list: name, type, layer columns; clickable rows.
- Layer distribution: element count per layer, displayed as a horizontal bar chart or summary table.
- Click orphan row → `analysisStore.selectElement(id)` + navigate to element card / Impact Analyzer.

## Out of Scope

- Heatmap visualization of coverage.
- Per-layer coverage percentages or thresholds.
- Low-coverage detection alerts.
- Orphan remediation suggestions.

## Preconditions

- M3-02: `buildCoverageReport(graph)` returns a valid `CoverageReport` with all required fields.
- Zustand stores (`graphStore`, `analysisStore`, `uiStore`) are operational.

## Implementation Notes

- On component mount (or when graph changes), call `buildCoverageReport(graphStore.graph)` and store result in local state or a derived store.
- Use `useMemo` or a store selector to avoid recomputation on every render.
- Orphan list can use a simple HTML table or a lightweight list component (TanStack Table is overkill here).
- Layer distribution can be rendered with simple CSS bar widths (`width: ${percent}%`) — no charting library needed.
- Click handler on orphan row: `analysisStore.selectElement(orphan.id)` then `uiStore.setScreen('impact')` or equivalent navigation.

## Files and Artifacts Expected to Change

| Path                                              | Change   |
|---------------------------------------------------|----------|
| `src/ui/screens/CoverageView/CoverageView.tsx`    | Create   |
| `src/ui/screens/CoverageView/OrphanList.tsx`      | Create   |
| `src/ui/screens/CoverageView/LayerDistribution.tsx`| Create  |
| `src/ui/screens/CoverageView/index.ts`            | Create   |

## Acceptance Criteria

- [ ] Header displays total element count, orphan count, and orphan percentage.
- [ ] Orphan list shows all orphan elements with name, type, and layer.
- [ ] Clicking an orphan navigates to the element card or Impact Analyzer with that element selected.
- [ ] Layer distribution shows element counts per layer.
- [ ] Demo dataset displays "11 orphan elements (11.6 %)".

## Required Tests

### Functional

- Stats header shows correct values matching `CoverageReport` output.
- Orphan list length matches `orphanCount`.
- Each orphan row displays correct name, type, and layer.
- Clicking an orphan row calls `analysisStore.selectElement` with the correct ID and navigates.
- Layer distribution entries sum to total element count.

### Smoke

- Coverage screen renders without errors with demo dataset loaded.
- All sub-components (header, orphan list, layer distribution) are visible.

### Regression

- Table View (M3-01) still renders correctly.
- Global Graph and Impact Analyzer still function.

## Handoff to Next Issue

Coverage screen is operational and displays quality metrics. M3-04 will add sidebar navigation so users can reach the Coverage screen (and all other screens) from anywhere in the app.

## Done Definition

- All acceptance criteria checked.
- Code compiles without errors.
- Tests pass.
- `CoverageView` exported from `src/ui/screens/CoverageView/index.ts`.
- Demo dataset shows expected orphan statistics.
