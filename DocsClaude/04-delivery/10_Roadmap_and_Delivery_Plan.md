# 10. Roadmap and Delivery Plan

> Главный вопрос документа: «В каком порядке мы реализуем продукт?»

---

## Delivery Context

- **Команда:** 1-2 fullstack разработчика (TypeScript/React).
- **Длительность MVP:** 6 недель.
- **Первый демонстрируемый результат:** через 2 недели.
- **Бюджет:** нулевой. Только время участников.

---

## Этапы реализации

### Этап 0: Spike & Setup (3-5 дней)

**Цель:** Устранить главную неопределённость — API Architeezy. Настроить проект.

**Содержание:**
- Исследовать Swagger UI Architeezy. Получить credentials.
- Ручные запросы к API. Понять формат данных, auth, CORS.
- Настроить проект: React + TypeScript + Vite + ESLint + Prettier.
- Создать структуру папок и базовые interfaces.
- Подготовить минимальный demo dataset (JSON).

**Результат:** Понимание API + skeleton проекта.

**Критерий выхода:** Можем программно получить список элементов и отношений из Architeezy.

---

### Этап 1: Connector + Graph Engine (Неделя 1)

**Цель:** Загрузить модель и построить граф.

**Содержание:**
- Architeezy connector (fetch elements, relationships, diagrams).
- Нормализация в NormalizedModel.
- Graph Engine: построение графа, adjacency lists, indexes.
- Расчёт базовых метрик (degree, orphan).
- Unit-тесты для graph engine.

**Результат:** `loadModel()` → `AnalysisGraph` с метриками.

**Критерий выхода:** На demo dataset граф строится корректно, метрики совпадают с ручным подсчётом.

---

### Этап 2: Базовый UI + Global Graph (Неделя 2)

**Цель:** Показать модель визуально. **Первый демонстрируемый результат.**

**Содержание:**
- Экран подключения (URL + token + Connect).
- Загрузка модели с прогрессом.
- Global Graph на React Flow с elkjs layout.
- Цветовая кодировка по слоям. Zoom/pan.
- Клик по узлу → базовая карточка.

**Результат:** Пользователь подключается → видит граф → кликает по узлам.

**Критерий выхода:** Demo dataset отображается как интерактивный граф.

---

### Этап 3: Impact Analyzer (Неделя 3)

**Цель:** Главный сценарий MVP — impact analysis.

**Содержание:**
- BFS от выбранного элемента.
- Переключатель глубины 1/2/3.
- Affected elements (список + подсветка на графе).
- Summary по слоям. Affected diagrams.
- Карточка элемента с метриками.
- Текстовый поиск.

**Результат:** Полный impact analysis end-to-end.

**Критерий выхода:** Канонический сценарий работает корректно.

---

### Этап 4: Таблица + Coverage (Неделя 4)

**Цель:** Второй столп ценности + альтернативная навигация.

**Содержание:**
- Table View (TanStack Table) с сортировкой и фильтрацией.
- Coverage экран: orphan count/list, stats.
- Фильтры по слою и типу (граф + таблица).
- Навигация между экранами.

**Результат:** Два способа работы — граф и таблица + coverage insights.

**Критерий выхода:** Orphan elements определяются корректно.

---

### Этап 5: Экспорт + стабилизация (Неделя 5)

**Цель:** Экспорт + polish + стабильность.

**Содержание:**
- Export GraphML (подграф и полный граф).
- Export CSV (таблица элементов).
- Финализация demo dataset.
- Bug fixes, UI polish.
- Проверка на реальной модели Architeezy (если доступна).

**Результат:** Стабильный MVP с экспортом.

**Критерий выхода:** GraphML открывается в yEd. CSV — в Excel. Нет critical багов.

---

### Этап 6: Документация + Release (Неделя 6)

**Цель:** Готовность к публичному релизу.

**Содержание:**
- README: описание, скриншоты, инструкция запуска.
- CONTRIBUTING.md, LICENSE (MIT).
- Demo script (5 минут).
- Smoke E2E тест.
- GitHub release v0.1.0.
- Deploy demo (GitHub Pages / Vercel).

**Результат:** Публичный open source проект.

**Критерий выхода:** Новый пользователь запускает проект по README за < 5 минут.

---

## Критический путь

```
API Research (Spike) → Connector → Graph Engine → Impact Analysis → UI
```

Если API не предоставляет нужных данных — проект стопорится на spike.

**Fallback:** MVP на demo dataset + mock connector. Реальная интеграция — post-MVP.

---

## Cut lines при нехватке времени

**Что убирать первым (от менее важного):**
1. Coverage & Hygiene (этап 4)
2. CSV экспорт
3. Фильтры по типу элемента
4. Легенда графа
5. Прогресс загрузки

**Что нельзя убирать:**
1. Подключение к Architeezy (или demo dataset)
2. Построение графа
3. Global Graph с цветовой кодировкой
4. Impact Analysis (1-2-3 шага)
5. Экспорт подграфа в GraphML

---

## Зависимости по этапам

```
Spike → Этап 1 → Этап 2 → Этап 3 → Этап 4 → Этап 5 → Этап 6
                     ↓
              Первый demo (можно показать)
                              ↓
                      Valuable MVP (impact работает)
                                        ↓
                                Complete MVP
```

---

## Post-MVP roadmap

| Фаза | Горизонт | Содержание |
|------|----------|-----------|
| **Phase 2** | 2-3 месяца | Criticality Radar, Cross-Layer X-Ray, Saved Views, Advanced metrics, Plugin API stubs |
| **Phase 3** | 6+ месяцев | Multi-model, Time diff, Alerts, Community extensions, Alternative connectors |

Phase 2 начинается после подтверждения ценности MVP реальными пользователями.

---

## Признаки готовности к post-MVP

1. MVP используется 3+ реальными пользователями.
2. Канонический сценарий стабилен на 3+ моделях.
3. Нет critical багов.
4. Есть запрос на Phase 2 фичу от реального пользователя.

---

*Связь с другими документами: scope → [02_Scope](../01-discovery/02_Scope_and_Boundaries.md), приёмка → [11_Acceptance_Criteria](11_Acceptance_Criteria_and_Test_Strategy.md), slices → [14_Capability_Slice_Map](../05-planning/14_Capability_Slice_Map.md).*
