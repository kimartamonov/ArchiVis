# M2-06 Implementation Report

## Issue

| Field | Value |
|-------|-------|
| **Issue ID** | M2-06 |
| **Title** | Add Depth Switcher |
| **Milestone** | M2 — Impact Analysis |
| **Type** | UI |
| **Status** | Done |

## What Was Done

1. **Created DepthSwitcher component** (`src/ui/screens/ImpactAnalyzer/DepthSwitcher.tsx`):
   - Button group with three options: 1, 2, 3
   - Active depth visually highlighted (accent color)
   - `aria-pressed` attribute for accessibility
   - Clicks update `analysisStore.setDepth()`

2. **Integrated into ImpactAnalyzerScreen** — replaced static "Depth: N" label with `<DepthSwitcher />`

3. **Live update works** — `ImpactAnalyzerScreen` already subscribes to `analysisStore.depth` via `useEffect`, so changing depth re-runs `buildImpactResult` and all panels update reactively

4. **Created 5 UI tests** (`DepthSwitcher.test.tsx`):
   - Renders 3 depth buttons
   - Default depth is 1 (aria-pressed)
   - Click depth 2 → store updated
   - Click depth 3 → 1 cycles correctly
   - Active button updates visually on re-render

## Files Changed

| Path | Change |
|------|--------|
| `src/ui/screens/ImpactAnalyzer/DepthSwitcher.tsx` | Created |
| `src/ui/screens/ImpactAnalyzer/ImpactAnalyzerScreen.tsx` | Updated (DepthSwitcher, removed static label) |
| `src/ui/screens/ImpactAnalyzer/__tests__/DepthSwitcher.test.tsx` | Created |

## Acceptance Criteria Status

| Criteria | Status |
|----------|--------|
| Three options: 1, 2, 3 | Done (tested) |
| Default depth 1 | Done (tested) |
| Depth 2 updates results without reload | Done (live via useEffect) |
| Depth 3 further expands | Done |
| Back to depth 1 reduces | Done (tested) |
| Active depth visually indicated | Done (accent color + aria-pressed) |
| No flicker | Done |

## Checks Performed

- `npm run test` — 154/154 passed
- `npm run build` — successful
- `npm run lint` — 0 errors

## Unblocked

- **M2-07** (Impact Subgraph Highlighting)
