# Milestone M4: Export and Release

| Field              | Value                                                     |
|--------------------|-----------------------------------------------------------|
| **Milestone ID**   | M4                                                        |
| **Name**           | Export and Release                                        |
| **Status**         | Proposed                                                  |
| **Capability Slice** | S-4 ("Экспортирую результаты") + Release preparation   |
| **Decisions Needed** | D-7 (MIT license)                                       |

## Goal

Deliver the final MVP slice: export analysis results as GraphML (compatible with yEd) and CSV (UTF-8 BOM for Excel), set up CI, write documentation, run E2E smoke tests, and validate the complete MVP against all acceptance criteria and Definition of Done.

## User Outcome

A user completes their analysis in ArchiLens, exports the impact subgraph as a `.graphml` file that opens cleanly in yEd, and exports the element table as a `.csv` file that opens in Excel with correct encoding. The project is publicly released under MIT license with a README that enables a new user to get started in under 5 minutes.

## Slices

- **S-4** — "Экспортирую результаты"
  - FR covered: FR-7.1, FR-7.2
  - AC covered: AC-6.1 – AC-6.4
- **Release preparation**
  - CI, documentation, E2E, final validation

## Issues (in sequence order)

| Seq | Issue ID | Title                                  | Type        | Priority |
|-----|----------|----------------------------------------|-------------|----------|
| 1   | M4-01    | Implement GraphML Export Generator     | Engine      | P0       |
| 2   | M4-02    | Implement CSV Export Generator         | Engine      | P0       |
| 3   | M4-03    | Add Export Unit Tests                  | Test        | P0       |
| 4   | M4-04    | Add Export Buttons to UI               | UI          | P0       |
| 5   | M4-05    | Validation: Export Files Open Correctly| Validation  | P0       |
| 6   | M4-06    | Setup GitHub Actions CI                | Infra       | P0       |
| 7   | M4-07    | Write README and Project Documentation | Docs        | P0       |
| 8   | M4-08    | E2E Smoke Test                         | Test        | P0       |
| 9   | M4-09    | Final Validation: MVP Acceptance       | Validation  | P0       |

## Entry Criteria

- M1 (Model Visualization) is complete: graph engine, connectors, and graph view working.
- M2 (Impact Analysis) is complete: impact analysis engine and UI functional.
- M3 (Quality Assessment) is complete: table view, metrics, and quality checks working.

## Exit Criteria

- All S-4 demo steps pass end-to-end on demo dataset.
- AC-6.1 – AC-6.4 verified.
- GraphML opens in yEd without error.
- CSV opens in Excel with correct UTF-8 encoding.
- E2E smoke test passes in CI.
- README enables < 5 min onboarding.
- MIT license in place.
- All P0 FR implemented across M1–M4.
- No blocker bugs.

## Risks

| Risk ID | Description                  | Mitigation                                                         |
|---------|------------------------------|--------------------------------------------------------------------|
| R6      | Bus factor 1                 | Comprehensive documentation; CI automation; clear README; MIT license enables community contribution |

## Validation

Full S-4 demo flow and complete MVP acceptance:
1. Run impact analysis on demo dataset → export GraphML → open in yEd → verify nodes/edges.
2. Export CSV → open in Excel/LibreOffice → verify columns and UTF-8 encoding.
3. CI green on push.
4. New user follows README → app running in < 5 minutes.
5. Full canonical scenario SC-1 passes end-to-end.
6. All acceptance criteria groups AC-1 through AC-6 verified.
