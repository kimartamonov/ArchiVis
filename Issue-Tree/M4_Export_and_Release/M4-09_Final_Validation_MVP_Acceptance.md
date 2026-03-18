# M4-09: Final Validation: Complete MVP Acceptance

## Metadata

| Field                | Value                                             |
|----------------------|---------------------------------------------------|
| **Issue ID**         | M4-09                                             |
| **Type**             | Validation                                        |
| **Status**           | Proposed                                          |
| **Milestone**        | M4 — Export and Release                           |
| **Capability Slice** | All slices (S-1 through S-4)                      |
| **Priority**         | P0                                                |
| **Sequence Order**   | 9                                                 |
| **Depends On**       | M4-01 – M4-08 (all prior M4 issues)              |
| **Unlocks**          | Release v0.1.0                                    |
| **FR References**    | FR-1.1 – FR-8.6 (all P0 FRs)                     |
| **AC References**    | AC-1.1 – AC-6.4 (all AC groups)                   |
| **Decision Refs**    | D-7 (MIT license)                                 |
| **Demo Refs**        | SC-1 through SC-5 (all scenarios)                  |
| **Risk Refs**        | R6 (bus factor 1)                                 |

## Goal

Perform comprehensive validation of the entire MVP against all acceptance criteria, demo scenarios, and the Definition of Done. Confirm that ArchiLens is ready for public release as v0.1.0.

## Why Now

All implementation issues (M1–M4-08) are complete. This is the final gate before release. Every capability slice, acceptance criterion, and demo scenario must be verified in a single pass to confirm MVP completeness. Skipping this validation risks releasing with undetected integration issues or unmet requirements.

## User / System Outcome

The ArchiLens MVP is confirmed as complete and ready for public release. All acceptance criteria pass. All demo scenarios work. CI is green. Documentation is in place. Known issues are documented. The project can be tagged as v0.1.0 and published.

## Scope

### Demo Scenario Verification

Run through ALL demo scenarios on the demo dataset:
- **SC-1** (Canonical): Full flow from load → graph → search → impact analysis → depth change → export GraphML → export CSV.
- **SC-2** through **SC-5**: Any additional scenarios defined in doc 04.

### Acceptance Criteria Verification

Verify all AC groups:
- **AC-1** (Model Loading): Demo dataset loads, elements and relationships parsed correctly.
- **AC-2** (Graph Visualization): Graph renders, nodes colored by layer, zoom/pan works, click shows info.
- **AC-3** (Impact Analysis): Affected nodes computed correctly, depth levels work, results update.
- **AC-4** (Quality Metrics): Table view shows metrics, orphan detection works, sorting/filtering functional.
- **AC-5** (Search): Element search works, results are relevant, click navigates.
- **AC-6** (Export): GraphML opens in yEd, CSV opens in Excel, correct encoding.

### Definition of Done Checklist

- [ ] All P0 functional requirements implemented.
- [ ] All acceptance criteria pass.
- [ ] No blocker defects.
- [ ] Demo dataset works end-to-end.
- [ ] README enables < 5 min onboarding.
- [ ] GraphML validated in yEd.
- [ ] CSV validated in Excel.
- [ ] CI green (lint + tests + build).
- [ ] E2E smoke test passes.
- [ ] MIT license file present.
- [ ] Known issues documented.

### Known Issues Documentation

- Document any non-blocker issues found during validation.
- Categorize as P1/P2 for post-MVP backlog.
- Confirm none are blockers for release.

## Out of Scope

- Fixing non-blocker bugs (file as issues for post-MVP).
- Performance optimization beyond the 5-second budget.
- Cross-browser testing beyond Chrome.
- Security audit.

## Preconditions

- M4-01 through M4-08: All prior M4 issues complete and verified.
- CI pipeline green.
- E2E test passing.
- README and documentation in place.
- yEd and Excel/LibreOffice available for export validation.

## Implementation Notes

- Create a validation checklist document and check off each item.
- Run through each demo scenario manually, following the exact steps from doc 04.
- For each AC group, verify every individual criterion.
- If a blocker is found, stop validation, file a bugfix issue, fix it, and restart validation.
- Capture evidence: screenshots of key validation steps.
- Document known issues with severity and mitigation.
- After all checks pass, the project is ready to be tagged `v0.1.0`.

## Files and Artifacts Expected to Change

| Path                                      | Change   |
|-------------------------------------------|----------|
| `docs/validation/mvp-acceptance.md`       | Create   |
| `docs/validation/known-issues.md`         | Create   |
| No application code changes expected      | —        |

## Acceptance Criteria

- [ ] All demo scenarios (SC-1 through SC-5) pass end-to-end.
- [ ] All AC groups (AC-1 through AC-6) verified and passing.
- [ ] E2E smoke test green.
- [ ] CI pipeline green.
- [ ] No blocker bugs remain.
- [ ] README confirmed working (fresh clone → running app in < 5 min).
- [ ] GraphML confirmed opening in yEd.
- [ ] CSV confirmed opening in Excel with correct encoding.
- [ ] MIT license file present and correct.
- [ ] Known issues documented with severity classification.
- [ ] Definition of Done checklist fully satisfied.

## Required Tests

### Functional

- All demo scenarios complete successfully.
- All acceptance criteria verified.
- E2E test passes: `npx playwright test`.
- Unit tests pass: `npm run test`.
- Build succeeds: `npm run build`.

### Smoke

- Full application stability: navigate through all views without crash.
- Repeated demo flow execution (3 times) produces consistent results.
- App recovers gracefully from edge cases (empty search, etc.).

### Regression

- All unit tests from M1–M4 still pass.
- E2E test still passes.
- CI is green.
- Export files still open correctly in target applications.

### Manual

- Visual review of graph rendering.
- Visual review of export files in yEd and Excel.
- Walkthrough of README steps on a clean environment.
- Review of screenshots/GIF in README on GitHub.

## Handoff to Next Issue

MVP is validated and complete. All quality gates are passed. The project is ready for:
- Git tag: `v0.1.0`.
- GitHub Release creation with release notes.
- Public announcement / deployment.
- Post-MVP backlog triage of known issues.

## Done Definition

- All acceptance criteria in this issue are checked.
- All Definition of Done items satisfied.
- Validation results documented.
- Known issues documented and confirmed as non-blockers.
- Project is tagged `v0.1.0` or ready to be tagged.
- Release can proceed without further blocking work.
