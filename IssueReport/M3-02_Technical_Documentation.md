# M3-02 Technical Documentation

## Purpose

Coverage report engine — computes model quality metrics (orphans, layer distribution, broken references) for the Coverage screen.

## Function Signature

```ts
function buildCoverageReport(
  graph: AnalysisGraph,
  warnings?: BrokenReference[],
): CoverageReport
```

## Return Type

```ts
interface CoverageReport {
  totalElements: number;
  orphanCount: number;
  orphanPercent: number;          // (orphanCount / totalElements) * 100, 1 decimal
  orphanElements: NormalizedElement[];
  layerDistribution: LayerSummary[];  // sorted by count desc
  brokenReferences: BrokenReference[];
}
```

## Orphan Definition

`isOrphan = degree === 0 OR diagramsCount === 0`

An element is orphan if it either has no connections (degree 0) or appears in no diagrams (diagramsCount 0).

## Demo Dataset Profile

| Metric | Value |
|--------|-------|
| Total elements | 102 |
| Orphan count | 12 |
| Orphan percent | 11.8% |
| Broken references | 0 |
| Layers represented | 7 |

## Integration Points

- **M3-03 (Coverage Screen):** Calls `buildCoverageReport(graph)` on mount
- **M3-06 (Validation):** Verifies orphan count matches expected
