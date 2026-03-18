# Master Roadmap — ArchiLens MVP Issue Tree

## Цель

Этот Issue Tree описывает полный путь реализации ArchiLens MVP — от инициализации проекта до готового публичного релиза. Каждый Issue представлен отдельным файлом и может быть реализован последовательно без дополнительных product decisions.

---

## Milestones

| ID | Название | Цель | Slices | Недели |
|----|----------|------|--------|--------|
| M0 | Project Foundation | Устранить неопределённости, настроить проект, создать demo dataset | Readiness Gate | 0-1 |
| M1 | Model Visualization | Пользователь видит модель как интерактивный граф | S-1 | 1-2 |
| M2 | Impact Analysis | Пользователь анализирует impact изменения элемента | S-2 | 3 |
| M3 | Quality Assessment | Пользователь оценивает качество модели через таблицу и coverage | S-3 | 4 |
| M4 | Export and Release | Экспорт результатов, CI, документация, готовность к релизу | S-4 + Release | 5-6 |

---

## Порядок прохождения

```
M0 (Foundation) → M1 (Graph) → M2 (Impact) → M3 (Quality) → M4 (Export + Release)
                                    ↓
                             Valuable MVP
                                              ↓
                                       Stronger MVP
                                                          ↓
                                                   Complete MVP
```

M0 → M1: строго последовательно.
M2, M3: могут частично параллелиться при 2 разработчиках, но рекомендуется последовательно.
M4: зависит от M2 и M3.

---

## Общий критерий завершения MVP

1. Все 5 milestones завершены.
2. Канонический E2E сценарий проходит на demo dataset.
3. GraphML открывается в yEd.
4. CSV открывается в Excel.
5. README позволяет запустить за < 5 минут.
6. Нет blocker дефектов.
7. CI (lint + tests) проходит.

---

## Ключевые dependency gates

| Gate | Описание | Блокирует |
|------|----------|-----------|
| G-1 | Spike завершён: API Architeezy исследован | M0-02 → M1-02 |
| G-2 | Domain types определены | M0-03 → все engine/connector issues |
| G-3 | Demo dataset создан | M0-04 → все validation issues |
| G-4 | Graph engine работает | M1-03/M1-04 → все UI issues |
| G-5 | Impact analysis engine работает | M2-01/M2-02 → Impact Analyzer UI |
| G-6 | Table + Coverage готовы | M3 → M4 export |

---

## Critical decisions, влияющие на реализацию

| ID | Решение | Статус | Влияет на |
|----|---------|--------|-----------|
| D-1 | Frontend-only SPA | decided | Всё |
| D-3 | React Flow для графа | decided | M1: Global Graph |
| D-11 | elkjs для layout | preferred → подтвердить в M1-08 | M1: Global Graph |
| D-12 | Ручной BFS (без Cytoscape.js) | preferred → подтвердить в M2-01 | M2: Impact Analysis |
| D-14 | TanStack Table | preferred → подтвердить в M3-01 | M3: Table View |
| D-15 | Auth формат Architeezy | blocked → закрыть в M0-01 | M1: Connector |

---

## Общая статистика

- **Milestones:** 5
- **Issues:** 38
- **P0 FR покрыто:** 34/34
- **Capability slices:** S-1, S-2, S-3, S-4 (все обязательные)
- **Cut lines:** после M2 (Valuable MVP), после M3 (Strong MVP), после M4 (Complete MVP)

---

*Источники: [14_Capability_Slice_Map](../DocsClaude/05-planning/14_Capability_Slice_Map.md), [10_Roadmap](../DocsClaude/04-delivery/10_Roadmap_and_Delivery_Plan.md), [13_Decision_Backlog](../DocsClaude/05-planning/13_Decision_Backlog.md).*
