# M4-08: E2E Smoke Test

## Metadata

| Field                | Value                                             |
|----------------------|---------------------------------------------------|
| **Issue ID**         | M4-08                                             |
| **Type**             | Test                                              |
| **Status**           | Proposed                                          |
| **Milestone**        | M4 — Export and Release                           |
| **Capability Slice** | S-4 (Release preparation)                         |
| **Priority**         | P0                                                |
| **Sequence Order**   | 8                                                 |
| **Depends On**       | M4-07 (README and Documentation)                  |
| **Unlocks**          | M4-09 (Final MVP Validation)                      |
| **FR References**    | FR-1.1 – FR-7.2 (canonical scenario covers all)   |
| **AC References**    | AC-1.1 – AC-6.4 (canonical scenario covers all)   |
| **Decision Refs**    | —                                                 |
| **Demo Refs**        | SC-1 (full canonical scenario)                     |
| **Risk Refs**        | R6 (bus factor 1)                                 |

## Goal

Create an automated E2E smoke test that covers the canonical scenario (SC-1) on the demo dataset, verifying the critical path from app load through graph rendering, impact analysis, and export button availability. This serves as the final automated quality gate before MVP release.

## Why Now

All features are implemented, tested with unit tests, and validated manually. The project needs an automated E2E test that exercises the full user flow to catch integration issues that unit tests miss. This test will run in CI (M4-06) as a regression safety net and is required by the MVP Definition of Done.

## User / System Outcome

An automated test exercises the full canonical user scenario, confirming that all major features work together end-to-end. This test runs in CI on every push, providing confidence that the integrated application remains functional. Bus-factor risk (R6) is mitigated by having an automated verification of the complete user flow.

## Scope

- `tests/e2e/canonical.test.ts`:
  - Using Playwright (preferred) or Vitest browser mode.
  - Test steps (mapping to SC-1):
    1. Open app → verify Connection Screen renders.
    2. Click "Load Demo" → verify model loads successfully.
    3. Verify graph renders (canvas element present, node count > 0).
    4. Search for "Payment" element → verify search results appear.
    5. Click on a result → verify Element Info popup shows.
    6. Navigate to Impact Analyzer → verify it renders.
    7. Run impact analysis → verify affected nodes appear.
    8. Switch depth level → verify results update.
    9. Verify "Export GraphML" button exists and is enabled.
    10. Navigate to Table View → verify table renders with rows.
    11. Verify "Export CSV" button exists and is enabled.
  - Timeout: 30 seconds per test.
- `playwright.config.ts` (if using Playwright):
  - Base URL: `http://localhost:5173`.
  - Web server: `npm run dev`.
  - Single browser (Chromium).
- Update `.github/workflows/ci.yml` to include E2E step (optional, can be separate workflow).

## Out of Scope

- Full manual acceptance testing (covered in M4-09).
- Visual regression testing (screenshot comparison).
- Performance testing or load testing.
- Multi-browser testing (Chrome only for MVP).
- Testing actual file download content (browser security prevents this reliably in E2E).

## Preconditions

- M4-07: Application is stable and documented; README confirms how to run the app.
- All features from M1–M4-04 are implemented and unit-tested.
- Demo dataset is bundled and loadable.
- App starts successfully with `npm run dev`.

## Implementation Notes

- Playwright is the recommended E2E framework: mature, reliable, built-in web server management.
- Install Playwright: `npm install -D @playwright/test` and `npx playwright install chromium`.
- Use `page.waitForSelector` or `page.locator` to verify elements are present.
- For graph rendering verification, check that the React Flow canvas container exists and contains node elements.
- Do not assert on exact pixel positions or visual appearance — only structural presence.
- Keep assertions high-level: element exists, text contains expected value, button is enabled.
- If E2E in CI is too heavy for initial setup, the test can run locally with a CI step added later.

## Files and Artifacts Expected to Change

| Path                              | Change   |
|-----------------------------------|----------|
| `tests/e2e/canonical.test.ts`     | Create   |
| `playwright.config.ts`            | Create   |
| `package.json`                    | Update (add Playwright dev dependency) |
| `.github/workflows/ci.yml`       | Update (add E2E step, optional) |

## Acceptance Criteria

- [ ] E2E test file exists at `tests/e2e/canonical.test.ts`.
- [ ] Test covers SC-1 canonical scenario steps 1–9 at minimum.
- [ ] Test passes locally against the running dev server.
- [ ] Test verifies: app loads, demo loads, graph renders, search works, impact analysis works, export buttons exist.
- [ ] Test completes in under 60 seconds.
- [ ] Test runs in CI (or is documented for CI integration).

## Required Tests

### Functional

- E2E test passes locally: `npx playwright test` completes green.
- All canonical scenario steps verified.
- Test correctly fails when a critical feature is broken (sanity check).

### Smoke

- App does not crash during the E2E test run.
- No console errors during test execution (or only expected warnings).
- Test does not hang or timeout.

### Regression

- All unit tests still pass (`npm run test`).
- Dev server still starts correctly.
- No changes to application code — only test infrastructure added.

## Handoff to Next Issue

An automated E2E smoke test is in place covering the full canonical scenario. It serves as a regression safety net for M4-09 (Final Validation). CI now has both unit tests and E2E tests as quality gates. The project has automated verification of the complete user journey.

## Done Definition

- All acceptance criteria checked.
- E2E test passes locally.
- E2E test passes in CI (or CI integration documented).
- Unit tests unaffected.
- Playwright configuration committed.
