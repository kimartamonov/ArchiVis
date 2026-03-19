# M4-05 Technical Documentation

## Purpose

Validates that exported GraphML and CSV files are structurally correct and would open without errors in target applications (yEd, Excel).

## Validation Approach

Programmatic validation test suite (`src/validation/__tests__/m4-export-validation.test.ts`) runs the full S-4 export flow on the real demo dataset:

1. Loads `digital-bank.json` (102 elements, 160 relationships)
2. Builds graph, calculates metrics
3. Runs impact analysis on the highest-degree hub element (depth 2)
4. Generates GraphML from the affected subgraph → validates XML via DOMParser
5. Generates CSV from all nodes → validates BOM, header, row count, data integrity

## GraphML Structural Verification

- XML parseable without errors (equivalent to "opens in yEd without error")
- Correct namespace `http://graphml.graphstruct.org/xmlns`
- Key definitions for node attributes (name, type, layer, degree) and edge type
- All edge source/target IDs exist in the node set (no dangling references)
- Node data elements contain correct key references

## CSV Structural Verification

- BOM character at position 0 (Excel auto-detects UTF-8)
- 9-column header matches spec exactly
- Row count = 102 + 1 (header)
- is_orphan field contains only `true`/`false` strings
- Spot-check: first 5 element names from model found in CSV output

## Integration Points

This validation confirms the full chain works:
```
demo dataset → buildGraph → calculateMetrics → buildImpactResult
  → generateGraphML → valid XML (yEd compatible)
  → generateCSV → valid BOM CSV (Excel compatible)
```
