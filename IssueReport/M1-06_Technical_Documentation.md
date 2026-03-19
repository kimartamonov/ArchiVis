# M1-06 Technical Documentation

## Purpose

Centralized state management layer for ArchiLens using Zustand. Six flat stores cover the full state surface required by the MVP UI.

## Architecture

### Store Structure

```
src/stores/
├── index.ts              # Barrel export (stores + types)
├── connectionStore.ts    # Connection URL/token/status
├── modelStore.ts         # Model list and current model
├── graphStore.ts         # AnalysisGraph + React Flow data
├── analysisStore.ts      # Element selection + impact analysis
├── filterStore.ts        # Layer/type toggle filters
├── uiStore.ts            # Screen navigation + sidebar + search
└── __tests__/
    ├── connectionStore.test.ts
    ├── modelStore.test.ts
    ├── graphStore.test.ts
    ├── analysisStore.test.ts
    ├── filterStore.test.ts
    └── uiStore.test.ts
```

### Store Contracts

#### connectionStore

| State | Type | Default |
|-------|------|---------|
| `url` | `string` | `localStorage['archilens:url']` or `''` |
| `token` | `string` | `sessionStorage['archilens:token']` or `''` |
| `status` | `ConnectionStatus` | `'disconnected'` |
| `error` | `string \| null` | `null` |

Actions: `setConnection(url, token)`, `setStatus(status)`, `setError(error)`, `reset()`.

Persistence: `url` → `localStorage`, `token` → `sessionStorage`. Both are read at initialization and written on `setConnection`. `reset()` removes both.

#### modelStore

| State | Type | Default |
|-------|------|---------|
| `models` | `ModelSummary[]` | `[]` |
| `currentModel` | `NormalizedModel \| null` | `null` |
| `loading` | `boolean` | `false` |
| `error` | `string \| null` | `null` |

Actions: `setModels(list)`, `setCurrentModel(model)`, `setLoading(loading)`, `setError(error)`, `reset()`.

#### graphStore

| State | Type | Default |
|-------|------|---------|
| `graph` | `AnalysisGraph \| null` | `null` |
| `rfNodes` | `RFNode[]` | `[]` |
| `rfEdges` | `RFEdge[]` | `[]` |
| `loading` | `boolean` | `false` |

Actions: `setGraph(graph)`, `setRFNodes(nodes)`, `setRFEdges(edges)`, `setLoading(loading)`, `reset()`.

Types `RFNode` and `RFEdge` are lightweight interfaces compatible with React Flow's node/edge shape (`id`, `position`, `data`, `source`, `target`).

#### analysisStore

| State | Type | Default |
|-------|------|---------|
| `selectedElementId` | `string \| null` | `null` |
| `impactResult` | `ImpactResult \| null` | `null` |
| `depth` | `number` | `1` |

Actions: `selectElement(id)`, `setImpactResult(result)`, `setDepth(depth)`, `reset()`.

#### filterStore

| State | Type | Default |
|-------|------|---------|
| `layerFilters` | `Record<string, boolean>` | `{}` |
| `typeFilters` | `Record<string, boolean>` | `{}` |

Actions: `toggleLayer(layer)`, `toggleType(type)`, `resetFilters()`.

Toggle semantics: first toggle → `true`, second toggle → `false`. Empty object means "show all" (no filtering).

#### uiStore

| State | Type | Default |
|-------|------|---------|
| `activeScreen` | `ActiveScreen` | `'connection'` |
| `sidebarOpen` | `boolean` | `false` |
| `searchQuery` | `string` | `''` |

Actions: `setScreen(screen)`, `toggleSidebar()`, `setSearchQuery(query)`, `reset()`.

`ActiveScreen = 'connection' | 'graph' | 'impact'`.

## Design Decisions

- **Flat stores** — no nesting, no computed state. Derived values computed in components or selectors.
- **No middleware** — devtools/logging deferred to avoid premature complexity.
- **Defensive storage access** — `getStorage()` wraps `globalThis.localStorage`/`sessionStorage` with try-catch, returning `null` when unavailable (SSR, Node test environment).
- **`RFNode`/`RFEdge` defined locally** — avoids premature `@xyflow/react` dependency. Will be replaced by actual React Flow types when M1-08 installs the library.

## Constraints

- One model at a time (D-6).
- Token in `sessionStorage` only — does not survive browser close.
- No cross-store subscriptions — orchestration happens in UI components.

## Integration Points

- **M1-07 (Connection Screen):** reads/writes `connectionStore`, `modelStore`
- **M1-08 (Global Graph View):** reads/writes `graphStore`, `filterStore`, `uiStore`
- **M1-09 (Element Info Popup):** reads `analysisStore`
- **M2-05 (Impact Screen):** reads/writes `analysisStore`, `uiStore`
