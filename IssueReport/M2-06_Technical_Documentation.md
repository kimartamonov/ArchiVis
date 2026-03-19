# M2-06 Technical Documentation

## Purpose

Interactive depth switcher for the Impact Analyzer screen. Allows stakeholders to explore blast radii at 1, 2, or 3 hops without page reload.

## Architecture

### Component

```
src/ui/screens/ImpactAnalyzer/DepthSwitcher.tsx
```

Button group with 3 buttons. Active button has accent background. Reads/writes `analysisStore.depth`.

### Reactive Data Flow

```
User clicks depth button
    ↓
analysisStore.setDepth(newDepth)
    ↓
ImpactAnalyzerScreen useEffect detects depth change
    ↓
buildImpactResult(graph, model, elementId, newDepth)
    ↓
analysisStore.setImpactResult(result)
    ↓
All child components (AffectedList, LayerSummary, AffectedDiagrams) re-render
```

No page reload. Pure React state update → re-render.

### Accessibility

- `role="group"` with `aria-label="Analysis depth"`
- Each button has `aria-pressed={depth === d}`

## Integration Points

- **analysisStore:** reads `depth`, writes via `setDepth`
- **ImpactAnalyzerScreen:** subscribes to `depth`, re-runs analysis
- **M2-07 (Impact Highlighting):** will read `depth` to determine which nodes to highlight on graph
