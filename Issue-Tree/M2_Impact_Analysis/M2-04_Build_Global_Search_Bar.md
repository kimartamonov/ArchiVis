# M2-04: Build Global Search Bar

## Metadata

| Field                | Value                                             |
|----------------------|---------------------------------------------------|
| **Issue ID**         | M2-04                                             |
| **Type**             | UI                                                |
| **Status**           | Proposed                                          |
| **Milestone**        | M2 — Impact Analysis                              |
| **Capability Slice** | S-2 ("Анализирую impact изменения")               |
| **Priority**         | P0                                                |
| **Sequence Order**   | 4                                                 |
| **Depends On**       | M1-06 (Zustand Stores)                            |
| **Unlocks**          | M2-05 (Impact Analyzer Screen)                    |
| **FR References**    | FR-6.1, FR-6.2, FR-6.3                           |
| **AC References**    | AC-5.1                                            |
| **Decision Refs**    | —                                                 |
| **Demo Refs**        | SC-1 step 5                                       |
| **Risk Refs**        | —                                                 |

## Goal

Build a global search bar that lets users search for ArchiMate elements by name using substring matching (case-insensitive). The search bar shows a dropdown of matching results and navigating to the Impact Analyzer screen on selection.

## Why Now

The search bar is the entry point to the entire impact analysis workflow (S-2 demo steps 1-2). Without it, users cannot select an element for analysis. It must exist before the Impact Analyzer screen (M2-05) can be meaningfully used.

## User / System Outcome

A user types part of an element name (e.g., "pay") into the search bar in the top navigation. A dropdown appears showing matching elements with their name, type, and layer badge. The user selects an element and is navigated to the Impact Analyzer screen with that element pre-selected.

## Scope

- `src/ui/components/Search/SearchBar.tsx` — main search input component.
- `src/ui/components/Search/SearchDropdown.tsx` — dropdown list of matching results.
- `src/ui/components/Search/index.ts` — barrel export.
- Search input placed in the application top bar / header.
- On keystroke (debounced 200ms): filter all elements from `graphStore` by name substring match, case-insensitive.
- Dropdown shows up to 10 matching elements, each displaying: element name, type, layer badge (color-coded).
- On selecting a result: set `analysisStore.selectElement(elementId)` and navigate to the Impact Analyzer route.
- Empty input or no matches: dropdown hidden.

## Out of Scope

- Search by element type or layer (deferred to P1).
- Fuzzy matching or typo tolerance.
- Search history or recent searches.
- Keyboard navigation within dropdown (nice-to-have, not P0).

## Preconditions

- M1-06: `graphStore` exists with loaded elements accessible (e.g., `graphStore.getState().elements`).
- An `analysisStore` exists or will be created with `selectElement(elementId)` action.
- React Router (or equivalent) is set up with a route for Impact Analyzer.

## Implementation Notes

- Read all elements from `graphStore` using Zustand selector.
- On input change, debounce 200ms, then filter: `elements.filter(el => el.name.toLowerCase().includes(query.toLowerCase()))`.
- Limit results to first 10 matches.
- Each dropdown item shows: element name (bold), type (label), layer (color badge matching ArchiMate layer colors from M1).
- On click/select: dispatch `analysisStore.selectElement(element.id)` and programmatically navigate to `/impact` (or equivalent route).
- Close dropdown on selection, on blur (with small delay for click registration), or on Escape key.

## Files and Artifacts Expected to Change

| Path                                          | Change   |
|-----------------------------------------------|----------|
| `src/ui/components/Search/SearchBar.tsx`      | Create   |
| `src/ui/components/Search/SearchDropdown.tsx`  | Create   |
| `src/ui/components/Search/index.ts`           | Create   |
| `src/ui/components/Header/` (or equivalent)   | Modify   |
| `src/stores/analysisStore.ts`                 | Create or Modify |

## Acceptance Criteria

- [ ] Typing "pay" finds "Payment Gateway" in the dropdown.
- [ ] Search is case-insensitive: "PAY", "Pay", and "pay" all find the same results.
- [ ] Dropdown shows a maximum of 10 results.
- [ ] Each result displays element name, type, and layer badge.
- [ ] Selecting a result navigates to the Impact Analyzer screen with that element selected.
- [ ] Empty search input shows no dropdown.
- [ ] No matches found: dropdown shows "No results" or remains hidden.

## Required Tests

### Functional

- Search with known substring returns matching elements.
- Case-insensitive matching works ("PAY" finds "Payment Gateway").
- Dropdown limited to 10 results when more than 10 match.
- Selection triggers `analysisStore.selectElement` with correct element ID.
- Empty query returns no results.

### Smoke

- Rapid typing (multiple keystrokes within 200ms) does not crash the component.
- Component renders without errors when no model is loaded.

### Regression

- Global graph view still renders and functions correctly.
- Existing header/navigation elements are not broken.

## Handoff to Next Issue

Users can now search for and select elements by name. The selected element is stored in `analysisStore`. M2-05 (Impact Analyzer Screen) reads from `analysisStore` to display the selected element's impact analysis.

## Done Definition

- All acceptance criteria checked.
- Code compiles without errors.
- Search bar visible in app header.
- Tests pass.
- Components exported from `src/ui/components/Search/index.ts`.
