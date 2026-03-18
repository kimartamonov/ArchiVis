# 14. Capability Slice Map

> Главный вопрос документа: «На какие пользовательские capability-срезы нужно разрезать MVP перед построением issue tree?»

---

## Принцип slicing

Каждый slice — вертикальный срез по **пользовательскому результату**: UI → логика → данные. Пользователь получает ощутимый результат от начала до конца. Не «backend slice + frontend slice», а «пользователь может сделать X и получить Y».

---

## Каркас roadmap

```
Readiness Gate → MS-1 → MS-2 → MS-3 → MS-4
                  ↓        ↓        ↓        ↓
               Видит    Анализирует  Оценивает  Экспортирует
               модель   impact      качество   результаты
```

---

## Readiness Gate

Условия, выполняемые до начала slicing:

| # | Условие | Как проверить |
|---|---------|---------------|
| RG-1 | Проект инициализирован (React + TS + Vite + ESLint) | `npm run dev` запускается |
| RG-2 | API Architeezy исследован (spike завершён) | Документ: доступные endpoints, формат данных, auth |
| RG-3 | Demo dataset создан (JSON, 80-120 элементов) | Файл в repo, структура соответствует NormalizedModel |
| RG-4 | Connector interface определён | TypeScript interface в коде |
| RG-5 | Базовая структура папок создана | src/connectors, src/engine, src/ui |

**Длительность:** 3-5 дней (Этап 0 roadmap).

---

## Slice S-1: «Вижу модель как граф»

**Milestone:** MS-1 (Неделя 1-2)

**User outcome:** Пользователь подключается к Architeezy (или загружает demo), видит модель как интерактивный граф с цветовой кодировкой слоёв, может кликнуть по узлу и увидеть его имя и тип.

**Состав:**
- Connection screen (URL + token + Connect)
- Demo dataset loader (кнопка «Load Demo»)
- Architeezy connector (fetch models, elements, relationships, diagrams)
- Graph Engine: построение AnalysisGraph из NormalizedModel
- Global Graph view: React Flow + elkjs layout
- Цветовая кодировка по слоям
- Zoom/pan
- Клик по узлу → popup с именем, типом, слоем

**FR:** FR-1.1, FR-1.2, FR-1.3, FR-1.4, FR-1.5, FR-1.6, FR-2.1, FR-2.2, FR-2.3, FR-2.6, FR-2.7, FR-2.8

**AC:**
- AC-1.1, AC-1.4 (подключение работает)
- AC-2.1, AC-2.2, AC-2.3, AC-2.4 (данные загружены, граф построен)
- Граф рендерится с 80+ узлами на demo dataset
- Слои различимы по цвету

**Demo steps:**
1. Открыть приложение.
2. Нажать «Load Demo».
3. Увидеть граф модели.
4. Zoom in / zoom out.
5. Кликнуть по узлу — увидеть info popup.

**Required decisions:** D-1, D-2, D-3, D-11 (layout engine), D-15 (auth)

**Dependencies:** Readiness Gate

**Exit evidence:** Скриншот графа. Unit-тесты для graph engine проходят.

**Out of scope:** Фильтры, поиск, impact analysis, метрики, экспорт.

---

## Slice S-2: «Анализирую impact изменения»

**Milestone:** MS-2 (Неделя 3)

**User outcome:** Пользователь выбирает элемент, видит полную картину impact на 1-2-3 шага — какие элементы затронуты, на каких слоях, в каких диаграммах.

**Состав:**
- Текстовый поиск по элементам (search bar)
- Impact Analyzer screen
- BFS от выбранного элемента
- Переключатель глубины 1/2/3
- Список affected elements с типом, слоем, distance
- Summary по слоям
- Affected diagrams list
- Карточка элемента (degree, in/out)
- Визуальная подсветка impact подграфа на графе

**FR:** FR-3.1–FR-3.8, FR-6.1, FR-6.2, FR-6.3

**AC:**
- AC-3.1–AC-3.9 (impact analysis корректен)
- AC-5.1, AC-5.2 (поиск работает)
- На demo dataset: impact для «Core Banking Platform» на глубину 2 → expected N elements

**Demo steps:**
1. В search bar ввести «Payment».
2. Выбрать «Payment Gateway».
3. Увидеть карточку элемента.
4. Увидеть affected elements на 1 шаг.
5. Переключить на 2 шага — список расширяется.
6. Увидеть summary по слоям.
7. Увидеть affected diagrams.

**Required decisions:** D-12 (BFS approach)

**Dependencies:** S-1 (граф построен)

**Exit evidence:** Impact для known element совпадает с ожиданием. Unit-тесты BFS.

**Out of scope:** Направление анализа (in/out), risk card, фильтры на графе.

---

## Slice S-3: «Оцениваю качество модели»

**Milestone:** MS-3 (Неделя 4)

**User outcome:** Пользователь видит общую картину качества модели: orphan элементы, покрытие слоёв, работа через таблицу.

**Состав:**
- Table View (TanStack Table): все элементы, сортировка, фильтрация
- Столбцы: name, type, layer, degree, in/out, diagrams_count
- Фильтры по слою и типу (таблица + граф)
- Coverage screen: orphan count, orphan %, список orphans
- Переход из таблицы к impact analysis
- Переход из coverage к карточке элемента
- Навигация между экранами (sidebar/tabs)

**FR:** FR-4.1–FR-4.5, FR-5.1–FR-5.3, FR-2.4, FR-2.5, FR-6.4

**AC:**
- AC-4.1–AC-4.3 (coverage корректен)
- AC-5.3 (навигация без потери состояния)
- Таблица сортируется по degree (click header)
- Orphan list для demo dataset совпадает с ожиданием

**Demo steps:**
1. Перейти на Table View.
2. Отсортировать по degree (desc) — увидеть top hubs.
3. Отфильтровать по слою «Technology».
4. Перейти на Coverage screen.
5. Увидеть: «11 orphan elements (11.6%)».
6. Кликнуть на orphan — перейти к карточке.

**Required decisions:** D-14 (table library)

**Dependencies:** S-1 (граф и метрики)

**Exit evidence:** Orphan count = expected. Таблица рендерит все элементы.

**Out of scope:** Low-coverage detection (P1), heatmap по слоям, betweenness centrality.

---

## Slice S-4: «Экспортирую результаты»

**Milestone:** MS-4 (Неделя 5)

**User outcome:** Пользователь экспортирует impact подграф в GraphML (для yEd) и таблицу элементов в CSV (для Excel).

**Состав:**
- Export GraphML: impact подграф → .graphml файл
- Export CSV: таблица элементов → .csv файл
- Export buttons в Impact Analyzer и Table View
- GraphML format: nodes с атрибутами (name, type, layer, degree) + edges
- CSV format: UTF-8 BOM, все столбцы таблицы

**FR:** FR-7.1, FR-7.2

**AC:**
- AC-6.1–AC-6.4 (файлы корректны, открываются)
- GraphML открывается в yEd без ошибок

**Demo steps:**
1. Провести impact analysis для элемента.
2. Нажать «Export GraphML».
3. Открыть файл в yEd — видно граф.
4. Перейти в Table View.
5. Нажать «Export CSV».
6. Открыть файл в Excel — видно таблицу.

**Required decisions:** Нет новых

**Dependencies:** S-2 (impact result), S-3 (table data)

**Exit evidence:** GraphML файл, открытый в yEd (скриншот). CSV файл, открытый в Excel.

**Out of scope:** JSON snapshot, PNG/SVG, full graph export.

---

## Optional / Stretch Slices

### Slice S-5 (stretch): «Вижу критичность элементов»

**Milestone:** MS-3+ (если хватит времени)

**User outcome:** На графе и в таблице визуально выделены наиболее центральные/критичные элементы.

**Состав:**
- Betweenness centrality calculation
- Размер узла пропорционален degree/centrality
- Столбец centrality в таблице
- Orphan marking в таблице (цветом)

**Dependencies:** S-1, S-3

---

### Slice S-6 (stretch): «Расширенные фильтры»

**User outcome:** Фильтрация по degree, только orphans, поиск по типу.

**Dependencies:** S-3

---

## Зависимости между slices

```
Readiness Gate
     ↓
   S-1 (Вижу модель)
   ↙        ↘
S-2          S-3
(Impact)    (Coverage + Table)
   ↘        ↙
     S-4 (Export)
```

S-2 и S-3 могут разрабатываться параллельно (если 2 разработчика).
S-4 зависит от S-2 и S-3 (экспортирует их данные).
S-5, S-6 — independent, могут добавляться в любой момент после S-1.

---

## Сборка milestones

| Milestone | Slices | Результат | Cut line |
|-----------|--------|-----------|----------|
| **MS-1** | RG + S-1 | Модель видна как граф | Минимально показываемый результат |
| **MS-2** | S-2 | Impact analysis работает | **Valuable MVP** — уже полезен |
| **MS-3** | S-3 | Таблица + Coverage | **Stronger MVP** — вторая ценность |
| **MS-4** | S-4 | Экспорт работает | **Complete MVP** — все P0 фичи |

---

## Cut lines на случай нехватки времени

### Cut Line 1: «Valuable MVP» (после MS-2, ~неделя 3)

Есть: граф + impact analysis + поиск.
Нет: таблицы, coverage, экспорта.
**Уже полезен.** Можно показать и получить feedback.

### Cut Line 2: «Strong MVP» (после MS-3, ~неделя 4)

Есть: граф + impact + таблица + coverage.
Нет: экспорта.
**Очень полезен.** Пользователь получает insight, но не может легко поделиться.

### Cut Line 3: «Complete MVP» (после MS-4, ~неделя 5)

Всё P0 реализовано. Экспорт работает. Это целевой MVP.

---

## Обязательные vs stretch slices

| Slice | Обязательный? |
|-------|--------------|
| S-1 | **Обязательный** |
| S-2 | **Обязательный** |
| S-3 | **Обязательный** (но убираем первым при нехватке времени) |
| S-4 | **Обязательный** |
| S-5 | Stretch |
| S-6 | Stretch |

---

*Связь с другими документами: FR → [05_Functional_Requirements](../02-requirements/05_Functional_Requirements.md), AC → [11_Acceptance_Criteria](../04-delivery/11_Acceptance_Criteria_and_Test_Strategy.md), decisions → [13_Decision_Backlog](13_Decision_Backlog.md), issues → [15_Issue_Decomposition](15_Issue_Decomposition_Rules.md).*
