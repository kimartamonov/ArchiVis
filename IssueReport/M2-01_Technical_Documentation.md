# M2-01 Technical Documentation

## Purpose

BFS-based impact analysis engine. Given an element and a max depth, finds all reachable elements in the architecture graph — the "blast radius" of a change.

## Architecture

### File Structure

```
src/engine/insight/
├── impactAnalysis.ts   # analyzeImpact function
├── index.ts            # Barrel export
└── __tests__/
    └── impactAnalysis.test.ts
```

### Function Signature

```ts
function analyzeImpact(
  graph: AnalysisGraph,
  elementId: string,
  maxDepth: 1 | 2 | 3,
): AffectedElement[]
```

### Algorithm

Standard level-by-level BFS:

1. Initialize `visited = Set([elementId])`, `currentLevel = [elementId]`
2. For each `depth` from 1 to `maxDepth`:
   - For each node in `currentLevel`:
     - Expand `adjacencyOut[nodeId]` + `adjacencyIn[nodeId]` (undirected)
     - For each unvisited neighbor: add to visited, add to `nextLevel`, create `AffectedElement`
   - `currentLevel = nextLevel`
   - If `nextLevel` is empty, break early
3. Return all `AffectedElement` entries (source excluded)

### Complexity

- **Time**: O(V + E) where V = nodes within depth, E = edges traversed
- **Space**: O(V) for visited set and result array
- **Performance**: < 1ms for demo (102 nodes), < 10ms for 500 nodes

### Return Type

```ts
interface AffectedElement {
  id: string;        // Element ID
  name: string;      // Element name
  type: string;      // ArchiMate type (e.g., "ApplicationComponent")
  layer: Layer;       // Derived via elementTypeToLayer()
  distance: number;  // BFS distance from source (1, 2, or 3)
}
```

### Edge Cases

| Case | Behavior |
|------|----------|
| Source element | NOT included in results |
| Non-existent elementId | Returns `[]` |
| Isolated node (no neighbors) | Returns `[]` |
| Cycle (A→B→C→A) | Visited set prevents duplicates and infinite loops |
| Max depth reached | BFS stops, deeper nodes not explored |

## Constraints

- Undirected traversal only — no direction filtering (P1 feature)
- Max depth limited to 1, 2, or 3 (TypeScript union type enforced)
- Does not compute layer summaries or affected diagrams (M2-02)

## Integration Points

- **M2-02 (Layer Summary):** Calls `analyzeImpact`, then groups results by layer and finds affected diagrams
- **M2-03 (Tests):** Additional test coverage for edge cases
- **M2-05 (Impact Analyzer Screen):** UI calls `analyzeImpact` via store action
- **analysisStore:** `setImpactResult` will wrap `analyzeImpact` output into `ImpactResult`
