# M4-05: Validation: Export Files Open Correctly

## Metadata

| Field                | Value                                             |
|----------------------|---------------------------------------------------|
| **Issue ID**         | M4-05                                             |
| **Type**             | Validation                                        |
| **Status**           | Proposed                                          |
| **Milestone**        | M4 — Export and Release                           |
| **Capability Slice** | S-4 ("Экспортирую результаты")                    |
| **Priority**         | P0                                                |
| **Sequence Order**   | 5                                                 |
| **Depends On**       | M4-04 (Export Buttons to UI)                      |
| **Unlocks**          | M4-06 (GitHub Actions CI)                         |
| **FR References**    | FR-7.1, FR-7.2                                    |
| **AC References**    | AC-6.1, AC-6.2, AC-6.3, AC-6.4                   |
| **Decision Refs**    | —                                                 |
| **Demo Refs**        | S-4 demo steps 1–6                                |
| **Risk Refs**        | —                                                 |

## Goal

Validate that exported GraphML and CSV files open correctly in their target applications (yEd for GraphML, Microsoft Excel / LibreOffice Calc for CSV), completing the full S-4 demo flow on the demo dataset.

## Why Now

Export buttons are functional (M4-04). Before proceeding to release preparation, the actual exported files must be validated in real-world target applications. This is a critical quality gate: if files do not open correctly, the export feature fails its core purpose regardless of unit test results.

## User / System Outcome

Exported files are confirmed to work in their intended target applications. GraphML files display correctly in yEd with all nodes, edges, and attributes visible. CSV files open in Excel with proper column structure, encoding (no garbled Cyrillic characters), and data integrity.

## Scope

- Run the full S-4 demo scenario on the demo dataset:
  1. Load demo dataset in ArchiLens.
  2. Navigate to Impact Analyzer.
  3. Select an element and run impact analysis.
  4. Click "Export GraphML" → download file.
  5. Open the `.graphml` file in yEd.
  6. Verify: all affected nodes are present, edges connect correct nodes, node labels show names.
- CSV validation:
  1. Navigate to Table View in ArchiLens.
  2. Click "Export CSV" → download file.
  3. Open the `.csv` file in Microsoft Excel (or LibreOffice Calc).
  4. Verify: header row has all 9 columns, data rows present, UTF-8 characters display correctly, no garbled text.
- Document any issues found and file bugfix issues if needed.

## Out of Scope

- Automated validation (manual process for this issue).
- Testing in every possible spreadsheet application.
- Validating visual layout in yEd (only structural correctness).
- Performance testing of export.

## Preconditions

- M4-04: Export buttons are functional and produce file downloads.
- yEd Graph Editor installed (free download from yworks.com).
- Excel or LibreOffice Calc available for CSV validation.
- Demo dataset loaded and impact analysis working.

## Implementation Notes

- yEd validation: after opening, use "Fit Graph to Window" to see all nodes. Check Properties panel for node attributes. Verify edge connections.
- Excel validation: open CSV directly (File > Open). Check that the first row is a header. Check that Cyrillic or special characters in element names display correctly. Verify column count is 9.
- If BOM is missing, Excel may prompt for encoding — this is a failure of AC-6.4.
- Document results with screenshots.
- If any issue is found, create a bugfix issue before proceeding.

## Files and Artifacts Expected to Change

| Path                          | Change   |
|-------------------------------|----------|
| No code changes expected      | —        |
| Validation results (screenshots/notes) | Create |

## Acceptance Criteria

- [ ] GraphML file opens in yEd without error or warning.
- [ ] All affected nodes from the impact analysis are visible in yEd.
- [ ] Edges in yEd connect the correct source and target nodes.
- [ ] Node labels in yEd display element names.
- [ ] CSV file opens in Excel without encoding prompt.
- [ ] CSV header row shows all 9 expected columns.
- [ ] All data rows are present with correct values.
- [ ] Cyrillic and special characters display correctly (no garbled text).
- [ ] Full S-4 demo steps 1–6 complete successfully.

## Required Tests

### Functional

- GraphML file opens in yEd: nodes and edges render correctly.
- CSV file opens in Excel: columns and data are correct.
- Full S-4 demo scenario completes end-to-end.

### Manual

- Visual verification in yEd: node count matches expected affected elements.
- Visual verification in Excel: spot-check 5+ rows for data correctness.
- Screenshot capture of both applications showing successful import.

### Regression

- M1–M3 functionality still works (graph rendering, impact analysis, table view).
- Export buttons still trigger downloads after repeated use.

## Handoff to Next Issue

Export files are validated as working in target applications. The S-4 capability slice is confirmed complete. Release preparation can begin: CI setup (M4-06) and documentation (M4-07) can proceed with confidence that the core export feature is correct.

## Done Definition

- All acceptance criteria checked.
- GraphML validated in yEd.
- CSV validated in Excel or LibreOffice.
- No blocker bugs found (or bugfix issues filed and resolved).
- S-4 demo flow documented as passing.
