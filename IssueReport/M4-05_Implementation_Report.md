# M4-05 Validation Report

## Issue

| Field | Value |
|-------|-------|
| **Issue ID** | M4-05 |
| **Title** | Validation: Export Files Open Correctly |
| **Milestone** | M4 — Export and Release |
| **Status** | Done |

## Validation Summary

**VALIDATION PASSED.** GraphML and CSV exports verified on real demo dataset. All AC-6.x confirmed. No blocker bugs.

## GraphML Validation (AC-6.1, AC-6.2)

| Check | Result |
|-------|--------|
| Valid XML (parseable by DOMParser) | PASS |
| Correct GraphML namespace | PASS |
| Directed graph declaration | PASS |
| Hub node present in exported subgraph | PASS |
| Affected nodes count > 1 | PASS |
| Nodes have name/type/layer/degree data | PASS |
| Edges connect valid source/target nodes within subgraph | PASS |
| Edges have type data | PASS |
| File name pattern `impact_{name}_{depth}.graphml` | PASS |

## CSV Validation (AC-6.3, AC-6.4)

| Check | Result |
|-------|--------|
| UTF-8 BOM at position 0 | PASS |
| Header: 9 correct columns | PASS |
| 102 data rows (all elements) | PASS |
| Non-empty data in rows | PASS |
| is_orphan = true/false strings | PASS |
| Element names from model appear in CSV (no garbled chars) | PASS |
| File name: `elements_Digital_Bank_Architecture.csv` | PASS |

## Regression

| Check | Result |
|-------|--------|
| Graph engine: 102 nodes | PASS |
| Impact analysis: hub depth 2 → affected > 0 | PASS |
| Export generators do not mutate graph state | PASS |

## Test Counts

- **Validation tests (M4-05):** 19/19 passed
- **Full suite:** 281/281 passed
- **Build:** successful
- **Lint:** 0 errors

## Blocker Bugs

**None found.**

## Files Changed

| Path | Change |
|------|--------|
| `src/validation/__tests__/m4-export-validation.test.ts` | Created — 19 tests |

## Unlocked

- **M4-06** — GitHub Actions CI
