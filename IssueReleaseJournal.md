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
| **Issue ID** | M1-04 |
| **Title** | Calculate Base Metrics |
| **Milestone** | M1 — Model Visualization |
| **Type** | Engine |
| **Status** | Current |
| **Depends On** | M1-03 (Done) |
| **Unlocks** | M1-05, M3-02, M3-03 |
| **File** | `Issue-Tree/M1_Model_Visualization/M1-04_Calculate_Base_Metrics.md` |

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
| 9 | M1-04 | M1 — Model Visualization | Current | — | — | Base metrics: degree, orphan detection |
| 10 | M1-05 | M1 — Model Visualization | Pending | — | — | Unit tests for graph engine |
| 11 | M1-06 | M1 — Model Visualization | Pending | — | — | Zustand stores |
| 12 | M1-07 | M1 — Model Visualization | Pending | — | — | Connection screen UI |
| 13 | M1-08 | M1 — Model Visualization | Pending | — | — | Global Graph view (React Flow + elkjs) |
| 14 | M1-09 | M1 — Model Visualization | Pending | — | — | Node click → element info popup |
| 15 | M1-10 | M1 — Model Visualization | Pending | — | — | Validation: MS-1 graph visualization |
| 16 | M2-01 | M2 — Impact Analysis | Pending | — | — | BFS impact analysis engine |
| 17 | M2-02 | M2 — Impact Analysis | Pending | — | — | Layer summary и affected diagrams |
| 18 | M2-03 | M2 — Impact Analysis | Pending | — | — | Unit tests for impact analysis |
| 19 | M2-04 | M2 — Impact Analysis | Pending | — | — | Global search bar с dropdown |
| 20 | M2-05 | M2 — Impact Analysis | Pending | — | — | Impact Analyzer screen |
| 21 | M2-06 | M2 — Impact Analysis | Pending | — | — | Depth switcher (1/2/3) |
| 22 | M2-07 | M2 — Impact Analysis | Pending | — | — | Impact subgraph highlighting |
| 23 | M2-08 | M2 — Impact Analysis | Pending | — | — | Validation: canonical impact scenario |
| 24 | M3-01 | M3 — Quality Assessment | Pending | — | — | Table View (TanStack Table) |
| 25 | M3-02 | M3 — Quality Assessment | Pending | — | — | Coverage report engine |
| 26 | M3-03 | M3 — Quality Assessment | Pending | — | — | Coverage screen UI |
| 27 | M3-04 | M3 — Quality Assessment | Pending | — | — | Screen navigation (sidebar/tabs) |
| 28 | M3-05 | M3 — Quality Assessment | Pending | — | — | Cross-screen transitions |
| 29 | M3-06 | M3 — Quality Assessment | Pending | — | — | Validation: coverage and table |
| 30 | M4-01 | M4 — Export and Release | Pending | — | — | GraphML export generator |
| 31 | M4-02 | M4 — Export and Release | Pending | — | — | CSV export generator |
| 32 | M4-03 | M4 — Export and Release | Pending | — | — | Unit tests for export |
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

---

## Latest Execution Note

**Date:** 2026-03-18

**Event:** M1-03 завершён успешно.

- **Завершён:** M1-03 (Build Graph Engine) — buildGraph() создан и протестирован.
- **Файлы:** `src/engine/graph/buildGraph.ts`, `src/engine/graph/index.ts`, тесты в `__tests__/buildGraph.test.ts`.
- **Проверки:** `npm run build` — успешно, `npm run lint` — 0 ошибок, `npm run test` — 28/28 passed (6 Demo + 13 Architeezy + 9 Graph).
- **Артефакты:** `IssueReport/M1-03_Implementation_Report.md`, `IssueReport/M1-03_Technical_Documentation.md`.
- **Новый Current Issue:** M1-04 (Calculate Base Metrics) — зависимость M1-03 закрыта.
- **Разблокировано:** M1-04, M1-05, M1-08, M2-01, M3-02.
- Очередь: 30 нереализованных Issues из 38.
