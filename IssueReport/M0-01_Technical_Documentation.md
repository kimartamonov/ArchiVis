# M0-01 Technical Documentation

**Issue:** M0-01 — Spike: Research Architeezy API
**Date:** 2026-03-18

---

## 1. Purpose

This document captures the technical findings from the Architeezy API research spike. It serves as the authoritative reference for implementing the `ArchiteezyConnector` (M1-02) and designing domain types (M0-03).

---

## 2. Architeezy Platform Overview

- **URL:** https://architeezy.com
- **Type:** Collaborative platform for IT architecture modeling
- **Supported notations:** ArchiMate, C4, EIP
- **API documentation:** OpenAPI 3.0 at `/v3/api-docs`, Swagger UI at `/swagger-ui/index.html`
- **Architecture:** Spring Boot backend, Keycloak auth, Nginx reverse proxy, PostgreSQL, Docker

---

## 3. API Access Pattern for ArchiLens

### Primary Endpoint

```
GET /api/models/{scopeSlug}/{projectSlug}/{projectVersion}/{modelSlug}/content?format=json
```

This single endpoint returns the **complete ArchiMate model** as a monolithic JSON document containing all elements, relationships, views, and folder structure.

### URL Construction

```
https://{baseUrl}/api/models/{scopeSlug}/{projectSlug}/{projectVersion}/{modelSlug}/content?format=json
```

**Example:**
```
https://architeezy.com/api/models/dev/architeezy/dev/archimate/content?format=json
```

The slug components correspond to Architeezy's hierarchy:
- `scopeSlug` — organization/scope (e.g., `dev`)
- `projectSlug` — project name (e.g., `architeezy`)
- `projectVersion` — version (e.g., `dev`)
- `modelSlug` — model name (e.g., `archimate`)

### Supporting Endpoints

| Endpoint | Use in ArchiLens |
|----------|-----------------|
| `GET /api/projects/search/findAllPublicProjects` | Populate model selector dropdown |
| `GET /api/projects/{scopeSlug}/{projectSlug}/{projectVersion}` | Validate project exists |
| `GET /api/users/current` | Validate authentication |

---

## 4. Response Schema

### Top-Level Structure

```typescript
interface ArchiteezyResponse {
  json: { version: string; encoding: string };
  ns: { archimate: string };
  content: ArchimateModel[];
}

interface ArchimateModel {
  id: string;           // UUID
  eClass: 'archimate:ArchimateModel';
  data: {
    folders: Folder[];
    elements: Element[]; // usually empty at root level
  };
}
```

### Folder (Recursive)

```typescript
interface Folder {
  id: string;           // UUID
  eClass: 'archimate:Folder';
  data: {
    name: string;       // e.g., "Business", "Application", "Views"
    id: string;         // secondary ID: "id-xxx"
    type?: string;      // e.g., "business", "application", "technology"
    elements: Element[];
    folders?: Folder[];  // recursive sub-folders
  };
}
```

### Element

```typescript
interface Element {
  id: string;           // UUID (primary key)
  eClass: string;       // e.g., "archimate:BusinessActor"
  data: {
    name: string;
    id: string;         // secondary ID: "id-xxx"
    documentation?: string;
    properties?: Property[];
  };
}
```

### Relationship

Relationships are Elements with relationship-type `eClass`:

```typescript
interface Relationship {
  id: string;
  eClass: string;       // e.g., "archimate:ServingRelationship"
  data: {
    id: string;
    name?: string;
    source: string;     // UUID of source element
    target: string;     // UUID of target element
  };
}
```

**Distinguishing elements from relationships:** Check if `eClass` contains `Relationship` (e.g., `archimate:ServingRelationship`).

### Diagram (View)

```typescript
interface DiagramModel {
  id: string;
  eClass: 'archimate:ArchimateDiagramModel';
  data: {
    name: string;
    id: string;
    viewpoint: string;  // e.g., "motivation", "application_cooperation"
    children: DiagramObject[];
  };
}
```

### Diagram Object (View-Element)

```typescript
interface DiagramObject {
  id: string;
  eClass: 'archimate:DiagramModelArchimateObject';
  data: {
    id: string;
    archimateElement: string;  // UUID reference to Element
    bounds: {
      data: { x: number; y: number; width: number; height: number };
    };
    targetConnections?: string[];
    sourceConnections?: Connection[];
    children?: DiagramObject[];  // nested visual elements
  };
}
```

---

## 5. Normalization Algorithm

The connector must implement a recursive traversal to flatten the folder tree:

```
function extractAll(folders: Folder[]): { elements, relationships, views }
  for each folder in folders:
    for each element in folder.elements:
      if element.eClass contains "Relationship":
        relationships.push(normalize(element))
      else if element.eClass === "archimate:ArchimateDiagramModel":
        views.push(normalizeView(element))
      else:
        elements.push(normalize(element))
    if folder has sub-folders:
      recurse into folder.folders
```

**Key normalization rules:**
1. Strip `archimate:` prefix from `eClass` to get ArchiMate type name
2. Use `element.id` (UUID) as the canonical identifier
3. Map `data.source`/`data.target` UUIDs for relationships
4. Extract `data.children[].data.archimateElement` for view membership
5. Preserve `data.name`, `data.documentation`, `data.viewpoint`

---

## 6. Authentication

| Scenario | Auth Required | Method |
|----------|--------------|--------|
| Public project | No | Direct HTTP GET |
| Private project | Yes | `Authorization: Bearer <keycloak-token>` |

**Keycloak integration:** Architeezy uses Keycloak for identity management. Token acquisition flow is standard OAuth2/OIDC. For ArchiLens MVP, the user provides a pre-obtained token in the connection screen.

---

## 7. ID System

Architeezy uses **dual IDs**:
- **Primary:** UUID format `01993911-2055-74e4-96f1-ab3907650680` (used in `element.id`, relationship `source`/`target`)
- **Secondary:** Prefixed format `id-a45980e575c14efc95a9a24701c33106` (used in `element.data.id`)

**ArchiLens should use the primary UUID** (`element.id`) as the canonical identifier for all graph operations. The secondary `data.id` appears to be an ArchiMate Open Exchange Format compatibility field.

---

## 8. Constraints and Limitations

1. **Single response size:** The model content endpoint returns the entire model. For very large models (1000+ elements), this could be a large payload. No streaming or pagination available for model content.
2. **CORS:** Not tested from browser. May require proxy or same-origin deployment.
3. **Rate limits:** None observed, but not explicitly documented.
4. **Write access:** ArchiLens is read-only; no write endpoints are needed.
5. **GraphQL alternative:** Available at `/api/graphql` for fine-grained queries, but adds complexity. Recommended for post-MVP optimization only.

---

## 9. Integration Points for Next Issues

| Next Issue | What It Can Use From This Spike |
|------------|-------------------------------|
| **M0-03** (Domain types) | TypeScript interfaces above can be directly adapted for `NormalizedModel` |
| **M0-04** (Demo dataset) | Snapshot the real API response as demo JSON data |
| **M1-01** (Demo connector) | Parse the same JSON format as the real API |
| **M1-02** (Architeezy connector) | Full endpoint catalog, auth strategy, normalization algorithm |
| **M1-07** (Connection screen) | URL pattern: baseUrl + 4 slugs + optional token |
