# M2-05 Technical Documentation

## Purpose

Impact Analyzer screen — the primary deliverable of S-2. Shows complete impact analysis for a selected element: source card, affected list, layer summary, affected diagrams.

## Architecture

```
src/ui/screens/ImpactAnalyzer/
├── ImpactAnalyzerScreen.tsx  # Main screen (layout + data orchestration)
├── SourceCard.tsx            # Element summary with metrics
├── AffectedList.tsx          # Affected elements grouped by distance
├── LayerSummary.tsx          # Per-layer breakdown
├── AffectedDiagrams.tsx      # Source element's diagrams
├── index.ts                  # Barrel export
└── __tests__/
    └── ImpactAnalyzerScreen.test.tsx
```

### Data Flow

```
analysisStore.selectedElementId + depth
    ↓ useEffect
buildImpactResult(graph, model, elementId, depth)
    ↓
ImpactResult { affectedElements, affectedLayers, affectedDiagrams }
    ↓
SourceCard + AffectedList + LayerSummary + AffectedDiagrams
```

### Screen Layout

```
┌────────────────────────────────────────────┐
│ [← Graph]  [Search Bar]         Depth: 1   │
├──────────────────────┬─────────────────────┤
│ SourceCard           │ LayerSummary        │
│  name, type, layer   │  layer + count      │
│  degree metrics      │                     │
│  affected count      │ AffectedDiagrams    │
│                      │  diagram names      │
│ AffectedList         │                     │
│  1-hop (N)           │                     │
│    element items     │                     │
│  2-hop (N)           │                     │
│    element items     │                     │
└──────────────────────┴─────────────────────┘
```

### States

| State | Rendered |
|-------|----------|
| No graph/model | Prompt + SearchBar |
| No element selected | Prompt + SearchBar |
| Element selected, no affected | SourceCard + "No affected elements" |
| Element selected, with affected | Full layout |

## Integration Points

- **M2-06 (Depth Switcher):** Will replace static "Depth: N" label with interactive switcher
- **M2-07 (Impact Highlighting):** Will overlay impact data on graph view
- **SearchBar:** Embedded in toolbar for in-screen element search
- **analysisStore:** reads `selectedElementId`, `depth`, `impactResult`; writes `impactResult`
