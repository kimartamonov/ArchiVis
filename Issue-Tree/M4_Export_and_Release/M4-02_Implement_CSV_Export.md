# M4-02: Implement CSV Export Generator

## Metadata

| Field                | Value                                             |
|----------------------|---------------------------------------------------|
| **Issue ID**         | M4-02                                             |
| **Type**             | Engine                                            |
| **Status**           | Proposed                                          |
| **Milestone**        | M4 — Export and Release                           |
| **Capability Slice** | S-4 ("Экспортирую результаты")                    |
| **Priority**         | P0                                                |
| **Sequence Order**   | 2                                                 |
| **Depends On**       | M3-01 (Table View / Element Metrics)              |
| **Unlocks**          | M4-03 (Export Unit Tests), M4-04 (Export Buttons) |
| **FR References**    | FR-7.2                                            |
| **AC References**    | AC-6.3, AC-6.4                                    |
| **Decision Refs**    | —                                                 |
| **Demo Refs**        | SC-1 step 12                                      |
| **Risk Refs**        | —                                                 |

## Goal

Create a pure function that generates a CSV string from element table data, with UTF-8 BOM for Excel compatibility and proper CSV escaping, covering all required columns for model element analysis.

## Why Now

The CSV export completes the second export format required for MVP. The element table data from M3-01 is already available. Like GraphML, this is a pure data-to-string transformation that can be implemented and tested independently before UI integration. It unblocks M4-03 (tests) and M4-04 (UI buttons).

## User / System Outcome

The system can serialize the full element table into a CSV file that opens correctly in Microsoft Excel and LibreOffice Calc with proper UTF-8 encoding (no garbled Cyrillic or special characters). All analysis columns are present and correctly formatted.

## Scope

- `src/export/csv.ts`:
  - Function: `generateCSV(nodes: GraphNode[]): string`
  - Columns: `id`, `name`, `type`, `layer`, `degree`, `in_degree`, `out_degree`, `diagrams_count`, `is_orphan`.
  - UTF-8 BOM prefix (`\uFEFF`) as the first character for Excel compatibility.
  - Comma (`,`) as field separator.
  - Values containing commas, double quotes, or newlines are enclosed in double quotes.
  - Double quotes within values are escaped by doubling (`""`).
  - `is_orphan` column: `true` / `false`.
- Update `src/export/index.ts` — add barrel export for CSV.

## Out of Scope

- Coverage report CSV export — P1.
- Custom column selection or column ordering by user.
- Semicolon separator option for non-English locales.
- Streaming/chunked generation for very large datasets.

## Preconditions

- M3-01: Table view provides `GraphNode[]` with fields: `id`, `name`, `type`, `layer`, `degree`, `inDegree`, `outDegree`, `diagramsCount`, `isOrphan`.
- Core types for `GraphNode` include all required metric fields.

## Implementation Notes

- Build header row as first line: `id,name,type,layer,degree,in_degree,out_degree,diagrams_count,is_orphan`.
- Iterate over nodes, building one row per element.
- CSV escaping function: if value contains `,`, `"`, or `\n`, wrap in double quotes and escape internal quotes.
- Prepend BOM character `\uFEFF` before the header row.
- Map camelCase field names (`inDegree`) to snake_case column names (`in_degree`) in the header.
- Boolean `isOrphan` renders as string `true` or `false`.

## Files and Artifacts Expected to Change

| Path                          | Change   |
|-------------------------------|----------|
| `src/export/csv.ts`           | Create   |
| `src/export/index.ts`         | Update   |

## Acceptance Criteria

- [ ] `generateCSV` returns a string starting with UTF-8 BOM (`\uFEFF`).
- [ ] First data line after BOM is the header: `id,name,type,layer,degree,in_degree,out_degree,diagrams_count,is_orphan`.
- [ ] All input nodes appear as rows with correct values.
- [ ] Values containing commas are enclosed in double quotes.
- [ ] Values containing double quotes have quotes escaped as `""`.
- [ ] `is_orphan` column contains `true` or `false`.
- [ ] Output opens in Excel with correct encoding (no garbled characters).
- [ ] Row count equals node count + 1 (header).

## Required Tests

### Functional

- Given known nodes, `generateCSV` produces correct header and data rows.
- BOM character is present at position 0.
- A node with a comma in its name is correctly quoted.
- A node with a double quote in its name has the quote escaped.
- `is_orphan` renders as `true`/`false` string.
- Row count matches input length + 1.

### Smoke

- Calling `generateCSV` with an empty array returns BOM + header only.
- Calling with a single node does not crash.

### Regression

- Table view data (M3-01) is still correctly computed after export module is added.
- No import/build errors introduced.

## Handoff to Next Issue

The `generateCSV` function is implemented, exported, and produces correctly formatted CSV with BOM from any `GraphNode[]` input. M4-03 can write unit tests against it. M4-04 can wire it to a UI button that triggers file download.

## Done Definition

- All acceptance criteria checked.
- Code compiles without errors.
- `generateCSV` exported from `src/export/index.ts`.
- Manual spot-check: generated file opens in Excel with correct columns and encoding.
