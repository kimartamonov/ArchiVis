# Technical Documentation: M1-01 — Demo Dataset Connector

## Purpose

`DemoConnector` is the first implementation of the `DataConnector` interface. It provides an offline-first data source by loading a bundled JSON demo dataset (Digital Bank Architecture) without network configuration or external dependencies.

---

## Architecture

```
src/connectors/
  types.ts              ← DataConnector interface (from M0-03)
  demo/
    DemoConnector.ts    ← Implementation
    index.ts            ← Barrel export
    __tests__/
      DemoConnector.test.ts

public/
  digital-bank.json     ← Static asset served by Vite
```

### Design Decisions

- **`fetch()` over static import** — chosen because `verbatimModuleSyntax: true` in tsconfig prevents default JSON imports. `fetch('/digital-bank.json')` works both in dev (Vite dev server) and production (static file in `dist/`).
- **Demo JSON in `public/`** — Vite serves `public/` files at the root path. The canonical copy remains in `demo/digital-bank.json`; `public/digital-bank.json` is the served copy.
- **No runtime validation** — the demo dataset was verified in M0-05 (41/41 checks). TypeScript typing provides compile-time guarantees.

---

## API Contract

```typescript
import { DemoConnector } from './connectors/demo';

const connector = new DemoConnector();

// No-op — demo needs no connection
await connector.connect({ url: '', token: '' });

// Returns [{ id: "demo", name: "Digital Bank" }]
const models = await connector.listModels();

// Fetches and returns the full NormalizedModel
const model = await connector.loadModel('demo');
// model.elements.length === 102
// model.relationships.length === 160
// model.diagrams.length === 10
```

---

## Data Flow

1. UI calls `connector.loadModel('demo')`
2. DemoConnector calls `fetch('/digital-bank.json')`
3. Vite dev server (or static hosting) serves the file
4. Response is parsed as JSON and returned as `NormalizedModel`

---

## Testing

6 unit tests in `src/connectors/demo/__tests__/DemoConnector.test.ts`:

- Tests mock `fetch` with `vi.stubGlobal` using the actual demo dataset content
- Verifies all three DataConnector methods
- Asserts exact element (102), relationship (160), and diagram (10) counts

Run: `npm run test`

---

## Limitations

- Single hardcoded demo dataset (by design for MVP)
- `loadModel()` ignores the `id` parameter — always returns the Digital Bank dataset
- No caching — each `loadModel()` call triggers a new `fetch`

---

## Integration Points

- **M1-07 (Connection Screen):** instantiate `DemoConnector` when user clicks "Load Demo Dataset"
- **M1-03 (Graph Engine):** pass `NormalizedModel` from `loadModel()` to graph construction
- **M1-06 (Zustand Stores):** store the loaded `NormalizedModel` in app state
