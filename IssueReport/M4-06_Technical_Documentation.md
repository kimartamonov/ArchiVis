# M4-06 Technical Documentation

## Purpose

Automated CI pipeline via GitHub Actions that validates every code change with lint, tests, and build before merge.

## Workflow File

`.github/workflows/ci.yml`

## Triggers

- `push` to `main` branch
- `pull_request` targeting `main` branch

## Pipeline Steps

```
checkout → setup-node (20, npm cache) → npm ci → lint → test → build
```

## Concurrency

Uses `concurrency.group: ci-${{ github.ref }}` with `cancel-in-progress: true` to avoid wasting CI minutes on superseded pushes.

## What It Validates

| Check | Exit on failure |
|-------|----------------|
| ESLint (0 errors) | Yes |
| Vitest (281 unit + validation tests) | Yes |
| TypeScript compilation + Vite build | Yes |

## Limitations

- Single job, single OS (ubuntu-latest), single Node version (20)
- No coverage enforcement in CI
- No E2E tests (M4-08 scope)
- No artifact upload

## Integration Points

- M4-07 README can reference CI badge: `![CI](https://github.com/kimartamonov/ArchiVis/actions/workflows/ci.yml/badge.svg)`
- M4-08 E2E test can extend the pipeline
