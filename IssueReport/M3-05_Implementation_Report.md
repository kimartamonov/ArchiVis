# M3-05 Implementation Report

## Issue

| Field | Value |
|-------|-------|
| **Issue ID** | M3-05 |
| **Title** | Add Cross-Screen Transitions |
| **Milestone** | M3 — Quality Assessment |
| **Status** | Done |

## What Was Done

Created a shared `useNavigateToElement` hook and wired all cross-screen navigation paths:

1. **Created `useNavigateToElement` hook** — encapsulates the `selectElement(id) + setScreen(target)` pattern used by all cross-screen transitions.
2. **Wired Graph → Impact Analyzer** — `ElementCard`'s "Analyze Impact" button in `GlobalGraphView` now navigates to Impact Analyzer with the node pre-selected (previously disabled).
3. **Refactored Table View → Impact Analyzer** — row click handler now uses the shared hook.
4. **Refactored Coverage → Impact Analyzer** — orphan click handler now uses the shared hook.

## Files Changed

| Path | Change |
|------|--------|
| `src/ui/hooks/useNavigateToElement.ts` | Created — shared navigation hook |
| `src/ui/hooks/index.ts` | Created — barrel export |
| `src/ui/hooks/__tests__/useNavigateToElement.test.tsx` | Created — 7 tests |
| `src/ui/screens/TableView/TableView.tsx` | Modified — uses `useNavigateToElement` |
| `src/ui/screens/CoverageView/CoverageView.tsx` | Modified — uses `useNavigateToElement` |
| `src/ui/screens/GlobalGraph/GlobalGraphView.tsx` | Modified — passes `onAnalyzeImpact` to `ElementCard` |

## Acceptance Criteria

- [x] Clicking a Table View row navigates to Impact Analyzer with that element selected and displayed.
- [x] Clicking an orphan in Coverage screen navigates to Impact Analyzer with that orphan selected.
- [x] Clicking "Analyze Impact" on a graph node's Element Info popup navigates to Impact Analyzer with that node selected.
- [x] The selected element is correctly displayed on the target screen after every transition.
- [x] All transition paths use a consistent mechanism (`useNavigateToElement` → `analysisStore.selectElement` + `uiStore.setScreen`).

## Checks Performed

- `npx vitest run` — **198/198 tests passed** (191 existing + 7 new)
- `npm run build` — successful, 0 errors
- `npm run lint` — 0 errors (1 pre-existing warning unrelated to changes)
- `npx tsc --noEmit` — 0 type errors

## Out of Scope

- Back navigation / navigation history stack
- Transition animations
- URL-based deep linking
- Keyboard shortcuts for navigation

## Risks

None identified.

## Unlocked

- **M3-06** — Validation: MS-3 Coverage and Table scenario. All navigation paths are now wired for E2E validation.
