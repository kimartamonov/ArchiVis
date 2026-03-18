# 11. Acceptance Criteria and Test Strategy

> Главный вопрос документа: «Как мы поймём, что продукт готов и не сломан?»

---

## Главный end-to-end сценарий приёмки

```
GIVEN:  Architeezy доступен (или demo dataset загружен)
WHEN:   Пользователь подключается, выбирает модель, находит "Payment Gateway",
        запускает impact analysis на глубину 2, экспортирует в GraphML
THEN:
  - Модель загружена, граф отображён
  - "Payment Gateway" найден через поиск
  - Affected elements показаны (> 0 на каждом уровне)
  - Summary по слоям показано
  - Affected diagrams показаны (>= 1)
  - GraphML файл скачан и открывается в yEd
  - Весь сценарий < 3 минут
```

---

## Acceptance Criteria по функциям

### Подключение

| AC | Критерий |
|----|----------|
| AC-1.1 | Корректные credentials → список моделей отображается |
| AC-1.2 | Невалидный token → «Authentication failed» |
| AC-1.3 | Недоступный URL → «Cannot connect» + Retry |
| AC-1.4 | Demo dataset загружается без credentials |

### Загрузка модели и граф

| AC | Критерий |
|----|----------|
| AC-2.1 | Количество элементов в графе совпадает с источником |
| AC-2.2 | Количество рёбер = количество валидных отношений |
| AC-2.3 | Базовые метрики рассчитаны для каждого узла |
| AC-2.4 | Битые ссылки — warnings, не errors |
| AC-2.5 | Загрузка 200 элементов < 5 сек |

### Impact Analyzer

| AC | Критерий |
|----|----------|
| AC-3.1 | Карточка элемента: имя, тип, слой, degree |
| AC-3.2 | Глубина 1 = прямые соседи (проверка на known graph) |
| AC-3.3 | Глубина 2 = соседи + соседи соседей (без дубликатов) |
| AC-3.4 | Глубина 3 = корректный BFS |
| AC-3.5 | Сумма по слоям = total affected |
| AC-3.6 | Affected diagrams = диаграммы исходного элемента |
| AC-3.7 | Переключение глубины обновляет без перезагрузки |
| AC-3.8 | Impact на 200 элементов < 1 сек |
| AC-3.9 | Циклы не вызывают бесконечный цикл |

### Coverage

| AC | Критерий |
|----|----------|
| AC-4.1 | Orphan count = элементы с degree==0 ИЛИ diagramsCount==0 |
| AC-4.2 | Orphan % корректен |
| AC-4.3 | Клик на orphan → карточка элемента |

### Фильтры и поиск

| AC | Критерий |
|----|----------|
| AC-5.1 | Поиск по имени находит элемент (substring, case-insensitive) |
| AC-5.2 | Фильтр по слою скрывает узлы других слоёв |
| AC-5.3 | Навигация между экранами без потери состояния |

### Экспорт

| AC | Критерий |
|----|----------|
| AC-6.1 | GraphML содержит все affected nodes и edges |
| AC-6.2 | GraphML открывается в yEd |
| AC-6.3 | CSV содержит все элементы и все столбцы |
| AC-6.4 | CSV открывается в Excel (UTF-8 BOM) |

---

## Тестовые данные

### Demo dataset (основной)

Поставляется в репозитории. Предварительно рассчитанные ожидания:

```
Element "Core Banking Platform":
  degree: 12 (in: 5, out: 7)
  diagrams: 4
  impact depth 1: 12 elements
  impact depth 2: 28 elements
  impact depth 3: 41 elements

Model totals:
  elements: 95
  relationships: 187
  diagrams: 12
  orphans: 11
```

### Real model (Architeezy)

Если доступна — manual acceptance. Expected results определяются ручной проверкой.

---

## Ручная приёмка

Формат (если доступен архитектурный эксперт):
1. Проходит канонический сценарий на demo dataset.
2. Проверяет корректность impact chains.
3. Проверяет orphan detection.
4. Оценивает объяснимость метрик.
5. Feedback: полезно / бесполезно / нужно доработать.

---

## Стратегия тестирования

| Тип | Покрытие | Обязателен? |
|-----|---------|-------------|
| Unit tests: Graph Engine | BFS, degree, orphan detection | Да (> 80%) |
| Unit tests: Insight Engine | Impact analysis, coverage | Да (> 80%) |
| Unit tests: Connector | Normalization, broken refs | Да (> 60%) |
| Unit tests: Export | GraphML, CSV generation | Да (> 70%) |
| E2E test | Канонический сценарий | Да (1 тест) |
| Smoke test | App запускается, demo загружается | Да |
| Performance smoke | 200 элементов < 5 сек, impact < 1 сек | Да |
| Integration test (real API) | Connector → Architeezy | Нет (manual) |
| Visual test | Граф рендерится | Нет (manual) |

**Общее покрытие:** ~60-70%. Фокус на логике engine, не на UI.

---

## Приоритизация дефектов

**Blocker (не релизим):**
- Impact analysis даёт неправильные результаты.
- Приложение падает при загрузке.
- Экспорт создаёт невалидный файл.
- Подключение невозможно при корректных credentials.

**Critical (релизим с known issue):**
- UI glitch при zoom/pan.
- Метрика без tooltip.
- Фильтр сбрасывается при навигации.

**Minor (релизим):**
- Визуальные несовершенства layout.
- Мелкие стилевые проблемы.

---

## Definition of Done

### Для capability slice

1. Все P0 требования slice реализованы.
2. Все AC slice проходят.
3. Unit-тесты написаны и проходят.
4. Нет blocker дефектов.
5. Slice можно продемонстрировать на demo dataset.

### Для всего MVP

1. Все 6 этапов roadmap завершены.
2. Канонический E2E проходит.
3. Demo dataset работает.
4. README позволяет запустить за < 5 минут.
5. GraphML открывается в yEd.
6. Нет blocker дефектов.
7. GitHub repo публичен, MIT лицензия.

---

## Доказательства готовности

| Артефакт | Обязателен? |
|----------|-------------|
| README с инструкцией | Да |
| Скриншоты/GIF в README | Да |
| Demo dataset | Да |
| Demo script (5 мин) | Да |
| Passing CI (lint + tests) | Да |
| Known limitations в README | Да |
| Sample exports | Желательно |
| Video demo | Желательно |

---

*Связь с другими документами: сценарии → [04_User_Scenarios](../01-discovery/04_User_Scenarios_and_Use_Cases.md), FR → [05_Functional_Requirements](../02-requirements/05_Functional_Requirements.md), slices → [14_Capability_Slice_Map](../05-planning/14_Capability_Slice_Map.md).*
