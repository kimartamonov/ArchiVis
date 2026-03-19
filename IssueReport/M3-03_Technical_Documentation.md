# M3-03 Technical Documentation

## Purpose

Coverage screen displaying model quality metrics: orphan statistics, orphan list, and layer distribution.

## Architecture

```
src/ui/screens/CoverageView/
├── CoverageView.tsx        # Main screen (stats + panels)
├── OrphanList.tsx           # Orphan elements table
├── LayerDistribution.tsx    # Horizontal bar chart
├── index.ts
└── __tests__/
    └── CoverageView.test.tsx
```

### Layout

```
┌──────────────────────────────────────────┐
│ [← Graph]   Coverage Report              │
├──────────────────────────────────────────┤
│ [Total: 102] [Orphans: 12 11.8%] [Refs:0] [Layers:7] │
├─────────────────────┬────────────────────┤
│ OrphanList          │ LayerDistribution  │
│  name | type | layer│  Application ████  │
│  (clickable rows)   │  Business    ██    │
│                     │  Technology  ██    │
└─────────────────────┴────────────────────┘
```

### Data Flow

```
graphStore.graph → useMemo → buildCoverageReport(graph) → CoverageReport
    ↓
StatCards + OrphanList + LayerDistribution
```

### OrphanList

- Simple HTML table (no TanStack needed for small lists)
- Columns: Name, Type, Layer (color badge)
- Click row → `analysisStore.selectElement(id)` + `setScreen('impact')`

### LayerDistribution

- CSS horizontal bars: `width: (count / maxCount) * 100%`
- Color dot + layer name + bar + count (percentage)
- No charting library needed

## Integration Points

- **M3-04 (Navigation):** CoverageView accessible from sidebar
- **M3-06 (Validation):** Verifies orphan count matches expected
