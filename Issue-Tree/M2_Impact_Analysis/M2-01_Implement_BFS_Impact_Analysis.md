# M2-01: Implement BFS Impact Analysis

## Metadata

| Field                | Value                                             |
|----------------------|---------------------------------------------------|
| **Issue ID**         | M2-01                                             |
| **Type**             | Engine                                            |
| **Status**           | Proposed                                          |
| **Milestone**        | M2 — Impact Analysis                              |
| **Capability Slice** | S-2 ("Анализирую impact изменения")               |
| **Priority**         | P0                                                |
| **Sequence Order**   | 1                                                 |
| **Depends On**       | M1-03 (Graph Engine)                              |
| **Unlocks**          | M2-02 (Layer Summary), M2-03 (Unit Tests), M2-05 (Impact Analyzer Screen) |
| **FR References**    | FR-3.3, FR-3.4, FR-8.6                           |
| **AC References**    | AC-3.2, AC-3.3, AC-3.4, AC-3.8, AC-3.9          |
| **Decision Refs**    | D-12 (manual BFS preferred)                       |
| **Demo Refs**        | —                                                 |
| **Risk Refs**        | R2 (large graph performance)                      |

## Goal

Implement BFS traversal from a selected element to find all affected elements at depth 1, 2, or 3. This is the core analytical engine behind impact analysis, using a manual BFS approach (D-12) with a visited set to handle cycles in the ArchiMate graph.

## Why Now

Impact analysis is the primary value proposition of Slice S-2. The BFS engine must exist before layer summaries, UI screens, or graph highlighting can be built. It is the foundation that M2-02 through M2-07 depend on.

## User / System Outcome

The system can compute, given any element and a max depth (1, 2, or 3), the complete list of affected elements with their distance from the source. This enables stakeholders to understand the blast radius of changes to any architectural element.

## Scope

- `src/engine/insight/impactAnalysis.ts`:
  - Function: `analyzeImpact(graph: AnalysisGraph, elementId: string, maxDepth: 1 | 2 | 3): AffectedElement[]`
  - BFS with a `visited: Set<string>` to prevent cycles and duplicates.
  - Traversal is **undirected**: expand both `adjacencyIn` and `adjacencyOut` neighbors at each level.
  - Track distance from source for each discovered element.
  - Return an array of `AffectedElement` objects: `{ id, name, type, layer, distance }`.
- `src/engine/insight/types.ts` (or extend existing types):
  - `AffectedElement` type definition.
- `src/engine/insight/index.ts` — barrel export.

## Out of Scope

- Direction filtering (inbound-only or outbound-only) — deferred to P1.
- Layer summary and affected diagrams aggregation (M2-02).
- Any UI rendering or store integration.
- Depth values beyond 3.

## Preconditions

- M1-03: `AnalysisGraph` is built with `adjacencyIn` and `adjacencyOut` maps, and element metadata (name, type, layer) is accessible from the graph.

## Implementation Notes

- Standard BFS using a queue (array with shift/push or a dedicated queue structure).
- Initialize: enqueue `elementId` at distance 0, add to `visited`.
- For each level up to `maxDepth`:
  - Dequeue element.
  - For each neighbor in `adjacencyIn[id]` and `adjacencyOut[id]`:
    - If not in `visited`, add to `visited`, enqueue with `distance + 1`, add to results.
- The source element itself is NOT included in the returned `AffectedElement[]` array.
- Performance target: < 1 second for a graph with 500 nodes and typical ArchiMate connectivity.

## Files and Artifacts Expected to Change

| Path                                      | Change   |
|-------------------------------------------|----------|
| `src/engine/insight/impactAnalysis.ts`    | Create   |
| `src/engine/insight/types.ts`             | Create   |
| `src/engine/insight/index.ts`             | Create   |

## Acceptance Criteria

- [ ] `analyzeImpact` with depth 1 returns only direct neighbors of the source element.
- [ ] `analyzeImpact` with depth 2 returns neighbors and their neighbors, with no duplicates.
- [ ] `analyzeImpact` with depth 3 returns up to 3 hops, with no duplicates.
- [ ] Cycles in the graph do not cause an infinite loop or duplicate entries.
- [ ] Performance < 1 second for a graph with 500 nodes.
- [ ] Each returned `AffectedElement` includes correct `id`, `name`, `type`, `layer`, and `distance`.
- [ ] On demo dataset, a known element (e.g., "Core Banking Platform") at depth 2 returns the expected count (28 elements).
- [ ] Source element is not included in the results.

## Required Tests

### Functional

- Known graph with predictable structure: `analyzeImpact` at depth 1 returns expected elements.
- Same graph at depth 2 returns expected expanded set.
- Same graph at depth 3 returns expected further expansion.
- Graph with a cycle (A → B → C → A): BFS terminates, no duplicates.
- Element with no neighbors (isolated node): returns empty array.
- Performance: graph with 500 nodes completes in < 1 second.

### Smoke

- Calling `analyzeImpact` with a valid element ID does not throw.

### Regression

- All M1 graph engine tests (`tests/engine/`) still pass.

## Handoff to Next Issue

BFS impact analysis engine is ready and exported. M2-02 can call `analyzeImpact` to build layer summaries and affected diagrams. M2-03 can write comprehensive tests against it. M2-05 can integrate it into the Impact Analyzer screen via stores.

## Done Definition

- All acceptance criteria checked.
- Code compiles without errors.
- `analyzeImpact` and `AffectedElement` exported from `src/engine/insight/index.ts`.
- Smoke test passes.
