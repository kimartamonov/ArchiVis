# M2-05: Build Impact Analyzer Screen

## Metadata

| Field                | Value                                             |
|----------------------|---------------------------------------------------|
| **Issue ID**         | M2-05                                             |
| **Type**             | UI                                                |
| **Status**           | Proposed                                          |
| **Milestone**        | M2 — Impact Analysis                              |
| **Capability Slice** | S-2 ("Анализирую impact изменения")               |
| **Priority**         | P0                                                |
| **Sequence Order**   | 5                                                 |
| **Depends On**       | M2-01 (BFS Impact Analysis), M2-02 (Layer Summary), M2-04 (Global Search Bar) |
| **Unlocks**          | M2-06 (Depth Switcher)                            |
| **FR References**    | FR-3.1, FR-3.2, FR-3.5                           |
| **AC References**    | AC-3.1                                            |
| **Decision Refs**    | —                                                 |
| **Demo Refs**        | SC-1 steps 6, 7, 8                               |
| **Risk Refs**        | R3 (metrics perceived as magic)                   |

## Goal

Build the Impact Analyzer screen that displays the full impact analysis for a selected element: element card with metrics, affected elements list grouped by distance, layer summary panel, and affected diagrams list.

## Why Now

The BFS engine (M2-01), aggregation layer (M2-02), and search bar (M2-04) are in place. This screen is the primary deliverable of S-2 — the place where stakeholders see and understand the impact of changes. Without it, the engine work has no user-facing value.

## User / System Outcome

A stakeholder selects an element (via search or click) and sees a dedicated screen showing:
- An element card with the element's name, type, layer, degree metrics (in/out/total), and the count of diagrams it appears in.
- A list of affected elements grouped by hop distance (1-hop, 2-hop, 3-hop), each showing type and layer badge.
- A layer summary panel showing how many affected elements belong to each ArchiMate layer.
- A list of affected diagrams for the source element.

This provides transparency into impact analysis results, mitigating risk R3 (metrics perceived as magic).

## Scope

- `src/ui/screens/ImpactAnalyzer/ImpactAnalyzerScreen.tsx` — main screen component.
- `src/ui/screens/ImpactAnalyzer/ElementCard.tsx` — source element summary card.
- `src/ui/screens/ImpactAnalyzer/AffectedList.tsx` — affected elements grouped by distance.
- `src/ui/screens/ImpactAnalyzer/LayerSummary.tsx` — layer breakdown panel.
- `src/ui/screens/ImpactAnalyzer/AffectedDiagrams.tsx` — diagrams list.
- `src/ui/screens/ImpactAnalyzer/index.ts` — barrel export.
- Route registration for `/impact` (or equivalent).
- Default analysis depth: 1.
- Reads selected element from `analysisStore`.
- Calls `buildImpactResult` on mount (or element change) to get full `ImpactResult`.

## Out of Scope

- Depth switcher UI (M2-06 — this screen initially uses default depth 1).
- Graph highlighting overlay (M2-07).
- Export button (M4).
- Risk card or recommendation panel (P2).

## Preconditions

- M2-01: `analyzeImpact` available.
- M2-02: `buildImpactResult` available returning `ImpactResult`.
- M2-04: `analysisStore` has a selected element.
- M1-04: Base metrics (degree in/out/total) are computed and accessible.

## Implementation Notes

- Read `selectedElementId` from `analysisStore`.
- On mount or when `selectedElementId` changes, call `buildImpactResult(graph, selectedElementId, 1)`.
- **ElementCard**: display element name, type, layer (color-coded), degree in, degree out, degree total, diagrams count. Pull degree metrics from graph engine (M1-04).
- **AffectedList**: group `impactResult.affectedElements` by `distance`. Render sections: "1-hop (direct)", "2-hop", "3-hop". Each item shows element name, type label, layer color badge.
- **LayerSummary**: render `impactResult.affectedLayers` as a list of layer name + count, using ArchiMate layer colors.
- **AffectedDiagrams**: render `impactResult.affectedDiagrams` as a simple list of diagram names.
- If no element is selected, show a prompt ("Select an element using the search bar").
- If the selected element has no affected elements, show an appropriate empty state.

## Files and Artifacts Expected to Change

| Path                                                      | Change   |
|-----------------------------------------------------------|----------|
| `src/ui/screens/ImpactAnalyzer/ImpactAnalyzerScreen.tsx`  | Create   |
| `src/ui/screens/ImpactAnalyzer/ElementCard.tsx`           | Create   |
| `src/ui/screens/ImpactAnalyzer/AffectedList.tsx`          | Create   |
| `src/ui/screens/ImpactAnalyzer/LayerSummary.tsx`          | Create   |
| `src/ui/screens/ImpactAnalyzer/AffectedDiagrams.tsx`      | Create   |
| `src/ui/screens/ImpactAnalyzer/index.ts`                  | Create   |
| `src/ui/App.tsx` (or router config)                       | Modify   |

## Acceptance Criteria

- [ ] Element card displays correct name, type, layer, degree in/out/total, and diagrams count for the selected element.
- [ ] Affected elements list matches BFS results from `buildImpactResult`.
- [ ] Affected elements are grouped by distance (1-hop, 2-hop, 3-hop sections).
- [ ] Layer summary shows correct per-layer counts matching `ImpactResult.affectedLayers`.
- [ ] Affected diagrams list shows diagrams of the source element.
- [ ] No element selected: screen shows a helpful prompt.
- [ ] Isolated node (no affected elements): empty state displayed gracefully.

## Required Tests

### Functional

- Known element selected: element card shows correct metrics.
- Known element: affected list matches expected BFS output.
- Isolated node: empty state rendered, no errors.
- Layer summary counts match expected values.

### Smoke

- Screen renders without errors when navigated to.
- Screen renders without errors when model is loaded but no element is selected.

### Regression

- Connection screen still works.
- Global graph view still renders.
- Search bar still navigates to Impact Analyzer.

## Handoff to Next Issue

The Impact Analyzer screen displays complete impact analysis at a fixed depth (1). M2-06 (Depth Switcher) will add the ability to change depth interactively. M2-07 (Impact Subgraph Highlighting) will add graph overlay.

## Done Definition

- All acceptance criteria checked.
- Code compiles without errors.
- Screen accessible via route navigation.
- Tests pass.
- Components exported from `src/ui/screens/ImpactAnalyzer/index.ts`.
