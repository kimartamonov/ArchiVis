# M3-06: Validation: MS-3 Coverage and Table

## Metadata

| Field                | Value                                             |
|----------------------|---------------------------------------------------|
| **Issue ID**         | M3-06                                             |
| **Type**             | Validation                                        |
| **Status**           | Proposed                                          |
| **Milestone**        | M3 — Quality Assessment                           |
| **Capability Slice** | S-3 ("Оцениваю качество модели")                  |
| **Priority**         | P0                                                |
| **Sequence Order**   | 6                                                 |
| **Depends On**       | M3-01, M3-02, M3-03, M3-04, M3-05                |
| **Unlocks**          | M4-02                                             |
| **FR References**    | FR-4.1–FR-4.5, FR-5.1–FR-5.3, FR-6.4             |
| **AC References**    | AC-4.1, AC-4.2, AC-4.3, AC-5.3                    |
| **Decision Refs**    | —                                                 |
| **Demo Refs**        | S-3 demo steps 1–6                                |
| **Risk Refs**        | —                                                 |

## Goal

Execute the complete S-3 ("Оцениваю качество модели") demo flow on the demo dataset, verifying that Table View, Coverage Report, Coverage Screen, screen navigation, and cross-screen transitions all work together as a cohesive slice.

## Why Now

All M3 components have been built individually (M3-01 through M3-05). This validation issue confirms they integrate correctly and the full user journey works end-to-end before declaring M3 complete and moving to M4.

## User / System Outcome

The S-3 demo can be performed without errors on the demo dataset. An architect can navigate to Table View, sort and filter elements, switch to Coverage to see orphan statistics, click an orphan to drill into it, and navigate freely between all screens — validating the quality assessment workflow.

## Scope

Full S-3 demo execution:

1. **Navigate to Table View** → all elements displayed with sortable/filterable columns.
2. **Sort by degree (descending)** → highest-degree hub element appears at the top.
3. **Filter by "Technology" layer** → only Technology-layer elements shown.
4. **Navigate to Coverage screen** → header shows total elements, orphan count, orphan percentage.
5. **Verify orphan statistics** → "11 orphan elements (11.6 %)" on demo dataset.
6. **Click an orphan element** → navigates to element card / Impact Analyzer with that element selected.

Additionally verify:
- AC-4.1: Coverage report computes correctly.
- AC-4.2: Orphan identification matches expected counts.
- AC-4.3: Orphan elements are clickable and navigable.
- AC-5.3: Screen navigation works between all screens.
- Sidebar navigation between all screens (Connection, Global Graph, Impact Analyzer, Table View, Coverage).
- No blocker bugs across the full flow.

## Out of Scope

- Performance benchmarking (covered by individual issue tests).
- Automated end-to-end test creation (can be added in a future testing issue).
- Bug fixes for non-blocker issues (file as separate issues).

## Preconditions

- M3-01 through M3-05 all marked as Done.
- Demo dataset loads successfully (M1 prerequisite).
- All M1 and M2 screens operational.

## Implementation Notes

- This is a manual validation issue — no new code is written.
- Follow the S-3 demo script step by step.
- Document any deviations, bugs, or unexpected behavior.
- If blocker bugs are found, file them as hotfix issues and block M3 completion until resolved.
- Capture screenshots or screen recordings of the demo flow as evidence.

## Files and Artifacts Expected to Change

| Path                                    | Change   |
|-----------------------------------------|----------|
| No code changes expected                | —        |
| Validation report / checklist           | Create   |

## Acceptance Criteria

- [ ] S-3 demo step 1: Table View renders all elements with correct columns.
- [ ] S-3 demo step 2: Sorting by degree (desc) shows hub element first.
- [ ] S-3 demo step 3: Filtering by "Technology" shows only Technology elements.
- [ ] S-3 demo step 4: Coverage screen displays total, orphan count, orphan percent.
- [ ] S-3 demo step 5: Demo dataset shows "11 orphan elements (11.6 %)".
- [ ] S-3 demo step 6: Clicking an orphan navigates to element card with correct data.
- [ ] AC-4.1: Coverage report data is accurate.
- [ ] AC-4.2: Orphan detection matches expected results.
- [ ] AC-4.3: Orphan elements are interactive (clickable, navigable).
- [ ] AC-5.3: All screens accessible via sidebar navigation.
- [ ] No blocker bugs encountered during the full demo flow.

## Required Tests

### Functional

- Execute all 6 S-3 demo steps in sequence — all pass.
- Navigate to each screen via sidebar and verify it renders correctly.
- Perform cross-screen transitions: Table → Impact, Coverage → Impact, Graph → Impact.

### Smoke

- Load demo dataset, rapidly switch between all 5 screens — no crashes.
- Perform 3 full demo flow cycles back-to-back — stable behavior.

### Regression

- M1 validation: graph renders, nodes clickable, Element Info popup works.
- M2 validation: Impact Analyzer still functions correctly.
- Connection Screen: load demo dataset flow still works from scratch.

## Handoff to Next Issue

M3 is validated and complete. Table View and Coverage data are stable and available for M4 features. Specifically, M4-02 (CSV Export) can access the table data and coverage report for export functionality.

## Done Definition

- All acceptance criteria checked.
- All 6 S-3 demo steps pass on demo dataset.
- AC-4.1, AC-4.2, AC-4.3, AC-5.3 verified.
- No blocker bugs remain.
- M1 and M2 regression checks pass.
- M3 milestone marked complete.
