# M0-03 Implementation Report

## Issue

- **Issue ID:** M0-03
- **Title:** Define NormalizedModel Interface and Domain Types
- **Milestone:** M0 — Project Foundation
- **Type:** Engine

---

## What Was Done

Defined all domain types for the ArchiLens MVP across two files:

### `src/engine/types.ts` — Domain and derived types

- **Source types:** `NormalizedModel`, `NormalizedElement`, `NormalizedRelationship`, `NormalizedDiagram`, `LoadWarning`
- **Layer:** const object with 8 ArchiMate layers + `Layer` type union (Strategy, Business, Application, Technology, Physical, Motivation, Implementation, Other)
- **`elementTypeToLayer()` function:** Maps 50+ ArchiMate 3.x element types to their correct layers. Unknown types → `Other`.
- **Derived types:** `GraphNode`, `GraphEdge`, `AnalysisGraph`
- **Impact types:** `ImpactResult`, `AffectedElement`, `LayerSummary`, `DiagramRef`
- **Coverage types:** `CoverageReport`, `BrokenReference`

### `src/connectors/types.ts` — Connector interface types

- `ConnectorConfig` (url, token, proxyUrl)
- `ModelSummary` (id, name)
- `DataConnector` interface (connect, listModels, loadModel)

---

## Files Changed

| File | Action |
|------|--------|
| `src/engine/types.ts` | Created |
| `src/connectors/types.ts` | Created |

---

## Acceptance Criteria Status

| # | Criterion | Status |
|---|-----------|--------|
| 1 | All types compile without TypeScript errors | Done |
| 2 | No `any` types used | Done |
| 3 | Layer covers all 8 ArchiMate layers | Done |
| 4 | `elementTypeToLayer()` maps known types correctly | Done |
| 5 | NormalizedModel matches doc 08 contract | Done |
| 6 | DataConnector matches doc 08 contract | Done |
| 7 | GraphNode includes all fields from doc 07 | Done |
| 8 | AnalysisGraph includes nodes Map, edges array, adjacencyOut/In Maps | Done |
| 9 | `npm run build` succeeds | Done |

---

## Checks Performed

- `npm run build` — succeeds (tsc + vite, 0 errors)
- `npm run lint` — passes (0 errors)
- No circular dependencies between `engine/types.ts` and `connectors/types.ts`
- `connectors/types.ts` imports `NormalizedModel` from `engine/types.ts` (one-way dependency)

---

## Implementation Note

TypeScript 5.9 with `erasableSyntaxOnly: true` does not allow `enum` syntax. Layer is implemented as `const` object + type union, which is functionally equivalent and compatible with this config.

---

## Out of Scope

- Runtime implementations of engines, connectors, stores
- UI components
- Unit tests (types only — compile-time verification)
- Post-MVP types (plugins, multi-model, versioning)

---

## Risks

None identified. Types are stable and match documentation.

---

## What Is Now Unblocked

- **M0-04:** Demo dataset can now conform to `NormalizedModel`
- **M1-01:** Demo connector can implement `DataConnector` and return `NormalizedModel`
- **M1-02:** Architeezy connector can implement `DataConnector`
- **M1-03:** Graph engine can operate on `AnalysisGraph`, `GraphNode`, `GraphEdge`
