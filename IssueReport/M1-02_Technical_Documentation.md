# Technical Documentation: M1-02 — Architeezy Connector

## Purpose

`ArchiteezyConnector` is the production connector that integrates ArchiLens with live Architeezy instances. It implements the `DataConnector` interface and handles authentication, API communication, pagination, and normalization of the raw Architeezy API response.

---

## Architecture

```
src/connectors/
  types.ts                                ← DataConnector interface
  demo/                                   ← M1-01: offline connector
  architeezy/
    ArchiteezyConnector.ts               ← API client + DataConnector impl
    normalize.ts                          ← Raw API → NormalizedModel
    index.ts                              ← Barrel export
    __tests__/
      ArchiteezyConnector.test.ts        ← 13 unit tests (mocked fetch)
```

---

## API Communication

### Endpoints Used

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/users/current` | Connection test (200 = auth'd, 204 = anonymous) |
| `GET` | `/api/models?page=N&size=100` | Paginated model list |
| `GET` | `/api/models/{id}` | Model metadata (name) |
| `GET` | `/api/models/{id}/content?format=json` | Full model content (monolithic) |

### Authentication

- Bearer token via `Authorization: Bearer <token>` header
- Public projects work without token (API returns 204 for anonymous)
- Invalid tokens result in 401/403 → thrown as `Authentication failed` error

### Pagination

`listModels()` walks Spring Data pages (`page.totalPages`) fetching 100 models per page.

---

## Normalization Pipeline

The Architeezy API returns a single monolithic JSON with a recursive folder tree. `normalizeModelContent()` flattens this into `NormalizedModel`:

### Step 1: Collect raw elements
Recursive traversal of `content[0].data.folders[*]` → `elements[]` and nested `folders[]`.

### Step 2: Classify by eClass
- `archimate:ArchimateDiagramModel` → `NormalizedDiagram`
- `*Relationship` suffix → `NormalizedRelationship`
- Everything else → `NormalizedElement`

### Step 3: Extract diagram membership
Diagrams have `children[]` containing `DiagramModelArchimateObject` with `archimateElement` UUID references. These are recursively collected.

### Step 4: Reverse-map diagramIds
For each diagram, update referenced elements' `diagramIds[]` arrays.

### Step 5: Validate references
Relationships pointing to non-existent elements generate `broken_reference` warnings but are still included in the model.

### Edge Cases

| Case | Handling |
|------|----------|
| Element without `id` | Skipped, warning added |
| Element without `name` | `id` used as fallback name |
| Relationship missing source/target | Skipped, `incomplete_relationship` warning |
| Relationship referencing missing element | Included, `broken_reference` warning |
| Empty model (no folders) | Returns empty model with `empty_model` warning |

---

## Error Handling

| Scenario | Error Type | Message Pattern |
|----------|-----------|-----------------|
| Invalid URL format | `Error` | `Invalid Architeezy URL: ...` |
| Network unreachable | `Error` | `Network error connecting to Architeezy: ...` |
| 401/403 response | `Error` | `Authentication failed: ...` |
| Other HTTP errors | `Error` | `Architeezy API error: ...` |

---

## Testing Strategy

All tests use mocked `fetch` via `vi.stubGlobal`. No real API calls. The mock handler routes by URL pattern:
- `/api/users/current` → connection test
- `/content` → model content
- `/api/models` → model list or metadata

---

## Limitations

- No response caching — each `loadModel()` makes 2 HTTP calls (content + metadata)
- No progress reporting for large models
- CORS proxy path (`config.proxyUrl`) is plumbed but not tested end-to-end
- Metadata fetch failure is silently ignored (best-effort model name)

---

## Integration Points

- **M1-07 (Connection Screen):** user enters URL + token → `connect()` → `listModels()` → user picks model → `loadModel()`
- **M1-03 (Graph Engine):** `NormalizedModel` from `loadModel()` feeds into graph construction
- **M1-06 (Zustand Stores):** connector instance and loaded model stored in app state
