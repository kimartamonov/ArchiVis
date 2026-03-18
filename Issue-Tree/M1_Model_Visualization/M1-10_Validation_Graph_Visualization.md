# M1-10: Validation — MS-1 Graph Visualization

## Metadata

| Field                | Value                                               |
|----------------------|-----------------------------------------------------|
| **Issue ID**         | M1-10                                               |
| **Type**             | Validation                                          |
| **Status**           | Proposed                                            |
| **Milestone**        | M1 — Model Visualization                            |
| **Capability Slice** | S-1 ("Вижу модель как граф")                        |
| **Priority**         | P0                                                  |
| **Sequence Order**   | 10                                                  |
| **Depends On**       | M1-01 through M1-09 (all preceding M1 issues)       |
| **Unlocks**          | All M2 issues (Impact Analyzer), All M3 issues (Table/Coverage) |
| **FR References**    | FR-1.1–FR-1.8, FR-2.1–FR-2.9, FR-8.1, FR-8.3–FR-8.6 |
| **AC References**    | AC-1.1, AC-1.4, AC-2.1–AC-2.5                      |
| **Decision Refs**    | —                                                   |
| **Demo Refs**        | S-1 full demo flow                                  |
| **Risk Refs**        | —                                                   |

## Goal

Validate that the complete S-1 capability slice works end-to-end on the demo dataset. This is a gate issue: M1 is not complete until this validation passes. It verifies all acceptance criteria and confirms the milestone is ready for downstream work.

## Why Now

All implementation issues (M1-01 through M1-09) are complete. Before declaring M1 done and unblocking M2/M3 work, the full user flow must be validated as a cohesive experience.

## User / System Outcome

Stakeholders have confidence that the first slice of ArchiLens works correctly. The demo flow is documented and reproducible. All acceptance criteria are verified. The foundation is stable for building Impact Analyzer (M2) and Table/Coverage views (M3).

## Scope

### S-1 Demo Flow Validation (on demo dataset)

Execute the following steps and verify each:

1. **Open app** → Connection Screen appears.
2. **Click "Load Demo Dataset"** → demo model loads without error.
3. **Graph renders** → all elements visible as nodes, all relationships as edges.
4. **Verify layer colors** → Business nodes yellow, Application nodes blue, Technology nodes green, etc.
5. **Zoom / pan** → smooth interaction, no jank or crash.
6. **Click a node** → Element Info popup appears with correct name, type, layer, degree.
7. **Click different node** → popup updates.
8. **Click canvas** → popup closes.

### Acceptance Criteria Verification

| AC ID   | Description                                    | Verification Method                |
|---------|------------------------------------------------|------------------------------------|
| AC-1.1  | User can connect to Architeezy                 | Manual test with mock/real server  |
| AC-1.4  | Demo dataset loads as offline fallback          | Demo flow step 2                   |
| AC-2.1  | All elements rendered as nodes                  | Count nodes vs. dataset elements   |
| AC-2.2  | All relationships rendered as edges             | Count edges vs. dataset relationships |
| AC-2.3  | Degree metrics calculated correctly             | Verify in Element Info popup       |
| AC-2.4  | Broken references handled gracefully            | Check warnings (no crash)          |
| AC-2.5  | Graph is zoomable and pannable                  | Demo flow step 5                   |

### Quantitative Checks

- Node count in graph == element count in demo dataset.
- Edge count in graph == valid relationship count in demo dataset.
- Layout completes in < 5 seconds.
- All unit tests pass (`npm run test`).
- Graph engine coverage > 80 %.

## Out of Scope

- Architeezy real API end-to-end testing (manual, separate, depends on available instance).
- Performance testing with models > 500 elements (deferred to performance milestone).
- Visual/pixel-perfect design review.
- Accessibility audit.

## Preconditions

- All M1 issues (M1-01 through M1-09) are complete and merged.
- Demo dataset is available and unchanged.
- Application builds and starts without errors (`npm run dev`).

## Implementation Notes

This is primarily a manual validation issue, but it should also include:
- Running `npm run test` and confirming all tests pass.
- Running `npm run build` and confirming no build errors.
- Optionally: a Playwright or Cypress smoke test that automates steps 1–8 of the demo flow.
- Document any bugs found as separate issues (tagged as blockers if they violate AC).

## Files and Artifacts Expected to Change

| Path                                    | Change   |
|-----------------------------------------|----------|
| No code changes expected                | —        |
| `docs/validation/M1-validation.md` (optional) | Create (validation report) |

## Acceptance Criteria

- [ ] All S-1 demo flow steps (1–8) pass without errors.
- [ ] AC-1.1, AC-1.4, AC-2.1–AC-2.5 verified and documented.
- [ ] Node count matches demo dataset element count.
- [ ] Edge count matches demo dataset valid relationship count.
- [ ] Layout renders within 5 seconds for demo dataset.
- [ ] All unit tests pass.
- [ ] Graph engine test coverage > 80 %.
- [ ] `npm run build` succeeds without errors.
- [ ] No blocker bugs remain open.

## Required Tests

### Functional

- Full S-1 demo flow executed manually (or via E2E test).
- Each AC verified individually.

### Smoke

- App loads (`npm run dev`) without errors.
- Demo dataset loads without crash.
- Graph renders without crash.

### Regression

- All unit tests still pass (no regressions from M1-08/M1-09 UI work).
- Stores function correctly under full flow.

## Handoff to Next Issue

M1 is complete. The graph visualization foundation is stable and validated. Downstream milestones are unblocked:
- **M2 (Impact Analyzer):** can add BFS traversal, impact overlay on graph, and the Impact Analyzer screen. The "Analyze Impact" button in ElementCard is ready to be wired.
- **M3 (Table/Coverage):** can add the element table view and coverage metrics using the existing `AnalysisGraph` and base metrics.

## Done Definition

- All acceptance criteria checked and documented.
- Validation report created (optional but recommended).
- No blocker bugs.
- M1 milestone marked as complete.
- Team sign-off on S-1 slice readiness.
