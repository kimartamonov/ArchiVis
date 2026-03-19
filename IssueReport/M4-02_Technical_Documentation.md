# M4-02 Technical Documentation

## Purpose

The CSV export generator serializes the full element table (`GraphNode[]`) into a CSV string compatible with Microsoft Excel and LibreOffice Calc, with correct UTF-8 encoding and proper field escaping.

## API

```ts
function generateCSV(nodes: GraphNode[]): string
```

## Output Format

- **BOM:** `\uFEFF` prefix for Excel UTF-8 detection
- **Separator:** comma (`,`)
- **Header:** `id,name,type,layer,degree,in_degree,out_degree,diagrams_count,is_orphan`
- **Escaping:** fields containing `,`, `"`, or `\n` are wrapped in double quotes; internal `"` doubled

## Columns

| Column | Source | Type |
|--------|--------|------|
| id | `element.id` | string |
| name | `element.name` | string |
| type | `element.type` | string |
| layer | `elementTypeToLayer(element.type)` | string |
| degree | `node.degree` | int |
| in_degree | `node.inDegree` | int |
| out_degree | `node.outDegree` | int |
| diagrams_count | `node.diagramsCount` | int |
| is_orphan | `node.isOrphan` | boolean (`true`/`false`) |

## Integration Points

- Exported from `src/export/index.ts`
- M4-04 will wire to a download button
- Input: `GraphNode[]` from `AnalysisGraph.nodes` (via `Array.from(graph.nodes.values())`)
