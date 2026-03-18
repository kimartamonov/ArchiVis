# M2-06: Add Depth Switcher

## Metadata

| Field                | Value                                             |
|----------------------|---------------------------------------------------|
| **Issue ID**         | M2-06                                             |
| **Type**             | UI                                                |
| **Status**           | Proposed                                          |
| **Milestone**        | M2 — Impact Analysis                              |
| **Capability Slice** | S-2 ("Анализирую impact изменения")               |
| **Priority**         | P0                                                |
| **Sequence Order**   | 6                                                 |
| **Depends On**       | M2-05 (Impact Analyzer Screen)                    |
| **Unlocks**          | M2-07 (Impact Subgraph Highlighting)              |
| **FR References**    | FR-3.4                                            |
| **AC References**    | AC-3.7                                            |
| **Decision Refs**    | —                                                 |
| **Demo Refs**        | SC-1 step 9                                       |
| **Risk Refs**        | —                                                 |

## Goal

Add a depth switcher control (1/2/3) to the Impact Analyzer screen that live-updates all impact results without a full page reload when the user changes the analysis depth.

## Why Now

The Impact Analyzer screen (M2-05) currently runs analysis at a fixed depth of 1. The depth switcher is critical for the S-2 demo flow (step 9: "switch to depth 2") and for stakeholders to explore different blast radii interactively. It is also required before graph highlighting (M2-07), which must respond to depth changes.

## User / System Outcome

A stakeholder viewing impact analysis can click depth 1, 2, or 3 and see the affected elements list, layer summary, and affected diagrams update instantly. Switching from depth 1 to depth 2 reveals a wider blast radius; depth 3 reveals the widest. No page reload or navigation occurs.

## Scope

- `src/ui/screens/ImpactAnalyzer/DepthSwitcher.tsx` — toggle/button group component for depth 1/2/3.
- Integrate into `ImpactAnalyzerScreen.tsx`.
- `analysisStore` extended with `depth` state and `setDepth(depth: 1 | 2 | 3)` action.
- `useEffect` in the Impact Analyzer screen re-runs `buildImpactResult` when `depth` changes.
- All dependent panels (AffectedList, LayerSummary, AffectedDiagrams) update reactively.

## Out of Scope

- Custom depth values beyond 1/2/3.
- Animation or transition effects between depth changes.
- Depth persistence across sessions.

## Preconditions

- M2-05: Impact Analyzer screen renders and displays results at a fixed depth.
- `buildImpactResult` accepts `depth` parameter and returns correct results for any depth 1/2/3.

## Implementation Notes

- **DepthSwitcher component**: a button group or segmented control with three options: "1", "2", "3". Active depth is visually highlighted.
- On click: call `analysisStore.setDepth(newDepth)`.
- In `ImpactAnalyzerScreen`, subscribe to `analysisStore.depth`. Use a `useEffect` hook that re-runs `buildImpactResult(graph, selectedElementId, depth)` whenever `depth` or `selectedElementId` changes.
- Store the `ImpactResult` in local state or in `analysisStore`. All child components read from this result, so they update automatically.
- Default depth on initial load: 1.
- No full page reload — only React state update triggers re-render.

## Files and Artifacts Expected to Change

| Path                                                      | Change   |
|-----------------------------------------------------------|----------|
| `src/ui/screens/ImpactAnalyzer/DepthSwitcher.tsx`         | Create   |
| `src/ui/screens/ImpactAnalyzer/ImpactAnalyzerScreen.tsx`  | Modify   |
| `src/stores/analysisStore.ts`                             | Modify   |

## Acceptance Criteria

- [ ] Depth switcher displays three options: 1, 2, 3.
- [ ] Default depth on screen load is 1.
- [ ] Switching to depth 2 updates affected elements list, layer summary, and affected diagrams without page reload.
- [ ] Switching to depth 3 further expands results.
- [ ] Switching back to depth 1 reduces results to direct neighbors only.
- [ ] Active depth is visually indicated on the switcher.
- [ ] No flicker, loading spinner is acceptable for large graphs.

## Required Tests

### Functional

- Switching depth 1 → 2 → 3 shows increasing number of affected elements.
- Switching depth 3 → 1 shows reduced affected elements.
- Layer summary counts update correctly with depth change.

### Smoke

- Rapid depth switching (clicking 1-2-3-1-2-3 quickly) does not crash or produce stale results.

### Regression

- Impact analysis results at depth 1 are unchanged from M2-05.
- Element card metrics remain correct regardless of depth.

## Handoff to Next Issue

Depth switching is functional. The Impact Analyzer now supports variable-depth analysis. M2-07 (Impact Subgraph Highlighting) can read the current depth and affected elements to highlight the correct subgraph on the Global Graph, and highlighting will update when depth changes.

## Done Definition

- All acceptance criteria checked.
- Code compiles without errors.
- Depth switcher integrated into Impact Analyzer screen.
- Tests pass.
