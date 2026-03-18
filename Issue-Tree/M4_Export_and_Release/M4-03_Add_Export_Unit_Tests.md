# M4-03: Add Export Unit Tests

## Metadata

| Field                | Value                                             |
|----------------------|---------------------------------------------------|
| **Issue ID**         | M4-03                                             |
| **Type**             | Test                                              |
| **Status**           | Proposed                                          |
| **Milestone**        | M4 — Export and Release                           |
| **Capability Slice** | S-4 ("Экспортирую результаты")                    |
| **Priority**         | P0                                                |
| **Sequence Order**   | 3                                                 |
| **Depends On**       | M4-01 (GraphML Export), M4-02 (CSV Export)        |
| **Unlocks**          | M4-04 (Export Buttons)                            |
| **FR References**    | FR-7.1, FR-7.2                                    |
| **AC References**    | AC-6.1 – AC-6.4                                   |
| **Decision Refs**    | —                                                 |
| **Demo Refs**        | —                                                 |
| **Risk Refs**        | —                                                 |

## Goal

Write comprehensive unit tests for both the GraphML and CSV export generators, ensuring correctness of output structure, data integrity, encoding, and edge cases before integrating with the UI.

## Why Now

Both export generators (M4-01, M4-02) are implemented. Unit tests must be in place before wiring exports to UI buttons (M4-04) to catch any data transformation bugs early. These tests also feed into CI (M4-06) as part of the automated quality gate.

## User / System Outcome

The export module has automated test coverage > 70%, giving confidence that GraphML and CSV outputs are correct. Regressions in export logic will be caught automatically by `npm run test`.

## Scope

- `tests/export/graphml.test.ts`:
  - Test: valid XML structure (parseable, correct root element, namespace).
  - Test: correct `<key>` definitions for node attributes (`name`, `type`, `layer`, `degree`) and edge attribute (`type`).
  - Test: correct node count and attribute values.
  - Test: correct edge count with `source`, `target`, and type.
  - Test: XML special character escaping in element names.
  - Test: empty input produces valid minimal GraphML.
  - Test: directed graph declaration.
- `tests/export/csv.test.ts`:
  - Test: BOM character present at start.
  - Test: correct header row.
  - Test: correct row count (nodes + 1).
  - Test: values with commas are quoted.
  - Test: values with double quotes are escaped.
  - Test: `is_orphan` renders as `true`/`false`.
  - Test: empty input produces BOM + header only.
  - Test: encoding correctness (Cyrillic element names preserved).

## Out of Scope

- Integration tests with UI components.
- E2E tests (covered in M4-08).
- Performance/benchmark tests.
- Tests for file download mechanism (browser API).

## Preconditions

- M4-01: `generateGraphML` is implemented and exported.
- M4-02: `generateCSV` is implemented and exported.
- Test framework (Vitest) is configured from earlier milestones.

## Implementation Notes

- Use Vitest as the test runner (already configured in the project).
- For GraphML XML validation, use `DOMParser` to parse the output and query with standard DOM methods.
- Create shared test fixtures: a set of known `GraphNode[]` and `GraphEdge[]` with predictable values.
- Include edge cases: nodes with special characters (`&`, `<`, `>`), empty names, zero-degree nodes.
- For CSV, split output by newlines and commas, verify cell values match input.

## Files and Artifacts Expected to Change

| Path                              | Change   |
|-----------------------------------|----------|
| `tests/export/graphml.test.ts`    | Create   |
| `tests/export/csv.test.ts`        | Create   |
| `tests/export/fixtures.ts`        | Create   |

## Acceptance Criteria

- [ ] All GraphML tests pass.
- [ ] All CSV tests pass.
- [ ] `npm run test` passes with no failures.
- [ ] Export module coverage > 70% (lines and branches).
- [ ] All prior tests from M1–M3 still pass (no regressions).

## Required Tests

### Functional

- `npm run test` completes successfully.
- GraphML tests cover: structure, node count, edge count, attributes, escaping, empty input.
- CSV tests cover: BOM, header, row count, quoting, escaping, boolean rendering, empty input.

### Smoke

- Test suite runs without hanging or timing out.
- Importing test fixtures does not cause errors.

### Regression

- All prior unit tests (M1-05, M2-03, M3 tests) still pass.
- No changes to source files break existing functionality.

## Handoff to Next Issue

Export generators are tested and verified. M4-04 can safely integrate them into UI buttons knowing the underlying functions produce correct output. M4-06 can include these tests in the CI pipeline.

## Done Definition

- All acceptance criteria checked.
- All tests pass via `npm run test`.
- Coverage threshold met for export module.
- No regressions in prior test suites.
