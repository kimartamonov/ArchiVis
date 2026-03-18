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
| **Issue ID** | M0-02 |
| **Title** | Setup: React + TypeScript + Vite + ESLint |
| **Milestone** | M0 — Project Foundation |
| **Type** | Setup |
| **Status** | Current |
| **Depends On** | — (нет зависимостей) |
| **Unlocks** | M0-03, M0-04, M1-01 |
| **File** | `Issue-Tree/M0_Project_Foundation/M0-02_Setup_Project_Skeleton.md` |

---

## Execution Queue

| # | Issue ID | Milestone | Status | Report | Tech Doc | Note |
|---|----------|-----------|--------|--------|----------|------|
| 1 | M0-01 | M0 — Project Foundation | Done | [Report](IssueReport/M0-01_Implementation_Report.md) | [Tech Doc](IssueReport/M0-01_Technical_Documentation.md) | Spike: исследование API Architeezy |
| 2 | M0-02 | M0 — Project Foundation | Current | — | — | Setup: React + TS + Vite + ESLint |
| 3 | M0-03 | M0 — Project Foundation | Pending | — | — | Domain types и NormalizedModel interface |
| 4 | M0-04 | M0 — Project Foundation | Pending | — | — | Demo dataset: Digital Bank Architecture |
| 5 | M0-05 | M0 — Project Foundation | Pending | — | — | Validation: Readiness Gate |
| 6 | M1-01 | M1 — Model Visualization | Pending | — | — | Demo dataset connector |
| 7 | M1-02 | M1 — Model Visualization | Pending | — | — | Architeezy connector (fetch + normalize) |
| 8 | M1-03 | M1 — Model Visualization | Pending | — | — | Graph engine: construction, adjacency, indexes |
| 9 | M1-04 | M1 — Model Visualization | Pending | — | — | Base metrics: degree, orphan detection |
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

---

## Latest Execution Note

**Date:** 2026-03-18

**Event:** M0-01 завершён успешно.

- **Завершён:** M0-01 (Spike: Research Architeezy API) — API Architeezy полностью исследован.
- **Ключевые результаты:** OpenAPI 3.0 спецификация доступна, все 5 требуемых API ресурсов подтверждены, R1 не материализовался, D-15 и D-16 закрыты.
- **Артефакты:** `docs/spikes/architeezy-api-research.md`, `IssueReport/M0-01_Implementation_Report.md`, `IssueReport/M0-01_Technical_Documentation.md`.
- **Новый Current Issue:** M0-02 (Setup: React + TypeScript + Vite + ESLint) — следующий в очереди, без зависимостей.
- **Разблокировано:** M1-02 (Architeezy connector) теперь может начаться когда его зависимости будут готовы.
- Очередь: 37 нереализованных Issues из 38.
