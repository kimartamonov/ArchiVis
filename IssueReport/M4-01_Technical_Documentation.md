# M4-01 Technical Documentation

## Purpose

The GraphML export generator serializes impact analysis subgraphs (or any `GraphNode[]` + `GraphEdge[]`) into standards-compliant GraphML XML that can be opened in yEd and other graph tools.

## Architectural Approach

Pure function, no side effects, no dependencies beyond engine types. Uses string template building (no XML library needed).

```ts
function generateGraphML(nodes: GraphNode[], edges: GraphEdge[]): string
```

## Output Structure

```xml
<?xml version="1.0" encoding="UTF-8"?>
<graphml xmlns="http://graphml.graphstruct.org/xmlns" ...>
  <key id="d_name" for="node" attr.name="name" attr.type="string"/>
  <key id="d_type" for="node" attr.name="type" attr.type="string"/>
  <key id="d_layer" for="node" attr.name="layer" attr.type="string"/>
  <key id="d_degree" for="node" attr.name="degree" attr.type="int"/>
  <key id="d_edge_type" for="edge" attr.name="type" attr.type="string"/>
  <graph id="G" edgedefault="directed">
    <node id="...">
      <data key="d_name">...</data>
      <data key="d_type">...</data>
      <data key="d_layer">...</data>
      <data key="d_degree">...</data>
    </node>
    <edge id="e0" source="..." target="...">
      <data key="d_edge_type">...</data>
    </edge>
  </graph>
</graphml>
```

## Key Design Decisions

- **String concatenation over DOM API** — faster, simpler, no browser dependency for generation (only DOMParser used in tests for validation).
- **`escapeXml` utility** — handles `& < > " '` in all text content and attribute values.
- **Node IDs = element IDs** from the model, ensuring traceability.
- **Edge IDs = auto-generated** (`e0`, `e1`, ...) since relationship IDs are internal.
- **Layer computed at export time** via `elementTypeToLayer()` — consistent with all other ArchiLens components.

## Contracts

- **Input:** `GraphNode[]` (from `AnalysisGraph.nodes`) + `GraphEdge[]` (from `AnalysisGraph.edges`)
- **Output:** UTF-8 XML string, valid GraphML
- **Namespace:** `http://graphml.graphstruct.org/xmlns`

## Limitations

- No visual properties (yEd will use default layout)
- No streaming — entire XML built in memory (sufficient for MVP scale)

## Integration Points

- `src/export/index.ts` exports `generateGraphML`
- M4-04 will wire this to a download button
- M4-03 can add additional edge-case tests

## What Next Issue Can Rely On

`generateGraphML` is exported and tested. Any code can import from `src/export` and call it with nodes/edges arrays to get a downloadable GraphML string.
