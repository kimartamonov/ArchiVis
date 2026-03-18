# 13. Decision Backlog

> Главный вопрос документа: «Какие решения уже можно использовать как опору для backlog, а какие сначала нужно закрыть?»

---

## Назначение

Decision Backlog — operational слой между спецификациями и roadmap. Он отделяет уже принятые решения (на которые можно опираться при декомпозиции в issues) от тех, которые ещё блокируют реализацию.

---

## Статусы решений

| Статус | Значение |
|--------|----------|
| `decided` | Решение принято и зафиксировано. Можно реализовывать |
| `preferred` | Есть предпочтительный вариант, но нужна проверка (spike/prototype) |
| `open` | Нет предпочтительного варианта. Нужно исследование |
| `deferred` | Сознательно отложено за пределы MVP |
| `blocked` | Решение зависит от внешнего фактора |

---

## Принципы принятия решений в MVP

1. **Скорость > идеальность.** Если оба варианта рабочие — выбираем тот, который быстрее реализовать.
2. **Обратимость > оптимальность.** Предпочитаем решения, которые можно изменить позже без переписывания.
3. **Демонстрируемость.** Приоритет решениям, дающим видимый результат для пользователя.
4. **Explainability.** Между «умным, но непрозрачным» и «простым, но понятным» — выбираем понятное.
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

---

## Решения, критичные для декомпозиции

| ID | Тема | Решение | Статус | Блокирует |
|----|------|---------|--------|-----------|
| D-11 | Layout engine | elkjs (preferred) | preferred | Slice S-1: Global Graph |
| D-12 | Graph algorithms | Ручной BFS (preferred) | preferred | Slice S-2: Impact Analyzer |
| D-13 | Build tool | Vite | preferred | Этап 0 setup |
| D-14 | Table library | TanStack Table | preferred | Slice S-3: Table View |
| D-15 | Auth формат Architeezy | Bearer token (гипотеза) | blocked (Q-2) | Slice S-1: Connector |
| D-16 | CORS strategy | Localhost + optional proxy | preferred | Slice S-1: Connector |

---

## Детальные карточки ключевых решений

### D-1: Frontend-only SPA

**Контекст:** Нужно решить, где выполняется вычислительная логика — в браузере или на сервере.

**Варианты:**
1. SPA (browser-only) — простой деплой, конфиденциальность, offline после загрузки.
2. Backend + Frontend — лучше для больших моделей, но инфраструктура.
3. Hybrid — лёгкий proxy backend + frontend вычисления.

**Решение:** Вариант 1 (SPA). Для моделей < 500 элементов браузер справляется. Нулевая стоимость backend.

**Последствия:** CORS может быть проблемой. Нет server-side caching. Нет shared state.

**Обратимость:** Средняя. Engine headless — переносится в Node.js. Основной cost — routing/infra layer.

---

### D-3: React Flow для визуализации

**Контекст:** Выбор между React Flow, Cytoscape.js, D3.js.

**Варианты:**
1. React Flow — продуктовый UI, node-based, хороший DX с React.
2. Cytoscape.js — мощный graph analysis, но менее «продуктовый» вид.
3. D3.js — максимальная гибкость, но много ручной работы.

**Решение:** React Flow. Продуктовость UI важнее для первого впечатления. Graph analysis — отдельный headless layer.

**Последствия:** Графовые алгоритмы пишем сами (BFS — 20 строк).

**Обратимость:** Низкая. Переезд с React Flow — переписывание всего визуального слоя.

---

### D-12: Ручной BFS vs Cytoscape.js headless

**Контекст:** Для impact analysis нужен BFS. Писать свой или использовать библиотеку?

**Варианты:**
1. Ручной BFS/DFS — 20-30 строк кода, нет зависимости.
2. Cytoscape.js headless — BFS, centrality, shortest path из коробки. ~300 KB.

**Решение (preferred):** Ручной BFS для MVP. Cytoscape.js — overkill для 2 алгоритмов. Если в Phase 2 потребуется betweenness centrality — тогда добавим.

**Обратимость:** Высокая. Замена — 1-2 часа.

---

## Решения, сознательно отложенные (deferred beyond MVP)

| ID | Тема | Почему отложено |
|----|------|----------------|
| DD-1 | Plugin API / Extension system | Нет пользователей, которым это нужно. Архитектура позволит добавить |
| DD-2 | Multi-model support | Усложняет ID management, state, UI |
| DD-3 | Model versioning / diff | Требует persistence и историю (Phase 3) |
| DD-4 | Backend server | Не нужен для целевого размера данных |
| DD-5 | User authentication (own) | Однопользовательское приложение |
| DD-6 | i18n / локализация | Только English. Локализация если будет спрос |
| DD-7 | Dark mode | Nice to have. Не влияет на ценность |
| DD-8 | Mobile support | Граф на мобильном — бесполезен |
| DD-9 | Alternative connectors | Architeezy only. Interface готов для расширения |
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

### Решения, принимаемые инкрементально:
- D-11 (layout engine) → при реализации Global Graph.
- D-12 (BFS approach) → при реализации Impact Analyzer.
- D-14 (table library) → при реализации Table View.

### Решения, не влияющие на MVP:
- DD-1 через DD-10 — все отложены.

---

## Решения, не входящие в backlog

Следующие темы НЕ являются решениями для backlog — они не влияют на реализацию:
- Названия переменных и стиль кода (решается ESLint config).
- Выбор CI provider (GitHub Actions — очевидный).
- Формат документации (Markdown — очевидный).
- Хостинг demo (GitHub Pages / Vercel — принимается при деплое).

---

*Связь с другими документами: риски → [12_Risks](../04-delivery/12_Risks_Decisions_Open_Questions.md), slices → [14_Capability_Slice_Map](14_Capability_Slice_Map.md), архитектура → [08_System_Context](../03-solution/08_System_Context_and_Architecture.md).*
