# M0-04 Technical Documentation

## Purpose

The demo dataset provides a stable, documented test fixture for the entire ArchiLens MVP. It represents a fictional "Digital Bank Architecture" and conforms to the `NormalizedModel` interface defined in `src/engine/types.ts`.

---

## File Location

- Dataset: `demo/digital-bank.json`
- Expected values: `demo/digital-bank.expectations.md`

---

## Data Structure

The JSON file follows the `NormalizedModel` contract:

```json
{
  "id": "model-digital-bank-001",
  "name": "Digital Bank Architecture",
  "elements": [ ... ],       // 102 NormalizedElement objects
  "relationships": [ ... ],  // 160 NormalizedRelationship objects
  "diagrams": [ ... ],       // 10 NormalizedDiagram objects
  "warnings": []              // Clean dataset
}
```

---

## Architecture Modeled

The dataset represents a digital bank with:

### Strategy Layer (4 elements)
Digital banking strategy, customer experience and omnichannel capabilities, data analytics resource.

### Motivation Layer (4 elements)
Goals (customer satisfaction, cost reduction), regulatory compliance principle, board of directors stakeholder.

### Business Layer (26 elements)
Core banking processes (onboarding, loans, payments, fraud detection, KYC, risk assessment), banking services (retail, corporate, investment, customer service, wealth management), business actors/roles, business objects (accounts, agreements, transactions, credit reports).

### Application Layer (41 elements)
Core systems (Core Banking Platform, Payment Gateway, CRM, Fraud Detection Engine, etc.), application services, interfaces (REST API, SWIFT, Open Banking), data objects, compliance and AML systems.

### Technology Layer (26 elements)
Server clusters, databases (PostgreSQL), caching (Redis), messaging (Kafka), orchestration (Kubernetes), networking, security (HSM, Firewall), monitoring and backup services.

### Implementation Layer (1 element)
Planned Cloud Migration (orphan — represents future work).

---

## Structural Patterns

### Hub Elements
- **Core Banking Platform** (`app-001`): Primary hub, degree 18. Connected to most application-layer components. Central integration point.
- **Payment Gateway** (`app-002`): Secondary hub, degree 14. Key external-facing component.

### Orphan Elements (12)
All orphan elements have zero relationships and zero diagram memberships. They represent legacy, deprecated, or planned-but-not-integrated components.

### Cross-Layer Relationships
The dataset includes relationships spanning all layer boundaries:
- Strategy → Motivation (realization of goals)
- Strategy → Business (strategy drives business products)
- Motivation → Business (compliance drives processes)
- Business → Application (processes use systems)
- Application → Technology (systems run on infrastructure)
- Application internal (services, data access, composition)
- Technology internal (software on nodes, networking)

---

## ID Convention

All IDs use a prefix pattern for readability:
- `str-XXX` — Strategy elements
- `mot-XXX` — Motivation elements
- `bus-XXX` — Business elements
- `app-XXX` — Application elements
- `tech-XXX` — Technology elements
- `orph-XXX` — Orphan elements
- `rel-XXX` — Relationships
- `diag-XXX` — Diagrams

In production, IDs would be Architeezy UUIDs. The prefix pattern makes the demo dataset human-readable and debuggable.

---

## Usage

### Loading in code (M1-01 will implement this)
```typescript
import demoData from '../../demo/digital-bank.json';
const model: NormalizedModel = demoData;
```

### Testing assertions
Use values from `demo/digital-bank.expectations.md` for test assertions:
- `model.elements.length === 102`
- `model.relationships.length === 160`
- `model.diagrams.length === 10`
- Hub element `app-001` exists with type `ApplicationComponent`
- 12 orphan elements (all with `orph-` prefix)

---

## Constraints

- Single-file dataset — no lazy loading needed
- Read-only — ArchiLens never mutates source data
- Clean dataset — `warnings` array is empty
- All referential integrity is guaranteed (validated at generation time)

---

## Integration Points

| Consumer | How It Uses The Dataset |
|----------|----------------------|
| M1-01 (Demo connector) | Loads JSON, returns as NormalizedModel |
| M1-03 (Graph engine) | Builds AnalysisGraph from 102 elements + 160 relationships |
| M1-04 (Metrics) | Calculates degree, orphan detection |
| M2-01 (Impact analysis) | BFS traversal from any element |
| M3-02 (Coverage) | Orphan count, layer distribution |
| All validation issues | Primary test fixture |
