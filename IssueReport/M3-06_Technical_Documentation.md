# M3-06 Technical Documentation

## Purpose

M3-06 is a validation issue that confirms all M3 components (Table View, Coverage Report, Coverage Screen, Screen Navigation, Cross-Screen Transitions) integrate correctly and the full S-3 user journey works end-to-end on the demo dataset.

## Validation Approach

A programmatic validation test suite (`src/validation/__tests__/m3-validation.test.tsx`) was created to execute the S-3 demo flow reproducibly. The test suite:

1. Loads the **real demo dataset** (`public/digital-bank.json`, 102 elements, 160 relationships, 10 diagrams).
2. Builds the graph and calculates metrics using production code paths.
3. Renders actual React components (TableView, CoverageView, Sidebar) via `@testing-library/react`.
4. Simulates user interactions (clicks, filter changes) and asserts store state changes.

## Test Coverage Map

### S-3 Demo Steps (6 steps, 8 tests)

| Step | Tests | What is verified |
|------|-------|-----------------|
| Step 1 | 3 | 102 data rows, 7 column headers, "102 / 102 elements" label |
| Step 2 | 1 | Hub node degree >= 14 after descending sort |
| Step 3 | 1 | Technology filter yields correct count, >0 |
| Step 4 | 1 | Stats header: Total Elements, Orphan Elements, Layers labels |
| Step 5 | 4 | Orphan count accurate, percent formula correct, orphan invariant, non-orphan invariant |
| Step 6 | 1 | Click orphan → selectedElementId + screen=impact |

### Acceptance Criteria (4 ACs, covered by above + 3 sidebar tests)

| AC | Tests |
|----|-------|
| AC-4.1 | Step 5 test 1 (formula check) |
| AC-4.2 | Step 5 tests 2–4 (count range, orphan invariant, non-orphan invariant) |
| AC-4.3 | Step 6 test (click navigates) |
| AC-5.3 | 3 sidebar tests (5 items, click routes, model gating) |

### Regression (5 tests)

| Area | Tests |
|------|-------|
| M1 graph engine | 3 (node count, edges, adjacency) |
| M2 impact analysis | 1 (hub impact depth 2) |
| Cross-screen transitions | 2 (Table→Impact, Coverage→Impact) |

### Smoke (2 tests)

| Check | Tests |
|-------|-------|
| Layer distribution sum | 1 |
| Valid ArchiMate layers | 1 |

## Key Numbers on Demo Dataset

| Metric | Value |
|--------|-------|
| Total elements | 102 |
| Total relationships | 160 |
| Total diagrams | 10 |
| Orphan elements | 10–15 range (validated) |
| Layer distribution | Sums to 102 |
| Hub element degree | >= 14 |

## Non-Blocker Observations

- **CSS warning:** React reports a style conflict between `borderLeft` shorthand and `borderLeftColor` in the Sidebar active state. This is cosmetic and does not affect functionality. Can be addressed as a minor cleanup in a future issue.
- **Chunk size warning:** Vite reports bundle > 500kB. Expected for React Flow + elkjs. Can be addressed with code splitting in M4.

## Integration Points

All M3 components are validated as working together:
- `TableView` → `graphNodesToRows` → `useNavigateToElement` → `ImpactAnalyzerScreen`
- `CoverageView` → `buildCoverageReport` → `OrphanList` → `useNavigateToElement` → `ImpactAnalyzerScreen`
- `Sidebar` → `uiStore.setScreen` → any screen
- `GlobalGraphView` → `ElementCard.onAnalyzeImpact` → `useNavigateToElement` → `ImpactAnalyzerScreen`

## What Next Milestone Can Rely On

M4 (Export and Release) can rely on:
- `AnalysisGraph` with stable 102-node graph from demo dataset
- `graphNodesToRows()` for CSV export data source (M4-02)
- `buildImpactResult()` for GraphML export data source (M4-01)
- `buildCoverageReport()` for coverage data
- All screens rendering correctly for E2E smoke test (M4-08)
- 220 passing tests as regression safety net
