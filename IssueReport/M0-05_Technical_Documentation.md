# Technical Documentation: M0-05 — Validation: Project Foundation

## Purpose

M0-05 is a validation-type issue that confirms all Readiness Gate conditions are met before M1 begins. It does not introduce new functionality — it verifies the foundation built by M0-01 through M0-04.

---

## Architectural Approach

The validation is implemented as an automated TypeScript script (`scripts/validate-foundation.ts`) that can be re-run at any time. This approach was chosen over a manual checklist to provide repeatable, deterministic verification.

The script uses direct file system access and string analysis rather than TypeScript compilation checks, making it fast and dependency-light (requires only `tsx` to run).

---

## Validation Script: `scripts/validate-foundation.ts`

### Design

- **41 individual checks** organized by Readiness Gate (RG-2 through RG-5)
- RG-1 checks (npm run dev/build/lint) are verified manually since they require process execution
- Exit code 0 on success, 1 on any failure
- Human-readable output with ✓/✗ markers

### Check Categories

| Category | Checks | Method |
|----------|--------|--------|
| RG-2: Spike document | 6 | File existence + content keyword search |
| RG-3: Demo dataset | 14 | JSON parse + NormalizedModel field validation + referential integrity |
| RG-4: Types & interfaces | 16 | File existence + interface/method signature search |
| RG-5: Folder structure | 5 | Directory existence |

### Running

```bash
npx tsx scripts/validate-foundation.ts
```

---

## Verified Contracts and Data Structures

### NormalizedModel (src/engine/types.ts)

The canonical domain model contract, verified as stable:

- `NormalizedModel` — top-level container (id, name, elements, relationships, diagrams, warnings)
- `NormalizedElement` — ArchiMate element (id, name, type, diagramIds)
- `NormalizedRelationship` — relationship (id, sourceId, targetId, type)
- `NormalizedDiagram` — diagram/view (id, name, elementIds)
- `LoadWarning` — warning generated during loading
- `Layer` — 8 ArchiMate layers as const object
- `elementTypeToLayer()` — maps 50+ element types to layers
- `GraphNode`, `GraphEdge`, `AnalysisGraph` — derived graph types
- `ImpactResult`, `AffectedElement`, `LayerSummary`, `DiagramRef` — impact analysis types
- `CoverageReport`, `BrokenReference` — quality assessment types

### DataConnector (src/connectors/types.ts)

The connector interface contract:

- `DataConnector.connect(config: ConnectorConfig): Promise<void>`
- `DataConnector.listModels(): Promise<ModelSummary[]>`
- `DataConnector.loadModel(id: string): Promise<NormalizedModel>`

### Demo Dataset (demo/digital-bank.json)

Verified dataset properties:

- 102 elements across 6 ArchiMate layers
- 160 relationships (all sourceId/targetId resolve)
- 10 diagrams (all elementIds resolve)
- 100% referential integrity

---

## Limitations

- RG-1 checks (npm commands) are not included in the automated script — they require shell execution
- The script checks interface presence via string matching, not full TypeScript type-checking (compilation is verified separately by `npm run build`)

---

## Integration Points

This validation confirms that the following integration points are stable for M1:

1. **Demo connector → demo dataset:** `demo/digital-bank.json` conforms to `NormalizedModel`
2. **Architeezy connector → DataConnector:** Interface is defined and compilable
3. **Graph engine → domain types:** All required types (GraphNode, AnalysisGraph, etc.) are defined
4. **Build pipeline:** TypeScript strict + ESLint + Vite all pass

---

## What Next Issues Can Rely On

- Domain types are final and compilable — use them directly
- Demo dataset is valid and has full referential integrity — use it as primary test data
- DataConnector interface is stable — implement against it
- Build pipeline works — any new code that compiles will integrate cleanly
- Folder structure is in place — add files to the correct directories
