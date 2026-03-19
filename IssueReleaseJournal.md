# Issue Release Journal

## Purpose

Этот журнал отслеживает состояние выполнения всех Issues из `Issue-Tree/`. Он фиксирует:

- какой Issue сейчас в работе;
- полную очередь выполнения;
- завершённые Issues с ссылками на отчёты;
- последнее изменение состояния.

Журнал является единственным источником правды о прогрессе реализации MVP.

---

## Journal Rules

1. **Один активный Issue за раз.** В `Current Active Issue` всегда ровно один Issue.
2. **Статусы:** `Current` (в работе), `Pending` (в очереди), `Done` (завершён), `Blocked` (заблокирован).
3. **При завершении Issue:** перенести его в `Completed Issues`, следующий из очереди становится `Current`.
4. **При блокере:** Issue остаётся `Current`, причина фиксируется в `Latest Execution Note`.
5. **Порядок не менять** без явного обоснования. Порядок определён `01_Milestone_Index.md` и `02_Dependency_Map.md`.
6. **Report и Tech Doc** заполняются только после фактического завершения Issue.
7. **Post-MVP задачи не добавляются** в этот журнал.

---

## Current Active Issue

| Field | Value |
|-------|-------|
| **Issue ID** | M4-03 |
| **Title** | Add Export Unit Tests |
| **Milestone** | M4 — Export and Release |
| **Type** | Test |
| **Status** | Current |
| **Depends On** | M4-01 (Done), M4-02 (Done) |
| **Unlocks** | M4-04 |
| **File** | `Issue-Tree/M4_Export_and_Release/M4-03_Add_Export_Unit_Tests.md` |

---

## Execution Queue

| # | Issue ID | Milestone | Status | Report | Tech Doc | Note |
|---|----------|-----------|--------|--------|----------|------|
| 1 | M0-01 | M0 — Project Foundation | Done | [Report](IssueReport/M0-01_Implementation_Report.md) | [Tech Doc](IssueReport/M0-01_Technical_Documentation.md) | Spike: исследование API Architeezy |
| 2 | M0-02 | M0 — Project Foundation | Done | [Report](IssueReport/M0-02_Implementation_Report.md) | [Tech Doc](IssueReport/M0-02_Technical_Documentation.md) | Setup: React + TS + Vite + ESLint |
| 3 | M0-03 | M0 — Project Foundation | Done | [Report](IssueReport/M0-03_Implementation_Report.md) | [Tech Doc](IssueReport/M0-03_Technical_Documentation.md) | Domain types и NormalizedModel interface |
| 4 | M0-04 | M0 — Project Foundation | Done | [Report](IssueReport/M0-04_Implementation_Report.md) | [Tech Doc](IssueReport/M0-04_Technical_Documentation.md) | Demo dataset: Digital Bank Architecture |
| 5 | M0-05 | M0 — Project Foundation | Done | [Report](IssueReport/M0-05_Implementation_Report.md) | [Tech Doc](IssueReport/M0-05_Technical_Documentation.md) | Validation: all 5 RG conditions passed |
| 6 | M1-01 | M1 — Model Visualization | Done | [Report](IssueReport/M1-01_Implementation_Report.md) | [Tech Doc](IssueReport/M1-01_Technical_Documentation.md) | DemoConnector: fetch-based, 6 tests passed |
| 7 | M1-02 | M1 — Model Visualization | Done | [Report](IssueReport/M1-02_Implementation_Report.md) | [Tech Doc](IssueReport/M1-02_Technical_Documentation.md) | ArchiteezyConnector + normalize.ts, 13 tests |
| 8 | M1-03 | M1 — Model Visualization | Done | [Report](IssueReport/M1-03_Implementation_Report.md) | [Tech Doc](IssueReport/M1-03_Technical_Documentation.md) | buildGraph: nodes, edges, adjacency, orphans, 9 tests |
| 9 | M1-04 | M1 — Model Visualization | Done | [Report](IssueReport/M1-04_Implementation_Report.md) | [Tech Doc](IssueReport/M1-04_Technical_Documentation.md) | calculateMetrics: degree, orphan (degree=0 OR diagrams=0), 7 tests |
| 10 | M1-05 | M1 — Model Visualization | Done | [Report](IssueReport/M1-05_Implementation_Report.md) | [Tech Doc](IssueReport/M1-05_Technical_Documentation.md) | 42 tests, 100% coverage on graph engine |
| 11 | M1-06 | M1 — Model Visualization | Done | [Report](IssueReport/M1-06_Implementation_Report.md) | [Tech Doc](IssueReport/M1-06_Technical_Documentation.md) | 6 Zustand stores, 35 tests |
| 12 | M1-07 | M1 — Model Visualization | Done | [Report](IssueReport/M1-07_Implementation_Report.md) | [Tech Doc](IssueReport/M1-07_Technical_Documentation.md) | ConnectionScreen: connect + demo + model select, 7 tests |
| 13 | M1-08 | M1 — Model Visualization | Done | [Report](IssueReport/M1-08_Implementation_Report.md) | [Tech Doc](IssueReport/M1-08_Technical_Documentation.md) | React Flow + elkjs, layer colors, 14 tests |
| 14 | M1-09 | M1 — Model Visualization | Done | [Report](IssueReport/M1-09_Implementation_Report.md) | [Tech Doc](IssueReport/M1-09_Technical_Documentation.md) | ElementCard popup, 14 tests |
| 15 | M1-10 | M1 — Model Visualization | Done | [Report](IssueReport/M1-10_Implementation_Report.md) | [Tech Doc](IssueReport/M1-10_Technical_Documentation.md) | Validation PASSED: all AC, 112/112 tests, 100% engine coverage |
| 16 | M2-01 | M2 — Impact Analysis | Done | [Report](IssueReport/M2-01_Implementation_Report.md) | [Tech Doc](IssueReport/M2-01_Technical_Documentation.md) | BFS undirected traversal, 11 tests |
| 17 | M2-02 | M2 — Impact Analysis | Done | [Report](IssueReport/M2-02_Implementation_Report.md) | [Tech Doc](IssueReport/M2-02_Technical_Documentation.md) | buildImpactResult: layer summary + affected diagrams, 6 tests |
| 18 | M2-03 | M2 — Impact Analysis | Done | [Report](IssueReport/M2-03_Implementation_Report.md) | [Tech Doc](IssueReport/M2-03_Technical_Documentation.md) | 22 tests total, 100% lines / 90.9% branches, shared fixtures |
| 19 | M2-04 | M2 — Impact Analysis | Done | [Report](IssueReport/M2-04_Implementation_Report.md) | [Tech Doc](IssueReport/M2-04_Technical_Documentation.md) | SearchBar: debounced, case-insensitive, 10 max results, 8 tests |
| 20 | M2-05 | M2 — Impact Analysis | Done | [Report](IssueReport/M2-05_Implementation_Report.md) | [Tech Doc](IssueReport/M2-05_Technical_Documentation.md) | ImpactAnalyzerScreen: source card + affected list + layer summary + diagrams, 7 tests |
| 21 | M2-06 | M2 — Impact Analysis | Done | [Report](IssueReport/M2-06_Implementation_Report.md) | [Tech Doc](IssueReport/M2-06_Technical_Documentation.md) | DepthSwitcher: 1/2/3 buttons, live update, 5 tests |
| 22 | M2-07 | M2 — Impact Analysis | Done | [Report](IssueReport/M2-07_Implementation_Report.md) | [Tech Doc](IssueReport/M2-07_Technical_Documentation.md) | Graph highlighting: source glow, affected accent, dimmed non-affected, 8 tests |
| 23 | M2-08 | M2 — Impact Analysis | Done | [Report](IssueReport/M2-08_Implementation_Report.md) | [Tech Doc](IssueReport/M2-08_Technical_Documentation.md) | Validation PASSED: all AC, 162/162 tests, 0.14ms perf. **Milestone M2 COMPLETE.** |
| 24 | M3-01 | M3 — Quality Assessment | Done | [Report](IssueReport/M3-01_Implementation_Report.md) | [Tech Doc](IssueReport/M3-01_Technical_Documentation.md) | TanStack Table: 7 columns, sort, layer/type filters, row→impact, 8 tests |
| 25 | M3-02 | M3 — Quality Assessment | Done | [Report](IssueReport/M3-02_Implementation_Report.md) | [Tech Doc](IssueReport/M3-02_Technical_Documentation.md) | buildCoverageReport: orphans, layers, broken refs, 7 tests |
| 26 | M3-03 | M3 — Quality Assessment | Done | [Report](IssueReport/M3-03_Implementation_Report.md) | [Tech Doc](IssueReport/M3-03_Technical_Documentation.md) | CoverageView: stats header, orphan list, layer bars, 6 tests |
| 27 | M3-04 | M3 — Quality Assessment | Done | [Report](IssueReport/M3-04_Implementation_Report.md) | [Tech Doc](IssueReport/M3-04_Technical_Documentation.md) | Sidebar: 5 nav items, active indicator, model-gating, 8 tests |
| 28 | M3-05 | M3 — Quality Assessment | Done | [Report](IssueReport/M3-05_Implementation_Report.md) | [Tech Doc](IssueReport/M3-05_Technical_Documentation.md) | useNavigateToElement hook, 3 transition paths wired, 7 tests |
| 29 | M3-06 | M3 — Quality Assessment | Done | [Report](IssueReport/M3-06_Implementation_Report.md) | [Tech Doc](IssueReport/M3-06_Technical_Documentation.md) | Validation PASSED: all S-3 steps, all AC, 220/220 tests. **Milestone M3 COMPLETE.** |
| 30 | M4-01 | M4 — Export and Release | Done | [Report](IssueReport/M4-01_Implementation_Report.md) | [Tech Doc](IssueReport/M4-01_Technical_Documentation.md) | generateGraphML: valid XML, yEd compatible, 13 tests |
| 31 | M4-02 | M4 — Export and Release | Done | [Report](IssueReport/M4-02_Implementation_Report.md) | [Tech Doc](IssueReport/M4-02_Technical_Documentation.md) | generateCSV: UTF-8 BOM, escaping, 11 tests |
| 32 | M4-03 | M4 — Export and Release | Current | — | — | Unit tests for export |
| 33 | M4-04 | M4 — Export and Release | Pending | — | — | Export buttons в UI |
| 34 | M4-05 | M4 — Export and Release | Pending | — | — | Validation: export files |
| 35 | M4-06 | M4 — Export and Release | Pending | — | — | GitHub Actions CI |
| 36 | M4-07 | M4 — Export and Release | Pending | — | — | README и документация |
| 37 | M4-08 | M4 — Export and Release | Pending | — | — | E2E smoke test |
| 38 | M4-09 | M4 — Export and Release | Pending | — | — | Final validation: MVP acceptance |

---

## Completed Issues

| # | Issue ID | Milestone | Completed | Report | Tech Doc | Note |
|---|----------|-----------|-----------|--------|----------|------|
| 1 | M0-01 | M0 — Project Foundation | 2026-03-18 | [Report](IssueReport/M0-01_Implementation_Report.md) | [Tech Doc](IssueReport/M0-01_Technical_Documentation.md) | Spike завершён. API найден, все 5 ресурсов доступны. R1 не материализовался. D-15, D-16 закрыты. Разблокировано: M1-02. |
| 2 | M0-02 | M0 — Project Foundation | 2026-03-18 | [Report](IssueReport/M0-02_Implementation_Report.md) | [Tech Doc](IssueReport/M0-02_Technical_Documentation.md) | Проект создан: Vite 8 + React 19 + TS 5.9 strict + ESLint + Prettier. Folder structure готова. D-13 confirmed. Разблокировано: M0-03, M0-04. |
| 3 | M0-03 | M0 — Project Foundation | 2026-03-18 | [Report](IssueReport/M0-03_Implementation_Report.md) | [Tech Doc](IssueReport/M0-03_Technical_Documentation.md) | Domain types определены: NormalizedModel, Layer (8), elementTypeToLayer (50+ типов), GraphNode, AnalysisGraph, ImpactResult, CoverageReport, DataConnector. Разблокировано: M0-04, M1-01, M1-02, M1-03. |
| 4 | M0-04 | M0 — Project Foundation | 2026-03-18 | [Report](IssueReport/M0-04_Implementation_Report.md) | [Tech Doc](IssueReport/M0-04_Technical_Documentation.md) | Demo dataset создан: 102 элемента, 160 связей, 10 диаграмм, 2 хаба (degree 18/14), 12 orphans, 6 слоёв. Разблокировано: M0-05, M1-01, все validation issues. |
| 5 | M0-05 | M0 — Project Foundation | 2026-03-18 | [Report](IssueReport/M0-05_Implementation_Report.md) | [Tech Doc](IssueReport/M0-05_Technical_Documentation.md) | Validation пройден: 41/41 проверок, все 5 RG conditions passed. Milestone M0 завершён. Разблокировано: весь M1 (M1-01 — M1-10). |
| 6 | M1-01 | M1 — Model Visualization | 2026-03-18 | [Report](IssueReport/M1-01_Implementation_Report.md) | [Tech Doc](IssueReport/M1-01_Technical_Documentation.md) | DemoConnector создан: fetch('/digital-bank.json'), 3 метода DataConnector, 6 unit tests. Vitest добавлен. Разблокировано: M1-02, M1-03, M1-06, M1-07. |
| 7 | M1-02 | M1 — Model Visualization | 2026-03-18 | [Report](IssueReport/M1-02_Implementation_Report.md) | [Tech Doc](IssueReport/M1-02_Technical_Documentation.md) | ArchiteezyConnector создан: connect/listModels/loadModel, normalizeModelContent (рекурсивный обход папок), 13 unit tests. Разблокировано: M1-03, M1-07. |
| 8 | M1-03 | M1 — Model Visualization | 2026-03-18 | [Report](IssueReport/M1-03_Implementation_Report.md) | [Tech Doc](IssueReport/M1-03_Technical_Documentation.md) | buildGraph: NormalizedModel → AnalysisGraph (nodes Map, edges, adjacencyOut/In), degree/orphan metrics, broken reference warnings. 9 unit tests + demo smoke. Разблокировано: M1-04, M1-05, M1-08, M2-01, M3-02. |
| 9 | M1-04 | M1 — Model Visualization | 2026-03-18 | [Report](IssueReport/M1-04_Implementation_Report.md) | [Tech Doc](IssueReport/M1-04_Technical_Documentation.md) | calculateMetrics: recalculates degree, inDegree, outDegree, diagramsCount, isOrphan (degree===0 OR diagramsCount===0). 7 unit tests + demo hub check. Разблокировано: M1-05, M3-02, M3-03. |
| 10 | M1-05 | M1 — Model Visualization | 2026-03-19 | [Report](IssueReport/M1-05_Implementation_Report.md) | [Tech Doc](IssueReport/M1-05_Technical_Documentation.md) | 42 unit tests (12 buildGraph + 10 calculateMetrics), 100% coverage, shared fixtures, coverage thresholds enforced. Разблокировано: M1-06. |
| 11 | M1-06 | M1 — Model Visualization | 2026-03-19 | [Report](IssueReport/M1-06_Implementation_Report.md) | [Tech Doc](IssueReport/M1-06_Technical_Documentation.md) | 6 Zustand stores (connection, model, graph, analysis, filter, ui), 35 unit tests. Persistence: URL→localStorage, token→sessionStorage. Разблокировано: M1-07, M1-08. |
| 12 | M1-07 | M1 — Model Visualization | 2026-03-19 | [Report](IssueReport/M1-07_Implementation_Report.md) | [Tech Doc](IssueReport/M1-07_Technical_Documentation.md) | ConnectionScreen: URL+token connect, demo load, model selection, error handling, screen routing. 7 UI tests. Разблокировано: M1-08. |
| 13 | M1-08 | M1 — Model Visualization | 2026-03-19 | [Report](IssueReport/M1-08_Implementation_Report.md) | [Tech Doc](IssueReport/M1-08_Technical_Documentation.md) | GlobalGraphView: React Flow + elkjs layered layout, 8 ArchiMate layer colours, MiniMap, Controls, fitView. 14 tests (9 nodeStyles + 5 layout). Разблокировано: M1-09, M2-07. |
| 14 | M1-09 | M1 — Model Visualization | 2026-03-19 | [Report](IssueReport/M1-09_Implementation_Report.md) | [Tech Doc](IssueReport/M1-09_Technical_Documentation.md) | ElementCard: name, type, layer, degree, diagrams, orphan badge, Analyze Impact button. 14 UI tests. Разблокировано: M1-10, M2-05. |
| 15 | M1-10 | M1 — Model Visualization | 2026-03-19 | [Report](IssueReport/M1-10_Implementation_Report.md) | [Tech Doc](IssueReport/M1-10_Technical_Documentation.md) | Validation PASSED. All AC verified. 112/112 tests. 100% engine coverage. 0 blocker bugs. **Milestone M1 COMPLETE.** Разблокировано: весь M2, весь M3. |
| 16 | M2-01 | M2 — Impact Analysis | 2026-03-19 | [Report](IssueReport/M2-01_Implementation_Report.md) | [Tech Doc](IssueReport/M2-01_Technical_Documentation.md) | analyzeImpact: BFS undirected, depth 1/2/3, visited set, cycle-safe. Demo: Core Banking Platform depth 2 → 47 elements. 11 tests. Разблокировано: M2-02, M2-03, M2-05. |
| 17 | M2-02 | M2 — Impact Analysis | 2026-03-19 | [Report](IssueReport/M2-02_Implementation_Report.md) | [Tech Doc](IssueReport/M2-02_Technical_Documentation.md) | buildImpactResult: layer summary (sorted desc) + affected diagrams (source only). 6 tests. Разблокировано: M2-05. |
| 18 | M2-03 | M2 — Impact Analysis | 2026-03-19 | [Report](IssueReport/M2-03_Implementation_Report.md) | [Tech Doc](IssueReport/M2-03_Technical_Documentation.md) | 22 impact analysis tests (16 BFS + 6 aggregation), shared fixtures, 100% lines / 90.9% branches, coverage thresholds enforced. Разблокировано: M2-04. |
| 19 | M2-04 | M2 — Impact Analysis | 2026-03-19 | [Report](IssueReport/M2-04_Implementation_Report.md) | [Tech Doc](IssueReport/M2-04_Technical_Documentation.md) | SearchBar: debounced 200ms, case-insensitive substring, 10 max results, layer badges, navigate to impact. 8 UI tests. Разблокировано: M2-05. |
| 20 | M2-05 | M2 — Impact Analysis | 2026-03-19 | [Report](IssueReport/M2-05_Implementation_Report.md) | [Tech Doc](IssueReport/M2-05_Technical_Documentation.md) | ImpactAnalyzerScreen: SourceCard, AffectedList (grouped by hop), LayerSummary, AffectedDiagrams. 7 UI tests. Разблокировано: M2-06, M2-07. |
| 21 | M2-06 | M2 — Impact Analysis | 2026-03-19 | [Report](IssueReport/M2-06_Implementation_Report.md) | [Tech Doc](IssueReport/M2-06_Technical_Documentation.md) | DepthSwitcher: 1/2/3 button group, live update via useEffect, aria-pressed, accent styling. 5 UI tests. Разблокировано: M2-07. |
| 22 | M2-07 | M2 — Impact Analysis | 2026-03-19 | [Report](IssueReport/M2-07_Implementation_Report.md) | [Tech Doc](IssueReport/M2-07_Technical_Documentation.md) | applyHighlighting: source glow, affected accent border, dimmed non-affected (0.2), edge highlighting. 8 tests. Разблокировано: M2-08. |
| 23 | M2-08 | M2 — Impact Analysis | 2026-03-19 | [Report](IssueReport/M2-08_Implementation_Report.md) | [Tech Doc](IssueReport/M2-08_Technical_Documentation.md) | Validation PASSED. All 11 scenario steps, all AC-3.x + AC-5.1 verified. 162/162 tests. 0.14ms perf. 0 blockers. **Milestone M2 COMPLETE.** Разблокировано: M3, M4-01. |
| 24 | M3-01 | M3 — Quality Assessment | 2026-03-19 | [Report](IssueReport/M3-01_Implementation_Report.md) | [Tech Doc](IssueReport/M3-01_Technical_Documentation.md) | TanStack Table: 7 columns, sort, layer/type filter dropdowns, row→impact. 8 UI tests. Разблокировано: M3-02, M4-02. |
| 25 | M3-02 | M3 — Quality Assessment | 2026-03-19 | [Report](IssueReport/M3-02_Implementation_Report.md) | [Tech Doc](IssueReport/M3-02_Technical_Documentation.md) | buildCoverageReport: orphans 12/11.8%, layer distribution, broken refs. 7 tests. Разблокировано: M3-03. |
| 26 | M3-03 | M3 — Quality Assessment | 2026-03-19 | [Report](IssueReport/M3-03_Implementation_Report.md) | [Tech Doc](IssueReport/M3-03_Technical_Documentation.md) | CoverageView: stats header, OrphanList table, LayerDistribution bars. 6 UI tests. Разблокировано: M3-04. |
| 27 | M3-04 | M3 — Quality Assessment | 2026-03-19 | [Report](IssueReport/M3-04_Implementation_Report.md) | [Tech Doc](IssueReport/M3-04_Technical_Documentation.md) | Sidebar + AppLayout: 5 nav items, model gating, active indicator. 8 UI tests. Разблокировано: M3-05. |
| 28 | M3-05 | M3 — Quality Assessment | 2026-03-19 | [Report](IssueReport/M3-05_Implementation_Report.md) | [Tech Doc](IssueReport/M3-05_Technical_Documentation.md) | useNavigateToElement hook: 3 transition paths (Table→Impact, Coverage→Impact, Graph→Impact), 7 tests. Разблокировано: M3-06. |
| 29 | M3-06 | M3 — Quality Assessment | 2026-03-19 | [Report](IssueReport/M3-06_Implementation_Report.md) | [Tech Doc](IssueReport/M3-06_Technical_Documentation.md) | Validation PASSED. All 6 S-3 steps, AC-4.1–AC-4.3, AC-5.3 verified. 220/220 tests. 0 blockers. **Milestone M3 COMPLETE.** Разблокировано: M4-01, M4-02. |
| 30 | M4-01 | M4 — Export and Release | 2026-03-19 | [Report](IssueReport/M4-01_Implementation_Report.md) | [Tech Doc](IssueReport/M4-01_Technical_Documentation.md) | generateGraphML: pure function, valid XML, yEd compatible, escapeXml, 13 tests. Разблокировано: M4-02, M4-03, M4-04. |
| 31 | M4-02 | M4 — Export and Release | 2026-03-19 | [Report](IssueReport/M4-02_Implementation_Report.md) | [Tech Doc](IssueReport/M4-02_Technical_Documentation.md) | generateCSV: UTF-8 BOM, CSV escaping, 9 columns, 11 tests. Разблокировано: M4-03, M4-04. |

---

## Latest Execution Note

**Date:** 2026-03-19

**Event:** M4-02 завершён успешно.

- **Завершён:** M4-02 (Implement CSV Export Generator) — `generateCSV` function.
- **Файлы:** `src/export/csv.ts`, `src/export/index.ts`, `src/export/__tests__/csv.test.ts` (11 tests).
- **Проверки:** `npx vitest run` — 244/244 passed, `npm run build` — успешно, `npm run lint` — 0 ошибок.
- **Артефакты:** `IssueReport/M4-02_Implementation_Report.md`, `IssueReport/M4-02_Technical_Documentation.md`.
- **Новый Current Issue:** M4-03 (Add Export Unit Tests).
- **Разблокировано:** M4-03, M4-04.
- Очередь: 7 нереализованных Issues из 38.
