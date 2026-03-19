# M4-03 Technical Documentation

## Purpose

Comprehensive unit test suite for both export generators (GraphML, CSV), using shared fixtures and covering edge cases that ensure robustness before UI integration.

## Test Architecture

### Shared Fixtures (`src/export/__tests__/fixtures.ts`)

| Fixture | Purpose |
|---------|---------|
| `makeExportNode(id, name, type, opts, diagramIds)` | Factory with full control over all GraphNode fields |
| `makeExportEdge(relId, source, target, type)` | Factory for GraphEdge |
| `NODE_PG` | Standard node (degree 8, Application layer) |
| `NODE_PS` | Orphan node (isOrphan=true, no diagrams) |
| `NODE_CYRILLIC` | Node with Cyrillic name ("Платёжный Шлюз") |
| `NODE_SPECIAL` | Node with XML special chars (`& < > "`) |
| `NODE_EMPTY_NAME` | Node with empty string name |
| `NODE_ZERO_DEGREE` | Zero-degree orphan node |
| `EDGE_PG_PS` | Edge linking NODE_PG → NODE_PS |

### GraphML Tests (18 tests)

| Category | Tests | What is verified |
|----------|-------|-----------------|
| Structure | 4 | Valid XML, declaration, namespace, directed |
| Key definitions | 2 | Node keys (name/type/layer/degree), edge key (type) |
| Nodes | 2 | Correct count, correct data values |
| Edges | 2 | Correct count, source/target/type |
| Escaping | 2 | XML special chars, Cyrillic preservation |
| Edge cases | 6 | Empty input, single node, empty name, zero-degree, multi-edge |

### CSV Tests (14 tests)

| Category | Tests | What is verified |
|----------|-------|-----------------|
| BOM & Header | 2 | UTF-8 BOM at position 0, correct header |
| Row count | 3 | N+1 rows, empty input, single node |
| Data values | 3 | Correct fields, is_orphan, layer mapping |
| CSV escaping | 3 | Commas, double quotes, newlines |
| Encoding | 1 | Cyrillic preservation |
| Edge cases | 2 | Empty name, zero-degree, special characters |

## Coverage

```
 export/csv.ts     | 100% lines | 100% branches | 100% functions | 100% statements
 export/graphml.ts | 100% lines | 100% branches | 100% functions | 100% statements
```

## Integration Points

Tests use the same `makeElement`/`makeRelationship` fixtures from the graph engine tests, ensuring consistency between engine and export test data.
