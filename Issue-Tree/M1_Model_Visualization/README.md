# Milestone M1: Model Visualization

| Field              | Value                                      |
|--------------------|--------------------------------------------|
| **Milestone ID**   | M1                                         |
| **Name**           | Model Visualization                        |
| **Status**         | Proposed                                   |
| **Capability Slice** | S-1 ("Вижу модель как граф")             |
| **Decisions Needed** | D-3 (React Flow), D-11 (elkjs preferred) |

## Goal

Deliver the first usable slice of ArchiLens: a user can connect to an Architeezy repository (or load a demo dataset), see the full ArchiMate model rendered as an interactive graph with layer-colored nodes, and click any element to inspect its basic properties and degree metrics.

## User Outcome

A stakeholder opens ArchiLens, loads either a demo dataset or connects to a live Architeezy instance, and immediately sees the architecture model laid out as a navigable, color-coded graph. Clicking any node reveals the element's name, type, layer, and connectivity metrics.

## Slices

- **S-1** — "Вижу модель как граф"
  - FR covered: FR-1.1 – FR-1.8, FR-2.1 – FR-2.9, FR-8.1, FR-8.3 – FR-8.6
  - AC covered: AC-1.1 – AC-1.4, AC-2.1 – AC-2.5

## Issues (in sequence order)

| Seq | Issue ID | Title                                  | Type        | Priority |
|-----|----------|----------------------------------------|-------------|----------|
| 1   | M1-01    | Implement Demo Dataset Connector       | Integration | P0       |
| 2   | M1-02    | Implement Architeezy Connector         | Integration | P0       |
| 3   | M1-03    | Build Graph Engine                     | Engine      | P0       |
| 4   | M1-04    | Calculate Base Metrics                 | Engine      | P0       |
| 5   | M1-05    | Add Graph Engine Unit Tests            | Test        | P0       |
| 6   | M1-06    | Create Zustand Stores                  | Implementation | P0    |
| 7   | M1-07    | Build Connection Screen                | UI          | P0       |
| 8   | M1-08    | Build Global Graph View                | UI          | P0       |
| 9   | M1-09    | Add Node Click → Element Info Popup    | UI          | P0       |
| 10  | M1-10    | Validation: MS-1 Graph Visualization   | Validation  | P0       |

## Entry Criteria

- M0 (Project Scaffold) is complete: repo scaffolded, types defined, demo dataset created, spike results documented.

## Exit Criteria

- All S-1 demo steps pass end-to-end on demo dataset.
- AC-1.1, AC-1.4, AC-2.1 – AC-2.5 verified.
- Graph renders within 5 seconds for 200 elements.
- All unit tests pass with > 80 % coverage on graph engine.
- No blocker bugs.

## Risks

| Risk ID | Description                  | Mitigation                                           |
|---------|------------------------------|------------------------------------------------------|
| R2      | Large graph performance      | elkjs layout; React Flow virtualization; test with demo dataset size; set 5-sec budget |
| R4      | CORS on Architeezy API       | Demo dataset as fallback; document proxy setup; connection screen shows clear error     |

## Validation

Full S-1 demo flow executed on demo dataset:
1. Open app → Connection Screen appears.
2. Click "Load Demo Dataset" → model loads.
3. Graph renders with correct node/edge count and layer colors.
4. Zoom / pan works smoothly.
5. Click a node → Element Info popup shows name, type, layer, degree.
6. All unit tests green, coverage target met.
