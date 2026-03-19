# M2-07 Technical Documentation

## Purpose

Visual impact highlighting on the Global Graph. When impact analysis is active, affected nodes/edges are emphasized and non-affected elements are dimmed.

## Architecture

```
src/ui/screens/GlobalGraph/applyHighlighting.ts
```

### Functions

```ts
applyNodeHighlighting(nodes, highlightIds, sourceId) → RFNode[]
applyEdgeHighlighting(edges, highlightIds, sourceId) → RFEdge[]
```

Both are pure functions — they return new styled arrays without mutating input.

### Visual Treatment

| Element | Style |
|---------|-------|
| Source node | 3px solid #aa3bff border, box-shadow glow, opacity 1 |
| Affected node | 2px solid #aa3bff border, opacity 1 |
| Non-affected node | opacity 0.2 |
| Edge (both endpoints affected) | opacity 1, strokeWidth 2 |
| Edge (any endpoint not affected) | opacity 0.1 |
| No analysis active | All elements rendered normally |

### Integration in GlobalGraphView

```
analysisStore.impactResult
    ↓ useMemo
highlightIds = Set(affectedElements.map(e => e.id))
    ↓ useMemo
nodes = applyNodeHighlighting(rawNodes, highlightIds, sourceId)
edges = applyEdgeHighlighting(rawEdges, highlightIds, sourceId)
    ↓
<ReactFlow nodes={nodes} edges={edges} />
```

### Clearing

ImpactAnalyzerScreen "← Graph" button calls `setImpactResult(null)` before `setScreen('graph')`, which clears `highlightIds` → normal rendering.

## Performance

- `applyNodeHighlighting` and `applyEdgeHighlighting` are O(n) — simple map over arrays
- Wrapped in `useMemo` — only re-runs when `rawNodes`, `highlightIds`, or `sourceId` change
- For 200 nodes: < 1ms

## Integration Points

- **M2-08 (Validation):** Full S-2 flow includes graph highlighting verification
- **M2-06 (Depth Switcher):** Depth change → new `impactResult` → new `highlightIds` → highlighting updates
