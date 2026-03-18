# M1-09: Add Node Click → Element Info Popup

## Metadata

| Field                | Value                                         |
|----------------------|-----------------------------------------------|
| **Issue ID**         | M1-09                                         |
| **Type**             | UI                                            |
| **Status**           | Proposed                                      |
| **Milestone**        | M1 — Model Visualization                      |
| **Capability Slice** | S-1 ("Вижу модель как граф")                  |
| **Priority**         | P0                                            |
| **Sequence Order**   | 9                                             |
| **Depends On**       | M1-08 (Global Graph View)                     |
| **Unlocks**          | M1-10 (Validation), M2-05 (Impact Analyzer wiring) |
| **FR References**    | FR-2.8, FR-2.9                                |
| **AC References**    | —                                             |
| **Decision Refs**    | —                                             |
| **Demo Refs**        | S-1 step 5                                    |
| **Risk Refs**        | —                                             |

## Goal

When a user clicks a node in the Global Graph View, show an Element Info popup (card/panel) displaying the element's name, type, layer, degree metrics, and diagram count. Include an "Analyze Impact" button that will be wired to the Impact Analyzer in M2.

## Why Now

Node inspection completes the S-1 slice: the user can not only see the graph but also drill into any element's details. This is the final interactive feature needed before M1 validation.

## User / System Outcome

A user clicks any node in the graph and immediately sees a clear summary of that element: what it is, where it sits in the architecture, and how connected it is. The "Analyze Impact" button signals that deeper analysis is available (wired in M2-05).

## Scope

- `src/ui/components/ElementCard/ElementCard.tsx` — the popup/panel component.
- `src/ui/components/ElementCard/index.ts` — barrel export.
- Displayed information:
  - Element name.
  - Element type (e.g., "ApplicationComponent", "BusinessProcess").
  - ArchiMate layer (e.g., "Application", "Business").
  - In-degree, out-degree, total degree.
  - Diagrams count.
  - Orphan indicator (if `isOrphan` is true).
- "Analyze Impact" button (disabled or shows tooltip "Coming in M2" until wired).
- Close mechanism: click X button, click outside, or click another node (updates popup).

## Out of Scope

- Full Impact Analyzer screen (M2).
- Element editing or modification.
- Detailed relationship list (which elements connect to this one).
- Metrics beyond degree and diagram count.

## Preconditions

- M1-08: Global Graph View renders with `onNodeClick` handler hookable.
- `graphStore` contains the `AnalysisGraph` with populated metrics (from M1-03 + M1-04).

## Implementation Notes

- Add `onNodeClick` handler to `<ReactFlow>` in `GlobalGraphView`.
- On click: `analysisStore.selectElement(node.id)`.
- `ElementCard` reads `analysisStore.selectedElementId`, looks up the node in `graphStore.graph.nodes`.
- Render as an overlay card (absolute positioned over the graph) or a side panel.
- Overlay approach is simpler for M1; side panel can be introduced later.
- Clicking a different node updates the card (no close + reopen needed).
- Clicking the canvas (not a node) or the X button clears `analysisStore.selectedElementId` → hides the card.

## Files and Artifacts Expected to Change

| Path                                               | Change   |
|----------------------------------------------------|----------|
| `src/ui/components/ElementCard/ElementCard.tsx`    | Create   |
| `src/ui/components/ElementCard/index.ts`           | Create   |
| `src/ui/screens/GlobalGraph/GlobalGraphView.tsx`   | Update (add onNodeClick handler, render ElementCard) |
| `src/stores/analysisStore.ts`                      | Update (if selectElement needs adjustment) |

## Acceptance Criteria

- [ ] Clicking a node → Element Info popup appears.
- [ ] Popup displays the correct element name.
- [ ] Popup displays the correct element type.
- [ ] Popup displays the correct ArchiMate layer.
- [ ] Popup displays correct in-degree, out-degree, and total degree.
- [ ] Popup displays correct diagrams count.
- [ ] Orphan elements show an orphan indicator.
- [ ] "Analyze Impact" button is present (functionality deferred to M2-05).
- [ ] Clicking X or canvas closes the popup.
- [ ] Clicking a different node updates the popup with new element data.
- [ ] Multiple rapid clicks do not crash the UI.

## Required Tests

### Functional

- Click node → popup renders with correct element name, type, layer.
- Click node → popup shows correct degree values (verified against known test data).
- Click different node → popup updates.
- Click canvas → popup closes.

### Smoke

- Rapid clicks on multiple nodes do not crash.
- Popup renders without layout overflow or clipping.

### Regression

- Graph zoom and pan still work when popup is visible.
- Graph interaction (drag, scroll) is not blocked by the popup overlay.

## Handoff to Next Issue

Element info is accessible for any node. Users can inspect connectivity at a glance. The "Analyze Impact" button is a placeholder ready for M2-05 to wire navigation to the Impact Analyzer screen. M1-10 validation can now execute the full S-1 demo flow.

## Done Definition

- All acceptance criteria checked.
- Code compiles without errors.
- Tests pass.
- Popup is visually functional (styling polish not required at this stage).
- ElementCard component exported and reusable.
