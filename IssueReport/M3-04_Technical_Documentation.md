# M3-04 Technical Documentation

## Purpose

Persistent sidebar navigation enabling users to switch between all application screens without losing state.

## Architecture

```
src/ui/layout/
├── AppLayout.tsx   # Flex wrapper: Sidebar + main content
├── Sidebar.tsx     # Navigation component
└── index.ts
```

### Layout

```
┌──────────┬───────────────────────────────┐
│ Sidebar  │ Active Screen Content         │
│ 160px    │ (flex: 1)                     │
│          │                               │
│ ArchiLens│                               │
│ ─────── │                               │
│ Connection                               │
│ Graph    │                               │
│ Impact   │                               │
│ Table    │                               │
│ Coverage │                               │
└──────────┴───────────────────────────────┘
```

### Navigation State

- Driven by `uiStore.activeScreen`
- Click nav item → `setScreen(id)`
- Active item: `aria-current="page"`, accent color, left border

### Model-Dependent Screens

Graph, Impact, Table, Coverage require a loaded model (`graphStore.graph !== null`). When no model is loaded, these items are disabled.

### State Preservation

Screens are conditionally rendered (switch/case in `ActiveScreenContent`). State lives in Zustand stores, so switching screens does not lose data. Re-mounting a screen re-reads from stores.

## Integration Points

- **All screens:** Sidebar is visible on all screens via `AppLayout`
- **M3-05 (Cross-Screen Transitions):** Navigation infrastructure for row-click → Impact
