# M2-02 Technical Documentation

## Purpose

Aggregation layer on top of BFS impact analysis. Produces a complete `ImpactResult` with layer summaries and affected diagrams — the single data object consumed by the Impact Analyzer UI.

## Architecture

### Function Signature

```ts
function buildImpactResult(
  graph: AnalysisGraph,
  model: NormalizedModel,
  elementId: string,
  depth: 1 | 2 | 3,
): ImpactResult
```

### Data Flow

```
buildImpactResult(graph, model, elementId, depth)
    │
    ├── analyzeImpact(graph, elementId, depth) → AffectedElement[]
    │
    ├── Group by layer → LayerSummary[] (sorted by count desc)
    │
    ├── Resolve source diagramIds → DiagramRef[] (name from model.diagrams)
    │
    └── Return ImpactResult {
          sourceElementId, depth,
          affectedElements, affectedLayers, affectedDiagrams
        }
```

### Return Type

```ts
interface ImpactResult {
  sourceElementId: string;
  depth: number;
  affectedElements: AffectedElement[];     // Flat BFS list
  affectedLayers: LayerSummary[];          // Per-layer counts, sorted desc
  affectedDiagrams: DiagramRef[];          // Source element's diagrams
}
```

### Layer Summary

- Groups `affectedElements` by `layer` field
- Sorted by count descending (most-affected layer first)
- Sum of all counts === `affectedElements.length`

### Affected Diagrams

- Looks up source element's `diagramIds` from `graph.nodes.get(elementId).element.diagramIds`
- Resolves each ID to a name via `model.diagrams` map
- Only the **source** element's diagrams — not all affected elements' diagrams

## Constraints

- Requires both `AnalysisGraph` (for BFS) and `NormalizedModel` (for diagram names)
- Diagram membership for affected elements is not computed (only source)

## Integration Points

- **M2-05 (Impact Analyzer Screen):** Calls `buildImpactResult`, renders all sections from the returned object
- **analysisStore:** `setImpactResult(result)` stores the `ImpactResult` for UI consumption
