# Implementation Report: M1-01 — Implement Demo Dataset Connector

## Issue

- **Issue ID:** M1-01
- **Title:** Implement Demo Dataset Connector
- **Milestone:** M1 — Model Visualization
- **Type:** Integration
- **Date Completed:** 2026-03-18

---

## What Was Done

Created `DemoConnector` class implementing the `DataConnector` interface. The connector provides an offline-first entry point for loading the bundled Digital Bank demo dataset without any external API dependency.

### Implementation Details

- **`DemoConnector.connect()`** — no-op, resolves immediately (no external connection needed for demo)
- **`DemoConnector.listModels()`** — returns `[{ id: "demo", name: "Digital Bank" }]`
- **`DemoConnector.loadModel()`** — fetches `/digital-bank.json` from public assets, parses and returns as `NormalizedModel`
- Demo dataset JSON copied to `public/digital-bank.json` for Vite to serve as a static asset
- Barrel export via `src/connectors/demo/index.ts`

### Infrastructure Changes

- Added Vitest (`vitest@4.1.0`) as test runner
- Added `test` script to `package.json`
- Configured Vitest in `vite.config.ts`
- Updated ESLint config: `argsIgnorePattern: '^_'` for `@typescript-eslint/no-unused-vars` rule
- Updated `tsconfig.app.json`: excluded test files from production build

---

## Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `src/connectors/demo/DemoConnector.ts` | Created | DemoConnector implementing DataConnector |
| `src/connectors/demo/index.ts` | Created | Barrel export |
| `src/connectors/demo/__tests__/DemoConnector.test.ts` | Created | 6 unit tests for DemoConnector |
| `public/digital-bank.json` | Created | Demo dataset served as static asset |
| `vite.config.ts` | Modified | Added Vitest configuration |
| `package.json` | Modified | Added vitest dependency and test script |
| `eslint.config.js` | Modified | Allow `_`-prefixed unused parameters |
| `tsconfig.app.json` | Modified | Exclude test files from production build |

---

## Acceptance Criteria Status

| # | Criterion | Status |
|---|-----------|--------|
| 1 | DemoConnector implements DataConnector without type errors | ✅ |
| 2 | connect() resolves without error | ✅ |
| 3 | listModels() returns `[{ id: "demo", name: "Digital Bank" }]` | ✅ |
| 4 | loadModel("demo") returns a valid NormalizedModel | ✅ |
| 5 | Element count matches demo dataset (102) | ✅ |
| 6 | Relationship count matches demo dataset (160) | ✅ |

---

## Tests Performed

- `npm run test` — 6/6 tests passed:
  - `connect()` resolves without error
  - `listModels()` returns exactly one model entry
  - `loadModel("demo")` returns a valid NormalizedModel
  - Element count = 102
  - Relationship count = 160
  - Diagram count = 10
- `npm run build` — successful
- `npm run lint` — 0 errors

---

## Out of Scope

- Architeezy API connector (M1-02)
- Multiple demo datasets
- JSON validation beyond TypeScript type checking

---

## Risks

No risks identified. Demo connector is fully self-contained.

---

## What Is Now Unblocked

- **M1-07** (Connection Screen) — can offer "Load Demo Dataset" button using DemoConnector
- **M1-03** (Graph Engine) — can use DemoConnector output as test input
- **M1-06** (Zustand Stores) — can wire DemoConnector into app state
