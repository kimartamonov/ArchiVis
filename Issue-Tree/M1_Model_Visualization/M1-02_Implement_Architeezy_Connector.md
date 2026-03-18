# M1-02: Implement Architeezy Connector

## Metadata

| Field                | Value                                                        |
|----------------------|--------------------------------------------------------------|
| **Issue ID**         | M1-02                                                        |
| **Type**             | Integration                                                  |
| **Status**           | Proposed                                                     |
| **Milestone**        | M1 — Model Visualization                                     |
| **Capability Slice** | S-1 ("Вижу модель как граф")                                 |
| **Priority**         | P0                                                           |
| **Sequence Order**   | 2                                                            |
| **Depends On**       | M0-01 (Architeezy API Spike), M0-03 (Core Types)             |
| **Unlocks**          | M1-07 (Connection Screen)                                    |
| **FR References**    | FR-1.1, FR-1.2, FR-1.3, FR-1.5                              |
| **AC References**    | AC-1.1, AC-1.2, AC-1.3                                      |
| **Decision Refs**    | D-15, D-16                                                   |
| **Demo Refs**        | —                                                            |
| **Risk Refs**        | R1 (API availability/shape), R4 (CORS)                       |

## Goal

Create `ArchiteezyConnector` implementing the `DataConnector` interface. It connects to a live Architeezy REST API, authenticates with a bearer token, fetches models, elements, relationships, and diagrams, and normalizes the response into a `NormalizedModel`.

## Why Now

The Architeezy connector is the production data path. While the demo connector (M1-01) unblocks development, this connector proves that ArchiLens can work against a real ArchiMate repository. The M0-01 spike has already mapped the API endpoints and auth mechanism.

## User / System Outcome

A user enters an Architeezy server URL and API token, clicks Connect, and sees a list of available models. Selecting a model fetches all its elements, relationships, and diagrams for visualization. Errors (bad credentials, unreachable server, CORS) are surfaced clearly.

## Scope

- `src/connectors/architeezy/ArchiteezyConnector.ts` implementing `DataConnector`:
  - `connect(config: { url: string; token: string })` — validates URL format, makes a test request to verify credentials. Throws on failure.
  - `listModels()` — fetches the model list from the API. Returns `ModelListItem[]`.
  - `loadModel(id: string)` — fetches elements, relationships, and diagrams for the given model ID. Handles pagination if the API paginates. Normalizes to `NormalizedModel`. Collects warnings for broken references (e.g., relationship pointing to nonexistent element).
- `src/connectors/architeezy/normalize.ts` — mapping functions from raw API shapes to `NormalizedModel`.
- `src/connectors/architeezy/index.ts` — barrel export.

## Out of Scope

- CORS proxy implementation (documented as deployment concern).
- Response caching or local persistence.
- Progress reporting / streaming.
- WebSocket or real-time sync.

## Preconditions

- M0-01 spike complete: API endpoints, auth mechanism, response shapes, and pagination behavior are documented.
- M0-03: `DataConnector` interface, `NormalizedModel`, and related types are defined.

## Implementation Notes

- Use the `fetch` API. Set `Authorization: Bearer <token>` header (or whatever auth mechanism the spike revealed).
- Request sequence for `loadModel`: elements → relationships → diagrams (sequential to avoid overwhelming the server; can be parallelized later if safe).
- Normalize raw API responses: map API field names to `NormalizedElement`, `NormalizedRelationship`, `NormalizedDiagram`.
- Skip elements without an `id` field. Use `id` as `name` if `name` is missing.
- For relationships: if `source` or `target` element is not in the fetched element set, still include the relationship but add a `BrokenReference` warning.
- Collect all warnings in a `warnings: string[]` array on the `NormalizedModel`.

## Files and Artifacts Expected to Change

| Path                                             | Change   |
|--------------------------------------------------|----------|
| `src/connectors/architeezy/ArchiteezyConnector.ts` | Create |
| `src/connectors/architeezy/normalize.ts`         | Create   |
| `src/connectors/architeezy/index.ts`             | Create   |

## Acceptance Criteria

- [ ] `connect({ url, token })` with valid credentials resolves without error.
- [ ] `connect()` with invalid token throws an authentication error.
- [ ] `connect()` with unreachable URL throws a network error.
- [ ] `listModels()` returns a non-empty array of `ModelListItem` from a real or mocked API.
- [ ] `loadModel(id)` returns a valid `NormalizedModel` with elements, relationships, and diagrams.
- [ ] Missing element names default to the element's ID.
- [ ] Broken references (relationship pointing to missing element) are collected as warnings, not thrown as errors.
- [ ] Pagination is handled (all pages fetched).

## Required Tests

### Functional

- Mock API responses → `loadModel` produces correct `NormalizedModel` with expected element/relationship/diagram counts.
- Invalid auth response (401/403) → `connect` throws descriptive error.
- Network error (fetch rejects) → `connect` throws descriptive error.
- Missing `name` field on element → `id` used as name in output.
- Broken reference → warning collected, relationship still included.

### Smoke

- Connector instantiates without error.
- All methods are callable (type-level check).

### Regression

- `DemoConnector` (M1-01) still works after this change.
- `DataConnector` interface is unchanged.

## Handoff to Next Issue

Both `DemoConnector` and `ArchiteezyConnector` implement `DataConnector`. The Connection Screen (M1-07) can instantiate either connector based on user action (demo button vs. connect form). The returned `NormalizedModel` feeds into the Graph Engine (M1-03).

## Done Definition

- All acceptance criteria checked.
- Code compiles without errors.
- Tests pass (mocked API — real API test is manual/separate).
- Connector exported from `src/connectors/architeezy/index.ts`.
- Normalization logic handles all edge cases from the spike findings.
