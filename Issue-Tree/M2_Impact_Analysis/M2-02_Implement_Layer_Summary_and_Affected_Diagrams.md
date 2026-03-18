# M2-02: Implement Layer Summary and Affected Diagrams

## Metadata

| Field                | Value                                             |
|----------------------|---------------------------------------------------|
| **Issue ID**         | M2-02                                             |
| **Type**             | Engine                                            |
| **Status**           | Proposed                                          |
| **Milestone**        | M2 — Impact Analysis                              |
| **Capability Slice** | S-2 ("Анализирую impact изменения")               |
| **Priority**         | P0                                                |
| **Sequence Order**   | 2                                                 |
| **Depends On**       | M2-01 (BFS Impact Analysis)                       |
| **Unlocks**          | M2-05 (Impact Analyzer Screen)                    |
| **FR References**    | FR-3.5, FR-3.6, FR-3.8                           |
| **AC References**    | AC-3.5, AC-3.6                                    |
| **Decision Refs**    | —                                                 |
| **Demo Refs**        | —                                                 |
| **Risk Refs**        | —                                                 |

## Goal

From BFS impact results, compute a layer summary (count of affected elements per ArchiMate layer) and identify affected diagrams (diagrams containing the source element). These aggregations are packaged into a single `ImpactResult` object that the UI will consume.

## Why Now

The raw BFS output (flat list of affected elements) is necessary but not sufficient for the Impact Analyzer screen. Stakeholders need to see impact broken down by layer to understand which architectural concerns are affected, and need to know which diagrams are relevant. This aggregation must be in place before the UI (M2-05) can display the full analysis.

## User / System Outcome

The system produces a complete `ImpactResult` containing: the source element ID, the analysis depth, the flat list of affected elements, a per-layer summary with counts, and a list of diagrams where the source element appears. This gives stakeholders both detail and overview in a single result object.

## Scope

- Extend `src/engine/insight/impactAnalysis.ts`:
  - Function: `buildImpactResult(graph: AnalysisGraph, elementId: string, depth: 1 | 2 | 3): ImpactResult`
  - Calls `analyzeImpact` internally to get `AffectedElement[]`.
  - Groups `affectedElements` by `layer` to produce `affectedLayers: { layer: string, count: number }[]`.
  - Looks up the source element's `diagramIds` from the model/graph and resolves diagram names to produce `affectedDiagrams: { id: string, name: string }[]`.
  - Returns `ImpactResult`: `{ sourceElementId, depth, affectedElements, affectedLayers, affectedDiagrams }`.
- Extend `src/engine/insight/types.ts`:
  - `ImpactResult` type definition.
  - `LayerSummary` type: `{ layer: string, count: number }`.
  - `AffectedDiagram` type: `{ id: string, name: string }`.

## Out of Scope

- Diagram membership for affected elements (only the source element's diagrams are listed).
- Risk card generation (deferred to P2).
- Any UI rendering.

## Preconditions

- M2-01: `analyzeImpact` function is available and returns `AffectedElement[]` with correct `layer` field.
- Graph/model provides a way to look up which diagrams contain a given element.

## Implementation Notes

- Layer summary: iterate `affectedElements`, use a `Map<string, number>` to count per layer, convert to array.
- Affected diagrams: look up the source element's `diagramIds` from the model data. For each diagram ID, resolve the diagram name. This is specifically about the **source** element, not all affected elements.
- Total affected count should equal the sum of all layer counts.
- `buildImpactResult` is the primary public API — it wraps `analyzeImpact` and adds aggregations.

## Files and Artifacts Expected to Change

| Path                                      | Change   |
|-------------------------------------------|----------|
| `src/engine/insight/impactAnalysis.ts`    | Modify   |
| `src/engine/insight/types.ts`             | Modify   |
| `src/engine/insight/index.ts`             | Modify   |

## Acceptance Criteria

- [ ] `buildImpactResult` returns an `ImpactResult` with all required fields populated.
- [ ] Sum of all `affectedLayers[].count` equals `affectedElements.length`.
- [ ] `affectedDiagrams` lists diagrams of the **source** element only.
- [ ] Layer names in `affectedLayers` are correct ArchiMate layer names (e.g., "Business", "Application", "Technology").
- [ ] An element appearing in no diagrams produces an empty `affectedDiagrams` array.

## Required Tests

### Functional

- Known dataset: `buildImpactResult` returns expected layer counts per layer.
- Known element in 2 diagrams: `affectedDiagrams` contains exactly those 2 diagrams.
- Element in no diagrams: `affectedDiagrams` is empty.
- Sum of layer counts equals total affected count.

### Smoke

- Calling `buildImpactResult` with valid inputs does not throw.

### Regression

- BFS `analyzeImpact` tests still pass (no behavioral change in BFS).
- M1 graph engine tests still pass.

## Handoff to Next Issue

Full `ImpactResult` is available via `buildImpactResult`. The Impact Analyzer screen (M2-05) can call this single function and receive everything needed to render the element card, affected list, layer summary, and affected diagrams panels.

## Done Definition

- All acceptance criteria checked.
- Code compiles without errors.
- `buildImpactResult` and `ImpactResult` exported from `src/engine/insight/index.ts`.
- Tests pass.
