# Contributing to ArchiLens

Thank you for your interest in contributing!

## Development Setup

```bash
git clone https://github.com/kimartamonov/ArchiVis.git
cd ArchiVis
npm install
npm run dev
```

## Running Tests

```bash
npm run test          # run all tests
npm run test:coverage # run with coverage report
npm run lint          # ESLint
npm run format        # Prettier auto-fix
```

## Code Style

- TypeScript strict mode
- ESLint 9 flat config (see `eslint.config.js`)
- Prettier for formatting
- No default exports (except `App`)
- Barrel exports via `index.ts` in each directory

## Pull Request Guidelines

1. Fork the repository and create a feature branch from `main`.
2. Write or update tests for your changes.
3. Ensure `npm run lint`, `npm run test`, and `npm run build` pass locally.
4. Keep PRs focused — one feature or fix per PR.
5. Write a clear PR description explaining what and why.

CI will automatically run lint, tests, and build on your PR. All checks must pass before merge.

## Project Structure

See the [README](README.md#project-structure) for an overview of the codebase layout.

## Issue Tracking

Issues are tracked in the `Issue-Tree/` directory with detailed specifications. See `IssueReleaseJournal.md` for the current project status.
