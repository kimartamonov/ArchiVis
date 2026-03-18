# Milestone M2: Impact Analysis

| Field              | Value                                          |
|--------------------|------------------------------------------------|
| **Milestone ID**   | M2                                             |
| **Name**           | Impact Analysis                                |
| **Status**         | Proposed                                       |
| **Capability Slice** | S-2 ("Анализирую impact изменения")          |
| **Decisions Needed** | D-12 (manual BFS preferred)                  |

## Goal

Deliver the second usable slice of ArchiLens: a user can search for any element, select it, and see a full impact analysis — affected elements at configurable depth (1/2/3), layer summary, affected diagrams, and visual highlighting on the global graph.

## User Outcome

A stakeholder searches for an element (e.g., "Payment Gateway"), selects it, and immediately sees how many elements are affected at depth 1, 2, or 3. The impact is broken down by ArchiMate layer, affected diagrams are listed, and the global graph highlights the impact subgraph. The user can switch depth and see results update live.

## Slices

- **S-2** — "Анализирую impact изменения"
  - FR covered: FR-3.1 – FR-3.8, FR-6.1 – FR-6.3, FR-8.6
  - AC covered: AC-3.1 – AC-3.9, AC-5.1, AC-5.2

## Issues (in sequence order)

| Seq | Issue ID | Title                                        | Type       | Priority |
|-----|----------|----------------------------------------------|------------|----------|
| 1   | M2-01    | Implement BFS Impact Analysis                | Engine     | P0       |
| 2   | M2-02    | Implement Layer Summary and Affected Diagrams | Engine    | P0       |
| 3   | M2-03    | Add Impact Analysis Unit Tests               | Test       | P0       |
| 4   | M2-04    | Build Global Search Bar                      | UI         | P0       |
| 5   | M2-05    | Build Impact Analyzer Screen                 | UI         | P0       |
| 6   | M2-06    | Add Depth Switcher                           | UI         | P0       |
| 7   | M2-07    | Add Impact Subgraph Highlighting             | UI         | P0       |
| 8   | M2-08    | Validation: MS-2 Canonical Impact Scenario   | Validation | P0       |

## Entry Criteria

- M1 (Model Visualization) is complete: graph engine built, stores created, global graph renders, node click shows element info, all M1 tests pass.

## Exit Criteria

- All S-2 demo steps pass end-to-end on demo dataset.
- AC-3.1 – AC-3.9, AC-5.1, AC-5.2 verified.
- Impact analysis completes within 1 second for 500 nodes.
- All unit tests pass with > 80% coverage on insight engine.
- No blocker bugs.

## Risks

| Risk ID | Description                    | Mitigation                                                                              |
|---------|--------------------------------|-----------------------------------------------------------------------------------------|
| R2      | Large graph performance        | Manual BFS (D-12); visited set prevents re-expansion; max depth cap at 3; perf budget < 1 sec |
| R3      | Metrics perceived as magic     | Layer summary provides transparency; depth switcher lets users explore incrementally     |

## Validation

Full S-2 demo flow executed on demo dataset:
1. Open app with demo dataset loaded (M1 prerequisite).
2. Type "Payment" in global search bar.
3. Select "Payment Gateway" from dropdown.
4. Impact Analyzer screen shows element card with metrics.
5. Affected elements listed at depth 1.
6. Switch depth to 2 — results update live, "Core Banking Platform" depth 2 shows 28 elements.
7. Layer summary shows per-layer counts summing to total.
8. Affected diagrams listed for source element.
9. Global graph highlights affected subgraph.
10. All unit tests green, coverage target met.
