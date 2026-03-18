# M4-06: Setup GitHub Actions CI

## Metadata

| Field                | Value                                                          |
|----------------------|----------------------------------------------------------------|
| **Issue ID**         | M4-06                                                          |
| **Type**             | Infra                                                          |
| **Status**           | Proposed                                                       |
| **Milestone**        | M4 — Export and Release                                        |
| **Capability Slice** | S-4 (Release preparation)                                      |
| **Priority**         | P0                                                             |
| **Sequence Order**   | 6                                                              |
| **Depends On**       | M1-05 (Graph Engine Tests), M2-03 (Impact Tests), M4-03 (Export Tests) |
| **Unlocks**          | M4-07 (README and Documentation)                               |
| **FR References**    | —                                                              |
| **AC References**    | —                                                              |
| **Decision Refs**    | —                                                              |
| **Demo Refs**        | —                                                              |
| **Risk Refs**        | R6 (bus factor 1)                                              |

## Goal

Configure GitHub Actions to run automated CI on every push to `main` and on pull requests: lint, unit tests, and production build. This provides an automated quality gate and mitigates bus-factor risk by ensuring the project is always in a verifiable state.

## Why Now

All unit tests across M1–M4 are in place. Without CI, test results depend on individual developers remembering to run them locally. CI is essential for release readiness and directly mitigates risk R6 (bus factor 1) by making the project self-verifying. It must be in place before final documentation and release.

## User / System Outcome

Every push to `main` and every pull request automatically triggers lint, test, and build checks. A green badge on the repository signals project health. Contributors can verify their changes pass all checks without manual coordination.

## Scope

- `.github/workflows/ci.yml`:
  - Trigger: `push` to `main`, `pull_request` to `main`.
  - Job: `build-and-test` on `ubuntu-latest`.
  - Steps:
    1. `actions/checkout@v4`
    2. `actions/setup-node@v4` with Node.js 20.x.
    3. Cache `node_modules` using `actions/cache@v4` with `package-lock.json` hash.
    4. `npm ci`
    5. `npm run lint`
    6. `npm run test`
    7. `npm run build`
  - Timeout: 10 minutes.
- Add CI status badge to README (placeholder until M4-07 writes the full README).

## Out of Scope

- Continuous Deployment (CD) / automatic deploy.
- Coverage reporting or coverage threshold enforcement in CI.
- E2E tests in CI (covered separately in M4-08).
- Artifact upload (build output).
- Multi-OS or multi-Node-version matrix.

## Preconditions

- M1-05: Graph engine unit tests exist and pass.
- M2-03: Impact analysis tests exist and pass.
- M4-03: Export unit tests exist and pass.
- `npm run lint`, `npm run test`, and `npm run build` all work locally.
- Repository is hosted on GitHub.

## Implementation Notes

- Use Node.js 20.x (LTS) as the runtime version.
- Cache strategy: cache `~/.npm` or `node_modules` keyed on `package-lock.json` hash.
- Keep the workflow simple: single job, sequential steps. No need for parallel jobs at this scale.
- If lint or tests fail, the workflow should fail and block PR merge.
- Consider adding `concurrency` group to cancel in-progress runs on new pushes to the same branch.

## Files and Artifacts Expected to Change

| Path                             | Change   |
|----------------------------------|----------|
| `.github/workflows/ci.yml`      | Create   |

## Acceptance Criteria

- [ ] CI workflow file exists at `.github/workflows/ci.yml`.
- [ ] Push to `main` triggers the CI workflow.
- [ ] Pull request to `main` triggers the CI workflow.
- [ ] `npm run lint` step passes in CI.
- [ ] `npm run test` step passes in CI.
- [ ] `npm run build` step passes in CI.
- [ ] Failed lint or tests cause the workflow to fail (red status).
- [ ] Workflow completes in under 5 minutes.

## Required Tests

### Functional

- Push a commit to `main` → CI workflow triggers and completes green.
- Open a PR → CI workflow triggers and completes green.
- Introduce a deliberate lint error → CI fails (verify, then revert).

### Smoke

- Workflow YAML is valid (no syntax errors on GitHub).
- Cache step does not cause failures on first run (cache miss is OK).

### Regression

- Local development workflow (`npm run dev`, `npm run test`, `npm run build`) still works unchanged.
- No new dependencies or scripts required locally.

## Handoff to Next Issue

CI is operational and green. All subsequent pushes are automatically validated. M4-07 (README) can reference the CI badge. M4-08 (E2E) can later extend the CI pipeline. The project has an automated quality gate.

## Done Definition

- All acceptance criteria checked.
- CI workflow runs and passes on current `main`.
- Green check visible on GitHub.
- No impact on local development workflow.
