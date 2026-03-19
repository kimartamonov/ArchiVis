# M4-08 Technical Documentation

## Purpose

Automated E2E smoke test covering the full canonical scenario (SC-1) using Playwright. Final automated quality gate before MVP release.

## Technology

- **Playwright** with Chromium browser (headless)
- Dev server auto-started via `webServer` config
- Port 5199 (configurable in `playwright.config.ts`)

## Test Structure

Single test file: `tests/e2e/canonical.test.ts`

The test exercises the complete user journey:
1. Connection Screen → Load Demo
2. Graph View → sidebar navigation
3. Table View → verify rows + Export CSV
4. Table row click → Impact Analyzer → Export GraphML
5. Coverage → orphan stats
6. Back to Graph

## Running

```bash
npm run test:e2e          # Playwright E2E
npm run test              # Vitest unit tests (separate)
```

## Configuration

`playwright.config.ts`:
- Single project: Chromium
- Timeout: 30s per test
- Web server: `npx vite --port 5199`, auto-starts and waits

## CI Integration

The E2E test can be added to `.github/workflows/ci.yml` with:
```yaml
- name: Install Playwright
  run: npx playwright install chromium --with-deps
- name: E2E Test
  run: npm run test:e2e
```

Currently documented for manual CI integration to avoid browser install overhead in every CI run.

## Selector Strategy

- Sidebar actions scoped to `getByRole('navigation', { name: 'Main navigation' })` to avoid duplicates
- `{ exact: true }` for text matching where stat cards duplicate heading text
- `.react-flow` class for graph rendering verification
