# M2-03 Technical Documentation

## Purpose

Comprehensive test suite for the impact analysis engine (`analyzeImpact` + `buildImpactResult`). Establishes confidence before building UI layers on top.

## Test Structure

```
src/engine/insight/__tests__/
├── fixtures.ts              # Shared graph builders (chain, diamond, star, cycle)
├── impactAnalysis.test.ts   # 16 tests for analyzeImpact
└── buildImpactResult.test.ts # 6 tests for buildImpactResult
```

## Shared Fixtures

| Factory | Graph Shape | Use Cases |
|---------|-------------|-----------|
| `buildChainGraph()` | A→B→C→D (linear) | Depth tests, early termination |
| `buildDiamondGraph()` | A→B/C→D | Duplicate prevention, multi-path |
| `buildStarGraph()` | Hub→5 spokes | Fan-out, multi-layer |
| `buildCycleGraph()` | A→B→C→A | Cycle safety |

All fixtures return `{ graph: AnalysisGraph, model: NormalizedModel }` for use in both `analyzeImpact` and `buildImpactResult` tests.

## Coverage

Coverage threshold enforced in `vite.config.ts`:

```ts
'src/engine/insight/impactAnalysis.ts': { lines: 80, branches: 80 }
```

Actual: 100% lines, 90.9% branches. The uncovered branches are defensive guards (`graph.nodes.get()` returning undefined for a neighbor that exists in adjacency but not nodes — an impossible state in normal operation).

## Edge Cases Covered

| Case | Test |
|------|------|
| Cycle (A→B→C→A) | Terminates, no dupes |
| Diamond (multi-path to same node) | Node appears once |
| Isolated node | Empty result |
| Non-existent element | Empty result |
| Missing adjacency entries | Falls back to empty |
| Missing node in nodes map | Skipped gracefully |
| Early termination | Stops when queue empty |
| 500-node graph | < 1 second |
