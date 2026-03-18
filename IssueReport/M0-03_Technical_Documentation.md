# M0-03 Technical Documentation

## Purpose

This issue establishes the foundational type contract for the entire ArchiLens system. All domain types are defined as TypeScript interfaces in two files, ensuring compile-time safety across connectors, engines, stores, and UI.

---

## Architecture

Types are split into two files following the architectural layer separation:

```
src/engine/types.ts      ← Domain + derived types (used by engine, stores, UI)
src/connectors/types.ts  ← Connector interface + config (used by connectors only)
```

Dependency direction: `connectors/types.ts` → `engine/types.ts` (one-way import of `NormalizedModel`).

---

## Source Types (from Architeezy)

### NormalizedModel

The central data contract between Connector Layer and Graph Engine:

```typescript
interface NormalizedModel {
  id: string;
  name: string;
  elements: NormalizedElement[];
  relationships: NormalizedRelationship[];
  diagrams: NormalizedDiagram[];
  warnings: LoadWarning[];
}
```

Every connector normalizes raw API data into this structure. The engine never sees raw Architeezy data.

### NormalizedElement

```typescript
interface NormalizedElement {
  id: string;       // Architeezy ID (D-9)
  name: string;
  type: string;     // ArchiMate element type
  diagramIds: string[];
}
```

### NormalizedRelationship

```typescript
interface NormalizedRelationship {
  id: string;
  sourceId: string;
  targetId: string;
  type: string;     // ArchiMate relationship type
}
```

### NormalizedDiagram

```typescript
interface NormalizedDiagram {
  id: string;
  name: string;
  elementIds: string[];
}
```

---

## Layer System

### Layer (const object + type)

8 ArchiMate 3.x layers: Strategy, Business, Application, Technology, Physical, Motivation, Implementation, Other.

Implemented as `const` object + type union (not `enum`) due to `erasableSyntaxOnly: true` in tsconfig.

### elementTypeToLayer(type: string): Layer

Maps 50+ ArchiMate element types to their correct layers. Coverage:

| Layer | Element Types |
|-------|--------------|
| Strategy | Resource, Capability, ValueStream, CourseOfAction |
| Business | BusinessActor, BusinessRole, BusinessCollaboration, BusinessInterface, BusinessProcess, BusinessFunction, BusinessInteraction, BusinessEvent, BusinessService, BusinessObject, Contract, Representation, Product |
| Application | ApplicationComponent, ApplicationCollaboration, ApplicationInterface, ApplicationFunction, ApplicationInteraction, ApplicationProcess, ApplicationEvent, ApplicationService, DataObject |
| Technology | Node, Device, SystemSoftware, TechnologyCollaboration, TechnologyInterface, Path, CommunicationNetwork, TechnologyFunction, TechnologyProcess, TechnologyInteraction, TechnologyEvent, TechnologyService, Artifact |
| Physical | Equipment, Facility, DistributionNetwork, Material |
| Motivation | Stakeholder, Driver, Assessment, Goal, Outcome, Principle, Requirement, Constraint, Meaning, Value |
| Implementation | WorkPackage, Deliverable, ImplementationEvent, Plateau, Gap |
| Other | Any unrecognized type (fallback) |

---

## Derived Types

### GraphNode

Element wrapper with computed metrics:
- `element` — reference to source NormalizedElement
- `degree`, `inDegree`, `outDegree` — connection counts
- `diagramsCount` — number of diagrams containing this element
- `isOrphan` — `degree === 0 || diagramsCount === 0`

### GraphEdge

Relationship wrapper: `relationship` + `source`/`target` GraphNode references.

### AnalysisGraph

Full graph with indexes:
- `nodes: Map<string, GraphNode>` — ID → node lookup
- `edges: GraphEdge[]` — all edges
- `adjacencyOut: Map<string, string[]>` — outgoing neighbor IDs
- `adjacencyIn: Map<string, string[]>` — incoming neighbor IDs

---

## Impact Analysis Types

- **ImpactResult** — transient result: sourceElementId, depth, affectedElements, affectedLayers, affectedDiagrams
- **AffectedElement** — id, name, type, layer, distance from source
- **LayerSummary** — layer + count
- **DiagramRef** — diagram id + name

---

## Coverage Types

- **CoverageReport** — totalElements, orphanCount, orphanPercent, orphanElements, layerDistribution, brokenReferences
- **BrokenReference** — sourceId, targetId, type, reason

---

## Connector Types

- **ConnectorConfig** — url, token, optional proxyUrl
- **DataConnector** — interface: connect(), listModels(), loadModel()
- **ModelSummary** — id + name for model listing

---

## Constraints

- No `any` types anywhere
- All IDs are `string` (Architeezy IDs per decision D-9)
- ImpactResult is transient (not persisted)
- Layer is derived from ElementType, not stored in source data
- Types are read-only contracts; no mutation methods

---

## Integration Points

| Consumer | Uses |
|----------|------|
| Demo connector (M1-01) | `DataConnector`, `NormalizedModel` |
| Architeezy connector (M1-02) | `DataConnector`, `ConnectorConfig`, `NormalizedModel` |
| Graph engine (M1-03) | `NormalizedModel` → `AnalysisGraph`, `GraphNode`, `GraphEdge` |
| Insight engine (M2-01) | `AnalysisGraph` → `ImpactResult`, `CoverageReport` |
| Zustand stores (M1-06) | All types for state management |
| UI components | `GraphNode`, `ImpactResult`, `Layer` for display |
| Export (M4-01, M4-02) | `AnalysisGraph`, `ImpactResult` for file generation |
