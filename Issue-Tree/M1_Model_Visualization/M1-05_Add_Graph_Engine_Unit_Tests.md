# M1-05: Add Graph Engine Unit Tests

## Metadata

| Field                | Value                                        |
|----------------------|----------------------------------------------|
| **Issue ID**         | M1-05                                        |
| **Type**             | Test                                         |
| **Status**           | Proposed                                     |
| **Milestone**        | M1 — Model Visualization                     |
| **Capability Slice** | S-1 ("Вижу модель как граф")                 |
| **Priority**         | P0                                           |
| **Sequence Order**   | 5                                            |
| **Depends On**       | M1-03 (Graph Engine), M1-04 (Base Metrics)   |
| **Unlocks**          | M1-06 (Zustand Stores)                       |
| **FR References**    | —                                            |
| **AC References**    | —                                            |
| **Decision Refs**    | —                                            |
| **Demo Refs**        | —                                            |
| **Risk Refs**        | —                                            |

## Goal

Write comprehensive unit tests for the graph construction (`buildGraph`) and metrics calculation (`calculateMetrics`) using Vitest. Establish confidence that the engine layer is correct before building UI on top of it.

## Why Now

The graph engine is the foundation of all analysis. Testing it thoroughly now prevents cascading bugs in the UI, impact analyzer, and coverage engine. It also establishes the testing pattern for the project.

## User / System Outcome

No direct user-facing output. The development team gains confidence that the graph engine handles all edge cases correctly. CI will catch regressions automatically.

## Scope

- `tests/engine/graph.test.ts` (or split into `buildGraph.test.ts` and `calculateMetrics.test.ts`):
  - **Graph construction tests:**
    - Build from minimal model (1 element, 0 relationships).
    - Build from small known model (3 elements, 2 relationships) → verify node count, edge count, adjacency.
    - Build from demo dataset → verify counts match dataset.
    - Broken reference handling → edge skipped, warning recorded.
    - Empty model (0 elements, 0 relationships) → empty graph.
    - Duplicate element IDs → handled gracefully.
  - **Metrics tests:**
    - Degree calculation on known graph → expected values.
    - Orphan detection: isolated node, node with edges but no diagrams, node with diagrams but no edges.
    - Hub node degree.
  - **Cycle handling:**
    - Model with A → B → A cycle → graph constructed, no infinite loop, degrees correct.
- Test fixtures: small, hand-crafted `NormalizedModel` objects defined inline or in a fixtures file.

## Out of Scope

- UI component tests.
- End-to-end tests.
- Connector tests (separate concern).
- Performance benchmarks (informal timing only).

## Preconditions

- M1-03: `buildGraph` implemented and exported.
- M1-04: `calculateMetrics` implemented and exported.
- Vitest configured in the project (from M0 scaffold).

## Implementation Notes

- Use Vitest `describe` / `it` / `expect`.
- Create small fixture factories: `makeElement(id, name, layer)`, `makeRelationship(id, source, target, type)`, `makeModel(elements, relationships)`.
- Keep fixtures minimal — test one thing per test case.
- For the demo dataset test, import the demo JSON and pass it through `buildGraph` + `calculateMetrics`.

## Files and Artifacts Expected to Change

| Path                                          | Change   |
|-----------------------------------------------|----------|
| `tests/engine/graph.test.ts`                  | Create   |
| `tests/engine/fixtures.ts` (optional)         | Create   |

## Acceptance Criteria

- [ ] All tests pass via `npm run test` (or `npx vitest run`).
- [ ] Coverage > 80 % for `src/engine/graph/buildGraph.ts`.
- [ ] Coverage > 80 % for `src/engine/graph/calculateMetrics.ts`.
- [ ] Edge cases covered: empty model, broken refs, cycles, isolated nodes.
- [ ] Tests run in < 5 seconds total.

## Required Tests

### Functional

- `npm run test` passes for all graph engine tests.
- Coverage report shows > 80 % line coverage for the graph engine module.

### Smoke

- Tests run without hanging or timing out.
- No unhandled promise rejections.

### Regression

- N/A (this issue creates the test suite).

## Handoff to Next Issue

The graph engine is tested and stable. UI development (M1-06 stores, M1-08 graph view) can rely on the engine producing correct output. Any future engine changes will be caught by these tests.

## Done Definition

- All acceptance criteria checked.
- All tests green in CI.
- Coverage target met.
- Test fixtures are reusable for future test files.
