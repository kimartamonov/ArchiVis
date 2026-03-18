# M2-08: Validation: MS-2 Canonical Impact Scenario

## Metadata

| Field                | Value                                             |
|----------------------|---------------------------------------------------|
| **Issue ID**         | M2-08                                             |
| **Type**             | Validation                                        |
| **Status**           | Proposed                                          |
| **Milestone**        | M2 — Impact Analysis                              |
| **Capability Slice** | S-2 ("Анализирую impact изменения")               |
| **Priority**         | P0                                                |
| **Sequence Order**   | 8                                                 |
| **Depends On**       | M2-01, M2-02, M2-03, M2-04, M2-05, M2-06, M2-07 |
| **Unlocks**          | M4-01 (Export)                                    |
| **FR References**    | FR-3.1 – FR-3.8, FR-6.1 – FR-6.3                |
| **AC References**    | AC-3.1 – AC-3.9, AC-5.1                          |
| **Decision Refs**    | D-12 (manual BFS preferred)                       |
| **Demo Refs**        | SC-1 steps 5–12, S-2 demo steps 1–7              |
| **Risk Refs**        | R2 (large graph performance), R3 (metrics perceived as magic) |

## Goal

Validate the complete S-2 capability slice by executing the canonical impact analysis scenario end-to-end on the demo dataset. Verify that all acceptance criteria (AC-3.1 through AC-3.9, AC-5.1) are met and that no blocker bugs remain.

## Why Now

All M2 implementation issues (M2-01 through M2-07) are complete. Before declaring M2 done and unblocking downstream milestones (M4 Export), the full user flow must be validated against the expected demo scenario. This is the milestone gate.

## User / System Outcome

The complete S-2 demo flow is executed successfully on the demo dataset. A stakeholder can search for an element, view its impact at multiple depths, see layer breakdowns and affected diagrams, and observe the impact highlighted on the global graph. All expected values match. The milestone is validated and stable.

## Scope

Execute and verify the following canonical scenario on the demo dataset:

1. **Search**: Type "Payment" in the global search bar.
2. **Select**: Select "Payment Gateway" from the dropdown.
3. **Element Card**: Impact Analyzer screen shows element card with correct name, type, layer, degree metrics, diagrams count.
4. **Affected Elements (depth 1)**: Affected elements list shows direct neighbors.
5. **Depth Switch**: Switch to depth 2 — results update live, affected count increases.
6. **Known Value Check**: "Core Banking Platform" at depth 2 returns 28 affected elements.
7. **Layer Summary**: Layer summary shows per-layer counts that sum to total affected.
8. **Affected Diagrams**: Affected diagrams list shows diagrams containing the source element.
9. **Graph Highlighting**: Global Graph highlights affected subgraph; non-affected nodes dimmed.
10. **Depth 3**: Switch to depth 3 — highlighting updates, results expand further.
11. **Return to Depth 1**: Results contract back to direct neighbors only.

Verify acceptance criteria:
- AC-3.1: Impact analysis screen accessible with element selected.
- AC-3.2: Depth 1 shows direct neighbors.
- AC-3.3: Depth 2 includes 2-hop elements.
- AC-3.4: Depth 3 includes 3-hop elements.
- AC-3.5: Layer summary is correct.
- AC-3.6: Affected diagrams are listed.
- AC-3.7: Depth switcher updates results live.
- AC-3.8: No duplicates in results.
- AC-3.9: Performance < 1 second.
- AC-5.1: Search finds elements by name.

## Out of Scope

- Automated E2E test framework setup (manual validation is sufficient for this gate).
- Testing with non-demo datasets.
- Performance testing beyond the 1-second budget on demo data.

## Preconditions

- M2-01 through M2-07 are all complete and their individual acceptance criteria met.
- Demo dataset is loaded and accessible.
- All unit tests from M2-03 pass.

## Implementation Notes

- This is a manual validation issue. The deliverable is a validation report (checklist), not code.
- Execute each step of the canonical scenario. Record pass/fail for each step and each AC.
- If any step fails, file a bug and block M2 completion until resolved.
- Optionally, record a screen capture of the demo flow for documentation.
- Verify that all M1 features (connection, graph rendering, node click) still work (regression check).

## Files and Artifacts Expected to Change

| Path                                                      | Change   |
|-----------------------------------------------------------|----------|
| `Issue-Tree/M2_Impact_Analysis/validation-report.md`      | Create   |

## Acceptance Criteria

- [ ] All 11 canonical scenario steps pass without errors.
- [ ] AC-3.1 through AC-3.9 verified and documented.
- [ ] AC-5.1 verified and documented.
- [ ] "Core Banking Platform" at depth 2 returns 28 affected elements.
- [ ] No blocker bugs found (or all found bugs resolved before sign-off).
- [ ] Impact analysis performance < 1 second on demo dataset.
- [ ] M1 features still work (regression check passed).

## Required Tests

### Functional

- Full S-2 demo flow executed successfully (manual).
- Each acceptance criterion individually verified.

### Smoke

- All screens render without errors.
- No console errors during the demo flow.

### Regression

- M1 features: connection screen, graph rendering, node click popup all still work.
- M1 unit tests still pass.
- M2 unit tests (M2-03) all pass.

### Performance

- Impact analysis at depth 1, 2, 3 each complete in < 1 second on demo dataset.

## Handoff to Next Issue

M2 milestone is validated and complete. Impact analysis is stable and delivers correct results. M4-01 (Export) can use `ImpactResult` data to generate export artifacts. Downstream milestones can depend on the impact analysis engine and UI.

## Done Definition

- All acceptance criteria checked.
- Validation report created and filed.
- No blocker bugs outstanding.
- All M1 and M2 unit tests pass.
- Milestone M2 signed off as complete.
