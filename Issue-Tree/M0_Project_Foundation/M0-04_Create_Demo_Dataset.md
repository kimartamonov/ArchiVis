# [M0-04] Create Demo Dataset

## Metadata

- Issue ID: M0-04
- Type: Feature
- Status: Proposed
- Milestone: M0. Project Foundation
- Capability Slice: Readiness Gate (RG-3)
- Priority: P0
- Sequence Order: 4
- Depends On:
  - M0-03
- Unlocks:
  - M1-01
  - All validation issues (demo dataset is the primary test fixture)
- Decision References:
  - D-10 (Demo dataset required -- decided)
- FR References:
  - FR-1.8 (load built-in demo dataset without Architeezy connection)
- AC References:
  - AC-2.1 (data loaded into normalized structure)
- Demo References:
  - Step 2 of S-1 demo (press "Load Demo")
- Risk References:
  - R5 (No real model access for testing -- demo dataset is the mitigation)

---

## Goal

Create a synthetic "Digital Bank Architecture" dataset as a JSON file conforming to the `NormalizedModel` interface. The dataset must be large enough to demonstrate real analysis value (80-120 elements, 150-250 relationships, 8-15 diagrams) and must contain specific structural patterns needed for testing: hub elements, orphan elements, and coverage across all three main ArchiMate layers.

---

## Why Now

The demo dataset is the primary test fixture for the entire MVP. Every validation issue, every engine test, and every UI demo depends on it. Without it, M1-01 (graph engine) has nothing to process, and the team cannot verify any analysis results. It also mitigates R5 (no real model access) by providing a predictable, well-documented dataset.

---

## User/System Outcome

- **User:** Can press "Load Demo" and immediately see a realistic architecture model without needing Architeezy access.
- **System:** Has a stable, predictable dataset with known expected values for automated testing.
- **Roadmap:** All subsequent engine, analysis, and UI issues can be developed and tested against this dataset.

---

## Scope

- Create `demo/digital-bank.json` conforming to `NormalizedModel` interface
- The dataset represents a fictional "Digital Bank Architecture" with:
  - **80-120 elements** across Business, Application, and Technology layers
  - **150-250 relationships** of various ArchiMate types (ServingRelationship, CompositionRelationship, FlowRelationship, AssociationRelationship, RealizationRelationship, etc.)
  - **8-15 diagrams** with realistic element membership
- Required structural patterns:
  - **1-2 hub elements** with degree > 10 (e.g., "Core Banking Platform" as Application Component)
  - **10-15 orphan elements** (degree == 0 or diagramsCount == 0)
  - Elements in **Business layer** (BusinessProcess, BusinessService, BusinessActor, etc.)
  - Elements in **Application layer** (ApplicationComponent, ApplicationService, ApplicationInterface, etc.)
  - Elements in **Technology layer** (Node, SystemSoftware, Artifact, CommunicationNetwork, etc.)
  - At least some elements in **Strategy** or **Motivation** layer
- Document known expected values for testing:
  - Total element count
  - Total relationship count
  - Total diagram count
  - Name and expected degree of the hub element
  - Count of orphan elements
  - Layer distribution counts
- Include `warnings: []` (clean dataset, no load warnings)

---

## Out of Scope

- Loading logic (that is M1-01)
- UI integration (that is M1 slice work)
- Multiple datasets or dataset variants
- Real Architeezy data (this is synthetic by design, per D-10)

---

## Preconditions

- M0-03 complete: NormalizedModel, NormalizedElement, NormalizedRelationship, NormalizedDiagram interfaces are defined
- Layer enum and ElementType definitions exist

---

## Implementation Notes

- Reference `07_Domain_Model.md` for field definitions
- Reference `08_System_Context_and_Architecture.md` for the NormalizedModel contract
- The JSON file must be valid against the TypeScript interface. Every element must have: id, name, type, diagramIds. Every relationship must have: id, sourceId, targetId, type. Every diagram must have: id, name, elementIds.
- Use realistic ArchiMate element types (not generic placeholders)
- Use UUID-like strings for IDs to simulate Architeezy behavior
- Document expected test values either in a companion file (`demo/digital-bank.expectations.md`) or as comments in the issue
- Key test fixture: "Core Banking Platform" (ApplicationComponent) should be the primary hub with known degree, known in/out degree, and known diagram membership
- Ensure bidirectional consistency: if a relationship references elementId X, element X must exist. If a diagram contains elementId Y, element Y must exist.
- Orphan elements should be realistic (e.g., "Legacy Payment Module" with no relationships, or "Planned Cloud Migration" not yet on any diagram)

---

## Files and Artifacts Expected to Change

- New: `demo/digital-bank.json`
- New: `demo/digital-bank.expectations.md` (or equivalent documentation of expected test values)

---

## Acceptance Criteria for This Issue

1. `demo/digital-bank.json` exists and is valid JSON
2. JSON structure matches the `NormalizedModel` interface
3. Element count is between 80 and 120
4. Relationship count is between 150 and 250
5. Diagram count is between 8 and 15
6. At least one hub element exists with degree > 10
7. Between 10 and 15 orphan elements exist
8. Elements span at least Business, Application, and Technology layers
9. All relationship sourceId and targetId values reference existing elements
10. All diagram elementIds reference existing elements
11. Known test expectations are documented (hub element name, expected counts)

---

## Required Tests

### Functional checks

- JSON file parses without errors
- Element count is in range [80, 120]
- Relationship count is in range [150, 250]
- Diagram count is in range [8, 15]
- Element "Core Banking Platform" exists and has type "ApplicationComponent"
- All relationship sourceId values correspond to existing element IDs
- All relationship targetId values correspond to existing element IDs
- All diagram elementIds correspond to existing element IDs
- Orphan element count is in range [10, 15]
- Elements exist in at least 3 distinct layers (Business, Application, Technology)

### Smoke checks

- File size is reasonable (< 500KB)
- JSON can be loaded into memory and accessed programmatically

### Regression checks

- `npm run build` still succeeds
- `npm run lint` still passes

---

## Handoff to Next Issue

After M0-04 is complete:

- **What now works:** A stable, documented demo dataset is available at `demo/digital-bank.json` with known expected values for testing.
- **What contract is now stable:** The dataset conforms to NormalizedModel. Expected values for hub element, orphan count, and layer distribution are documented and can be used as test assertions.
- **What next issue can start:** M1-01 (graph engine can process the demo dataset). All subsequent validation and testing uses this dataset as the primary fixture.

---

## Done Definition

- [ ] `demo/digital-bank.json` committed to repository
- [ ] JSON is valid and matches NormalizedModel interface
- [ ] 80-120 elements, 150-250 relationships, 8-15 diagrams
- [ ] Hub element(s) with degree > 10 present
- [ ] 10-15 orphan elements present
- [ ] Business, Application, and Technology layers all represented
- [ ] Referential integrity: all IDs in relationships and diagrams point to existing elements
- [ ] Expected test values documented
- [ ] `npm run build` succeeds
