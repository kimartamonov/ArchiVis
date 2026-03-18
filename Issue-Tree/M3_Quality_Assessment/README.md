# Milestone M3: Quality Assessment

| Field              | Value                                                  |
|--------------------|--------------------------------------------------------|
| **Milestone ID**   | M3                                                     |
| **Name**           | Quality Assessment                                     |
| **Status**         | Proposed                                               |
| **Capability Slice** | S-3 ("Оцениваю качество модели")                    |
| **Decisions Needed** | D-14 (TanStack Table preferred)                      |

## Goal

Deliver the third usable slice of ArchiLens: a user can view all model elements in a sortable/filterable table, run a coverage report to identify orphan elements and structural gaps, navigate between all application screens, and drill into any element from any context.

## User Outcome

An architect opens ArchiLens with a loaded model, switches to Table View to see all elements with degree metrics, sorts and filters to find hubs and anomalies, opens the Coverage screen to see orphan statistics (e.g., "11 orphan elements — 11.6 %"), clicks an orphan to inspect it, and navigates freely between all screens without losing context.

## Slices

- **S-3** — "Оцениваю качество модели"
  - FR covered: FR-4.1 – FR-4.5, FR-5.1 – FR-5.3, FR-2.4, FR-2.5, FR-6.4
  - AC covered: AC-4.1 – AC-4.3, AC-5.3

## Issues (in sequence order)

| Seq | Issue ID | Title                                  | Type        | Priority |
|-----|----------|----------------------------------------|-------------|----------|
| 1   | M3-01    | Build Table View with TanStack Table   | UI          | P0       |
| 2   | M3-02    | Implement Coverage Report              | Engine      | P0       |
| 3   | M3-03    | Build Coverage Screen                  | UI          | P0       |
| 4   | M3-04    | Add Screen Navigation                  | UI          | P0       |
| 5   | M3-05    | Add Cross-Screen Transitions           | UI          | P0       |
| 6   | M3-06    | Validation: MS-3 Coverage and Table    | Validation  | P0       |

## Entry Criteria

- M1 (Model Visualization) is complete: graph engine, stores, graph view, element info working.
- M2 (Impact Analysis) is complete: Impact Analyzer screen operational.
- AnalysisGraph with node metrics (degree, inDegree, outDegree, diagramsCount, isOrphan) available.

## Exit Criteria

- All S-3 demo steps pass end-to-end on demo dataset.
- AC-4.1 – AC-4.3, AC-5.3 verified.
- Table View renders and sorts 200 elements smoothly.
- Coverage report correctly identifies 11 orphan elements (11.6 %) on demo dataset.
- Navigation between all screens works without state loss.
- All unit tests pass.
- No blocker bugs.

## Risks

| Risk ID | Description                        | Mitigation                                                        |
|---------|------------------------------------|-------------------------------------------------------------------|
| R5      | TanStack Table bundle size         | Tree-shaking; only import used features; monitor bundle           |
| R6      | Orphan heuristic edge cases        | Clear definition: isOrphan = degree==0 OR diagramsCount==0; unit tests with known data |

## Validation

Full S-3 demo flow executed on demo dataset:
1. Open Table View → all elements displayed with columns.
2. Sort by degree (descending) → hub element appears first.
3. Filter by "Technology" layer → only Technology elements shown.
4. Switch to Coverage screen → see "11 orphan elements (11.6 %)".
5. Click an orphan element → element card / Impact Analyzer opens.
6. Navigate between all screens freely → no state loss, no crashes.
