# M1-03: Build Graph Engine

## Metadata

| Field                | Value                                                  |
|----------------------|--------------------------------------------------------|
| **Issue ID**         | M1-03                                                  |
| **Type**             | Engine                                                 |
| **Status**           | Proposed                                               |
| **Milestone**        | M1 — Model Visualization                               |
| **Capability Slice** | S-1 ("Вижу модель как граф")                           |
| **Priority**         | P0                                                     |
| **Sequence Order**   | 3                                                      |
| **Depends On**       | M0-03 (Core Types)                                     |
| **Unlocks**          | M1-04 (Base Metrics), M1-05 (Unit Tests), M1-08 (Global Graph View), M2-01 (BFS/Impact) |
| **FR References**    | FR-1.6, FR-8.5, FR-8.6                                |
| **AC References**    | AC-2.1, AC-2.2, AC-2.4                                |
| **Decision Refs**    | D-8 (headless engine)                                  |
| **Demo Refs**        | —                                                      |
| **Risk Refs**        | —                                                      |

## Goal

Build the graph construction function that transforms a `NormalizedModel` into an `AnalysisGraph`. The graph provides adjacency lists (in/out), a node index (`Map<id, GraphNode>`), and an edge list — the core data structure that all analysis and visualization depends on.

## Why Now

The graph engine is the heart of ArchiLens. Every downstream feature — metrics, BFS/impact analysis, filtering, and the React Flow visualization — consumes `AnalysisGraph`. It must be built and tested before any of those features can proceed.

## User / System Outcome

No direct user-facing output. The system gains the ability to convert any loaded `NormalizedModel` into an in-memory graph structure with O(1) node lookups and efficient traversal via adjacency lists.

## Scope

- `src/engine/graph/buildGraph.ts`:
  - Input: `NormalizedModel`.
  - Output: `AnalysisGraph` containing:
    - `nodes: Map<string, GraphNode>` — keyed by element ID.
    - `edges: GraphEdge[]` — list of all valid edges.
    - `adjacencyOut: Map<string, string[]>` — outgoing neighbor IDs per node.
    - `adjacencyIn: Map<string, string[]>` — incoming neighbor IDs per node.
    - `warnings: BrokenReference[]` — relationships with missing source/target.
  - Handles broken references: if source or target element is not in the model, skip the edge and record a `BrokenReference` warning.
  - Handles cycles: no special treatment at construction time (cycles are valid in ArchiMate).
- `src/engine/graph/types.ts` (if not already in M0-03): `AnalysisGraph`, `GraphNode`, `GraphEdge`, `BrokenReference`.
- `src/engine/graph/index.ts` — barrel export.

## Out of Scope

- Metrics calculation (M1-04).
- BFS / impact traversal (M2-01).
- React Flow node/edge conversion (M1-08).
- Any UI rendering.

## Preconditions

- M0-03: `NormalizedModel`, `NormalizedElement`, `NormalizedRelationship` types are defined.

## Implementation Notes

1. Initialize empty `nodes` map, `edges` array, `adjacencyOut` map, `adjacencyIn` map, `warnings` array.
2. Iterate `model.elements`:
   - Create a `GraphNode` for each element: `{ element, metrics: { inDegree: 0, outDegree: 0, degree: 0, diagramsCount: 0, isOrphan: false } }`.
   - Insert into `nodes` map keyed by `element.id`.
   - Initialize empty arrays in `adjacencyOut` and `adjacencyIn`.
3. Iterate `model.relationships`:
   - If `source` or `target` not in `nodes` → push `BrokenReference` to warnings, skip.
   - Otherwise create `GraphEdge`, push to `edges`, append to `adjacencyOut[source]` and `adjacencyIn[target]`.
4. Return `AnalysisGraph`.

## Files and Artifacts Expected to Change

| Path                                  | Change   |
|---------------------------------------|----------|
| `src/engine/graph/buildGraph.ts`      | Create   |
| `src/engine/graph/types.ts`           | Create (or extend from M0-03) |
| `src/engine/graph/index.ts`           | Create   |

## Acceptance Criteria

- [ ] `buildGraph(model)` returns an `AnalysisGraph`.
- [ ] Node count in the graph equals the element count in the input model.
- [ ] Edge count equals the number of relationships with valid source and target.
- [ ] Broken references are collected in `warnings` (not thrown).
- [ ] `adjacencyOut[nodeId]` contains the IDs of all outgoing neighbors.
- [ ] `adjacencyIn[nodeId]` contains the IDs of all incoming neighbors.
- [ ] Empty model (zero elements, zero relationships) returns an empty graph without error.

## Required Tests

### Functional

- Known input (3 elements, 2 relationships) → expected 3 nodes, 2 edges, correct adjacency.
- Input with broken reference → edge skipped, warning recorded, other edges correct.
- Empty model → empty graph, no errors.
- Model with cycles → graph constructed correctly (no infinite loop).

### Smoke

- `buildGraph` does not crash on the demo dataset.

### Regression

- M0-03 types still compile after adding graph types.

## Handoff to Next Issue

`AnalysisGraph` is available for:
- M1-04: metrics calculation (degree, orphan detection).
- M1-05: comprehensive unit testing.
- M1-08: conversion to React Flow nodes/edges for visualization.
- M2-01: BFS/impact traversal.

## Done Definition

- All acceptance criteria checked.
- Code compiles without errors.
- `buildGraph` exported from `src/engine/graph/index.ts`.
- Works with both demo dataset and any valid `NormalizedModel`.
