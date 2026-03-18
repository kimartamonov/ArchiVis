# M3-05: Add Cross-Screen Transitions

## Metadata

| Field                | Value                                             |
|----------------------|---------------------------------------------------|
| **Issue ID**         | M3-05                                             |
| **Type**             | UI                                                |
| **Status**           | Proposed                                          |
| **Milestone**        | M3 — Quality Assessment                           |
| **Capability Slice** | S-3 ("Оцениваю качество модели")                  |
| **Priority**         | P0                                                |
| **Sequence Order**   | 5                                                 |
| **Depends On**       | M3-04 (Screen Navigation)                         |
| **Unlocks**          | M3-06                                             |
| **FR References**    | FR-4.5, FR-2.9                                    |
| **AC References**    | —                                                 |
| **Decision Refs**    | —                                                 |
| **Demo Refs**        | —                                                 |
| **Risk Refs**        | —                                                 |

## Goal

Wire up all cross-screen navigation paths so that clicking an element in any context (table row, coverage orphan, graph node, element card button) navigates to the appropriate screen with that element pre-selected, creating a seamless analytical workflow.

## Why Now

M3-04 provides the navigation infrastructure (sidebar), but individual screens need explicit wiring to transition between each other with context (selected element). Without this, users would have to manually navigate and re-select elements, breaking the analytical flow.

## User / System Outcome

A user clicks a row in Table View and lands on Impact Analyzer with that element already selected and analyzed. They click an orphan in Coverage and see its element card. They click "Analyze Impact" on a graph node's popup and arrive at Impact Analyzer. Every transition carries the selected element, eliminating redundant clicks.

## Scope

- **Table View → Impact Analyzer**: clicking a table row selects the element and navigates to Impact Analyzer.
- **Coverage → Impact Analyzer / Element Card**: clicking an orphan in the orphan list selects it and navigates to element detail.
- **Graph Node → Impact Analyzer**: the "Analyze Impact" button in the Element Info popup (M1-09) navigates to Impact Analyzer with the node selected.
- **Element Card → Impact Analyzer**: any "Analyze Impact" action in element detail views.
- All transitions follow the same pattern: `analysisStore.selectElement(elementId)` + `uiStore.setScreen(targetScreen)`.
- Ensure the selected element state is correctly displayed on the target screen after transition.

## Out of Scope

- Back navigation / navigation history stack.
- Transition animations or visual effects.
- URL-based deep linking for transitions.
- Keyboard shortcuts for navigation.

## Preconditions

- M3-04: Sidebar navigation and `uiStore.setScreen` are operational.
- M1-09: Element Info popup exists with an "Analyze Impact" button (or slot for one).
- `analysisStore.selectElement` action is implemented.

## Implementation Notes

- Create a shared utility function or hook: `useNavigateToElement(elementId: string, screen: ScreenId)` that encapsulates the `selectElement + setScreen` pattern.
- Update Table View row click handler (M3-01) to use this utility.
- Update Coverage orphan click handler (M3-03) to use this utility.
- Update Element Info popup "Analyze Impact" button (M1-09) to use this utility.
- Verify that each target screen reads `analysisStore.selectedElement` on mount/update and renders accordingly.
- Guard against edge cases: what if `selectedElement` is null on Impact Analyzer? Show a prompt to select an element.

## Files and Artifacts Expected to Change

| Path                                                  | Change   |
|-------------------------------------------------------|----------|
| `src/ui/hooks/useNavigateToElement.ts`                | Create   |
| `src/ui/screens/TableView/TableView.tsx`              | Modify   |
| `src/ui/screens/CoverageView/OrphanList.tsx`          | Modify   |
| `src/ui/screens/GlobalGraph/ElementInfoPopup.tsx`     | Modify   |

## Acceptance Criteria

- [ ] Clicking a Table View row navigates to Impact Analyzer with that element selected and displayed.
- [ ] Clicking an orphan in Coverage screen navigates to element card / Impact Analyzer with that orphan selected.
- [ ] Clicking "Analyze Impact" on a graph node's Element Info popup navigates to Impact Analyzer with that node selected.
- [ ] The selected element is correctly displayed on the target screen after every transition.
- [ ] All transition paths use a consistent mechanism (`analysisStore.selectElement` + `uiStore.setScreen`).

## Required Tests

### Functional

- Table row click: verify `analysisStore.selectedElement` is set to the clicked element's ID and `uiStore.activeScreen` changes to `'impact'`.
- Coverage orphan click: verify element is selected and screen transitions.
- Graph popup "Analyze Impact" click: verify element is selected and screen transitions.
- Target screen renders the correct element data after transition.

### Smoke

- Performing all three transition types in sequence does not crash the application.
- Transitioning back and forth between screens preserves correct element selection.

### Navigation

- Selected element state is preserved correctly when transitioning from each source screen.
- If no element is selected on Impact Analyzer, a fallback message is shown (not a crash).

### Regression

- Direct sidebar navigation (M3-04) still works independently of cross-screen transitions.
- All screens render correctly when navigated to directly (without a pre-selected element).

## Handoff to Next Issue

All cross-screen navigation paths are wired. Users can flow between Table View, Coverage, Graph, and Impact Analyzer seamlessly. M3-06 will validate the complete S-3 demo flow end-to-end.

## Done Definition

- All acceptance criteria checked.
- Code compiles without errors.
- Tests pass.
- `useNavigateToElement` hook (or equivalent) exported and used by all transition points.
- Every cross-screen transition path verified manually on demo dataset.
