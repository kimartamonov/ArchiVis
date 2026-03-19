# M3-05 Technical Documentation

## Purpose

Cross-screen transitions — clicking an element in any context navigates to the appropriate screen with that element pre-selected.

## Hook

```ts
// src/ui/hooks/useNavigateToElement.ts
function useNavigateToElement(): (elementId: string, screen?: ActiveScreen) => void
```

Encapsulates: `analysisStore.selectElement(id)` + `uiStore.setScreen(screen)`.

## Transition Map

```
TableView row click ──→ Impact Analyzer
Coverage orphan click ──→ Impact Analyzer
Graph ElementCard "Analyze Impact" ──→ Impact Analyzer
SearchBar result click ──→ Impact Analyzer
```

All paths use `useNavigateToElement` hook for consistency.

## Integration Points

- **M3-06 (Validation):** All transitions verified in S-3 demo flow
- **All screens:** Read `analysisStore.selectedElementId` on mount to display correct element
