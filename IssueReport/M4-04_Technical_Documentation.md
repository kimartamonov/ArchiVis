# M4-04 Technical Documentation

## Purpose

Connects the export generators (M4-01 GraphML, M4-02 CSV) to the UI via download buttons, completing the user-facing export capability.

## Architecture

### Download Utility (`src/utils/download.ts`)

```ts
downloadBlob(blob: Blob, filename: string): void
sanitizeFileName(name: string): string
```

- `downloadBlob`: creates `URL.createObjectURL` → hidden `<a>` element → `.click()` → `revokeObjectURL`
- `sanitizeFileName`: removes `< > : " / \ | ? *`, replaces spaces with `_`, limits to 60 chars

### ExportButton Component

Reusable button with accent styling and disabled state. Props: `label`, `onClick`, `disabled`.

### Integration Points

#### Impact Analyzer — "Export GraphML"

- Collects subgraph: source node + affected nodes from `impactResult.affectedElements`
- Filters edges where both source and target are in the subgraph
- Calls `generateGraphML(nodes, edges)`
- File name: `impact_{sanitized_element_name}_{depth}.graphml`
- Disabled when no impact result or zero affected elements

#### Table View — "Export CSV"

- Gets all nodes from `graph.nodes`
- Calls `generateCSV(nodes)`
- File name: `elements_{sanitized_model_name}.csv`
- Disabled when no data (empty graph)

## File Name Patterns

| Context | Pattern | Example |
|---------|---------|---------|
| GraphML | `impact_{elementName}_{depth}.graphml` | `impact_Payment_Gateway_2.graphml` |
| CSV | `elements_{modelName}.csv` | `elements_Digital_Bank_Architecture.csv` |

## Limitations

- GraphML exports only the impact subgraph, not the full graph
- No export format selection dialog
- No progress indicator (generation is synchronous and fast)
