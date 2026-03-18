# M0. Project Foundation

## Metadata

- Milestone ID: M0
- Name: Project Foundation
- Goal: Establish all prerequisites so that feature development (M1+) can begin without blockers
- User Outcome: No direct user-facing outcome. After M0, the project has a working skeleton, defined domain types, a demo dataset, and a completed API spike. All Readiness Gate conditions (RG-1 through RG-5) are satisfied.
- Duration: 3-5 days (Stage 0 of roadmap)

---

## Capability Slices Covered

M0 covers the **Readiness Gate** defined in `14_Capability_Slice_Map.md`. It is the prerequisite for all four product slices (S-1 through S-4).

| RG | Condition | Verified By |
|----|-----------|-------------|
| RG-1 | Project initialized (React + TS + Vite + ESLint) | `npm run dev` starts without errors |
| RG-2 | Architeezy API researched (spike complete) | Markdown document: endpoints, data format, auth |
| RG-3 | Demo dataset created (JSON, 80-120 elements) | File in repo, structure matches NormalizedModel |
| RG-4 | Connector interface defined | TypeScript interface in code |
| RG-5 | Base folder structure created | src/connectors, src/engine, src/ui, src/stores, src/export |

---

## Decisions That Must Be Closed

| Decision | Topic | Status Before M0 | Resolved By |
|----------|-------|-------------------|-------------|
| D-1 | SPA architecture | decided | -- (already closed) |
| D-2 | React + TypeScript | decided | -- (already closed) |
| D-9 | Architeezy ID as PK | decided | -- (already closed) |
| D-10 | Demo dataset required | decided | -- (already closed) |
| D-13 | Vite as build tool | preferred | M0-02 (confirmed at setup) |
| D-15 | Auth format | blocked | M0-01 (spike resolves) |
| D-16 | CORS strategy | preferred | M0-01 (spike resolves) |

---

## Issues in Order

| # | Issue ID | Title | Type | Depends On |
|---|----------|-------|------|------------|
| 1 | M0-01 | Spike: Research Architeezy API | Spike | none |
| 2 | M0-02 | Setup Project Skeleton | Infra | none (parallel with M0-01) |
| 3 | M0-03 | Define NormalizedModel Interface and Domain Types | Engine | M0-02 |
| 4 | M0-04 | Create Demo Dataset | Feature | M0-03 |
| 5 | M0-05 | Validation: Project Foundation | Validation | M0-01, M0-02, M0-03, M0-04 |

M0-01 and M0-02 can run in parallel. M0-03 depends on M0-02. M0-04 depends on M0-03. M0-05 gates the entire milestone.

---

## Entry Conditions

- Node.js installed (v18+)
- Access to Architeezy instance or Swagger documentation (for M0-01)
- Git repository initialized

---

## Exit Criteria

All five Readiness Gate conditions verified:

1. `npm run dev` starts without errors (RG-1)
2. Spike document committed with API findings (RG-2)
3. Demo dataset JSON file present and parseable as NormalizedModel (RG-3)
4. DataConnector interface and all domain types defined in TypeScript (RG-4)
5. Folder structure matches architecture doc: src/connectors, src/engine, src/ui, src/stores, src/export (RG-5)

---

## Key Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| R1: Architeezy API may not provide needed data | 30-50% | Critical | Spike (M0-01) resolves early. Fallback: demo-only MVP |
| R4: CORS blocks browser requests | 60-70% | Low (solvable) | Spike documents CORS behavior. Mitigation: localhost or proxy |
| R5: No real model access for testing | 40% | Medium | Demo dataset (M0-04) covers all test scenarios |

---

## Minimal Validation

M0-05 performs the milestone-level validation:

- Run `npm run dev` -- server starts
- Run `npm run build` -- build succeeds
- Run `npm run lint` -- no errors
- Import domain types and parse demo JSON in a simple script -- no TypeScript errors
- Spike document exists with all required sections
- Folder structure verified against architecture doc
