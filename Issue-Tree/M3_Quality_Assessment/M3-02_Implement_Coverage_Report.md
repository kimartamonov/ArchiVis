# M3-02: Implement Coverage Report in Insight Engine

## Metadata

| Field                | Value                                             |
|----------------------|---------------------------------------------------|
| **Issue ID**         | M3-02                                             |
| **Type**             | Engine                                            |
| **Status**           | Proposed                                          |
| **Milestone**        | M3 — Quality Assessment                           |
| **Capability Slice** | S-3 ("Оцениваю качество модели")                  |
| **Priority**         | P0                                                |
| **Sequence Order**   | 2                                                 |
| **Depends On**       | M1-04 (Base Metrics)                              |
| **Unlocks**          | M3-03                                             |
| **FR References**    | FR-5.1, FR-5.2                                    |
| **AC References**    | AC-4.1, AC-4.2                                    |
| **Decision Refs**    | —                                                 |
| **Demo Refs**        | —                                                 |
| **Risk Refs**        | —                                                 |

## Goal

Implement the `buildCoverageReport` function that computes a `CoverageReport` from an `AnalysisGraph`, providing orphan statistics, layer distribution, and broken reference detection — the analytical foundation for the Coverage screen.

## Why Now

The Table View (M3-01) displays raw element data, but architects need aggregate quality metrics to assess model health at a glance. The Coverage Report transforms per-element flags into actionable statistics that the Coverage screen (M3-03) will display.

## User / System Outcome

The system can compute, for any loaded model: total element count, orphan count and percentage, a list of all orphan elements, element distribution by layer, and a list of broken references. On the demo dataset, this produces 11 orphans (11.6 %).

## Scope

- `src/engine/insight/coverageReport.ts` — main module.
- `src/engine/insight/index.ts` — barrel export (create or update).
- Function signature: `buildCoverageReport(graph: AnalysisGraph): CoverageReport`.
- `CoverageReport` type definition (if not already in core types):
  - `totalElements: number` — count of all nodes.
  - `orphanCount: number` — count of nodes where `isOrphan === true`.
  - `orphanPercent: number` — `(orphanCount / totalElements) * 100`.
  - `orphanElements: AnalysisNode[]` — list of orphan nodes.
  - `layerDistribution: { layer: string; count: number }[]` — element count per layer.
  - `brokenReferences: BrokenReference[]` — extracted from graph warnings if available.
- Orphan definition: `isOrphan = degree === 0 OR diagramsCount === 0`.

## Out of Scope

- Low-coverage detection or threshold alerts (P1).
- Per-layer coverage percentages (P1).
- Coverage trend tracking over time (P2).
- UI rendering of the report (M3-03).

## Preconditions

- M1-04: `AnalysisGraph` nodes have computed metrics: `degree`, `inDegree`, `outDegree`, `diagramsCount`, `isOrphan`.
- Core types for `AnalysisGraph` and `AnalysisNode` are defined.

## Implementation Notes

- Iterate over `graph.nodes` (Map or array).
- Filter nodes where `isOrphan === true` to build `orphanElements`.
- Count orphans and compute percentage: `orphanPercent = (orphanCount / totalElements) * 100`, rounded to one decimal place.
- Group nodes by `layer` field to build `layerDistribution`.
- Verify that `layerDistribution` counts sum to `totalElements` (invariant).
- Extract `brokenReferences` from `graph.warnings` or `graph.edges` with missing source/target (implementation depends on M1-03 output).
- Pure function with no side effects — easy to test.

## Files and Artifacts Expected to Change

| Path                                        | Change   |
|---------------------------------------------|----------|
| `src/engine/insight/coverageReport.ts`      | Create   |
| `src/engine/insight/index.ts`               | Create or Modify |
| `src/types/coverage.ts` (if needed)         | Create   |

## Acceptance Criteria

- [ ] `buildCoverageReport` returns a valid `CoverageReport` for any non-empty `AnalysisGraph`.
- [ ] `orphanCount` equals the count of nodes where `isOrphan === true`.
- [ ] `orphanPercent` equals `(orphanCount / totalElements) * 100`, rounded to one decimal.
- [ ] `orphanElements` array length equals `orphanCount`.
- [ ] `layerDistribution` counts sum to `totalElements`.
- [ ] Demo dataset produces exactly 11 orphans and orphanPercent of 11.6 %.

## Required Tests

### Functional

- Given a graph with known orphan nodes, `orphanCount` and `orphanElements` match expected values.
- Given a graph with elements in 3 layers, `layerDistribution` has 3 entries summing to `totalElements`.
- `orphanPercent` is calculated correctly (e.g., 5 orphans out of 50 elements = 10.0 %).
- Demo dataset produces `orphanCount = 11`, `orphanPercent = 11.6`.
- Empty graph (0 elements) does not throw; returns zero counts.

### Smoke

- `buildCoverageReport` executes without error on the demo dataset graph.

### Regression

- Graph metrics (degree, inDegree, outDegree) computed in M1-04 remain correct after coverage module is added.

## Handoff to Next Issue

`CoverageReport` is available as a pure function. M3-03 (Coverage Screen) can call `buildCoverageReport(graph)` on mount and render the results. The report data can also be used by future export features.

## Done Definition

- All acceptance criteria checked.
- Code compiles without errors.
- Tests pass.
- `buildCoverageReport` exported from `src/engine/insight/index.ts`.
- `CoverageReport` type exported from types module.
