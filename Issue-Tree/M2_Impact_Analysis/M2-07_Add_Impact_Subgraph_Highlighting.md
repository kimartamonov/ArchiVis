# M2-07: Add Impact Subgraph Highlighting

## Metadata

| Field                | Value                                             |
|----------------------|---------------------------------------------------|
| **Issue ID**         | M2-07                                             |
| **Type**             | UI                                                |
| **Status**           | Proposed                                          |
| **Milestone**        | M2 — Impact Analysis                              |
| **Capability Slice** | S-2 ("Анализирую impact изменения")               |
| **Priority**         | P0                                                |
| **Sequence Order**   | 7                                                 |
| **Depends On**       | M1-08 (Global Graph View), M2-06 (Depth Switcher) |
| **Unlocks**          | M2-08 (Validation)                                |
| **FR References**    | FR-3.7                                            |
| **AC References**    | —                                                 |
| **Decision Refs**    | —                                                 |
| **Demo Refs**        | S-2 demo step 7                                   |
| **Risk Refs**        | R2 (large graph performance)                      |

## Goal

When viewing impact analysis results, highlight the affected nodes and edges on the Global Graph. Affected elements are visually emphasized; non-affected elements are dimmed. This provides a spatial, visual understanding of impact that complements the tabular data on the Impact Analyzer screen.

## Why Now

The Impact Analyzer screen (M2-05) and depth switcher (M2-06) provide the analytical data. The graph highlighting adds the critical visual dimension that makes impact analysis intuitive — stakeholders can literally see the blast radius on the architecture map. This is also the final functional piece needed before the M2 validation (M2-08).

## User / System Outcome

A stakeholder on the Impact Analyzer screen sees the Global Graph with the affected subgraph highlighted: affected nodes have a distinct visual treatment (e.g., highlight border, glow, or increased saturation), while non-affected nodes are dimmed (reduced opacity). Edges between affected nodes are highlighted; other edges are dimmed. When the user changes the analysis depth, the highlighting updates to match the new impact set.

## Scope

- Extend `graphStore` (or `analysisStore`) to hold `highlightedElementIds: Set<string>` derived from current impact results.
- Modify Global Graph node rendering: if `highlightedElementIds` is non-empty, apply conditional styles:
  - Affected nodes: highlight border/glow, full opacity, possibly increased border width.
  - Non-affected nodes: reduced opacity (e.g., 0.2–0.3).
  - Source element: distinct style (e.g., different border color or thicker border).
- Modify Global Graph edge rendering:
  - Edges where both source and target are in the highlighted set: highlighted (full opacity, possibly thicker).
  - Other edges: dimmed (reduced opacity).
- Highlighting clears when navigating away from Impact Analyzer or deselecting the element.
- Highlighting updates reactively when depth changes (via M2-06).

## Out of Scope

- Separate subgraph view (isolated rendering of only affected elements).
- Export of the highlighted view as an image.
- Animated transitions for highlighting changes.
- Custom highlight colors per layer.

## Preconditions

- M1-08: Global Graph View renders nodes and edges with React Flow.
- M2-06: Depth switcher updates `ImpactResult` in store, including `affectedElements` with their IDs.
- Node and edge rendering supports conditional styling (CSS classes or inline styles based on state).

## Implementation Notes

- When `ImpactResult` is computed (on element selection or depth change), extract affected element IDs into a `Set<string>` and store in `graphStore.highlightedElementIds` (or `analysisStore`).
- In the React Flow node component: check if `highlightedElementIds` is non-empty. If so, apply highlight style if node ID is in the set, or dim style otherwise. If the set is empty, render normally (no impact analysis active).
- In the React Flow edge component: same logic — highlight if both endpoints are in the set, dim otherwise.
- When leaving the Impact Analyzer screen (or deselecting element), clear `highlightedElementIds` to restore normal graph appearance.
- **Performance (R2)**: avoid re-computing styles on every render. Use memoization. The highlighted set changes only on element selection or depth change, not on every frame. For 200 nodes, style application should complete in < 1 second.

## Files and Artifacts Expected to Change

| Path                                                      | Change   |
|-----------------------------------------------------------|----------|
| `src/stores/graphStore.ts` (or `analysisStore.ts`)        | Modify   |
| `src/ui/components/Graph/CustomNode.tsx` (or equivalent)  | Modify   |
| `src/ui/components/Graph/CustomEdge.tsx` (or equivalent)  | Modify   |
| `src/ui/screens/ImpactAnalyzer/ImpactAnalyzerScreen.tsx`  | Modify   |

## Acceptance Criteria

- [ ] Affected nodes are visually distinct from non-affected nodes when impact analysis is active.
- [ ] Non-affected nodes are dimmed (reduced opacity).
- [ ] Source element has a distinct visual treatment.
- [ ] Edges between affected nodes are highlighted; other edges are dimmed.
- [ ] Highlighting updates correctly when depth changes via the depth switcher.
- [ ] Highlighting clears when navigating away from the Impact Analyzer screen.
- [ ] Graph without active impact analysis renders normally (no dimming).

## Required Tests

### Functional

- Impact analysis active: affected node IDs are stored in the highlight set.
- Depth change: highlight set updates to match new affected elements.
- Navigation away: highlight set is cleared.

### Smoke

- Highlighting on a graph with 200 nodes does not crash.
- Rapid depth switching with highlighting active does not produce visual artifacts or errors.

### Performance

- Applying highlighting to 200 nodes completes in < 1 second.
- No perceptible lag when switching depth with highlighting active.

### Regression

- Global Graph renders normally when no impact analysis is active.
- Node click still opens Element Info popup (M1-09).
- Zoom/pan still works with highlighting active.

## Handoff to Next Issue

Full visual impact analysis is now available: search, select, analyze at variable depth, and see the results highlighted on the graph. M2-08 (Validation) will verify the complete S-2 flow end-to-end.

## Done Definition

- All acceptance criteria checked.
- Code compiles without errors.
- Highlighting renders correctly on the demo dataset.
- Tests pass.
- Performance budget met.
