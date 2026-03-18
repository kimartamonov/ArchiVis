# Dependency Map

## Зависимости между Milestones

```
M0 (Foundation) ──→ M1 (Visualization) ──→ M2 (Impact) ──→ M4 (Export + Release)
                                        ──→ M3 (Quality) ──→ M4 (Export + Release)
```

- **M0 → M1:** Проект инициализирован, types определены, demo dataset готов.
- **M1 → M2:** Граф построен, engine работает, UI shell готов.
- **M1 → M3:** Граф построен, метрики рассчитаны, stores работают.
- **M2, M3 → M4:** Impact result и table data доступны для экспорта.

---

## Зависимости между critical issues

### Основная последовательность (critical path)

```
M0-01 (Spike API)
  ↓
M0-02 (Setup project)
  ↓
M0-03 (Domain types) ──→ M0-04 (Demo dataset)
  ↓                         ↓
M1-01 (Demo connector) ←───┘
  ↓
M1-02 (Architeezy connector)
  ↓
M1-03 (Graph engine) → M1-04 (Metrics) → M1-05 (Tests)
  ↓
M1-06 (Stores) → M1-07 (Connection screen) → M1-08 (Global Graph) → M1-09 (Popup)
  ↓
M2-01 (BFS engine) → M2-02 (Layer summary) → M2-03 (Tests)
  ↓
M2-04 (Search bar) → M2-05 (Impact screen) → M2-06 (Depth switcher) → M2-07 (Highlighting)
  ↓
M3-01 (Table View) → M3-02 (Coverage engine) → M3-03 (Coverage screen)
  ↓
M3-04 (Navigation) → M3-05 (Transitions)
  ↓
M4-01 (GraphML) → M4-02 (CSV) → M4-03 (Tests) → M4-04 (Export buttons)
  ↓
M4-06 (CI) → M4-07 (README) → M4-08 (E2E test) → M4-09 (Final validation)
```

---

## Blocking issues

| Issue | Блокирует | Причина |
|-------|-----------|---------|
| M0-01 | M1-02 | Spike определяет формат auth и endpoints Architeezy |
| M0-03 | M0-04, M1-01, M1-02, M1-03 | Domain types — контракт для всех engine/connector |
| M0-04 | Все validation issues | Demo dataset — primary test data |
| M1-03 | M1-08, M2-01, M3-02 | Graph engine — основа для UI и analysis |
| M1-04 | M3-02, M3-03 | Base metrics (orphan) нужны для coverage |
| M2-01 | M2-05, M4-01 | BFS engine нужен для Impact UI и GraphML export |
| M3-01 | M4-02 | Table data нужна для CSV export |

---

## Точки входа в следующий блок

| После issue | Можно начинать |
|-------------|----------------|
| M0-05 (Foundation validated) | Весь M1 |
| M1-10 (Graph validated) | Весь M2 и M3 (параллельно при 2 dev) |
| M2-08 (Impact validated) | M4-01 (GraphML export) |
| M3-06 (Quality validated) | M4-02 (CSV export) |
| M4-05 (Export validated) | M4-06 (CI) → Release prep |
