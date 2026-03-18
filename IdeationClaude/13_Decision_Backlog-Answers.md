# 13_Decision_Backlog: ответы

---

## Формат и управление

### Формат decision backlog

**Решение:** **Таблица + карточки.** Сводная таблица для обзора, детальные карточки для ключевых решений. Формат ADR (Architecture Decision Records) избыточен для MVP — слишком формальный для команды из 1-2 человек. Таблица в markdown + краткое обоснование — достаточно.

### Статусы решений

| Статус | Значение |
|--------|----------|
| `decided` | Решение принято и зафиксировано. Можно реализовывать |
| `preferred` | Есть предпочтительный вариант, но нужна проверка (spike/prototype) |
| `open` | Нет предпочтительного варианта. Нужно обсуждение/исследование |
| `deferred` | Сознательно отложено за пределы MVP |
| `blocked` | Решение зависит от внешнего фактора |

Статусы `proposed`, `in review`, `rejected` — не нужны для малой команды. Упрощаем.

### Кто владеет decision backlog?

**Решение:** Product owner / tech lead (в MVP — один и тот же человек). Backlog обновляется при каждом значимом решении. Обязательный review — перед стартом каждого этапа roadmap.

---

## Принципы принятия решений в MVP

1. **Скорость > идеальность.** Если оба варианта рабочие — выбираем тот, который быстрее реализовать.
2. **Обратимость > оптимальность.** Предпочитаем решения, которые можно изменить позже без переписывания.
3. **Демонстрируемость.** Приоритет решениям, которые дают видимый результат для пользователя.
4. **Explainability.** Если нужно выбрать между «умным, но непрозрачным» и «простым, но понятным» — выбираем понятное.
5. **Минимизация внешних зависимостей.** Меньше зависимостей = меньше рисков.

---

## Сводка принятых решений

| ID | Тема | Решение | Статус | Влияет на |
|----|------|---------|--------|-----------|
| D-1 | Архитектура приложения | SPA, frontend-only, без backend | decided | Всё |
| D-2 | Фреймворк | React + TypeScript | decided | UI, tooling |
| D-3 | Визуализация графа | React Flow | decided | Global Graph, Impact View |
| D-4 | State management | Zustand | decided | Весь UI |
| D-5 | Режим работы | Read-only, никаких записей | decided | Connector, безопасность |
| D-6 | Модели в MVP | Одна модель за раз | decided | State, UI, engine |
| D-7 | Лицензия | MIT | decided | Open source |
| D-8 | Graph engine | Headless, без UI | decided | Архитектура |
| D-9 | Primary key | ID из Architeezy | decided | Data model |
| D-10 | Demo dataset | Обязателен, synthetic | decided | Onboarding, тесты |

## Сводка решений, критичных для декомпозиции

| ID | Тема | Решение | Статус | Блокирует |
|----|------|---------|--------|-----------|
| D-11 | Layout engine | elkjs (preferred) | preferred | Slice: Global Graph |
| D-12 | Graph algorithms | Ручной BFS vs Cytoscape.js headless | preferred (ручной) | Slice: Impact Analyzer |
| D-13 | Build tool | Vite | preferred | Этап 0 setup |
| D-14 | Table library | TanStack Table | preferred | Slice: Table View |
| D-15 | Auth формат Architeezy | Bearer token (гипотеза) | blocked (Q-2) | Slice: Connector |
| D-16 | CORS strategy | Localhost + optional proxy | preferred | Slice: Connector |

---

## Детальные карточки ключевых решений

### D-1: Frontend-only SPA

**Контекст:** Нужно решить, где выполняется вычислительная логика — в браузере или на сервере.

**Варианты:**
1. SPA (browser-only) — простой деплой, конфиденциальность, offline после загрузки.
2. Backend + Frontend — лучше для больших моделей, но инфраструктура.
3. Hybrid — лёгкий proxy backend + frontend вычисления.

**Решение:** Вариант 1 (SPA). Для моделей < 500 элементов браузер справляется. Backend нулевой стоимости.

**Последствия:** CORS может быть проблемой. Нет server-side caching. Нет shared state.

**Обратимость:** Средняя. Переход на backend потребует перенос engine в Node.js + API layer. Но engine headless, поэтому перенос — в основном routing/infra.

---

### D-3: React Flow для визуализации

**Контекст:** Выбор между React Flow, Cytoscape.js, D3.js.

**Варианты:**
1. React Flow — продуктовый UI, node-based, хороший DX с React.
2. Cytoscape.js — мощный graph analysis, но менее «продуктовый» вид.
3. D3.js — максимальная гибкость, но много ручной работы.

**Решение:** React Flow. Продуктовость UI важнее для первого впечатления. Graph analysis делаем отдельным headless layer.

**Последствия:** Графовые алгоритмы пишем сами (BFS — 20 строк). React Flow не даёт centrality/shortest path.

**Обратимость:** Низкая. Переезд с React Flow — переписывание всего визуального слоя.

---

### D-12: Ручной BFS vs Cytoscape.js headless

**Контекст:** Для impact analysis нужен BFS по графу. Писать свой или использовать Cytoscape.js?

**Варианты:**
1. Ручной BFS/DFS — 20-30 строк кода, нет зависимости.
2. Cytoscape.js headless — BFS, centrality, shortest path из коробки. ~300 KB зависимость.

**Решение (preferred):** Ручной BFS для MVP. Причины:
- Для MVP нужен только BFS (impact) и degree (считается при построении графа).
- Cytoscape.js — overkill для 2 алгоритмов.
- Если в Phase 2 потребуется betweenness centrality, shortest path — тогда добавим Cytoscape.js.

**Обратимость:** Высокая. Замена своего BFS на Cytoscape.js — 1-2 часа.

---

## Решения, сознательно отложенные (deferred beyond MVP)

| ID | Тема | Почему отложено |
|----|------|----------------|
| DD-1 | Plugin API / Extension system | Нет пользователей, которым это нужно. Архитектура позволит добавить позже |
| DD-2 | Multi-model support | Усложняет ID management, state, UI. Не нужно для MVP |
| DD-3 | Model versioning / diff | Требует persistence и историю. Phase 3 |
| DD-4 | Backend server | Не нужен для целевого размера данных |
| DD-5 | User authentication (ArchiLens own) | Однопользовательское приложение в MVP |
| DD-6 | i18n / локализация | Только English. Локализация если будет спрос |
| DD-7 | Dark mode | Nice to have. Не влияет на ценность |
| DD-8 | Mobile support | Граф на мобильном — бесполезен |
| DD-9 | Alternative connectors | Architeezy only в MVP. Interface готов для расширения |
| DD-10 | Saved analysis / views | Требует persistence |

---

## Решения, требующие внешнего подтверждения

| ID | Тема | От кого | Что нужно | Дедлайн |
|----|------|---------|-----------|---------|
| E-1 | API access | Architeezy | Credentials + documentation | До начала spike |
| E-2 | CORS | Architeezy | Подтверждение policy | До этапа 1 |
| E-3 | Test model | Architeezy / ourselves | Модель с 50+ элементами | До этапа 3 |

---

## Вывод для roadmap

### Блокирующие решения перед стартом разработки:
- **D-15 (Auth формат)** → закрывается на spike.
- **E-1 (API access)** → нужен до spike.

### Решения, которые можно принять инкрементально:
- D-11 (layout engine) → решается при реализации Global Graph.
- D-12 (BFS approach) → решается при реализации Impact Analyzer.
- D-14 (table library) → решается при реализации Table View.

### Решения, не влияющие на MVP:
- DD-1 через DD-10 — все отложены и не нужны в backlog.

---

## Решения, которые не нужно затягивать в backlog

Следующие темы НЕ являются решениями для backlog, потому что они не влияют на реализацию:
- Названия переменных и стиль кода (решается ESLint config).
- Выбор CI provider (GitHub Actions — очевидный).
- Формат документации (Markdown — очевидный).
- Хостинг demo (GitHub Pages / Vercel — очевидный, принимается при деплое).
