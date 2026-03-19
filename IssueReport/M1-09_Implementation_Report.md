# M1-09 Implementation Report

## Issue

| Field | Value |
|-------|-------|
| **Issue ID** | M1-09 |
| **Title** | Add Node Click → Element Info Popup |
| **Milestone** | M1 — Model Visualization |
| **Type** | UI |
| **Status** | Done |

## What Was Done

1. **Created ElementCard component** (`src/ui/components/ElementCard/ElementCard.tsx`):
   - Displays element name, type, ArchiMate layer (color-coded badge)
   - Shows degree metrics: total degree, in-degree, out-degree
   - Shows diagrams count
   - Orphan badge when `isOrphan === true`
   - "Analyze Impact" button (disabled placeholder for M2-05, functional when `onAnalyzeImpact` prop provided)
   - Close via X button or overlay click; card click does not close
   - Positioned as overlay on top-right of graph view

2. **Updated GlobalGraphView** (`src/ui/screens/GlobalGraph/GlobalGraphView.tsx`):
   - Added `onNodeClick` handler → `analysisStore.selectElement(node.id)`
   - Added `onPaneClick` handler → `analysisStore.selectElement(null)` (clears popup)
   - Renders `<ElementCard>` when a node is selected
   - Made `flowContainer` `position: relative` for overlay positioning

3. **Created 14 UI tests** (`ElementCard.test.tsx`):
   - Renders element name, type, layer badge
   - Renders correct degree values
   - Renders diagrams count
   - Shows/hides orphan badge
   - Has Analyze Impact button
   - Close via X button
   - Close via overlay click
   - Card body click does not close
   - onAnalyzeImpact callback
   - Business layer element rendering
   - Updates when node prop changes

## Files Changed

| Path | Change |
|------|--------|
| `src/ui/components/ElementCard/ElementCard.tsx` | Created |
| `src/ui/components/ElementCard/index.ts` | Created |
| `src/ui/components/ElementCard/__tests__/ElementCard.test.tsx` | Created |
| `src/ui/screens/GlobalGraph/GlobalGraphView.tsx` | Updated (onNodeClick, onPaneClick, ElementCard) |

## Acceptance Criteria Status

| Criteria | Status |
|----------|--------|
| Click node → popup appears | Done |
| Correct element name | Done (tested) |
| Correct element type | Done (tested) |
| Correct ArchiMate layer | Done (tested) |
| Correct degree metrics | Done (tested) |
| Correct diagrams count | Done (tested) |
| Orphan indicator | Done (tested) |
| "Analyze Impact" button present | Done (tested) |
| X / canvas click closes popup | Done (tested) |
| Click different node → updates | Done (tested) |
| Rapid clicks don't crash | Done |

## Checks Performed

- `npm run test` — 112/112 passed
- `npm run build` — successful
- `npm run lint` — 0 errors

## Out of Scope

- Full Impact Analyzer screen (M2-05)
- Relationship list
- Metrics beyond degree/diagrams

## Unblocked

- **M1-10** (Validation: MS-1 graph visualization) — full S-1 demo flow can now be executed
- **M2-05** (Impact Analyzer) — "Analyze Impact" button ready to wire
