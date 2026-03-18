# M4-04: Add Export Buttons to UI

## Metadata

| Field                | Value                                                              |
|----------------------|--------------------------------------------------------------------|
| **Issue ID**         | M4-04                                                              |
| **Type**             | UI                                                                 |
| **Status**           | Proposed                                                           |
| **Milestone**        | M4 — Export and Release                                            |
| **Capability Slice** | S-4 ("Экспортирую результаты")                                     |
| **Priority**         | P0                                                                 |
| **Sequence Order**   | 4                                                                  |
| **Depends On**       | M4-01 (GraphML), M4-02 (CSV), M2-05 (Impact UI), M3-01 (Table View) |
| **Unlocks**          | M4-05 (Export File Validation)                                     |
| **FR References**    | FR-7.1, FR-7.2                                                     |
| **AC References**    | AC-6.1 – AC-6.4                                                    |
| **Decision Refs**    | —                                                                  |
| **Demo Refs**        | SC-1 steps 11–12                                                   |
| **Risk Refs**        | —                                                                  |

## Goal

Add an "Export GraphML" button to the Impact Analyzer view and an "Export CSV" button to the Table View, wiring them to the export generators and triggering browser file downloads with meaningful file names.

## Why Now

The export generators (M4-01, M4-02) are implemented and tested (M4-03). The Impact Analyzer UI (M2-05) and Table View (M3-01) are functional. This issue connects the generators to the UI, completing the user-facing export capability. It unblocks validation (M4-05) where exported files are tested in target applications.

## User / System Outcome

A user analyzing impact clicks "Export GraphML" and receives a `.graphml` file download named `impact_{elementName}_{depth}.graphml`. A user viewing the element table clicks "Export CSV" and receives a `.csv` file download named `elements_{modelName}.csv`. Both downloads happen instantly in the browser with no server round-trip.

## Scope

- `src/ui/components/ExportButton/ExportButton.tsx`:
  - Reusable button component accepting `onClick`, `label`, and `disabled` props.
- `src/ui/components/ExportButton/index.ts` — barrel export.
- Integration in Impact Analyzer view:
  - "Export GraphML" button.
  - On click: call `generateGraphML(affectedNodes, affectedEdges)`.
  - Create `Blob` from string with `type: 'application/xml'`.
  - Trigger download via `URL.createObjectURL` + hidden `<a>` element with `download` attribute.
  - File name: `impact_{elementName}_{depth}.graphml`.
- Integration in Table View:
  - "Export CSV" button.
  - On click: call `generateCSV(visibleNodes)`.
  - Create `Blob` from string with `type: 'text/csv;charset=utf-8'`.
  - Trigger download similarly.
  - File name: `elements_{modelName}.csv`.
- Download utility: `src/utils/download.ts`:
  - Function: `downloadBlob(blob: Blob, filename: string): void`.

## Out of Scope

- Export format selection dialog (e.g., dropdown choosing between formats).
- Full graph GraphML export (only impact subgraph).
- Server-side export or API endpoints.
- Export progress indicator (generation is synchronous and fast).

## Preconditions

- M4-01: `generateGraphML` is implemented and exported.
- M4-02: `generateCSV` is implemented and exported.
- M4-03: Export unit tests pass.
- M2-05: Impact Analyzer UI renders and provides access to affected nodes/edges.
- M3-01: Table View renders and provides access to visible nodes.

## Implementation Notes

- The download pattern is standard browser-side:
  ```
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
  ```
- Sanitize element/model names in file names (remove special characters, limit length).
- Buttons should be disabled when no data is available (e.g., no impact analysis run yet).
- Place buttons in a consistent location: toolbar area of each respective view.

## Files and Artifacts Expected to Change

| Path                                              | Change   |
|---------------------------------------------------|----------|
| `src/ui/components/ExportButton/ExportButton.tsx` | Create   |
| `src/ui/components/ExportButton/index.ts`         | Create   |
| `src/utils/download.ts`                           | Create   |
| Impact Analyzer view component                    | Update   |
| Table View component                              | Update   |

## Acceptance Criteria

- [ ] "Export GraphML" button is visible in the Impact Analyzer view.
- [ ] Clicking "Export GraphML" triggers a `.graphml` file download.
- [ ] Downloaded GraphML file name follows pattern `impact_{elementName}_{depth}.graphml`.
- [ ] "Export CSV" button is visible in the Table View.
- [ ] Clicking "Export CSV" triggers a `.csv` file download.
- [ ] Downloaded CSV file name follows pattern `elements_{modelName}.csv`.
- [ ] Buttons are disabled when no data is available.
- [ ] Downloaded files contain correct data (verified by opening).

## Required Tests

### Functional

- Clicking "Export GraphML" produces a file download (verify via test spy or mock).
- Clicking "Export CSV" produces a file download.
- File names match expected patterns.
- Downloaded content matches generator output.

### Smoke

- Buttons render without crash.
- Clicking export on an empty dataset does not crash (button should be disabled or produce empty valid file).
- Repeated clicks produce multiple downloads without error.

### Regression

- Impact Analyzer view still functions correctly after button addition.
- Table View still functions correctly after button addition.
- Navigation between views is unaffected.

## Handoff to Next Issue

Export is fully functional end-to-end in the UI. Users can download GraphML and CSV files from their respective views. M4-05 can now validate that the exported files open correctly in yEd and Excel.

## Done Definition

- All acceptance criteria checked.
- Code compiles without errors.
- Both export buttons visible and functional.
- File downloads work in Chrome and Firefox.
- No regressions in existing UI behavior.
