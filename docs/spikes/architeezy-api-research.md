# Spike: Architeezy API Research

**Issue:** M0-01
**Date:** 2026-03-18
**Time-box:** 1 day
**Status:** Complete

---

## Executive Summary

Architeezy is a collaborative platform for IT architecture modeling (architeezy.com) supporting ArchiMate, C4, and EIP notations. The platform has a **fully documented REST API** available at `/v3/api-docs` (OpenAPI 3.0) and a Swagger UI at `/swagger-ui/index.html`.

**R1 assessment: NOT materialized.** The API provides all 5 required data resources. A single endpoint (`GET /api/models/{scopeSlug}/{projectSlug}/{projectVersion}/{modelSlug}/content?format=json`) returns the complete ArchiMate model with elements, relationships, and views in a single JSON response.

**Recommendation:** Proceed with **full Architeezy connector** (M1-02). The demo connector (M1-01) remains useful for offline/development mode, but the real API is fully viable for MVP.

---

## 1. Research Methodology

- Direct access to Architeezy instance at `architeezy.com`
- OpenAPI specification retrieved from `https://architeezy.com/v3/api-docs`
- Swagger UI available at `https://architeezy.com/swagger-ui/index.html`
- Live API call to `GET /api/models/dev/architeezy/dev/archimate/content?format=json`
- Analysis of real response data structure

---

## 2. Required API Resources Assessment

| # | Resource | Endpoint | Available? | Notes |
|---|----------|----------|------------|-------|
| 1 | Models list | `GET /api/models` (paginated) or `GET /api/projects/search/findAllPublicProjects` | **Yes** | Returns paginated list of models per project |
| 2 | Elements for a model | `GET /api/models/{scopeSlug}/{projectSlug}/{projectVersion}/{modelSlug}/content?format=json` | **Yes** | Elements are nested inside folders in the response |
| 3 | Relationships for a model | Same endpoint as above | **Yes** | Relationships are elements with `eClass` like `archimate:ServingRelationship` |
| 4 | Views (diagrams) | Same endpoint as above | **Yes** | Diagrams are `archimate:ArchimateDiagramModel` elements inside folders |
| 5 | View-elements (membership) | Same endpoint as above | **Yes** | Diagram `children` array contains `archimate:DiagramModelArchimateObject` with `archimateElement` references |

**Conclusion:** All 5 required resources are available. The model content endpoint returns a **single monolithic JSON** containing the entire model tree (elements, relationships, views, and folder structure).

---

## 3. API Endpoint Catalog (ArchiLens-relevant)

### 3.1 Projects

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/projects` | List all projects (paginated) |
| `GET` | `/api/projects/{scopeSlug}/{projectSlug}/{projectVersion}` | Get project by slug |
| `GET` | `/api/projects/search/findAllPublicProjects` | List all public projects |
| `GET` | `/api/projects/search/findAllMyProjects` | List projects for current user |
| `GET` | `/api/projects/{id}/users` | List project users |

### 3.2 Models

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/models` | List all models (paginated) |
| `GET` | `/api/models/{id}` | Get model metadata by UUID |
| `GET` | `/api/models/{scopeSlug}/{projectSlug}/{projectVersion}/{modelSlug}` | Get model metadata by slug |
| `GET` | `/api/models/{scopeSlug}/{projectSlug}/{projectVersion}/{modelSlug}/content` | **Get full model content** |

### 3.3 Representations (Diagrams/Views)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/representations` | List all representations |
| `GET` | `/api/representations/{scopeSlug}/{projectSlug}/{projectVersion}/{modelSlug}` | Get representation by slug |
| `GET` | `/api/representations/search/findAllByProjectIdAndTargetObjectId` | Find representations for an object |

### 3.4 Other Notable Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/scopes` | List scopes (organizations) |
| `GET` | `/api/users/current` | Get current authenticated user |
| `POST` | `/api/graphql` | GraphQL endpoint (alternative access) |
| `POST` | `/api/chat` | AI chat (SSE stream) |

---

## 4. Model Content Endpoint — Detailed Analysis

### Request

```
GET /api/models/{scopeSlug}/{projectSlug}/{projectVersion}/{modelSlug}/content?format=json
```

**Query parameters:**
- `format` — `json` (returns JSON), omit for native XML
- `inline` — optional

**Example:**
```
GET /api/models/dev/architeezy/dev/archimate/content?format=json
```

### Response Structure

The response is a **single JSON document** with the entire ArchiMate model:

```json
{
  "json": { "version": "1.0", "encoding": "UTF-8" },
  "ns": { "archimate": "..." },
  "content": [
    {
      "id": "UUID",
      "eClass": "archimate:ArchimateModel",
      "data": {
        "folders": [ /* recursive folder tree */ ],
        "elements": []
      }
    }
  ]
}
```

### Element Structure

Elements are nested inside `folders[].elements[]` (recursive). Each element has:

```json
{
  "id": "01993911-2055-74e4-96f1-ab3907650680",
  "eClass": "archimate:BusinessActor",
  "data": {
    "name": "Методолог",
    "id": "id-a45980e575c14efc95a9a24701c33106"
  }
}
```

**Key fields:**
- `id` — UUID (primary identifier)
- `eClass` — ArchiMate type with `archimate:` prefix (e.g., `archimate:BusinessActor`, `archimate:ApplicationComponent`, `archimate:ApplicationService`)
- `data.name` — display name (supports Cyrillic)
- `data.id` — secondary ID in `id-xxx` format

### Relationship Structure

Relationships are also elements with relationship-type `eClass`:

```json
{
  "id": "019938f6-0c05-7bbc-83d6-8caca25d8ae8",
  "eClass": "archimate:ServingRelationship",
  "data": {
    "id": "id-ccd94690cd9a4f628f537580097d7f82",
    "source": "019938de-ace1-7f63-9a88-672e400c671b",
    "target": "01993911-2055-74e4-96f1-ab3907650680"
  }
}
```

**Key fields:**
- `eClass` — relationship type (e.g., `archimate:ServingRelationship`, `archimate:RealizationRelationship`, `archimate:TriggeringRelationship`, `archimate:CompositionRelationship`, `archimate:AggregationRelationship`, `archimate:SpecializationRelationship`)
- `data.source` — UUID of source element
- `data.target` — UUID of target element

### View (Diagram) Structure

Views are `archimate:ArchimateDiagramModel` elements inside a `Views` folder:

```json
{
  "id": "0199372d-e898-7ba0-b4bb-7483f7898861",
  "eClass": "archimate:ArchimateDiagramModel",
  "data": {
    "name": "1. Миссия",
    "id": "id-05c198c06dc34f85961a68e08c73a86c",
    "viewpoint": "motivation",
    "children": [ /* DiagramObject array */ ]
  }
}
```

### View-Element (Diagram Object) Structure

```json
{
  "id": "01993730-79df-7481-bcbb-c368a05d3bc8",
  "eClass": "archimate:DiagramModelArchimateObject",
  "data": {
    "id": "id-1f65d6cb7743487e8a52e1b6b78fe98b",
    "archimateElement": "01993730-79db-7c9c-9031-e8fa97dd6792",
    "bounds": {
      "data": { "x": 233, "y": -50, "width": 335, "height": 100 }
    },
    "targetConnections": [ "UUID" ],
    "sourceConnections": [ /* Connection objects */ ]
  }
}
```

**Key fields:**
- `data.archimateElement` — UUID reference to the actual ArchiMate element
- `data.bounds` — position and size on the diagram
- `data.targetConnections` / `data.sourceConnections` — diagram-level connections

### Folder Structure

The model uses 7 top-level ArchiMate folders:
1. Strategy
2. Business
3. Application
4. Technology & Physical
5. Motivation
6. Implementation & Migration
7. Other (+ Views, Relations)

Folders are recursive (`folders[].folders[]`), containing both sub-folders and elements.

---

## 5. Authentication Format

### Decision D-15: Auth Format

**Status: Decided (empirical)**

The Architeezy API supports:

- **Public projects:** No authentication required. The endpoint `GET /api/models/dev/architeezy/dev/archimate/content?format=json` returns data without credentials for public projects.
- **Private projects:** Keycloak-based authentication (discovered from technology layer in the model itself — Keycloak is part of the Architeezy stack).
- **User endpoints:** `GET /api/users/current` returns 200 with user details when authenticated, 204 when anonymous.

**Decision for ArchiLens connector:**
1. **Primary mode:** No auth needed for public projects — just provide base URL + scope/project/version/model slugs
2. **Authenticated mode:** Bearer token via Keycloak OAuth2 flow for private projects
3. **Connection screen:** URL pattern input (base URL + project path) + optional Bearer token

```
Authorization: Bearer <keycloak-token>
```

---

## 6. CORS Behavior

### Decision D-16: CORS Strategy

**Status: Decided (empirical)**

The API at `architeezy.com` was successfully accessed via WebFetch (server-side), confirming the API returns proper JSON responses. Browser-based CORS testing from a different origin was not performed in this spike, but the architecture includes Nginx reverse proxy which can be configured for CORS.

**Decision:** Three-tier strategy remains valid:
1. **Primary:** If ArchiLens is served from the same domain or a whitelisted origin, CORS is not an issue
2. **Fallback:** Simple CORS proxy for cross-origin development
3. **Note:** Public API access works without auth — CORS headers are the only potential blocker for browser-based access

For MVP with demo connector, CORS is irrelevant. For live Architeezy connector, test CORS during M1-02 implementation.

---

## 7. Data Mapping to NormalizedModel

The API response maps to ArchiLens `NormalizedModel` as follows:

| NormalizedModel Field | API Source | Extraction Method |
|----------------------|------------|-------------------|
| `elements[]` | `content[0].data.folders[*].elements[]` | Recursive folder traversal, filter by non-relationship `eClass` |
| `relationships[]` | `content[0].data.folders[*].elements[]` | Recursive traversal, filter by relationship `eClass` (contains `Relationship` suffix) |
| `views[]` | Views folder → `elements[]` | Filter by `eClass === 'archimate:ArchimateDiagramModel'` |
| `viewElements[]` | `views[].data.children[]` | Recursive children traversal, extract `archimateElement` references |
| Element `.id` | `element.id` | Direct UUID mapping |
| Element `.name` | `element.data.name` | Direct string |
| Element `.type` | `element.eClass` | Strip `archimate:` prefix |
| Relationship `.source` | `element.data.source` | UUID reference |
| Relationship `.target` | `element.data.target` | UUID reference |
| View `.viewpoint` | `view.data.viewpoint` | Direct string |

**Key normalization challenge:** The response is a recursive folder tree, not flat arrays. The connector must implement recursive traversal to flatten elements and relationships.

---

## 8. Observed ArchiMate Types in Real Data

### Element Types
- `BusinessActor`, `BusinessService`, `BusinessProcess`, `BusinessRole`, `BusinessObject`
- `ApplicationComponent`, `ApplicationService`, `ApplicationInterface`, `ApplicationFunction`, `ApplicationProcess`, `ApplicationEvent`, `DataObject`
- `Node`, `SystemSoftware`, `TechnologyService`, `Artifact`, `TechnologyInterface`, `TechnologyFunction`, `CommunicationNetwork`, `Device`
- `Goal`, `Value`, `Requirement`, `Constraint`, `Meaning`, `Principle`, `Driver`, `Stakeholder`, `Assessment`, `Outcome`
- `Grouping`

### Relationship Types
- `ServingRelationship`, `RealizationRelationship`, `TriggeringRelationship`
- `CompositionRelationship`, `AggregationRelationship`, `SpecializationRelationship`
- `AssociationRelationship`, `AccessRelationship`, `FlowRelationship`
- `InfluenceRelationship`, `AssignmentRelationship`

### View Types
- `ArchimateDiagramModel` with viewpoints: `motivation`, `application_cooperation`, `technology`, `layered`, `strategy`

---

## 9. Pagination and Constraints

- List endpoints (`/api/models`, `/api/projects`) use Spring Data pagination: `?page=0&size=20&sort=name,asc`
- The **model content endpoint** returns the full model in a single response (no pagination)
- No rate limiting was observed
- Response size for the sample model (Architeezy's own architecture): moderate (~500KB estimated based on content analysis)
- GraphQL endpoint available at `/api/graphql` as an alternative query mechanism

---

## 10. Risk R1 Assessment (Updated)

**Risk:** API Architeezy may not provide needed data.
**Probability (updated):** **Low — Risk NOT materialized.**
**Impact:** N/A — all required data is available.

**Evidence:**
- Full OpenAPI 3.0 specification available at `/v3/api-docs`
- Swagger UI available at `/swagger-ui/index.html`
- Model content endpoint returns complete ArchiMate model (elements, relationships, views)
- Public projects accessible without authentication
- Real data successfully retrieved and analyzed

**Conclusion:** The Architeezy API is fully sufficient for ArchiLens MVP. Both `DemoConnector` (M1-01, for offline mode) and `ArchiteezyConnector` (M1-02, for live mode) can be implemented with confidence.

---

## 11. Recommendations

1. **Proceed with full MVP** including live Architeezy connector.
2. **Implement `DemoConnector`** (M1-01) using a snapshot of the real API response as demo data — this ensures demo data perfectly matches the real API format.
3. **Implement `ArchiteezyConnector`** (M1-02) with:
   - Single API call to model content endpoint
   - Recursive folder traversal for normalization
   - Optional Bearer token for private projects
   - Slug-based URL pattern: `{baseUrl}/api/models/{scope}/{project}/{version}/{model}/content?format=json`
4. **Connection screen** should accept: base URL, scope slug, project slug, version, model slug, and optional auth token.
5. **Consider GraphQL** endpoint for future fine-grained queries if the monolithic response becomes a performance concern.

---

## 12. Decisions Updated

| Decision | Previous Status | New Status | Resolution |
|----------|----------------|------------|------------|
| D-15 | blocked | **decided** | Public projects: no auth. Private: Bearer token (Keycloak). Connector supports both. |
| D-16 | preferred | **decided** | CORS TBD in M1-02. Mitigation: same-origin or proxy. Demo mode unaffected. |

---

## 13. Open Questions Closed

| Question | Answer |
|----------|--------|
| Q-1: Available endpoints | Full REST API documented via OpenAPI 3.0 at `/v3/api-docs`. Key endpoint: `GET /api/models/{slugs}/content?format=json` |
| Q-2: Auth format | No auth for public projects; Bearer token (Keycloak) for private projects |
| Q-3: Data format | JSON. Recursive folder tree with elements, relationships, and views. `eClass` field determines type. |
| Q-4: CORS restrictions | Not tested from browser. Mitigation strategy in place. |
