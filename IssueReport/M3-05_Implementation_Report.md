# M3-05 Implementation Report

## Issue

| Field | Value |
|-------|-------|
| **Issue ID** | M3-05 |
| **Title** | Add Cross-Screen Transitions |
| **Milestone** | M3 — Quality Assessment |
| **Type** | UI |
| **Status** | Done |

## What Was Done

1. **Created `useNavigateToElement` hook** (`src/ui/hooks/useNavigateToElement.ts`):
   - Encapsulates `analysisStore.selectElement(id) + uiStore.setScreen(target)`
   - Shared by all transition points

2. **Wired "Analyze Impact" button on ElementCard** in GlobalGraphView:
   - `onAnalyzeImpact={(id) => navigateToElement(id, 'impact')}`
   - Was previously a disabled placeholder — now functional

3. **Standardized Table View** row click to use `useNavigateToElement`

4. **Standardized Coverage View** orphan click to use `useNavigateToElement`

## Transition Paths Implemented

| From | Action | To |
|------|--------|----|
| Table View | Click row | Impact Analyzer (element selected) |
| Coverage | Click orphan | Impact Analyzer (element selected) |
| Graph → ElementCard | Click "Analyze Impact" | Impact Analyzer (element selected) |
| Search Bar (any screen) | Select result | Impact Analyzer (element selected) |

## Files Changed

| Path | Change |
|------|--------|
| `src/ui/hooks/useNavigateToElement.ts` | Created |
| `src/ui/screens/GlobalGraph/GlobalGraphView.tsx` | Updated (onAnalyzeImpact wired) |
| `src/ui/screens/TableView/TableView.tsx` | Updated (use hook) |
| `src/ui/screens/CoverageView/CoverageView.tsx` | Updated (use hook) |

## Acceptance Criteria Status

| Criteria | Status |
|----------|--------|
| Table row → Impact Analyzer | Done (was working, now standardized) |
| Coverage orphan → Impact Analyzer | Done (was working, now standardized) |
| Graph "Analyze Impact" → Impact | Done (newly wired) |
| Selected element displayed on target | Done (Impact Analyzer reads from store) |
| Consistent mechanism | Done (all use useNavigateToElement) |

## Checks Performed

- `npm run test` — 191/191 passed
- `npm run build` — successful
- `npm run lint` — 0 errors

## Unblocked

- **M3-06** (Validation)
