# M3-04: Add Screen Navigation

## Metadata

| Field                | Value                                             |
|----------------------|---------------------------------------------------|
| **Issue ID**         | M3-04                                             |
| **Type**             | UI                                                |
| **Status**           | Proposed                                          |
| **Milestone**        | M3 — Quality Assessment                           |
| **Capability Slice** | S-3 ("Оцениваю качество модели")                  |
| **Priority**         | P0                                                |
| **Sequence Order**   | 4                                                 |
| **Depends On**       | M1-07 (Connection Screen), M1-08 (Global Graph), M2-05 (Impact Analyzer), M3-01 (Table View), M3-03 (Coverage Screen) |
| **Unlocks**          | M3-05                                             |
| **FR References**    | FR-6.4                                            |
| **AC References**    | AC-5.3                                            |
| **Decision Refs**    | —                                                 |
| **Demo Refs**        | —                                                 |
| **Risk Refs**        | —                                                 |

## Goal

Add a persistent sidebar or tab navigation component that lets users switch between all main application screens without losing loaded model state.

## Why Now

With M1 and M2 delivering individual screens and M3-01/M3-03 adding Table View and Coverage, users need a unified way to navigate between them. Without explicit navigation, users cannot discover or reach all available screens.

## User / System Outcome

A user sees a sidebar (or tab bar) listing all available screens: Connection, Global Graph, Impact Analyzer, Table View, Coverage. The current screen is visually highlighted. Clicking any item switches to that screen instantly, with the loaded model and all state preserved.

## Scope

- `src/ui/layout/Sidebar.tsx` (or `TabBar.tsx`) — navigation component.
- `src/ui/layout/AppLayout.tsx` — layout wrapper that includes sidebar + content area.
- `src/ui/layout/index.ts` — barrel export.
- Navigation items: Connection, Global Graph, Impact Analyzer, Table View, Coverage.
- Active screen visually highlighted (bold, colored, or underlined).
- Navigation driven by `uiStore.activeScreen`.
- Switching screens does not unmount or reload the model — state preserved in Zustand stores.

## Out of Scope

- Breadcrumb navigation.
- Screen history / back button.
- Deep linking / URL routing (can be added later).
- Responsive / mobile layout.

## Preconditions

- M1-07: Connection Screen exists.
- M1-08: Global Graph View exists.
- M2-05: Impact Analyzer screen exists (or equivalent from M2).
- M3-01: Table View exists.
- M3-03: Coverage Screen exists.
- `uiStore` with `activeScreen` state and `setScreen` action.

## Implementation Notes

- `uiStore.activeScreen` holds the current screen identifier (e.g., `'connection' | 'graph' | 'impact' | 'table' | 'coverage'`).
- Sidebar renders a list of `NavButton` or `NavLink` components, one per screen.
- Each button calls `uiStore.setScreen(screenId)` on click.
- `AppLayout` renders the sidebar alongside a content area that conditionally renders the active screen component.
- Alternatively, use a lightweight router (e.g., wouter or react-router) with the sidebar as persistent chrome — but conditional rendering based on `uiStore` is simpler and avoids URL sync complexity.
- Screens should not be unmounted on switch if state preservation is needed; consider keeping them mounted but hidden, or relying on Zustand stores to restore state on remount.

## Files and Artifacts Expected to Change

| Path                                    | Change   |
|-----------------------------------------|----------|
| `src/ui/layout/Sidebar.tsx`             | Create   |
| `src/ui/layout/AppLayout.tsx`           | Create   |
| `src/ui/layout/index.ts`               | Create   |
| `src/stores/uiStore.ts`                | Modify   |
| `src/App.tsx`                           | Modify   |

## Acceptance Criteria

- [ ] Sidebar (or tab bar) is visible on all screens after a model is loaded.
- [ ] All five screens (Connection, Global Graph, Impact Analyzer, Table View, Coverage) are listed and navigable.
- [ ] Active screen is visually distinguished from inactive items.
- [ ] Switching screens does not lose the loaded model or analysis state.
- [ ] Switching screens is near-instant (no perceptible delay).

## Required Tests

### Functional

- Clicking each navigation item switches to the correct screen.
- Active screen indicator updates after navigation.
- Model data (graphStore) remains intact after switching between all screens.
- Analysis state (selected element) persists across screen switches.

### Smoke

- Rapid switching between all screens (10 times) does not crash the application.
- Sidebar renders correctly with all items.

### Regression

- All individual screens (Connection, Graph, Impact, Table, Coverage) still render and function correctly within the new layout.
- Element Info popup still works from the graph screen.

## Handoff to Next Issue

All screens are reachable via sidebar navigation. M3-05 will refine cross-screen transitions (e.g., clicking a table row navigates to Impact with the element pre-selected), building on the navigation infrastructure established here.

## Done Definition

- All acceptance criteria checked.
- Code compiles without errors.
- Tests pass.
- `AppLayout` with sidebar exported and used as the root layout in `App.tsx`.
- All screens accessible via navigation.
