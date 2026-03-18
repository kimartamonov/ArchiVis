# [M0-05] Validation: Project Foundation

## Metadata

- Issue ID: M0-05
- Type: Validation
- Status: Proposed
- Milestone: M0. Project Foundation
- Capability Slice: Readiness Gate (RG-1 through RG-5)
- Priority: P0
- Sequence Order: 5
- Depends On:
  - M0-01
  - M0-02
  - M0-03
  - M0-04
- Unlocks:
  - All M1 issues (M1-01, M1-02, M1-03, and beyond)
- Decision References:
  - D-1 (SPA -- must be decided)
  - D-2 (React + TS -- must be decided)
  - D-9 (Architeezy ID as PK -- must be decided)
  - D-10 (Demo dataset -- must be decided)
  - D-13 (Vite -- must be decided by M0-02)
  - D-15 (Auth format -- must be decided by M0-01)
  - D-16 (CORS strategy -- must be decided by M0-01)
- FR References:
  - FR-1.8 (demo dataset)
- AC References:
  - none (milestone-level validation, not feature AC)
- Demo References:
  - none (pre-demo validation)
- Risk References:
  - R1 (API data -- assessed by M0-01)
  - R4 (CORS -- assessed by M0-01)
  - R5 (No real model -- mitigated by M0-04)

---

## Goal

Confirm that all five Readiness Gate conditions (RG-1 through RG-5) are met. This is the milestone-level validation that gates entry into M1 (Model Visualization). Every foundation artifact must be verified: project builds, types compile, demo dataset loads, spike document exists, and folder structure matches architecture.

---

## Why Now

This is the final issue in M0. It exists to ensure that M1 work begins on a solid foundation. Without explicit validation, subtle issues (broken build, missing types, incomplete dataset, undocumented spike findings) could propagate into M1 and cause rework. The validation issue provides a clean checkpoint.

---

## User/System Outcome

- **System:** All foundation artifacts are verified as correct and consistent. The project is ready for feature development.
- **Roadmap:** M1 can begin with confidence. No foundation-level blockers remain.

---

## Scope

Verify each Readiness Gate condition:

### RG-1: Project initialized
- `npm run dev` starts without errors
- `npm run build` succeeds
- `npm run lint` passes with zero errors
- TypeScript strict mode is enabled

### RG-2: API Architeezy researched
- Spike document exists in repository
- Document covers: endpoints, auth format, CORS behavior, sample responses
- D-15 (auth) and D-16 (CORS) are marked as decided in the decision backlog

### RG-3: Demo dataset created
- `demo/digital-bank.json` exists
- JSON parses without errors
- Structure conforms to NormalizedModel interface
- Element count, relationship count, and diagram count are in expected ranges
- Referential integrity holds (all IDs resolve)

### RG-4: Connector interface defined
- `DataConnector` interface exists in `src/connectors/types.ts`
- `ConnectorConfig` type exists
- `NormalizedModel` and all sub-types exist in `src/engine/types.ts`

### RG-5: Base folder structure created
- `src/connectors/` exists
- `src/engine/` exists
- `src/ui/` exists
- `src/stores/` exists
- `src/export/` exists

### Cross-check
- Write a simple validation script that imports the domain types and parses the demo JSON to verify type compatibility

---

## Out of Scope

- Fixing issues found during validation (those become separate bugfix issues if needed)
- Running the full application with demo data (that is M1)
- Performance testing
- UI testing

---

## Preconditions

- M0-01 complete: spike document committed
- M0-02 complete: project skeleton running
- M0-03 complete: domain types defined
- M0-04 complete: demo dataset created

---

## Implementation Notes

- This validation can be performed as a checklist review + running a few commands
- For RG-3 validation, consider writing a small TypeScript script (e.g., `scripts/validate-foundation.ts`) that:
  - Imports NormalizedModel from src/engine/types.ts
  - Reads and parses demo/digital-bank.json
  - Asserts element count in [80, 120]
  - Asserts relationship count in [150, 250]
  - Asserts diagram count in [8, 15]
  - Checks referential integrity
  - Prints "All RG conditions passed" or reports failures
- Reference `14_Capability_Slice_Map.md` for the exact RG conditions
- If any RG condition fails, document the failure and create a targeted bugfix issue (do not proceed to M1)

---

## Files and Artifacts Expected to Change

- New (optional): `scripts/validate-foundation.ts` (validation script)
- Updated (if issues found): any M0 artifacts that need correction

---

## Acceptance Criteria for This Issue

1. RG-1 verified: `npm run dev`, `npm run build`, `npm run lint` all succeed
2. RG-2 verified: spike document exists with required sections
3. RG-3 verified: demo JSON parses and conforms to NormalizedModel
4. RG-4 verified: DataConnector interface and all domain types exist and compile
5. RG-5 verified: all 5 required directories exist
6. All verification results documented (pass/fail for each RG)
7. If all pass: M1 is formally unblocked

---

## Required Tests

### Functional checks

- `npm run dev` starts without errors
- `npm run build` succeeds
- `npm run lint` passes
- Domain types import without errors
- Demo JSON parses without errors
- Demo JSON element count in [80, 120]
- Demo JSON relationship count in [150, 250]
- Demo JSON diagram count in [8, 15]
- All relationship sourceId/targetId resolve to existing elements
- All diagram elementIds resolve to existing elements
- Spike document exists and contains: endpoints, auth, CORS sections
- DataConnector interface has methods: connect, listModels, loadModel
- Directories exist: src/connectors, src/engine, src/ui, src/stores, src/export

### Smoke checks

- Run the validation script (if created) -- all checks pass
- Open the app in browser -- placeholder renders without console errors

### Regression checks

- All M0-02 checks still pass (dev server, lint, build)
- All M0-03 checks still pass (types compile)
- All M0-04 checks still pass (dataset valid)

---

## Handoff to Next Issue

After M0-05 is complete:

- **What now works:** The entire project foundation is verified and stable. All Readiness Gate conditions are met.
- **What contract is now stable:** NormalizedModel contract, DataConnector interface, demo dataset structure, folder layout, build pipeline.
- **What next issue can start:** All M1 issues are unblocked:
  - M1-01: Graph engine can process the demo dataset
  - M1-02: Connector can implement the DataConnector interface
  - M1-03: Insight engine can use the domain types
  - All subsequent milestones build on this verified foundation

---

## Done Definition

- [ ] RG-1 verified: project builds, lints, and runs
- [ ] RG-2 verified: spike document committed with all required sections
- [ ] RG-3 verified: demo dataset valid and conforms to NormalizedModel
- [ ] RG-4 verified: DataConnector interface and domain types compile
- [ ] RG-5 verified: folder structure matches architecture doc
- [ ] Verification results documented (all 5 RG conditions pass)
- [ ] No blocking issues remain for M1
- [ ] D-15 and D-16 confirmed as decided
