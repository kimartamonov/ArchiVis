# Milestone Index

## M0: Project Foundation

- **ID:** M0
- **Цель:** Устранить главную неопределённость (API Architeezy), настроить проект, создать demo dataset и domain types.
- **Capability Slices:** Readiness Gate (RG-1 — RG-5)
- **Issues (в порядке реализации):**
  1. M0-01 — Spike: Research Architeezy API endpoints and auth
  2. M0-02 — Setup project skeleton
  3. M0-03 — Define NormalizedModel interface and domain types
  4. M0-04 — Create demo dataset
  5. M0-05 — Validation: Project foundation is stable
- **Exit criteria:** `npm run dev` запускается, domain types компилируются, demo dataset загружается в memory.

---

## M1: Model Visualization

- **ID:** M1
- **Цель:** Пользователь подключается к Architeezy (или загружает demo), видит модель как интерактивный граф.
- **Capability Slices:** S-1 «Вижу модель как граф»
- **Issues (в порядке реализации):**
  1. M1-01 — Implement demo dataset connector
  2. M1-02 — Implement Architeezy connector
  3. M1-03 — Build graph engine (construction, adjacency, indexes)
  4. M1-04 — Calculate base metrics (degree, orphan)
  5. M1-05 — Add unit tests for graph engine
  6. M1-06 — Create Zustand stores
  7. M1-07 — Build connection screen UI
  8. M1-08 — Build Global Graph view
  9. M1-09 — Add node click → element info popup
  10. M1-10 — Validation: MS-1 graph visualization
- **Exit criteria:** Demo dataset отображается как интерактивный граф с цветовой кодировкой. Клик по узлу показывает info popup.

---

## M2: Impact Analysis

- **ID:** M2
- **Цель:** Пользователь выбирает элемент, видит полную картину impact на 1-2-3 шага.
- **Capability Slices:** S-2 «Анализирую impact изменения»
- **Issues (в порядке реализации):**
  1. M2-01 — Implement BFS impact analysis in insight engine
  2. M2-02 — Implement layer summary and affected diagrams
  3. M2-03 — Add unit tests for impact analysis
  4. M2-04 — Build global search bar with dropdown
  5. M2-05 — Build Impact Analyzer screen
  6. M2-06 — Add depth switcher with live update
  7. M2-07 — Add impact subgraph highlighting on Global Graph
  8. M2-08 — Validation: MS-2 canonical impact scenario
- **Exit criteria:** Канонический сценарий (Payment Gateway → impact depth 2) работает корректно. Unit-тесты BFS проходят.

---

## M3: Quality Assessment

- **ID:** M3
- **Цель:** Пользователь оценивает качество модели через таблицу и coverage.
- **Capability Slices:** S-3 «Оцениваю качество модели»
- **Issues (в порядке реализации):**
  1. M3-01 — Build Table View with TanStack Table
  2. M3-02 — Implement coverage report in insight engine
  3. M3-03 — Build Coverage screen UI
  4. M3-04 — Add screen navigation (sidebar/tabs)
  5. M3-05 — Add cross-screen transitions
  6. M3-06 — Validation: MS-3 coverage and table scenario
- **Exit criteria:** Таблица рендерит все элементы с сортировкой. Orphan count совпадает с ожиданием. Навигация между экранами работает.

---

## M4: Export and Release

- **ID:** M4
- **Цель:** Экспорт результатов, CI, документация, готовность к публичному релизу.
- **Capability Slices:** S-4 «Экспортирую результаты» + Release
- **Issues (в порядке реализации):**
  1. M4-01 — Implement GraphML export generator
  2. M4-02 — Implement CSV export generator
  3. M4-03 — Add unit tests for export generators
  4. M4-04 — Add export buttons to UI
  5. M4-05 — Validation: Export files open correctly
  6. M4-06 — Setup GitHub Actions CI
  7. M4-07 — Write README and project documentation
  8. M4-08 — E2E smoke test
  9. M4-09 — Final validation: Complete MVP acceptance
- **Exit criteria:** Все P0 фичи работают. GraphML → yEd. CSV → Excel. CI green. README позволяет запустить за < 5 минут.
