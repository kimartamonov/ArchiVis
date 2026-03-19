# M3-05 Technical Documentation

## Purpose

Cross-screen transitions allow users to navigate between Table View, Coverage, Global Graph, and Impact Analyzer while carrying the selected element context. This eliminates redundant clicks and creates a seamless analytical workflow.

## Architectural Approach

### Shared Hook Pattern

All cross-screen transitions use a single shared hook:

```ts
// src/ui/hooks/useNavigateToElement.ts
export function useNavigateToElement() {
  const selectElement = useAnalysisStore((s) => s.selectElement);
  const setScreen = useUIStore((s) => s.setScreen);

  return useCallback(
    (elementId: string, screen: ActiveScreen = 'impact') => {
      selectElement(elementId);
      setScreen(screen);
    },
    [selectElement, setScreen],
  );
}
```

This ensures:
- **Consistency** — every transition path follows the same two-step pattern.
- **Single source of truth** — if the transition logic changes, only one place needs updating.
- **Testability** — the hook can be tested in isolation and in integration.

### Transition Paths

| Source | Trigger | Target Screen | Element |
|--------|---------|---------------|---------|
| Table View | Row click | Impact Analyzer | Clicked element |
| Coverage | Orphan row click | Impact Analyzer | Clicked orphan |
| Global Graph | "Analyze Impact" button in ElementCard | Impact Analyzer | Selected node |

### Data Flow

```
User clicks → useNavigateToElement(elementId, 'impact')
                ↓
  analysisStore.selectElement(elementId)  →  selectedElementId updated
  uiStore.setScreen('impact')            →  activeScreen updated
                ↓
  App re-renders → ImpactAnalyzerScreen mounts
                ↓
  ImpactAnalyzerScreen reads selectedElementId → runs buildImpactResult → shows results
```

### Fallback Handling

Impact Analyzer already handles the case where `selectedElementId` is null — it shows a prompt: "Select an element using the search bar to analyze its impact." This ensures no crash when navigating directly via sidebar without pre-selecting an element.

## Contracts and Data Structures

No new types introduced. The hook uses existing store interfaces:

- `AnalysisState.selectElement(id: string | null)` — from `analysisStore`
- `UIState.setScreen(screen: ActiveScreen)` — from `uiStore`
- `ActiveScreen = 'connection' | 'graph' | 'impact' | 'table' | 'coverage'` — from `uiStore`

## Key Logic

The hook is intentionally minimal — it's a composition of two existing store actions. The default target screen is `'impact'` since that's the most common transition target.

## Limitations

- No navigation history — pressing browser Back doesn't undo a screen transition.
- No URL sync — transitions are state-only, not reflected in the URL.
- No animation — screen switches are instant.

## Integration Points

- **`ElementCard` component** (`src/ui/components/ElementCard/`) — now receives `onAnalyzeImpact` callback from `GlobalGraphView`, enabling the previously disabled "Analyze Impact" button.
- **`ImpactAnalyzerScreen`** — reads `analysisStore.selectedElementId` on mount/update via `useEffect`, running impact analysis automatically when an element is pre-selected.

## What Next Issue Can Rely On

M3-06 (Validation) can now execute the complete S-3 demo flow end-to-end:
- Table View → sort/filter → click row → Impact Analyzer shows element
- Coverage → click orphan → Impact Analyzer shows orphan
- Graph → click node → ElementCard → "Analyze Impact" → Impact Analyzer shows node
- Sidebar navigation works independently alongside cross-screen transitions
