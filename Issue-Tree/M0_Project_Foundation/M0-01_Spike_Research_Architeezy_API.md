# [M0-01] Spike: Research Architeezy API

## Metadata

- Issue ID: M0-01
- Type: Spike
- Status: Proposed
- Milestone: M0. Project Foundation
- Capability Slice: Readiness Gate (RG-2)
- Priority: P0
- Sequence Order: 1
- Depends On:
  - none
- Unlocks:
  - M1-02
- Decision References:
  - D-15 (Auth format -- blocked, resolved by this spike)
  - D-16 (CORS strategy -- preferred, confirmed by this spike)
- FR References:
  - FR-1.1 (URL + token input -- needs auth format knowledge)
  - FR-1.2 (connection validation -- needs endpoint knowledge)
  - FR-1.3 (list models -- needs endpoint knowledge)
  - FR-1.5 (load elements, relationships, diagrams -- needs endpoint knowledge)
- AC References:
  - AC-1.1 (connection works)
  - AC-2.1 (data loaded)
- Demo References:
  - none (spike is pre-demo)
- Risk References:
  - R1 (API may not provide needed data)
  - R4 (CORS blocks browser requests)

---

## Goal

Investigate the Architeezy Swagger/API to understand available endpoints, authentication format, response data structure, and CORS policy. Time-boxed: 1 day maximum.

This spike produces a written document, not code. It answers the blocking questions Q-1 through Q-4 from `12_Risks_Decisions_Open_Questions.md`.

---

## Why Now

This is the first issue because two critical decisions (D-15 auth format, D-16 CORS strategy) are currently blocked/preferred and cannot be finalized without empirical data. The connector implementation (M1-02) cannot begin until we know what the API actually provides and how authentication works. Risk R1 (API may not provide needed data) must be evaluated as early as possible to allow fallback planning.

---

## User/System Outcome

- **System:** The team knows exactly which API endpoints exist, what data they return, how to authenticate, and whether CORS will be an issue.
- **Roadmap:** Decisions D-15 and D-16 are closed. The connector can be designed with confidence. If R1 materializes (insufficient API), the team can pivot to demo-only MVP immediately rather than discovering it during M1.

---

## Scope

- Identify and document all relevant Architeezy API endpoints:
  - Models list
  - Elements for a model
  - Relationships for a model
  - Views (diagrams) for a model
  - View-elements (diagram membership)
- Test authentication: determine format (Bearer token, API key, Basic auth, other)
- Make at least one successful API call and capture a sample response
- Test CORS behavior from a browser context (not just curl)
- Document the response JSON structure for each endpoint
- Note any pagination, rate limits, or data size constraints
- Assess whether the 5 required resource types are available via the API

---

## Out of Scope

- Writing production code
- Building the connector
- Creating TypeScript types from the API (that is M0-03)
- Performance benchmarking
- Testing write endpoints (ArchiLens is read-only)

---

## Preconditions

- Access to an Architeezy instance or its Swagger/API documentation
- A valid set of credentials (or knowledge of how to obtain them)
- External dependency E-1 (API access) must be resolved before this spike can start

---

## Implementation Notes

- Use browser DevTools (Network tab) to verify CORS headers
- Use curl or Postman for initial endpoint testing
- Use Swagger UI if available
- Document findings in a markdown file committed to the repository
- Reference doc `09_Data_and_Integrations.md` for expected data flow
- Reference doc `08_System_Context_and_Architecture.md` for the NormalizedModel contract to understand what data we need from the API
- If CORS blocks browser requests, document the exact error and test with a simple local proxy to confirm the workaround

---

## Files and Artifacts Expected to Change

- New file: `docs/spikes/architeezy-api-research.md` (or similar path)
- Updated: `13_Decision_Backlog.md` -- D-15 and D-16 status changes

---

## Acceptance Criteria for This Issue

1. A markdown document exists in the repository with the spike findings
2. The document lists all discovered API endpoints relevant to ArchiLens
3. Authentication format is documented with a working example
4. CORS behavior is documented (tested from browser, not just curl)
5. Sample response structure is captured for at least: models list, elements, relationships
6. The document explicitly states whether each of the 5 required API resources is available: models, elements, relationships, views, view-elements
7. A clear recommendation is given for D-15 (auth format) and D-16 (CORS strategy)
8. If any required resource is unavailable, this is flagged as R1 materialization with a recommended fallback

---

## Required Tests

### Functional checks

- Document covers all 5 required API resource types (models, elements, relationships, views, view-elements)
- For each resource: endpoint URL, HTTP method, required headers, and sample response are documented
- Auth format is documented with enough detail to implement programmatically
- CORS section includes both curl and browser test results

### Smoke checks

- At least one successful API call is documented (request + response)
- The response can be visually mapped to NormalizedModel fields

### Regression checks

- Not applicable (first issue, no prior work to regress)

---

## Handoff to Next Issue

After M0-01 is complete:

- **What now works:** We have empirical knowledge of the Architeezy API surface
- **What contract is now stable:** Auth format (D-15 closed), CORS strategy (D-16 closed), list of available endpoints
- **What next issue can start:** M1-02 (Architeezy connector implementation) is unblocked. M0-02 through M0-04 were never blocked by this spike and may already be in progress.

---

## Done Definition

- [ ] Spike markdown document committed to repository
- [ ] Document covers all 5 required API resources with endpoint details
- [ ] Auth format documented and D-15 status updated to `decided`
- [ ] CORS behavior documented and D-16 status updated to `decided`
- [ ] At least one sample API response captured
- [ ] R1 assessment written (API sufficient or insufficient, with evidence)
- [ ] Time spent: <= 1 day
