# Digital Bank Architecture — Expected Test Values

## Dataset Summary

| Metric | Value |
|--------|-------|
| Model ID | `model-digital-bank-001` |
| Model Name | `Digital Bank Architecture` |
| Total Elements | 102 |
| Total Relationships | 160 |
| Total Diagrams | 10 |
| Warnings | 0 (clean dataset) |
| File Size | ~41 KB |

---

## Hub Elements

| Element ID | Name | Type | Total Degree | In-Degree | Out-Degree |
|-----------|------|------|-------------|-----------|------------|
| `app-001` | Core Banking Platform | ApplicationComponent | 18 | 5 | 13 |
| `app-002` | Payment Gateway | ApplicationComponent | 14 | 2 | 12 |

---

## Orphan Elements (12)

Orphan = degree == 0 OR diagramsCount == 0.

All orphans in this dataset have both degree == 0 AND diagramsCount == 0.

| Element ID | Name | Type | Reason |
|-----------|------|------|--------|
| `orph-001` | Legacy Payment Module | ApplicationComponent | No relationships, no diagrams |
| `orph-002` | Deprecated Mainframe Connector | ApplicationComponent | No relationships, no diagrams |
| `orph-003` | Planned Cloud Migration | WorkPackage | No relationships, no diagrams |
| `orph-004` | Future Blockchain Module | ApplicationComponent | No relationships, no diagrams |
| `orph-005` | Archive Database | Node | No relationships, no diagrams |
| `orph-006` | Old Reporting Tool | ApplicationComponent | No relationships, no diagrams |
| `orph-007` | Manual Reconciliation Process | BusinessProcess | No relationships, no diagrams |
| `orph-008` | Prototype Analytics Dashboard | ApplicationComponent | No relationships, no diagrams |
| `orph-009` | Sunset CRM Module | ApplicationComponent | No relationships, no diagrams |
| `orph-010` | Test Environment Node | Node | No relationships, no diagrams |
| `orph-011` | Legacy Print Service | TechnologyService | No relationships, no diagrams |
| `orph-012` | Decommissioned ATM Network | CommunicationNetwork | No relationships, no diagrams |

---

## Layer Distribution

| Layer | Count |
|-------|-------|
| Strategy | 4 |
| Motivation | 4 |
| Business | 26 |
| Application | 41 |
| Technology | 26 |
| Implementation | 1 |
| Physical | 0 |
| Other | 0 |
| **Total** | **102** |

---

## Diagrams

| Diagram ID | Name | Element Count |
|-----------|------|--------------|
| `diag-001` | Business Process Overview | 20 |
| `diag-002` | Core Banking Application Landscape | 21 |
| `diag-003` | Payment Processing Flow | 10 |
| `diag-004` | Technology Infrastructure | 21 |
| `diag-005` | Customer Onboarding Journey | 10 |
| `diag-006` | Loan Origination Flow | 10 |
| `diag-007` | Security and Compliance View | 13 |
| `diag-008` | Data Architecture | 10 |
| `diag-009` | Strategy and Motivation | 9 |
| `diag-010` | Integration Architecture | 13 |

---

## Relationship Type Distribution

| Type | Expected Usage |
|------|---------------|
| ServingRelationship | Most common — services serving processes/components |
| CompositionRelationship | Products composed of services, nodes of software |
| RealizationRelationship | Business objects realized by data objects |
| FlowRelationship | Data flows between components |
| TriggeringRelationship | Process triggering |
| AccessRelationship | Components accessing data objects |
| AssociationRelationship | General associations |

---

## Referential Integrity

- All `relationship.sourceId` values reference existing `element.id` values
- All `relationship.targetId` values reference existing `element.id` values
- All `diagram.elementIds` values reference existing `element.id` values
- Zero broken references in clean dataset

---

## Canonical Test Scenario (for M2 Impact Analysis)

**Element:** Payment Gateway (`app-002`)
**Expected at depth 1:** Direct neighbors include `app-018`, `app-024`, `app-031`, `app-021`, `app-027`, `app-007`, `app-011`, `app-013`, `app-029`, `app-035`, `app-025`, `bus-003`, `bus-020`
**Expected at depth 2:** Transitive neighbors reachable from depth-1 elements
