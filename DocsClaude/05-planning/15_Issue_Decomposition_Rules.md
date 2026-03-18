# 15. Issue Decomposition Rules

> Главный вопрос документа: «Как правильно резать milestones и slices на issues?»

---

## Входы для декомпозиции

1. **Capability Slice Map** ([документ 14](14_Capability_Slice_Map.md)) — slices и milestones.
2. **Functional Requirements** ([документ 05](../02-requirements/05_Functional_Requirements.md)) — что система должна уметь.
3. **Acceptance Criteria** ([документ 11](../04-delivery/11_Acceptance_Criteria_and_Test_Strategy.md)) — как проверять.
4. **Issue Decomposition Rules** (этот документ) — как резать.

---

## Структура backlog

`Milestones → Issues` (без epics). Для MVP из 4 milestones и ~25-35 issues epics — лишний уровень абстракции.

```
MS-1 (Вижу модель)
  ├── issue: Setup project skeleton
  ├── issue: Implement Architeezy connector
  ├── issue: Build graph engine
  ├── issue: Create demo dataset
  └── ...

MS-2 (Анализирую impact)
  ├── issue: Implement BFS impact analysis
  ├── issue: Build Impact Analyzer screen
  └── ...
```

---

## Типы issues

| Type | Label | Когда использовать |
|------|-------|--------------------|
| feature | `type:feature` | Новая функциональность для пользователя |
| integration | `type:integration` | Подключение к внешней системе (Architeezy API) |
| ui | `type:ui` | UI-компонент или экран |
| engine | `type:engine` | Логика graph/insight engine |
| spike | `type:spike` | Исследование, проверка гипотезы. Результат = знание, не код |
| bug | `type:bug` | Исправление дефекта |
| test | `type:test` | Написание тестов |
| docs | `type:docs` | Документация |
| infra | `type:infra` | Настройка CI, линтеры, деплой |

НЕ нужные типы для MVP: `refactor` (внутри feature issues), `decision` (в документации), `validation` (входит в spike).

---

## Обязательные поля issue

| Поле | Обязательно? | Описание |
|------|-------------|----------|
| Title | Да | Краткое описание результата |
| Description | Да | Контекст + что нужно сделать |
| Type label | Да | `type:feature`, `type:spike`, etc. |
| Milestone | Да | MS-1, MS-2, MS-3, MS-4 |
| Acceptance criteria | Да (для feature/ui) | Список проверяемых условий |
| Priority label | Нет | Приоритет определяется позицией в milestone |
| Assignee | Нет | Для команды из 1-2 человек — очевидно |
| Estimate | Нет | Не используем time estimates |
| Dependencies | Если есть | `blocked-by: #N` в описании |

---

## Шаблон issue

```markdown
## Context
[1-2 предложения: зачем это нужно, к какому slice относится]

## What needs to be done
- [ ] Задача 1
- [ ] Задача 2
- [ ] Задача 3

## Acceptance criteria
- [ ] AC 1
- [ ] AC 2

## Out of scope
- Что явно НЕ входит в этот issue

## Dependencies
- blocked-by: #N (если есть)

## Technical notes
[Опционально: подсказки по реализации, ссылки на docs]
```

---

## Правила именования

### Issues

Формат: `[Verb] [Object] [Context]`

Примеры:
- `Implement Architeezy connector (fetch elements, relationships, diagrams)`
- `Build Global Graph view with layer color coding`
- `Add BFS impact analysis to graph engine`
- `Create demo dataset (80-120 elements, 3 layers)`
- `Spike: Research Architeezy API endpoints and auth`

**Запрещено:**
- Безглагольные: `Architeezy connector` → непонятно, что делать.
- Слишком абстрактные: `Work on graph` → какой graph, что делать?
- Слишком детальные: `Add React Flow node component with click handler that opens popup showing element name type and layer` → разбить.

### Milestones

Формат: `MS-N: [User outcome]`

- `MS-1: See model as interactive graph`
- `MS-2: Analyze impact of element changes`
- `MS-3: Assess model quality and navigate via table`
- `MS-4: Export analysis results`

---

## Правила гранулярности

### Правильный размер issue:
- **1-3 дня работы** для одного разработчика.
- Один чёткий результат (deliverable).
- 2-5 acceptance criteria.

### Когда issue слишком большой (нужен split):
- Описание содержит > 5 задач в разных областях (UI + engine + data).
- Работа > 3 дней.
- Acceptance criteria > 7 штук.
- Название содержит «и... и... и...».

**Пример split:**
- ❌ `Build Impact Analyzer (engine + UI + search + export)` — слишком большой.
- ✅ `Add BFS impact analysis to graph engine` + `Build Impact Analyzer screen` + `Add element search` — три отдельных issue.

### Когда split не нужен и вреден:
- Issue на 2-4 часа. Splitting создаёт overhead > самой работы.
- Логически неразделимая работа (connector: fetch + normalize — один issue).
- Тест: если два sub-issues нельзя демонстрировать по отдельности — не разделяйте.

**Пример anti-split:**
- ❌ `Create CSV header` + `Create CSV body` + `Create CSV download` — три бессмысленных issue.
- ✅ `Implement CSV export for element table` — один issue.

---

## Зависимости между issues

**Как фиксировать:** В описании issue — строка `blocked-by: #N`. В GitHub — task lists или mentions.

**Допустимые зависимости:**
- Engine issue → UI issue (сначала логика, потом визуализация).
- Spike → implementation (сначала исследование, потом код).
- Setup → всё остальное.

**Запрещённые зависимости:**
- Циклические: A blocks B blocks A.
- Ложные: «наверное, лучше сделать X первым» — если нет технической причины, нет зависимости.

---

## Definition of Ready (для issue)

Issue готов к работе, когда:
1. Title чётко описывает результат.
2. Description содержит контекст и список задач.
3. Acceptance criteria сформулированы и проверяемы.
4. Milestone назначен.
5. Type label назначен.
6. Зависимости указаны (если есть) и все blocking issues завершены.

---

## Definition of Done (для issue)

Issue считается done, когда:
1. Все задачи из description выполнены.
2. Все acceptance criteria подтверждены.
3. Код в main branch (merged PR или direct push для solo dev).
4. Тесты написаны (для engine/integration issues) и проходят.
5. Lint проходит.
6. Нет regression (существующие тесты не сломаны).

---

## Канонические паттерны декомпозиции

### Паттерн: Integration slice (Connector)

```
1. [spike]       Spike: Research API endpoints and auth
2. [integration] Implement connector interface and types
3. [integration] Implement Architeezy connector (fetch + normalize)
4. [test]        Add connector unit tests (mock API responses)
5. [feature]     Add connection screen UI
```

### Паттерн: Graph Engine

```
1. [engine]  Implement graph construction from NormalizedModel
2. [engine]  Calculate base metrics (degree, orphan)
3. [test]    Add graph engine unit tests
```

### Паттерн: UI Screen

```
1. [ui]      Build [Screen] layout and components
2. [ui]      Connect [Screen] to store
3. [ui]      Add [Screen] to navigation
4. [test]    Add E2E test for [Screen] (if critical path)
```

### Паттерн: Export feature

```
1. [engine]  Implement [Format] generator (pure function)
2. [test]    Add unit test for [Format] output
3. [ui]      Add Export button to relevant screen
```

### Паттерн: Spike / Research

```
1. [spike]  Research [Topic]
   - Acceptance criteria: document with findings
   - Output: markdown file OR comment in issue
   - NO code required
   - Time-boxed: max 1 day
```

---

## Decision/spike issues vs implementation issues

**Принцип:** Spike выдаёт **знание** (документ, findings). Implementation выдаёт **код**. Они всегда отдельные issues.

```
❌ "Research Architeezy API and implement connector"  — mixed
✅ "Spike: Research Architeezy API" → "Implement Architeezy connector"  — separate
```

Spike может закрыться с результатом «невозможно, нужен другой подход». Это нормально — знание тоже результат.

---

## Приоритеты при построении issue tree

Порядок внутри milestone:
1. **Spikes** (устраняют неопределённость) → первыми.
2. **Engine / integration** (бизнес-логика) → вторыми.
3. **UI** (визуализация) → третьими.
4. **Tests** (проверка) → параллельно или сразу после.
5. **Docs / infra** → в конце milestone.

---

## Правила сборки milestone из issues

1. Milestone содержит **5-10 issues** (больше — слишком гранулярно, меньше — issues слишком большие).
2. Все issues milestone **привязаны к одному slice** (или readiness gate).
3. Milestone имеет **один exit criteria**: user outcome из Capability Slice Map.
4. Milestone закрывается, когда все issues done И exit evidence собран.

---

## Антипаттерны backlog

| Антипаттерн | Почему плохо | Что делать вместо |
|-------------|-------------|-------------------|
| «Catch-all issue»: «Implement MVP» | Не декомпозирован, непроверяем | Разбить на slices → issues |
| «Horizontal slice»: «Build all backend» + «Build all frontend» | Не даёт user value пока оба не готовы | Вертикальные slices по user outcome |
| «Gold-plating issue»: «Polish graph UX» без AC | Бесконечный scope | Конкретные AC: «add zoom buttons», «add legend» |
| «Orphan issue» без milestone | Потеряется, непонятен приоритет | Привязать к milestone или пометить backlog/icebox |
| «Premature optimization»: «Optimize for 10K nodes» | Не нужно для MVP | Пометить label `post-mvp` |
| «Dependency hell»: все issues blocked by всё | Парализует работу | Минимизировать зависимости |

---

## Требования к AI-генерации issues

Если issues генерируются AI:

### Входные артефакты:
1. Capability Slice Map (документ 14).
2. Functional Requirements (документ 05).
3. Acceptance Criteria (документ 11).
4. Issue Decomposition Rules (этот документ).

### Промпт должен содержать:
- Конкретный slice для декомпозиции.
- Шаблон issue (из этого документа).
- Правила именования.
- Правила гранулярности.
- Список антипаттернов.

### Проверка человеком:
1. Каждый issue читается и проверяется перед созданием в GitHub.
2. Нет «catch-all» issues.
3. Acceptance criteria конкретны и проверяемы.
4. Зависимости корректны (нет циклов, нет ложных).
5. Naming соответствует правилам.
6. Milestone назначен.

### Чего AI НЕ должен делать:
- Добавлять issues для post-MVP features.
- Создавать issues без AC.
- Придумывать новые requirements (только из документов).
- Оценивать время (мы не используем estimates).

---

## Пример: Issue tree для MS-1

```
MS-1: See model as interactive graph

  #1 [infra]        Setup project: React + TS + Vite + ESLint + Prettier
  #2 [spike]        Spike: Research Architeezy API (endpoints, auth, data format)
  #3 [engine]       Define NormalizedModel interface and domain types
  #4 [feature]      Create demo dataset (80-120 elements, 3 layers, known patterns)
  #5 [integration]  Implement Architeezy connector (fetch + normalize)
  #6 [engine]       Build graph engine (construct graph, calculate degree/orphan)
  #7 [test]         Add unit tests for graph engine
  #8 [ui]           Build connection screen (URL + token + Connect + Load Demo)
  #9 [ui]           Build Global Graph view (React Flow + elkjs + layer colors)
  #10 [ui]          Add node click → element info popup
  #11 [infra]       Setup GitHub Actions CI (lint + test)

  Dependencies:
    #2 → #5 (spike informs connector)
    #3 → #4, #5, #6 (types used everywhere)
    #5, #6 → #8, #9 (data needed for UI)
    #6 → #7 (test what's built)
```

Всего: 11 issues. ~2 недели. Соответствует Slice S-1.

---

*Связь с другими документами: slices → [14_Capability_Slice_Map](14_Capability_Slice_Map.md), AC → [11_Acceptance_Criteria](../04-delivery/11_Acceptance_Criteria_and_Test_Strategy.md), FR → [05_Functional_Requirements](../02-requirements/05_Functional_Requirements.md).*
