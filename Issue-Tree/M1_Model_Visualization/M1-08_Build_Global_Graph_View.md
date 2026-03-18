# M1-08: Build Global Graph View

## Metadata

| Field                | Value                                                          |
|----------------------|----------------------------------------------------------------|
| **Issue ID**         | M1-08                                                          |
| **Type**             | UI                                                             |
| **Status**           | Proposed                                                       |
| **Milestone**        | M1 — Model Visualization                                       |
| **Capability Slice** | S-1 ("Вижу модель как граф")                                   |
| **Priority**         | P0                                                             |
| **Sequence Order**   | 8                                                              |
| **Depends On**       | M1-03 (Graph Engine), M1-06 (Zustand Stores), M1-07 (Connection Screen) |
| **Unlocks**          | M1-09 (Node Click Popup), M2-07 (Impact Overlay on Graph)      |
| **FR References**    | FR-2.1, FR-2.2, FR-2.3, FR-2.6, FR-2.7                       |
| **AC References**    | AC-2.1, AC-2.2, AC-2.5                                        |
| **Decision Refs**    | D-3 (React Flow), D-11 (elkjs preferred)                      |
| **Demo Refs**        | S-1 steps 3–4                                                 |
| **Risk Refs**        | R2 (large graph performance)                                   |

## Goal

Display the loaded ArchiMate model as an interactive graph using React Flow with elkjs automatic layout and ArchiMate layer color coding. This is the primary visualization screen of ArchiLens.

## Why Now

The graph view is the core value proposition of ArchiLens — "see the model as a graph." All preceding M1 work (connectors, engine, stores) leads to this screen. It must exist before node interaction (M1-09) or impact overlays (M2) can be added.

## User / System Outcome

After loading a model, the user sees all elements as color-coded nodes and all relationships as edges, automatically laid out by elkjs. They can zoom, pan, and navigate the graph freely. The minimap provides orientation in large models.

## Scope

- `src/ui/screens/GlobalGraph/GlobalGraphView.tsx` — main component.
- `src/ui/screens/GlobalGraph/useGraphLayout.ts` — hook that runs elkjs layout and returns positioned React Flow nodes/edges.
- `src/ui/screens/GlobalGraph/nodeStyles.ts` — layer-to-color mapping.
- `src/ui/screens/GlobalGraph/index.ts` — barrel export.
- Functionality:
  - On mount: read `modelStore.currentModel` → run `buildGraph` + `calculateMetrics` → store in `graphStore`.
  - Convert `AnalysisGraph` nodes/edges to React Flow format.
  - Run elkjs layout to calculate node positions.
  - Render `<ReactFlow>` with `fitView`, `zoomOnScroll`, `panOnDrag`.
  - Add `<Controls>` (zoom in/out/fit) and `<MiniMap>` components.
  - Color nodes by ArchiMate layer:
    - Business → yellow (#FFFFB5)
    - Application → blue (#B5FFFF)
    - Technology → green (#B5FFB5)
    - Strategy → pink (#FFB5B5) (or as per ArchiMate spec)
    - Motivation → purple (#CCCCFF)
    - Implementation → salmon (#FFD4B5)
    - Physical → green-dark (#C9E7CB)
    - Other/Unknown → gray (#E0E0E0)

## Out of Scope

- Layer/type filters (future milestone).
- Search (future milestone).
- Node click popup (M1-09 — this issue only renders the graph).
- Impact highlighting / overlays (M2).
- Edge labels or relationship type styling.

## Preconditions

- M1-03: `buildGraph` and `calculateMetrics` available.
- M1-06: `graphStore`, `modelStore`, `uiStore` created.
- M1-07: Connection screen loads data into `modelStore`.
- React Flow and elkjs installed as dependencies (from M0 scaffold).

## Implementation Notes

- **Graph conversion:** For each `GraphNode` → React Flow node: `{ id, data: { label: element.name, element, metrics }, position: { x: 0, y: 0 }, style: { background: layerColor } }`. For each `GraphEdge` → React Flow edge: `{ id, source, target, type: 'default' }`.
- **elkjs layout:** Use `ELK` from `elkjs/lib/elk.bundled.js`. Create elk graph with nodes (width/height estimated from label length) and edges. Run `elk.layout()`. Map resulting positions back to React Flow nodes.
- **Performance (R2):** elkjs runs in a Web Worker by default. For 200 nodes, layout should complete in < 3 seconds. Set a loading indicator while layout runs. If performance is an issue, consider: reducing node size, simplifying edge routing, or using `elk.layered` algorithm options.
- **Responsive:** ReactFlow container should fill available screen space.

## Files and Artifacts Expected to Change

| Path                                               | Change   |
|----------------------------------------------------|----------|
| `src/ui/screens/GlobalGraph/GlobalGraphView.tsx`   | Create   |
| `src/ui/screens/GlobalGraph/useGraphLayout.ts`     | Create   |
| `src/ui/screens/GlobalGraph/nodeStyles.ts`         | Create   |
| `src/ui/screens/GlobalGraph/index.ts`              | Create   |
| `src/stores/graphStore.ts`                         | Update (populate rfNodes/rfEdges) |
| `src/App.tsx` (or router config)                   | Update (add graph screen route)   |

## Acceptance Criteria

- [ ] All elements from the loaded model are visible as nodes.
- [ ] All valid relationships are visible as edges.
- [ ] Nodes are colored by ArchiMate layer (visually distinguishable).
- [ ] Zoom in/out works (scroll wheel and controls).
- [ ] Pan works (click and drag on canvas).
- [ ] `fitView` positions the graph to fill the viewport on initial render.
- [ ] MiniMap is visible and reflects the current viewport.
- [ ] Layout renders within 5 seconds for a 200-element model.
- [ ] Demo dataset renders correctly with expected node/edge count.
- [ ] No UI crash or freeze on render.

## Required Tests

### Functional

- Graph renders with correct node count matching model element count.
- Graph renders with correct edge count matching valid relationship count.
- Node colors correspond to their ArchiMate layer.
- Layout produces non-overlapping node positions (basic check: not all nodes at 0,0).

### Smoke

- Demo dataset: load → graph appears without crash.
- Empty model: renders empty canvas without crash.

### Performance

- 200-node demo dataset renders (including layout) in < 5 seconds.

### Regression

- Connection flow still works end-to-end.
- Stores still function correctly.

## Handoff to Next Issue

The graph is visible and interactive. M1-09 can add an `onNodeClick` handler to show the Element Info popup. M2-07 can overlay impact highlighting on the existing graph. Filter and search features can modify `rfNodes`/`rfEdges` to show/hide elements.

## Done Definition

- All acceptance criteria checked.
- Code compiles without errors.
- Tests pass.
- Graph view is visually functional with layer colors and interactive controls.
- Screen exported and routed in the app.
