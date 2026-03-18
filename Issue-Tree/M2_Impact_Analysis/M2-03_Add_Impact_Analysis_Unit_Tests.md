# M2-03: Add Impact Analysis Unit Tests

## Metadata

| Field                | Value                                             |
|----------------------|---------------------------------------------------|
| **Issue ID**         | M2-03                                             |
| **Type**             | Test                                              |
| **Status**           | Proposed                                          |
| **Milestone**        | M2 — Impact Analysis                              |
| **Capability Slice** | S-2 ("Анализирую impact изменения")               |
| **Priority**         | P0                                                |
| **Sequence Order**   | 3                                                 |
| **Depends On**       | M2-01 (BFS Impact Analysis), M2-02 (Layer Summary and Affected Diagrams) |
| **Unlocks**          | M2-04 (Global Search Bar)                         |
| **FR References**    | —                                                 |
| **AC References**    | —                                                 |
| **Decision Refs**    | —                                                 |
| **Demo Refs**        | —                                                 |
| **Risk Refs**        | —                                                 |

## Goal

Write comprehensive unit tests for the BFS impact analysis engine and layer summary aggregation, ensuring correctness, cycle safety, edge cases, and performance. Establish a reliable test suite that subsequent issues can depend on.

## Why Now

M2-01 and M2-02 deliver the core engine logic. Before building UI on top of it (M2-04 onward), the engine must be thoroughly tested. Finding bugs at this stage is far cheaper than discovering them through UI-level debugging.

## User / System Outcome

Developers have confidence that the impact analysis engine is correct and performant. Any future changes to the engine that break behavior are caught immediately by the test suite.

## Scope

- `tests/engine/insight.test.ts` (or `tests/engine/insight/` directory):
  - **BFS depth tests**: depth 1 returns only direct neighbors; depth 2 returns 2-hop expansion; depth 3 returns 3-hop expansion. Verified against hand-computed expected results on a known test graph.
  - **Cycle handling**: graph with cycles (e.g., A → B → C → A) terminates correctly, no infinite loop, no duplicates.
  - **Isolated node**: element with no connections returns empty `AffectedElement[]`.
  - **Layer summary**: counts per layer match expected values for a known dataset.
  - **Affected diagrams**: source element's diagrams are correctly returned.
  - **Performance**: graph with 500 nodes and typical connectivity completes `analyzeImpact` in < 1 second.
  - **Demo dataset known values**: "Core Banking Platform" at depth 2 returns 28 affected elements.

## Out of Scope

- UI component tests (covered in M2-05, M2-06, M2-07).
- Integration tests with real Architeezy data.
- E2E browser tests.

## Preconditions

- M2-01: `analyzeImpact` function is implemented.
- M2-02: `buildImpactResult` function is implemented.
- Test framework (Vitest) is configured (from M0).

## Implementation Notes

- Create small, deterministic test graphs as fixtures (e.g., a linear chain, a diamond, a cycle, a star, an isolated node).
- For performance tests, generate a synthetic graph with 500 nodes and random edges programmatically.
- Use `describe`/`it` blocks organized by function and scenario.
- Coverage target: > 80% line coverage for `src/engine/insight/`.

## Files and Artifacts Expected to Change

| Path                                      | Change   |
|-------------------------------------------|----------|
| `tests/engine/insight.test.ts`            | Create   |
| `tests/fixtures/testGraphs.ts`            | Create   |

## Acceptance Criteria

- [ ] All unit tests pass (`npm run test`).
- [ ] Test coverage > 80% for `src/engine/insight/` files.
- [ ] BFS depth 1, 2, 3 tests verify exact expected element sets.
- [ ] Cycle test confirms termination and no duplicates.
- [ ] Isolated node test confirms empty result.
- [ ] Layer summary test confirms correct counts.
- [ ] Affected diagrams test confirms correct diagram list.
- [ ] Performance test confirms < 1 second for 500-node graph.

## Required Tests

### Functional

- `npm run test` passes with all insight engine tests green.
- Coverage report shows > 80% for insight engine files.

### Smoke

- Test suite executes without hanging or crashing.

### Regression

- All M1 graph engine tests (`tests/engine/`) still pass.
- No test file conflicts or import errors.

## Handoff to Next Issue

Impact analysis engine is fully tested and stable. M2-04 (Global Search Bar) and subsequent UI issues can proceed with confidence that the engine layer is correct.

## Done Definition

- All acceptance criteria checked.
- All tests pass.
- Coverage target met.
- Test fixtures committed and reusable.
