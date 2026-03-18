# M1-01: Implement Demo Dataset Connector

## Metadata

| Field                | Value                                             |
|----------------------|---------------------------------------------------|
| **Issue ID**         | M1-01                                             |
| **Type**             | Integration                                       |
| **Status**           | Proposed                                          |
| **Milestone**        | M1 — Model Visualization                          |
| **Capability Slice** | S-1 ("Вижу модель как граф")                      |
| **Priority**         | P0                                                |
| **Sequence Order**   | 1                                                 |
| **Depends On**       | M0-03 (Core Types), M0-04 (Demo Dataset)          |
| **Unlocks**          | M1-07 (Connection Screen)                         |
| **FR References**    | FR-1.8                                            |
| **AC References**    | AC-1.4                                            |
| **Decision Refs**    | —                                                 |
| **Demo Refs**        | —                                                 |
| **Risk Refs**        | —                                                 |

## Goal

Create `DemoConnector` implementing the `DataConnector` interface. It loads a bundled demo JSON dataset and returns a `NormalizedModel`, providing an offline-first entry point for the application that requires no external API.

## Why Now

The demo connector is the simplest path to a working data pipeline. It allows the graph engine, stores, and UI to be developed and tested without depending on a live Architeezy instance. It also serves as the reference implementation of the `DataConnector` interface.

## User / System Outcome

A user clicks "Load Demo Dataset" and the app immediately loads a realistic ArchiMate model ("Digital Bank") without any network configuration. Developers have a stable, repeatable dataset for testing.

## Scope

- `src/connectors/demo/DemoConnector.ts` implementing `DataConnector`:
  - `connect()` — no-op (returns resolved promise).
  - `listModels()` — returns a single-item array: `[{ id: "demo", name: "Digital Bank" }]`.
  - `loadModel()` — fetches or statically imports the demo JSON file, parses it, and returns a `NormalizedModel`.
- `src/connectors/demo/index.ts` — barrel export.

## Out of Scope

- Architeezy API integration (M1-02).
- Validation beyond TypeScript type checking.
- Multiple demo datasets.
- Network calls to external services.

## Preconditions

- M0-03: `DataConnector` interface, `NormalizedModel`, `NormalizedElement`, `NormalizedRelationship` types are defined.
- M0-04: Demo dataset JSON file exists in `public/` or `src/data/`.

## Implementation Notes

- Import the demo JSON statically (`import demoData from ...`) or use `fetch('/demo-dataset.json')` if placed in `public/`.
- Static import is preferred for simplicity and zero network overhead.
- Map the raw JSON structure to `NormalizedModel` fields: `elements`, `relationships`, `diagrams`, `metadata`.
- If the JSON is already in `NormalizedModel` shape (from M0-04), mapping is trivial.

## Files and Artifacts Expected to Change

| Path                                    | Change   |
|-----------------------------------------|----------|
| `src/connectors/demo/DemoConnector.ts`  | Create   |
| `src/connectors/demo/index.ts`          | Create   |

## Acceptance Criteria

- [ ] `DemoConnector` implements the `DataConnector` interface without type errors.
- [ ] `connect()` resolves without error.
- [ ] `listModels()` returns `[{ id: "demo", name: "Digital Bank" }]`.
- [ ] `loadModel("demo")` returns a valid `NormalizedModel`.
- [ ] Element count in the returned model matches the demo dataset element count.
- [ ] Relationship count matches the demo dataset relationship count.

## Required Tests

### Functional

- `loadModel("demo")` returns a `NormalizedModel` with the expected element and relationship counts.
- `listModels()` returns exactly one model entry.
- `connect()` resolves without throwing.

### Smoke

- Importing `DemoConnector` and calling all three methods does not crash.

### Regression

- N/A (first connector; no prior behavior to regress).

## Handoff to Next Issue

The demo dataset is loadable via the standard `DataConnector` interface. `M1-07` (Connection Screen) can offer a "Load Demo Dataset" button that instantiates `DemoConnector` and calls `loadModel`. `M1-03` (Graph Engine) can use the output to build an `AnalysisGraph`.

## Done Definition

- All acceptance criteria checked.
- Code compiles without errors.
- Tests pass.
- `DemoConnector` exported from `src/connectors/demo/index.ts`.
