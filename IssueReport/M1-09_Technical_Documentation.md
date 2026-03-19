# M1-09 Technical Documentation

## Purpose

Element Info popup shown when a user clicks a node in the Global Graph View. Displays element properties, connectivity metrics, and provides entry point to Impact Analysis.

## Architecture

### File Structure

```
src/ui/components/ElementCard/
├── ElementCard.tsx      # Popup component
├── index.ts             # Barrel export
└── __tests__/
    └── ElementCard.test.tsx
```

### Data Flow

```
User clicks node in ReactFlow
    ↓ onNodeClick handler
analysisStore.selectElement(node.id)
    ↓ Zustand subscription
GlobalGraphView re-renders
    ↓ selectedNode = graphStore.graph.nodes.get(selectedElementId)
<ElementCard node={selectedNode} onClose={…} />
```

### ElementCard Props

```ts
interface ElementCardProps {
  node: GraphNode;           // The selected node with element + metrics
  onClose: () => void;       // Called on X click or overlay click
  onAnalyzeImpact?: (id: string) => void;  // Optional — wired in M2-05
}
```

### Displayed Information

| Field | Source |
|-------|--------|
| Name | `node.element.name` |
| Type | `node.element.type` |
| Layer | `elementTypeToLayer(node.element.type)` |
| Layer colour | `colorForLayer(layer)` |
| Total degree | `node.degree` |
| In-degree | `node.inDegree` |
| Out-degree | `node.outDegree` |
| Diagrams | `node.diagramsCount` |
| Orphan | `node.isOrphan` (badge shown only when true) |

### Interaction

- **Click node:** `selectElement(node.id)` → popup appears/updates
- **Click different node:** popup updates with new element data
- **Click pane (canvas):** `selectElement(null)` → popup closes
- **Click X button:** `onClose()` → `selectElement(null)` → popup closes
- **Click overlay:** same as X button
- **Click card body:** `stopPropagation()` → popup stays open

### Positioning

Overlay positioned `absolute` within the `flowContainer` (which is `position: relative`). Card is in the top-right corner with `1rem` padding.

## Constraints

- "Analyze Impact" button is a placeholder until M2-05 wires `onAnalyzeImpact`
- No detailed relationship list (which elements connect)
- Styling is functional, not final

## Integration Points

- **M2-05 (Impact Analyzer):** Pass `onAnalyzeImpact` prop to navigate to impact screen
- **M1-10 (Validation):** Full S-1 demo flow: load → graph → click node → see info
- **analysisStore:** `selectedElementId` state shared with future impact screens
