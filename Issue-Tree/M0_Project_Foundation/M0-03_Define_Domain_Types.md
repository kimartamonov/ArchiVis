# [M0-03] Define NormalizedModel Interface and Domain Types

## Metadata

- Issue ID: M0-03
- Type: Engine
- Status: Proposed
- Milestone: M0. Project Foundation
- Capability Slice: Readiness Gate (RG-4)
- Priority: P0
- Sequence Order: 3
- Depends On:
  - M0-02
- Unlocks:
  - M0-04
  - M1-01
  - M1-02
  - M1-03
- Decision References:
  - D-9 (Architeezy ID as primary key -- decided)
- FR References:
  - FR-1.5 (load elements, relationships, diagrams -- types define the contract)
  - FR-1.6 (build internal graph -- types define GraphNode, GraphEdge, AnalysisGraph)
- AC References:
  - AC-2.1 (data loaded into normalized structure)
- Demo References:
  - none (types only, no runtime)
- Risk References:
  - none

---

## Goal

Create TypeScript interfaces for all domain types defined in `07_Domain_Model.md` and `08_System_Context_and_Architecture.md`. This includes the NormalizedModel contract (connector-to-engine boundary), all source types, all derived analysis types, the Layer enum, ElementType-to-Layer mapping, and the DataConnector interface.

These types are the foundational contract for the entire system. Every subsequent engine, connector, store, and UI issue depends on them.

---

## Why Now

Domain types must exist before any implementation can begin. M0-04 (demo dataset) must conform to NormalizedModel. M1-01 (graph engine) operates on AnalysisGraph, GraphNode, GraphEdge. M1-02 (connector) implements DataConnector and returns NormalizedModel. Without stable types, parallel work is impossible.

---

## User/System Outcome

- **System:** All domain types are defined as TypeScript interfaces. Any file in the project can import them. The compiler enforces the contract.
- **Roadmap:** The type contract is frozen. All subsequent issues build against these types. No ambiguity about data shapes.

---

## Scope

### Source types (in `src/engine/types.ts` or similar)

- `NormalizedModel` -- top-level model container
- `NormalizedElement` -- element with id, name, type, diagramIds
- `NormalizedRelationship` -- relationship with id, sourceId, targetId, type
- `NormalizedDiagram` -- diagram with id, name, elementIds
- `LoadWarning` -- warning generated during data loading

### Derived types (in `src/engine/types.ts`)

- `Layer` enum -- Strategy, Business, Application, Technology, Physical, Motivation, Implementation, Other
- `ElementType` -- string union or enum of ArchiMate element types
- `GraphNode` -- element + computed metrics (degree, inDegree, outDegree, diagramsCount, isOrphan)
- `GraphEdge` -- relationship wrapper with source/target GraphNode references
- `AnalysisGraph` -- nodes Map, edges array, adjacencyOut Map, adjacencyIn Map
- `ImpactResult` -- impact analysis result (sourceElementId, depth, affectedElements, affectedLayers, affectedDiagrams)
- `AffectedElement` -- element in impact result with distance
- `LayerSummary` -- layer + count
- `DiagramRef` -- diagram id + name
- `CoverageReport` -- orphan count, percent, list, layer distribution, broken references
- `BrokenReference` -- sourceId, targetId, type, reason

### Connector types (in `src/connectors/types.ts`)

- `ConnectorConfig` -- URL, token, optional proxy config
- `DataConnector` interface -- connect(), listModels(), loadModel()
- `ModelSummary` -- id + name (for model list)

### Utility

- `elementTypeToLayer(type: string): Layer` -- mapping function

---

## Out of Scope

- Implementation of engines, connectors, or stores (types and interfaces only)
- UI components
- Runtime behavior or tests beyond type compilation
- Types for post-MVP features (plugins, multi-model, versioning)

---

## Preconditions

- M0-02 complete: project skeleton exists, TypeScript compiles, folder structure in place

---

## Implementation Notes

- Reference `07_Domain_Model.md` for all entity definitions and field types
- Reference `08_System_Context_and_Architecture.md` for the NormalizedModel contract and DataConnector interface
- No `any` types allowed. Use `string` for types that will be refined later
- Layer enum must cover all ArchiMate layers: Strategy, Business, Application, Technology, Physical, Motivation, Implementation, Other
- ElementType-to-Layer mapping should follow the ArchiMate 3.x specification
- ID fields are `string` (Architeezy IDs per D-9)
- GraphNode.isOrphan: `degree === 0 || diagramsCount === 0` per domain model doc
- ImpactResult is transient (not persisted) per domain model doc
- Keep types in two files: `src/engine/types.ts` (domain + derived) and `src/connectors/types.ts` (connector interface + config)

---

## Files and Artifacts Expected to Change

- New: `src/engine/types.ts`
- New: `src/connectors/types.ts`

---

## Acceptance Criteria for This Issue

1. All types listed in Scope compile without TypeScript errors
2. No `any` types used anywhere in the type definitions
3. Layer enum covers all 8 ArchiMate layers (Strategy, Business, Application, Technology, Physical, Motivation, Implementation, Other)
4. `elementTypeToLayer()` function exists and maps known ArchiMate types to their correct layers
5. NormalizedModel interface matches the contract in `08_System_Context_and_Architecture.md`
6. DataConnector interface matches the contract in `08_System_Context_and_Architecture.md`
7. GraphNode includes all fields from `07_Domain_Model.md`: element, degree, inDegree, outDegree, diagramsCount, isOrphan
8. AnalysisGraph includes: nodes (Map), edges (array), adjacencyOut (Map), adjacencyIn (Map)
9. `npm run build` still succeeds after adding the type files

---

## Required Tests

### Functional checks

- TypeScript compiles without errors (`npm run build` succeeds)
- All types from `07_Domain_Model.md` are represented
- NormalizedModel contract matches doc 08 exactly
- Layer enum has exactly 8 members
- elementTypeToLayer maps at least: BusinessProcess -> Business, ApplicationComponent -> Application, Node -> Technology

### Smoke checks

- Importing types from both files works in a test .ts file
- No circular dependencies between engine/types.ts and connectors/types.ts

### Regression checks

- `npm run lint` still passes
- `npm run dev` still starts
- Existing App.tsx still renders

---

## Handoff to Next Issue

After M0-03 is complete:

- **What now works:** All domain types are importable from `src/engine/types.ts` and `src/connectors/types.ts`. TypeScript enforces the contract at compile time.
- **What contract is now stable:** NormalizedModel (connector output), AnalysisGraph (graph engine output), DataConnector (connector interface), Layer enum, all metric types.
- **What next issue can start:** M0-04 (demo dataset must conform to NormalizedModel). M1-01 (graph engine operates on AnalysisGraph). M1-02 (connector implements DataConnector). M1-03 (insight engine uses ImpactResult, CoverageReport).

---

## Done Definition

- [ ] `src/engine/types.ts` committed with all domain and derived types
- [ ] `src/connectors/types.ts` committed with ConnectorConfig, DataConnector, ModelSummary
- [ ] `elementTypeToLayer()` function defined and covers ArchiMate 3.x types
- [ ] No `any` types in either file
- [ ] `npm run build` succeeds
- [ ] `npm run lint` passes
- [ ] Types match specifications in docs 07 and 08
