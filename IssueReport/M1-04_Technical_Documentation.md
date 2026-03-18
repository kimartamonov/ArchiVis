# Technical Documentation: M1-04 — Base Metrics

## Purpose

`calculateMetrics()` provides authoritative base metrics on all graph nodes. It is designed to be called after `buildGraph()` and ensures the full orphan definition is applied.

---

## API

```typescript
import { buildGraph, calculateMetrics } from './engine/graph';

const { graph } = buildGraph(model);
calculateMetrics(graph);

// Every node now has accurate metrics:
for (const node of graph.nodes.values()) {
  console.log(node.element.name, {
    degree: node.degree,
    inDegree: node.inDegree,
    outDegree: node.outDegree,
    diagramsCount: node.diagramsCount,
    isOrphan: node.isOrphan,
  });
}
```

---

## Orphan Definition

An element is orphaned if **either** condition is true:
- `degree === 0` — no relationships at all
- `diagramsCount === 0` — not placed on any diagram

This captures two kinds of architectural hygiene issues:
1. **Disconnected elements** — defined but not related to anything
2. **Invisible elements** — connected but never shown on any diagram (potentially forgotten)

---

## Complexity

- **Time:** O(n) where n = number of nodes
- **Space:** O(1) additional — mutates nodes in place
- **Depends on:** adjacency lists being already populated by `buildGraph()`

---

## Relationship with buildGraph

`buildGraph()` computes preliminary degree metrics during edge construction. `calculateMetrics()` is the authoritative recalculation that:
1. Re-derives all values from adjacency list lengths (source of truth)
2. Applies the full orphan definition (degree + diagramsCount)

The standard usage pattern is: `buildGraph()` → `calculateMetrics()`.

---

## Integration Points

- **M1-09 (Element Info Popup):** display `degree`, `inDegree`, `outDegree`, `isOrphan`
- **M3-02 (Coverage Report):** count orphans, compute orphan %, layer distribution
- **M1-06 (Zustand Stores):** call `calculateMetrics` after loading model and building graph
