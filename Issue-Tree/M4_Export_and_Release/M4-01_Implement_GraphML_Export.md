# M4-01: Implement GraphML Export Generator

## Metadata

| Field                | Value                                             |
|----------------------|---------------------------------------------------|
| **Issue ID**         | M4-01                                             |
| **Type**             | Engine                                            |
| **Status**           | Proposed                                          |
| **Milestone**        | M4 — Export and Release                           |
| **Capability Slice** | S-4 ("Экспортирую результаты")                    |
| **Priority**         | P0                                                |
| **Sequence Order**   | 1                                                 |
| **Depends On**       | M2-01 (Impact Analysis Engine)                    |
| **Unlocks**          | M4-03 (Export Unit Tests), M4-04 (Export Buttons) |
| **FR References**    | FR-7.1                                            |
| **AC References**    | AC-6.1, AC-6.2                                    |
| **Decision Refs**    | —                                                 |
| **Demo Refs**        | SC-1 step 11                                      |
| **Risk Refs**        | —                                                 |

## Goal

Create a pure function that generates a valid GraphML XML string from an impact analysis subgraph (affected nodes and edges), producing output that is compatible with yEd and contains all required element attributes.

## Why Now

Export is the final user-facing capability of the MVP. The impact analysis engine (M2-01) already produces the subgraph data. The GraphML generator is a pure data-to-string transformation with no UI dependencies, making it the natural first step in the export slice. It unblocks both testing (M4-03) and UI integration (M4-04).

## User / System Outcome

The system can serialize any impact analysis result into a standards-compliant GraphML file. When opened in yEd, the file displays all affected nodes with their names, types, layers, and degree values, connected by typed edges in a directed graph.

## Scope

- `src/export/graphml.ts`:
  - Function: `generateGraphML(nodes: GraphNode[], edges: GraphEdge[]): string`
  - Output: valid XML with `<?xml?>` declaration and GraphML namespace.
  - Key definitions in `<graphml>` header:
    - Node keys: `name` (string), `type` (string), `layer` (string), `degree` (int).
    - Edge key: `type` (string).
  - `<graph>` element with `edgedefault="directed"`.
  - `<node>` elements with `<data>` children for each key.
  - `<edge>` elements with `source`, `target` attributes and `<data>` for type.
  - UTF-8 encoding declaration.
- `src/export/index.ts` — barrel export.

## Out of Scope

- Full graph export (all elements, not just affected subgraph) — P1.
- Visual properties in GraphML (node position, color, shape for yEd) — not required for MVP.
- Streaming/chunked generation for very large graphs.
- Any file download logic (handled in M4-04).

## Preconditions

- M2-01: Impact analysis engine produces `GraphNode[]` and `GraphEdge[]` with fields: `id`, `name`, `type`, `layer`, `degree` on nodes; `source`, `target`, `type` on edges.
- Core types for `GraphNode` and `GraphEdge` are defined and stable.

## Implementation Notes

- Use string template building (template literals) to construct XML. No heavy XML library needed for this scope.
- GraphML namespace: `xmlns="http://graphml.graphstruct.org/xmlns"`.
- Key definitions must appear before `<graph>` element.
- Node IDs in GraphML must match element IDs from the model.
- Edge IDs can be auto-generated (e.g., `e0`, `e1`, ...).
- Escape XML special characters (`&`, `<`, `>`, `"`, `'`) in attribute values and data content.
- Reference: GraphML specification at graphml.graphdrawing.org.

## Files and Artifacts Expected to Change

| Path                          | Change   |
|-------------------------------|----------|
| `src/export/graphml.ts`       | Create   |
| `src/export/index.ts`         | Create   |

## Acceptance Criteria

- [ ] `generateGraphML` returns a string that is valid XML (parseable by DOMParser).
- [ ] Output contains `<graphml>` root element with correct namespace.
- [ ] Output contains key definitions for `name`, `type`, `layer`, `degree` (nodes) and `type` (edges).
- [ ] All input nodes appear as `<node>` elements with correct `<data>` values.
- [ ] All input edges appear as `<edge>` elements with correct `source`, `target`, and type data.
- [ ] Graph is declared as directed (`edgedefault="directed"`).
- [ ] Output file opens in yEd without error.
- [ ] XML special characters in element names are properly escaped.

## Required Tests

### Functional

- Given a known set of nodes and edges, `generateGraphML` produces XML containing the correct number of `<node>` and `<edge>` elements.
- All nodes have `<data>` elements for `name`, `type`, `layer`, `degree` with correct values.
- All edges have `source`/`target` attributes and `<data>` for type.
- Output is parseable by `DOMParser` without errors.

### Smoke

- Calling `generateGraphML` with an empty array returns valid (minimal) GraphML XML.
- Calling with a single node and no edges does not crash.

### Regression

- Impact analysis engine (M2-01) still produces correct subgraph data after export module is added.
- No import/build errors introduced.

## Handoff to Next Issue

The `generateGraphML` function is implemented, exported, and produces valid GraphML XML from any `GraphNode[]` + `GraphEdge[]` input. M4-03 can write unit tests against it. M4-04 can wire it to a UI button that triggers file download.

## Done Definition

- All acceptance criteria checked.
- Code compiles without errors.
- `generateGraphML` exported from `src/export/index.ts`.
- Output validated as parseable XML.
- Manual spot-check: generated file opens in yEd.
