# Implementation Report: M1-03 — Build Graph Engine

## Issue

- **Issue ID:** M1-03
- **Title:** Build Graph Engine
- **Milestone:** M1 — Model Visualization
- **Type:** Engine
- **Date Completed:** 2026-03-18

---

## What Was Done

Created `buildGraph()` function that transforms a `NormalizedModel` into an `AnalysisGraph` — the core data structure for all downstream analysis and visualization.

### buildGraph(model) → { graph, warnings }

- **Nodes:** Creates `GraphNode` for each element with computed metrics (degree, inDegree, outDegree, diagramsCount, isOrphan)
- **Edges:** Creates `GraphEdge` for each valid relationship (source and target exist)
- **Adjacency lists:** `adjacencyOut` and `adjacencyIn` maps for O(1) neighbor lookup
- **Broken references:** Invalid relationships (missing source/target) are skipped and collected as `BrokenReference` warnings
- **Orphan detection:** Nodes with degree 0 are marked as orphans
- **Cycles:** Handled correctly (no special treatment needed — valid in ArchiMate)

---

## Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `src/engine/graph/buildGraph.ts` | Created | Graph construction function |
| `src/engine/graph/index.ts` | Created | Barrel export |
| `src/engine/graph/__tests__/buildGraph.test.ts` | Created | 9 unit tests |

---

## Acceptance Criteria Status

| # | Criterion | Status |
|---|-----------|--------|
| 1 | buildGraph(model) returns an AnalysisGraph | ✅ |
| 2 | Node count equals element count | ✅ |
| 3 | Edge count equals valid relationship count | ✅ |
| 4 | Broken references collected in warnings | ✅ |
| 5 | adjacencyOut contains outgoing neighbor IDs | ✅ |
| 6 | adjacencyIn contains incoming neighbor IDs | ✅ |
| 7 | Empty model returns empty graph without error | ✅ |

---

## Tests Performed

- `npm run test` — 28/28 passed (6 Demo + 13 Architeezy + 9 Graph Engine):
  - Known input (3 elements, 2 relationships) → correct nodes/edges/adjacency
  - Correct adjacency lists (multi-edge)
  - Correct degree metrics (inDegree, outDegree, degree)
  - Broken references → warnings, invalid edges skipped
  - Empty model → empty graph
  - Cycles → no infinite loop, correct degrees
  - Orphan detection
  - diagramsCount from element.diagramIds
  - Demo dataset smoke test (102 nodes, 160 edges, 0 warnings)
- `npm run build` — successful
- `npm run lint` — 0 errors

---

## Out of Scope

- Metrics calculation beyond degree (M1-04)
- BFS / impact traversal (M2-01)
- React Flow conversion (M1-08)
- UI rendering

---

## What Is Now Unblocked

- **M1-04** (Calculate Base Metrics) — can compute orphan %, layer distribution using AnalysisGraph
- **M1-05** (Unit Tests) — comprehensive testing of graph engine
- **M1-08** (Global Graph View) — can convert AnalysisGraph to React Flow nodes/edges
- **M2-01** (BFS Impact Analysis) — can traverse adjacency lists
- **M3-02** (Coverage Report) — can use node metrics
