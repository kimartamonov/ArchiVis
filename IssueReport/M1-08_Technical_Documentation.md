# M1-08 Technical Documentation

## Purpose

Primary visualization screen: renders the ArchiMate model as an interactive, color-coded graph using React Flow with elkjs automatic layout.

## Architecture

### File Structure

```
src/ui/screens/GlobalGraph/
├── GlobalGraphView.tsx      # Main component
├── useGraphLayout.ts        # elkjs layout hook
├── nodeStyles.ts            # Layer-to-color mapping
├── index.ts                 # Barrel export
└── __tests__/
    ├── nodeStyles.test.ts
    └── useGraphLayout.test.ts
```

### Data Flow

```
modelStore.currentModel (NormalizedModel)
    ↓ useEffect
buildGraph() + calculateMetrics()
    ↓
graphStore.graph (AnalysisGraph)
    ↓ useGraphLayout hook
elkjs layout (async)
    ↓
React Flow nodes[] + edges[]
    ↓
<ReactFlow> render
```

### useGraphLayout Hook

The hook converts `AnalysisGraph` → React Flow nodes/edges:

1. For each `GraphNode`: creates an RF node with position `{x:0, y:0}`, data (label, element, metrics), and layer-colored style
2. For each `GraphEdge`: creates an RF edge with source/target IDs
3. Builds an elkjs graph with estimated node widths (`max(180, labelLen * 8 + 32)`)
4. Runs `elk.layout()` asynchronously (layered algorithm, top-down direction)
5. Maps elkjs output positions back to React Flow nodes

**Loading state** is derived (not set via `setState` in effect): `loading = result.forGraph !== graph`. This satisfies the `react-hooks/set-state-in-effect` lint rule.

**Cancellation**: a `graphIdRef` counter increments on each new graph. Layout results are discarded if the counter has changed.

### elkjs Configuration

```ts
{
  'elk.algorithm': 'layered',
  'elk.direction': 'DOWN',
  'elk.spacing.nodeNode': '50',
  'elk.layered.spacing.nodeNodeBetweenLayers': '80',
}
```

### Layer Colors

| Layer | Color | Hex |
|-------|-------|-----|
| Strategy | Pink | #FFB5B5 |
| Business | Yellow | #FFFFB5 |
| Application | Cyan | #B5FFFF |
| Technology | Green | #B5FFB5 |
| Physical | Dark green | #C9E7CB |
| Motivation | Purple | #CCCCFF |
| Implementation | Salmon | #FFD4B5 |
| Other | Gray | #E0E0E0 |

### React Flow Features

- `fitView` — auto-fits on initial render
- `<Controls>` — zoom in/out/fit buttons (bottom-left)
- `<MiniMap>` — viewport navigator with layer colors (bottom-right)
- `<Background>` — dot pattern
- Zoom range: 0.05× to 4×

## Constraints

- No `onNodeClick` handler yet — added in M1-09
- No edge labels or relationship type styling
- No filtering — all nodes/edges always visible
- Bundle includes full React Flow + elkjs (~1.8MB) — code splitting deferred to M4

## Integration Points

- **M1-09 (Node Click Popup):** Add `onNodeClick` prop to `<ReactFlow>` → read `node.data.element` → show popup
- **M2-07 (Impact Highlighting):** Modify `rfNodes` styles (border color, opacity) for affected/unaffected nodes
- **M1-06 stores:** `graphStore.graph` holds the built graph for reuse by other components
