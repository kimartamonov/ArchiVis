# [M0-02] Setup Project Skeleton

## Metadata

- Issue ID: M0-02
- Type: Infra
- Status: Proposed
- Milestone: M0. Project Foundation
- Capability Slice: Readiness Gate (RG-1, RG-5)
- Priority: P0
- Sequence Order: 2
- Depends On:
  - none (can run in parallel with M0-01)
- Unlocks:
  - M0-03
  - M0-04
  - All subsequent issues (every issue creates files in this structure)
- Decision References:
  - D-1 (SPA -- decided)
  - D-2 (React + TypeScript -- decided)
  - D-13 (Vite -- preferred, confirmed here)
- FR References:
  - none (infrastructure, not functional)
- AC References:
  - none (infrastructure)
- Demo References:
  - none
- Risk References:
  - none

---

## Goal

Initialize a React + TypeScript + Vite project with ESLint and Prettier. Create the folder structure defined in `08_System_Context_and_Architecture.md`: `src/connectors`, `src/engine`, `src/ui`, `src/stores`, `src/export`. Confirm that dev server, linter, and build all work.

---

## Why Now

This is the foundational infrastructure issue. Every subsequent issue (M0-03 through M4-xx) creates files inside this project structure. Without a working skeleton, no code can be written. It runs in parallel with M0-01 because it has no dependency on the API spike.

---

## User/System Outcome

- **System:** A working, lintable, buildable React + TypeScript + Vite project exists with the correct folder structure.
- **Roadmap:** All subsequent issues can create files in the established structure without setup overhead. D-13 (Vite) is confirmed as decided.

---

## Scope

- Run `npm create vite@latest` with React + TypeScript template
- Configure TypeScript in strict mode (`strict: true` in tsconfig.json)
- Install and configure ESLint with TypeScript plugin
- Install and configure Prettier
- Create folder structure:
  - `src/connectors/`
  - `src/engine/`
  - `src/ui/`
  - `src/stores/`
  - `src/export/`
- Create a minimal `App.tsx` placeholder (renders project name)
- Verify: `npm run dev` starts, `npm run lint` passes, `npm run build` succeeds
- Add `.gitignore` for node_modules, dist, etc.

---

## Out of Scope

- Any business logic
- Any UI components beyond a placeholder App.tsx
- Installing domain-specific dependencies (React Flow, Zustand, TanStack Table, elkjs)
- Writing tests
- CI/CD configuration

---

## Preconditions

- Node.js v18+ installed
- Git repository initialized

---

## Implementation Notes

- Reference `08_System_Context_and_Architecture.md` for the canonical folder structure
- Use Vite's official React + TypeScript template as starting point
- TypeScript strict mode is non-negotiable per architecture decisions
- ESLint config should extend recommended TypeScript rules
- Prettier config: consistent defaults (single quotes or double quotes -- pick one, stay consistent)
- Keep package.json scripts standard: `dev`, `build`, `lint`, `preview`

---

## Files and Artifacts Expected to Change

- New: `package.json`, `tsconfig.json`, `vite.config.ts`
- New: `.eslintrc.cjs` or `eslint.config.js`
- New: `.prettierrc`
- New: `.gitignore`
- New: `src/App.tsx`, `src/main.tsx`, `src/index.css`
- New: `src/connectors/` (empty directory or .gitkeep)
- New: `src/engine/` (empty directory or .gitkeep)
- New: `src/ui/` (empty directory or .gitkeep)
- New: `src/stores/` (empty directory or .gitkeep)
- New: `src/export/` (empty directory or .gitkeep)
- New: `index.html`

---

## Acceptance Criteria for This Issue

1. `npm run dev` starts the Vite dev server without errors
2. `npm run lint` passes with zero errors
3. `npm run build` succeeds and produces a `dist/` directory
4. TypeScript strict mode is enabled in tsconfig.json
5. Folder structure matches architecture doc: `src/connectors`, `src/engine`, `src/ui`, `src/stores`, `src/export` all exist
6. ESLint and Prettier configurations are present and functional
7. App.tsx renders without errors in the browser

---

## Required Tests

### Functional checks

- `npm run dev` starts and serves the app on localhost
- `npm run lint` exits with code 0
- `npm run build` exits with code 0 and creates `dist/`
- Opening the app in a browser shows the placeholder content

### Smoke checks

- Dev server starts repeatedly (stop and restart -- no stale state issues)
- Build output is non-empty

### Regression checks

- Not applicable (first code issue, no prior functionality)

---

## Handoff to Next Issue

After M0-02 is complete:

- **What now works:** A clean React + TypeScript + Vite project with working dev server, linter, and build pipeline
- **What contract is now stable:** Folder structure (src/connectors, src/engine, src/ui, src/stores, src/export). Package scripts (dev, build, lint). TypeScript strict mode.
- **What next issue can start:** M0-03 (define domain types -- creates files in src/engine/ and src/connectors/). M0-04 (create demo dataset -- needs project context). All M1+ issues can create files in the established structure.

---

## Done Definition

- [ ] Project created with Vite + React + TypeScript
- [ ] `npm run dev` starts without errors
- [ ] `npm run lint` passes with zero errors
- [ ] `npm run build` succeeds
- [ ] TypeScript strict mode enabled
- [ ] ESLint + Prettier configured
- [ ] Folder structure: src/connectors, src/engine, src/ui, src/stores, src/export
- [ ] Placeholder App.tsx renders in browser
- [ ] All files committed to repository
- [ ] D-13 (Vite) status updated to `decided`
