# M4-04 Implementation Report

## Issue

| Field | Value |
|-------|-------|
| **Issue ID** | M4-04 |
| **Title** | Add Export Buttons to UI |
| **Milestone** | M4 — Export and Release |
| **Status** | Done |

## What Was Done

1. Created **`downloadBlob`** utility (`src/utils/download.ts`) — triggers browser file download from a Blob via hidden `<a>` element.
2. Created **`sanitizeFileName`** utility — cleans element/model names for safe file names.
3. Created **`ExportButton`** component (`src/ui/components/ExportButton/`) — reusable styled button with disabled state.
4. Integrated **"Export GraphML"** button into Impact Analyzer toolbar — exports affected subgraph (source + affected nodes + edges between them).
5. Integrated **"Export CSV"** button into Table View toolbar — exports all elements.
6. Buttons are disabled when no data is available.

## Files Changed

| Path | Change |
|------|--------|
| `src/utils/download.ts` | Created |
| `src/utils/__tests__/download.test.ts` | Created — 6 tests |
| `src/ui/components/ExportButton/ExportButton.tsx` | Created |
| `src/ui/components/ExportButton/index.ts` | Created |
| `src/ui/components/ExportButton/__tests__/ExportButton.test.tsx` | Created — 4 tests |
| `src/ui/screens/ImpactAnalyzer/ImpactAnalyzerScreen.tsx` | Modified — Export GraphML button |
| `src/ui/screens/TableView/TableView.tsx` | Modified — Export CSV button |

## Acceptance Criteria

- [x] "Export GraphML" button is visible in the Impact Analyzer view.
- [x] Clicking "Export GraphML" triggers a `.graphml` file download.
- [x] Downloaded GraphML file name follows pattern `impact_{elementName}_{depth}.graphml`.
- [x] "Export CSV" button is visible in the Table View.
- [x] Clicking "Export CSV" triggers a `.csv` file download.
- [x] Downloaded CSV file name follows pattern `elements_{modelName}.csv`.
- [x] Buttons are disabled when no data is available.

## Checks Performed

- `npx vitest run` — **262/262 tests passed** (252 + 10 new)
- `npm run build` — successful
- `npm run lint` — 0 errors

## Unlocked

- **M4-05** — Validation: Export Files Open Correctly
