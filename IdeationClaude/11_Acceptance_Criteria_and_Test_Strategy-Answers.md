# 11_Acceptance_Criteria_and_Test_Strategy: ответы

---

### Главный end-to-end сценарий приемки MVP

**Решение:** Канонический сценарий — **«Impact Analysis от подключения до экспорта»**:

```
GIVEN:  Architeezy доступен по URL с валидным token (или demo dataset)
WHEN:   Пользователь подключается, выбирает модель, находит элемент "Payment Gateway",
        запускает impact analysis на глубину 2, экспортирует результат в GraphML
THEN:
  - Модель загружена, граф отображён
  - "Payment Gateway" найден через поиск
  - Affected elements отображены (> 0 элементов на каждом уровне глубины)
  - Summary по слоям показано
  - Affected diagrams показаны (≥ 1)
  - GraphML файл скачан и открывается в yEd без ошибок
  - Весь сценарий занимает < 3 минут
```

---

### Acceptance criteria: подключение к Architeezy

| # | Критерий | Проверка |
|---|----------|----------|
| AC-1.1 | При вводе корректных URL + token и нажатии Connect — отображается список моделей | Manual + E2E |
| AC-1.2 | При невалидном token — сообщение «Authentication failed» | Manual |
| AC-1.3 | При недоступном URL — сообщение «Cannot connect» + retry button | Manual |
| AC-1.4 | При загрузке demo dataset — модель загружается без ввода credentials | Manual + E2E |
| AC-1.5 | Список моделей отображает имя каждой модели | Manual |

---

### Acceptance criteria: загрузка модели и построение графа

| # | Критерий | Проверка |
|---|----------|----------|
| AC-2.1 | После выбора модели — все элементы загружены (количество совпадает с Architeezy) | Manual + Unit |
| AC-2.2 | Все отношения загружены (количество совпадает) | Unit |
| AC-2.3 | Граф содержит столько узлов, сколько элементов в модели | Unit |
| AC-2.4 | Граф содержит столько рёбер, сколько валидных отношений | Unit |
| AC-2.5 | Базовые метрики (degree, orphan) рассчитаны для каждого узла | Unit |
| AC-2.6 | Битые ссылки зафиксированы как warnings, не как errors | Unit |
| AC-2.7 | Загрузка модели из 200 элементов занимает < 5 сек | Performance smoke |

---

### Acceptance criteria: Impact Analyzer

| # | Критерий | Проверка |
|---|----------|----------|
| AC-3.1 | При выборе элемента — отображается карточка (имя, тип, слой, degree) | E2E |
| AC-3.2 | На глубину 1 — affected elements = прямые соседи элемента | Unit (проверка на known graph) |
| AC-3.3 | На глубину 2 — affected elements = соседи + соседи соседей (без дубликатов) | Unit |
| AC-3.4 | На глубину 3 — аналогично, BFS корректен | Unit |
| AC-3.5 | Summary по слоям корректно: сумма по слоям = total affected | Unit |
| AC-3.6 | Affected diagrams — список диаграмм, где исходный элемент присутствует | Unit |
| AC-3.7 | Переключение глубины 1→2→3 обновляет результат без перезагрузки | E2E |
| AC-3.8 | Impact analysis на модели 200 элементов выполняется < 1 сек | Performance |
| AC-3.9 | Циклы в графе не вызывают бесконечный цикл (visited set) | Unit |

---

### Acceptance criteria: Coverage / Hygiene

| # | Критерий | Проверка |
|---|----------|----------|
| AC-4.1 | Orphan count = количество элементов с degree==0 ИЛИ diagramsCount==0 | Unit |
| AC-4.2 | Orphan % корректен (orphans / total * 100) | Unit |
| AC-4.3 | Список orphans содержит имя, тип, слой каждого | E2E |
| AC-4.4 | Клик на orphan переводит к карточке элемента | E2E |

---

### Acceptance criteria: фильтры, поиск, навигация

| # | Критерий | Проверка |
|---|----------|----------|
| AC-5.1 | Поиск по имени находит элемент (substring, case-insensitive) | Unit + E2E |
| AC-5.2 | Фильтр по слою скрывает узлы других слоёв на графе | E2E |
| AC-5.3 | Фильтр по типу скрывает узлы других типов | E2E |
| AC-5.4 | Навигация между экранами (Graph, Table, Impact, Coverage) работает без потери состояния | E2E |

---

### Acceptance criteria: экспорт

| # | Критерий | Проверка |
|---|----------|----------|
| AC-6.1 | GraphML экспорт impact подграфа — файл содержит все affected nodes и edges | Unit |
| AC-6.2 | GraphML файл открывается в yEd без ошибок | Manual |
| AC-6.3 | CSV экспорт таблицы — файл содержит все элементы со всеми столбцами | Unit |
| AC-6.4 | CSV файл открывается в Excel с корректной кодировкой (UTF-8 BOM) | Manual |

---

### Тестовые данные для приемки

**Решение:** Два набора данных:

1. **Demo dataset (synthetic)** — поставляется в репозитории. Заранее известны:
   - Точное количество элементов, отношений, диаграмм.
   - Элемент-хаб с known degree.
   - Known orphans.
   - Expected impact result для конкретного элемента на глубину 1/2/3.

2. **Real model (Architeezy)** — если доступна. Используется для manual acceptance. Expected results определяются ручной проверкой архитектурным экспертом.

**Предварительно рассчитанные ожидания (для demo dataset):**

```
Element "Core Banking Platform":
  - degree: 12 (in: 5, out: 7)
  - diagrams: 4
  - impact depth 1: 12 elements
  - impact depth 2: 28 elements
  - impact depth 3: 41 elements

Model totals:
  - elements: 95
  - relationships: 187
  - diagrams: 12
  - orphans: 11
```

---

### Ручная приемка архитектурным экспертом

**Решение:** **Да, желательна.** Формат:
1. Эксперт проходит канонический сценарий на demo dataset.
2. Проверяет корректность impact chains (совпадают с его пониманием модели).
3. Проверяет orphan detection (нет ложных orphans, нет пропущенных).
4. Оценивает объяснимость метрик (понятны ли tooltips).
5. Даёт feedback: «полезно / бесполезно / нужно доработать X».

Если нет доступного эксперта — приемка через unit-тесты с pre-calculated expected values.

---

### Обязательные тесты для MVP

| Тип | Что покрывает | Обязателен? |
|-----|--------------|-------------|
| **Unit tests** | Graph Engine: BFS, degree, orphan detection | Да |
| **Unit tests** | Insight Engine: impact analysis, coverage metrics | Да |
| **Unit tests** | Connector: normalization, broken refs handling | Да |
| **Unit tests** | Export: GraphML generation, CSV generation | Да |
| **E2E test** | Канонический сценарий (connect → impact → export) | Да (1 тест) |
| **Smoke test** | Приложение запускается, demo dataset загружается | Да |
| **Integration test** | Connector → real Architeezy API | Нет (manual only) |
| **Visual test** | Граф рендерится корректно | Нет (manual only) |
| **Performance smoke** | Загрузка 200 элементов < 5 сек, impact < 1 сек | Да (простой benchmark) |

---

### Уровень автоматизации тестов

**Решение:**
- **Graph Engine + Insight Engine:** > 80% line coverage. Это ядро продукта.
- **Connector:** > 60%. Маппинг и обработка edge cases.
- **Export:** > 70%. Корректность форматов.
- **UI:** 1 E2E тест (Playwright/Cypress) на канонический сценарий. Остальное — manual.

Общее покрытие: ~60-70%. Фокус на логике, не на UI.

---

### Блокирующие vs допустимые дефекты

**Blocker (не релизим):**
- Impact analysis даёт неправильные результаты (некорректный BFS).
- Приложение падает при загрузке модели.
- Экспорт создаёт невалидный GraphML/CSV.
- Подключение к Architeezy невозможно при корректных credentials.

**Critical (релизим с known issue):**
- UI glitch при zoom/pan на больших графах.
- Метрика отображается без tooltip.
- Фильтр сбрасывается при навигации.

**Minor (релизим):**
- Визуальные несовершенства layout.
- Неоптимальная расстановка узлов.
- Мелкие стилевые проблемы.

---

### Definition of Done для capability slice

Slice считается done, когда:
1. Все P0 функциональные требования slice реализованы.
2. Все acceptance criteria slice проходят.
3. Unit-тесты для логики slice написаны и проходят.
4. Нет blocker дефектов.
5. Код review пройден (self-review для solo dev).
6. Slice можно продемонстрировать на demo dataset.

---

### Definition of Done для всего MVP

MVP считается done, когда:
1. Все 6 этапов roadmap завершены.
2. Канонический E2E сценарий проходит.
3. Demo dataset работает корректно.
4. Подключение к реальному Architeezy работает (или задокументировано как limitation).
5. README позволяет новому пользователю запустить проект за < 5 минут.
6. GraphML экспорт открывается в yEd.
7. Нет blocker дефектов.
8. GitHub repo публичен с MIT лицензией.

---

### Доказательства готовности

| Артефакт | Обязателен? |
|----------|-------------|
| README с инструкцией | Да |
| Скриншоты/GIF в README | Да |
| Demo dataset в репозитории | Да |
| Demo script (текст, 5 минут) | Да |
| Passing CI (lint + tests) | Да |
| Sample exports (GraphML, CSV) | Желательно |
| Known limitations section в README | Да |
| Video demo | Желательно, не обязательно |
| Test report | Нет (CI green достаточно) |
