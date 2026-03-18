# Implementation Report: M1-04 — Calculate Base Metrics

## Issue

- **Issue ID:** M1-04
- **Title:** Calculate Base Metrics
- **Milestone:** M1 — Model Visualization
- **Type:** Engine
- **Date Completed:** 2026-03-18

---

## What Was Done

Created `calculateMetrics()` function that recalculates base metrics on every `GraphNode` in an `AnalysisGraph`. This provides the authoritative orphan definition and ensures metrics are consistent with adjacency state.

### Metrics Computed

| Metric | Formula |
|--------|---------|
| `inDegree` | `adjacencyIn[id].length` |
| `outDegree` | `adjacencyOut[id].length` |
| `degree` | `inDegree + outDegree` |
| `diagramsCount` | `element.diagramIds.length` |
| `isOrphan` | `degree === 0 OR diagramsCount === 0` |

### Key Design Decision

The orphan definition is `degree === 0 || diagramsCount === 0` — an element is considered orphaned if it has no relationships OR if it doesn't appear on any diagram. This is stricter than M1-03's preliminary check (degree-only) and captures elements that are technically connected but never visualized in any diagram.

---

## Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `src/engine/graph/calculateMetrics.ts` | Created | Metrics calculation function |
| `src/engine/graph/index.ts` | Updated | Added calculateMetrics export |
| `src/engine/graph/buildGraph.ts` | Updated | Comment noting calculateMetrics as authoritative |
| `src/engine/graph/__tests__/calculateMetrics.test.ts` | Created | 7 unit tests |

---

## Acceptance Criteria Status

| # | Criterion | Status |
|---|-----------|--------|
| 1 | Every node has all metrics populated | ✅ |
| 2 | Degree values match manual count on known graph | ✅ |
| 3 | Zero edges + zero diagrams → isOrphan = true | ✅ |
| 4 | Has edges but zero diagrams → isOrphan = true | ✅ |
| 5 | Has diagrams but zero edges → isOrphan = true | ✅ |
| 6 | Well-connected + in diagrams → isOrphan = false | ✅ |
| 7 | Hub element in demo dataset has high degree (≥14) | ✅ |

---

## Tests Performed

- `npm run test` — 35/35 passed (6 Demo + 13 Architeezy + 9 Graph + 7 Metrics)
- `npm run build` — successful
- `npm run lint` — 0 errors

---

## What Is Now Unblocked

- **M1-05** (Unit Tests) — comprehensive testing of graph engine + metrics
- **M3-02** (Coverage Report) — can use isOrphan and diagramsCount
- **M3-03** (Coverage Screen) — can display metrics
- **M1-09** (Element Info Popup) — can show degree, orphan status
