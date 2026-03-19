# M1-08 Implementation Report

## Issue

| Field | Value |
|-------|-------|
| **Issue ID** | M1-08 |
| **Title** | Build Global Graph View |
| **Milestone** | M1 — Model Visualization |
| **Type** | UI |
| **Status** | Done |

## What Was Done

1. **Created GlobalGraphView component** (`src/ui/screens/GlobalGraph/GlobalGraphView.tsx`):
   - Reads `modelStore.currentModel` on mount, runs `buildGraph` + `calculateMetrics`, stores in `graphStore`
   - Renders `<ReactFlow>` with `fitView`, zoom/pan, `<Controls>`, `<MiniMap>`, dot background
   - Toolbar with "Back to Connection" button and node/edge count stats
   - Empty state (no model loaded) with back navigation
   - Loading state while elkjs layout runs

2. **Created useGraphLayout hook** (`src/ui/screens/GlobalGraph/useGraphLayout.ts`):
   - Converts `AnalysisGraph` to React Flow nodes/edges
   - Runs elkjs layered layout asynchronously
   - Node width estimated from label length
   - Cancellation via ref-based ID tracking
   - Loading state derived from graph/result comparison (lint-compliant)

3. **Created nodeStyles** (`src/ui/screens/GlobalGraph/nodeStyles.ts`):
   - `colorForType(type)` — maps ArchiMate element type to layer colour
   - `colorForLayer(layer)` — direct layer-to-colour lookup
   - 8 ArchiMate layer colours: Strategy (pink), Business (yellow), Application (cyan), Technology (green), Physical (dark green), Motivation (purple), Implementation (salmon), Other (gray)

4. **Updated App.tsx** — replaced graph placeholder with `<GlobalGraphView />`

5. **Updated index.css** — removed `max-width: 1126px` and `text-align: center` from `#root` for full-width graph

6. **Installed dependencies**: `@xyflow/react`, `elkjs`

7. **Created 14 tests** across 2 test files:
   - `nodeStyles.test.ts` (9 tests): colour mapping for all 8 layers + unknown
   - `useGraphLayout.test.ts` (5 tests): node/edge count, non-zero positions, layer colours, empty graph, performance (<5s)

## Files Changed

| Path | Change |
|------|--------|
| `src/ui/screens/GlobalGraph/GlobalGraphView.tsx` | Created |
| `src/ui/screens/GlobalGraph/useGraphLayout.ts` | Created |
| `src/ui/screens/GlobalGraph/nodeStyles.ts` | Created |
| `src/ui/screens/GlobalGraph/index.ts` | Created |
| `src/ui/screens/GlobalGraph/__tests__/nodeStyles.test.ts` | Created |
| `src/ui/screens/GlobalGraph/__tests__/useGraphLayout.test.ts` | Created |
| `src/App.tsx` | Updated (graph route) |
| `src/index.css` | Updated (full-width root) |
| `package.json` | Updated (@xyflow/react, elkjs) |
| `package-lock.json` | Updated |

## Acceptance Criteria Status

| Criteria | Status |
|----------|--------|
| All elements visible as nodes | Done (102 nodes from demo) |
| All relationships visible as edges | Done (160 edges from demo) |
| Nodes colored by ArchiMate layer | Done (8 layer colours) |
| Zoom in/out works | Done (scroll + Controls) |
| Pan works | Done (click-drag) |
| fitView on initial render | Done |
| MiniMap visible | Done |
| Layout renders in <5s for 200 elements | Done (tested) |
| Demo dataset renders correctly | Done (tested) |
| No crash or freeze | Done |

## Checks Performed

- `npm run test` — 98/98 passed
- `npm run build` — successful
- `npm run lint` — 0 errors

## Out of Scope

- Layer/type filters
- Search
- Node click popup (M1-09)
- Impact highlighting (M2-07)
- Edge labels

## Risks

- R2 (large graph performance): elkjs layered layout completes in well under 5s for 200 nodes. Bundle size is 1.8MB due to React Flow + elkjs — can be addressed with code splitting in M4-06.

## Unblocked

- **M1-09** (Node Click Popup) — `onNodeClick` handler can be added to existing `<ReactFlow>`
- **M2-07** (Impact Subgraph Highlighting) — overlay can modify node/edge styles
