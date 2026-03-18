# Technical Documentation: M1-03 — Graph Engine

## Purpose

The graph engine transforms a flat `NormalizedModel` (arrays of elements, relationships, diagrams) into an indexed `AnalysisGraph` with O(1) node lookups and adjacency-based traversal.

---

## Architecture

```
src/engine/
  types.ts                           ← Domain types (from M0-03)
  graph/
    buildGraph.ts                    ← NormalizedModel → AnalysisGraph
    index.ts                         ← Barrel export
    __tests__/
      buildGraph.test.ts             ← 9 unit tests
```

---

## API

```typescript
import { buildGraph } from './engine/graph';

const { graph, warnings } = buildGraph(model);

// graph.nodes: Map<string, GraphNode>     — O(1) lookup by element ID
// graph.edges: GraphEdge[]                — all valid edges
// graph.adjacencyOut: Map<string, string[]> — outgoing neighbor IDs
// graph.adjacencyIn: Map<string, string[]>  — incoming neighbor IDs
// warnings: BrokenReference[]             — skipped relationships
```

---

## Construction Algorithm

### Step 1: Build node index
For each element in `model.elements`:
- Create `GraphNode` with zeroed metrics
- Set `diagramsCount` from `element.diagramIds.length`
- Insert into `nodes` map and initialize empty adjacency arrays

### Step 2: Build edges and adjacency
For each relationship in `model.relationships`:
- Look up source and target in `nodes` map
- If either is missing → record `BrokenReference` warning, skip
- Otherwise create `GraphEdge`, update adjacency lists, increment degree counters

### Step 3: Mark orphans
Nodes with `degree === 0` are flagged `isOrphan = true`.

### Complexity
- Time: O(E + V) where E = relationships, V = elements
- Space: O(E + V) for adjacency lists and node map

---

## GraphNode Metrics (computed during construction)

| Field | Meaning |
|-------|---------|
| `degree` | Total connections (in + out) |
| `inDegree` | Incoming relationships |
| `outDegree` | Outgoing relationships |
| `diagramsCount` | Number of diagrams containing this element |
| `isOrphan` | `true` if degree === 0 |

---

## Demo Dataset Results

| Metric | Value |
|--------|-------|
| Nodes | 102 |
| Edges | 160 |
| Broken references | 0 |
| Orphans | 12 (elements with no relationships) |

---

## Limitations

- No incremental updates — graph must be rebuilt if model changes
- No edge deduplication (same source/target pair can have multiple edges with different types)
- Orphan detection is purely relationship-based (diagram membership is not considered)

---

## Integration Points

- **M1-04:** Iterate `graph.nodes.values()` for metrics aggregation
- **M1-08:** Convert `graph.nodes` → React Flow nodes, `graph.edges` → React Flow edges
- **M2-01:** BFS traversal using `graph.adjacencyOut` / `graph.adjacencyIn`
- **M3-02:** Coverage report from node metrics (orphanCount, layerDistribution)
