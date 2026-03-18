# M1-04: Calculate Base Metrics

## Metadata

| Field                | Value                                        |
|----------------------|----------------------------------------------|
| **Issue ID**         | M1-04                                        |
| **Type**             | Engine                                       |
| **Status**           | Proposed                                     |
| **Milestone**        | M1 — Model Visualization                     |
| **Capability Slice** | S-1 ("Вижу модель как граф")                 |
| **Priority**         | P0                                           |
| **Sequence Order**   | 4                                            |
| **Depends On**       | M1-03 (Graph Engine)                         |
| **Unlocks**          | M1-05 (Unit Tests), M3-02 (Coverage Metrics) |
| **FR References**    | FR-8.4                                       |
| **AC References**    | AC-2.3                                       |
| **Decision Refs**    | —                                            |
| **Demo Refs**        | —                                            |
| **Risk Refs**        | —                                            |

## Goal

Calculate base metrics for each `GraphNode`: in-degree, out-degree, total degree, diagrams count, and orphan status. These metrics are the foundation for element inspection, coverage analysis, and future advanced metrics.

## Why Now

Metrics are needed immediately after graph construction. The Element Info popup (M1-09) displays degree, and the coverage engine (M3) depends on `isOrphan` and `diagramsCount`. Calculating them in a separate, testable function keeps the graph engine clean.

## User / System Outcome

Every node in the graph carries accurate degree and orphan metrics. Users will see these in the Element Info popup. The system can identify orphaned elements and hubs.

## Scope

- `src/engine/graph/calculateMetrics.ts`:
  - Input: `AnalysisGraph` (mutates node metrics in place, or returns updated graph).
  - For each node:
    - `inDegree = adjacencyIn[id].length`
    - `outDegree = adjacencyOut[id].length`
    - `degree = inDegree + outDegree`
    - `diagramsCount = element.diagramIds.length` (or 0 if `diagramIds` is undefined)
    - `isOrphan = degree === 0 || diagramsCount === 0`

## Out of Scope

- Betweenness centrality (P1 / future milestone).
- Impact radius / BFS depth metrics (M2).
- Aggregate model-level statistics.

## Preconditions

- M1-03: `AnalysisGraph` with populated `adjacencyIn`, `adjacencyOut`, and `nodes` map.

## Implementation Notes

- Iterate over all entries in `nodes` map.
- Read adjacency list lengths — O(1) per node.
- Write metrics directly onto `GraphNode.metrics`.
- Total time complexity: O(n) where n = number of nodes.
- Consider making this a pure function that returns a new graph (immutability) vs. mutating in place (performance). Mutation is acceptable since this runs once after construction.

## Files and Artifacts Expected to Change

| Path                                        | Change   |
|---------------------------------------------|----------|
| `src/engine/graph/calculateMetrics.ts`      | Create   |
| `src/engine/graph/index.ts`                 | Update (add export) |

## Acceptance Criteria

- [ ] After `calculateMetrics`, every node has `inDegree`, `outDegree`, `degree`, `diagramsCount`, and `isOrphan` populated.
- [ ] Degree values match manual count on a known test graph.
- [ ] A node with zero relationships and zero diagram appearances is marked `isOrphan = true`.
- [ ] A node with relationships but zero diagram appearances is marked `isOrphan = true`.
- [ ] A node with diagram appearances but zero relationships is marked `isOrphan = true`.
- [ ] A well-connected node in diagrams is marked `isOrphan = false`.
- [ ] Known hub element in demo dataset has expected high degree.

## Required Tests

### Functional

- Known graph (3 nodes, 2 edges) → expected degree values for each node.
- Isolated node (no edges, no diagrams) → `isOrphan = true`, `degree = 0`.
- Node with edges but no diagrams → `isOrphan = true`.
- Node with diagrams but no edges → `isOrphan = true`.
- Hub node → `degree > 0`, `isOrphan = false` (if also in diagrams).

### Smoke

- `calculateMetrics` on demo dataset graph completes without error.

### Regression

- Graph construction (M1-03) still works — metrics calculation does not break `buildGraph`.

## Handoff to Next Issue

Base metrics are available on all `GraphNode` instances. The Element Info popup (M1-09) can display degree and orphan status. The coverage engine (M3-02) can use `isOrphan` and `diagramsCount` for model health analysis.

## Done Definition

- All acceptance criteria checked.
- Code compiles without errors.
- `calculateMetrics` exported from `src/engine/graph/index.ts`.
- Metrics values verified against demo dataset.
