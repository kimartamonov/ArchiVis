# M1-06: Create Zustand Stores

## Metadata

| Field                | Value                                                  |
|----------------------|--------------------------------------------------------|
| **Issue ID**         | M1-06                                                  |
| **Type**             | Implementation                                         |
| **Status**           | Proposed                                               |
| **Milestone**        | M1 — Model Visualization                               |
| **Capability Slice** | S-1 ("Вижу модель как граф")                           |
| **Priority**         | P0                                                     |
| **Sequence Order**   | 6                                                      |
| **Depends On**       | M0-03 (Core Types), M1-03 (Graph Engine)               |
| **Unlocks**          | M1-07 (Connection Screen), M1-08 (Global Graph View)   |
| **FR References**    | FR-8.1, FR-8.3                                         |
| **AC References**    | —                                                      |
| **Decision Refs**    | D-4 (Zustand), D-6 (one model at a time)               |
| **Demo Refs**        | —                                                      |
| **Risk Refs**        | —                                                      |

## Goal

Create Zustand stores for application state management. Six flat stores cover the full state surface: connection, model, graph, analysis, filters, and UI. Token persistence uses `sessionStorage`; URL persistence uses `localStorage`.

## Why Now

UI components (Connection Screen, Global Graph View, Element Info) need shared state. Stores must exist before any screen can be built. Zustand provides minimal boilerplate and excellent React integration.

## User / System Outcome

The application has a predictable, centralized state layer. Connection URL survives page refresh (localStorage). Token survives tab lifetime only (sessionStorage). All UI components react to state changes automatically.

## Scope

### connectionStore (`src/stores/connectionStore.ts`)
- State: `url: string`, `token: string`, `status: 'disconnected' | 'connecting' | 'connected' | 'error'`, `error: string | null`.
- Actions: `setConnection(url, token)`, `setStatus(status)`, `setError(error)`, `reset()`.
- Persistence: `url` → `localStorage`, `token` → `sessionStorage`.

### modelStore (`src/stores/modelStore.ts`)
- State: `models: ModelListItem[]`, `currentModel: NormalizedModel | null`, `loading: boolean`, `error: string | null`.
- Actions: `setModels(list)`, `setCurrentModel(model)`, `setLoading(loading)`, `setError(error)`, `reset()`.

### graphStore (`src/stores/graphStore.ts`)
- State: `graph: AnalysisGraph | null`, `rfNodes: RFNode[]`, `rfEdges: RFEdge[]`, `loading: boolean`.
- Actions: `setGraph(graph)`, `setRFNodes(nodes)`, `setRFEdges(edges)`, `setLoading(loading)`, `reset()`.

### analysisStore (`src/stores/analysisStore.ts`)
- State: `selectedElementId: string | null`, `impactResult: ImpactResult | null`, `depth: number`.
- Actions: `selectElement(id)`, `setImpactResult(result)`, `setDepth(depth)`, `reset()`.

### filterStore (`src/stores/filterStore.ts`)
- State: `layerFilters: Record<string, boolean>`, `typeFilters: Record<string, boolean>`.
- Actions: `toggleLayer(layer)`, `toggleType(type)`, `resetFilters()`.

### uiStore (`src/stores/uiStore.ts`)
- State: `activeScreen: 'connection' | 'graph' | 'impact'`, `sidebarOpen: boolean`, `searchQuery: string`.
- Actions: `setScreen(screen)`, `toggleSidebar()`, `setSearchQuery(query)`.

## Out of Scope

- Complex derived selectors (added as needed in later milestones).
- Middleware (devtools, logging — can be added later).
- Cross-store orchestration (handled in UI components or action thunks).

## Preconditions

- M0-03: Types for `NormalizedModel`, `ModelListItem`, `AnalysisGraph`, `ImpactResult`.
- M1-03: Graph engine types (`AnalysisGraph`, `GraphNode`).
- Zustand installed as a dependency (from M0 scaffold).

## Implementation Notes

- Use `zustand`'s `create()` with the standard pattern: `create<StoreType>((set) => ({ ... }))`.
- Keep stores flat — no nesting, no computed state in the store itself.
- For `connectionStore` persistence: read initial `url` from `localStorage.getItem('archilens:url')` and `token` from `sessionStorage.getItem('archilens:token')`. Write on `setConnection`.
- All stores should have a `reset()` action for cleanup (e.g., on disconnect).

## Files and Artifacts Expected to Change

| Path                               | Change   |
|------------------------------------|----------|
| `src/stores/connectionStore.ts`    | Create   |
| `src/stores/modelStore.ts`         | Create   |
| `src/stores/graphStore.ts`         | Create   |
| `src/stores/analysisStore.ts`      | Create   |
| `src/stores/filterStore.ts`        | Create   |
| `src/stores/uiStore.ts`           | Create   |
| `src/stores/index.ts`             | Create   |

## Acceptance Criteria

- [ ] All six stores create without errors.
- [ ] `connectionStore.setConnection(url, token)` persists URL to `localStorage` and token to `sessionStorage`.
- [ ] On page reload, `connectionStore` initializes with URL from `localStorage` and token from `sessionStorage`.
- [ ] State updates in any store trigger React component re-renders (verified in M1-07/M1-08).
- [ ] `reset()` on each store returns state to initial values.
- [ ] All stores are type-safe (no `any` types).

## Required Tests

### Functional

- `connectionStore`: `setConnection` → state updated, localStorage/sessionStorage written.
- `modelStore`: `setModels` → `models` updated; `setCurrentModel` → `currentModel` updated.
- `graphStore`: `setGraph` → `graph` updated.
- `analysisStore`: `selectElement` → `selectedElementId` updated.
- `filterStore`: `toggleLayer` → layer filter toggled.
- `uiStore`: `setScreen` → `activeScreen` updated.
- All stores: `reset()` → initial state restored.

### Smoke

- All stores instantiate without error.
- Importing any store does not cause side effects.

### Regression

- N/A (first store implementation).

## Handoff to Next Issue

All stores are available for UI components. M1-07 (Connection Screen) uses `connectionStore` and `modelStore`. M1-08 (Global Graph View) uses `graphStore`, `filterStore`, and `uiStore`. M1-09 (Element Info) uses `analysisStore`.

## Done Definition

- All acceptance criteria checked.
- Code compiles without errors.
- Tests pass.
- All stores exported from `src/stores/index.ts`.
