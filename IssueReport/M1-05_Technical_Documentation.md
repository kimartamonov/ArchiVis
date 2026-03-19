# M1-05 Technical Documentation

## Purpose

Comprehensive unit test suite for the graph engine layer (`buildGraph` and `calculateMetrics`), ensuring correctness before building UI on top of it.

## Architecture

### Test Structure

```
src/engine/graph/__tests__/
├── fixtures.ts              # Shared factory functions
├── buildGraph.test.ts       # 12 tests for graph construction
└── calculateMetrics.test.ts # 10 tests for metrics calculation
```

### Fixture Factories

All tests use shared factory functions from `fixtures.ts`:

```ts
makeElement(id, name?, type?, diagramIds?)     → NormalizedElement
makeRelationship(id, sourceId, targetId, type?) → NormalizedRelationship
makeModel(elements, relationships?, diagrams?)  → NormalizedModel
```

Factories use sensible defaults (`type = 'ApplicationComponent'`, `diagramIds = []`, etc.) so tests only specify fields relevant to the test case.

## Test Coverage Map

### buildGraph.test.ts

| Test | What It Verifies |
|------|-----------------|
| Minimal model (1 element) | Single node, no edges, orphan flag |
| Known input (3 elements, 2 rels) | Correct node/edge counts |
| Adjacency lists | adjacencyOut/adjacencyIn populated correctly |
| Degree metrics | inDegree, outDegree, degree on each node |
| Broken references | Invalid edges skipped, warnings collected |
| Empty model | Empty graph, no crash |
| Duplicate element IDs | Map.set overwrites — last wins |
| Cycle (A→B→C→A) | No infinite loop, degree = 2 for each |
| Self-loop (A→A) | No crash, degree = 2 |
| Orphan detection | degree === 0 → isOrphan = true |
| diagramsCount | Correctly read from element.diagramIds |
| Edge reference identity | edge.source/target === nodes.get(id) |
| Demo dataset smoke | 102 nodes, 160 edges, 0 warnings |

### calculateMetrics.test.ts

| Test | What It Verifies |
|------|-----------------|
| Known graph degrees | inDegree/outDegree/degree after recalculation |
| Orphan: no edges, no diagrams | isOrphan = true |
| Orphan: edges, no diagrams | isOrphan = true (diagramsCount = 0) |
| Orphan: diagrams, no edges | isOrphan = true (degree = 0) |
| Well-connected + diagrams | isOrphan = false |
| diagramsCount | element.diagramIds.length |
| Missing adjacency entries | Falls back to degree 0 |
| Undefined diagramIds | Falls back to diagramsCount 0 |
| Idempotency | Two calls → identical results |
| Demo hub degree | Max degree >= 14, all metrics valid |

## Coverage Configuration

Coverage is enforced via `vite.config.ts`:

```ts
coverage: {
  provider: 'v8',
  thresholds: {
    'src/engine/graph/buildGraph.ts':       { lines: 80, branches: 80 },
    'src/engine/graph/calculateMetrics.ts': { lines: 80, branches: 80 },
  },
}
```

Current actual coverage: **100%** lines, **100%** branches for both files.

## Constraints

- Tests use Vitest (`describe`/`it`/`expect`).
- Demo dataset tests read `demo/digital-bank.json` via `fs.readFileSync` (Node environment).
- Coverage thresholds are enforced per-file, not globally.

## Integration Points

- Tests import directly from `src/engine/graph/buildGraph.ts` and `src/engine/graph/calculateMetrics.ts`.
- Demo dataset at `demo/digital-bank.json` is used as integration-level smoke test data.
- Fixture factories are exported and reusable by future test files (M2-03, M4-03).

## What Next Issues Can Rely On

- **M1-06 (Zustand Stores):** Graph engine output (`AnalysisGraph`) is tested and stable — stores can trust the data shape.
- **M1-08 (Global Graph View):** Node/edge counts, adjacency, and metrics are verified — UI can map them to React Flow nodes/edges.
- **M2-01 (BFS Impact Analysis):** `adjacencyOut`/`adjacencyIn` maps are thoroughly tested — BFS traversal can use them directly.
- **M2-03, M4-03 (future test issues):** `fixtures.ts` factories can be reused.
