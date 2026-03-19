# M1-05 Implementation Report

## Issue

| Field | Value |
|-------|-------|
| **Issue ID** | M1-05 |
| **Title** | Add Graph Engine Unit Tests |
| **Milestone** | M1 — Model Visualization |
| **Type** | Test |
| **Status** | Done |

## What Was Done

1. **Created shared test fixture factories** (`src/engine/graph/__tests__/fixtures.ts`):
   - `makeElement(id, name?, type?, diagramIds?)` — creates a `NormalizedElement`
   - `makeRelationship(id, sourceId, targetId, type?)` — creates a `NormalizedRelationship`
   - `makeModel(elements, relationships?, diagrams?)` — assembles a `NormalizedModel`

2. **Expanded `buildGraph.test.ts`** (12 tests):
   - Minimal model (1 element, 0 relationships)
   - Known model (3 elements, 2 relationships) — node/edge count
   - Correct adjacency lists (adjacencyOut + adjacencyIn)
   - Degree metrics (inDegree, outDegree, degree)
   - Broken reference warnings (missing target, missing source)
   - Empty model (0 elements, 0 relationships)
   - Duplicate element IDs — last wins
   - Cycle handling (A → B → C → A)
   - Self-loop (A → A)
   - Orphan detection (degree === 0)
   - diagramsCount from element.diagramIds
   - Edge source/target reference identity
   - Demo dataset smoke test (102 elements, 160 edges)

3. **Expanded `calculateMetrics.test.ts`** (10 tests):
   - Degree values on known graph
   - Orphan: no edges + no diagrams
   - Orphan: has edges but no diagrams
   - Orphan: has diagrams but no edges
   - Well-connected node in diagrams — NOT orphan
   - diagramsCount from element.diagramIds
   - Missing adjacency entries fallback (defensive)
   - Undefined diagramIds fallback (defensive)
   - Idempotency — calling twice gives same results
   - Demo dataset hub element high degree

4. **Configured coverage** in `vite.config.ts`:
   - Provider: `@vitest/coverage-v8`
   - Thresholds: 80% lines + 80% branches for `buildGraph.ts` and `calculateMetrics.ts`
   - Added `npm run test:coverage` script

5. **Added `coverage` to `.gitignore`**

## Files Changed

| Path | Change |
|------|--------|
| `src/engine/graph/__tests__/fixtures.ts` | Created |
| `src/engine/graph/__tests__/buildGraph.test.ts` | Rewritten (shared fixtures, +4 new tests) |
| `src/engine/graph/__tests__/calculateMetrics.test.ts` | Rewritten (shared fixtures, +3 new tests) |
| `vite.config.ts` | Updated (coverage config with thresholds) |
| `package.json` | Updated (`test:coverage` script, `@vitest/coverage-v8`) |
| `.gitignore` | Updated (added `coverage`) |

## Acceptance Criteria Status

| Criteria | Status |
|----------|--------|
| All tests pass via `npm run test` | Done — 42/42 passed |
| Coverage > 80% for `buildGraph.ts` | Done — 100% lines, 100% branches |
| Coverage > 80% for `calculateMetrics.ts` | Done — 100% lines, 100% branches |
| Edge cases: empty model, broken refs, cycles, isolated nodes | Done |
| Tests run in < 5 seconds | Done — total 776ms |

## Checks Performed

- `npm run test` — 42/42 passed
- `npm run test:coverage` — all thresholds met (100/100/100/100)
- `npm run build` — successful
- `npm run lint` — 0 errors

## Out of Scope

- UI component tests (separate issue)
- Connector tests (already exist in M1-01, M1-02)
- E2E tests (M4-08)
- Performance benchmarks

## Risks

- None identified. Graph engine has full test coverage.

## Unblocked

- **M1-06** (Create Zustand Stores) — graph engine is tested and stable
- UI development (M1-08 graph view) can rely on engine correctness
