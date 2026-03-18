# 15 Issue Decomposition Rules

## Назначение

Этот документ задает правила превращения milestones и capability slices в последовательный рабочий backlog issues. Цель — не просто нарезать задачи, а сделать так, чтобы backlog оставался управляемым, проверяемым и связанным с продуктовым результатом.

## Входы для декомпозиции

Issue decomposition выполняется только после того, как доступны:

- Project Brief;
- Scope and Boundaries;
- User Scenarios;
- Functional and Nonfunctional Requirements;
- Domain Model;
- Architecture and Data docs;
- Roadmap;
- Acceptance Strategy;
- Decision Backlog;
- Capability Slice Map.

Если эти артефакты не стабилизированы, issue backlog будет слабым независимо от качества формулировок.

## Структура backlog

Рекомендуемая структура:

- `Milestone`
- `Capability Slice`
- `Issue`

Плоский backlog без привязки к slices для этого проекта не подходит.

## Типы issues

В проекте используются следующие типы:

- `feature`;
- `integration`;
- `analysis`;
- `ui`;
- `export`;
- `spike`;
- `decision`;
- `validation`;
- `docs`;
- `bug`;
- `refactor`.

## Обязательные поля issue

Каждый issue должен содержать:

- `Title`;
- `Type`;
- `Milestone`;
- `Capability Slice`;
- `Why / outcome`;
- `Scope`;
- `Out of scope`;
- `Dependencies`;
- `Acceptance criteria`;
- `Expected artifacts or evidence`;
- `Owner` или роль-владелец.

## Рекомендуемый шаблон issue

### Context

Зачем существует задача и какую проблему она снимает.

### Outcome

Какой пользовательский или технический результат должен появиться.

### Scope

Что входит в задачу.

### Out of scope

Что сознательно не входит.

### Dependencies

Какие решения, slices или другие issues должны быть готовы раньше.

### Acceptance criteria

Как команда проверит, что задача завершена.

### Artifacts

Какие тесты, документы, exports или validation notes ожидаются на выходе.

## Правила именования

### Milestones

Используются короткие названия по результату:

- `M0 Foundation Gate`;
- `M1 Valuable MVP`;
- `M2 Usable MVP`;
- `M3 Stronger MVP`.

### Issues

Названия должны:

- начинаться с глагола;
- отражать результат;
- по возможности быть привязаны к capability outcome.

Примеры хороших названий:

- `Load selected model into canonical graph`;
- `Run impact analysis for selected element`;
- `Export impact result to GraphML`.

## Правила гранулярности

Один issue должен:

- закрывать один ограниченный capability шаг или один clearly bounded technical block;
- иметь ясный конец;
- быть проверяемым без дополнительных скрытых задач.

## Когда split обязателен

Issue нужно split, если:

- он смешивает несколько независимых outcomes;
- acceptance criteria стали длинной mini-specification;
- в нем одновременно сидят integration, engine и UI без одного связующего результата;
- задачу нельзя закончить без цепочки внутренних подзадач;
- после завершения невозможно показать или проверить конкретный шаг вперед.

## Когда split не нужен и вреден

Split вреден, если:

- один естественный capability распадается на бессмысленные микрозадачи;
- отдельные issues теряют наблюдаемый смысл;
- coordination overhead становится выше пользы от детализации.

## Допустимые зависимости между issues

Фиксируются только meaningful dependencies:

- `blocks`;
- `depends on`;
- `validates`;
- `follows from`.

Не нужно строить сложную dependency graph-структуру ради самой структуры.

## Definition of Ready

Issue готов к взятию в работу, если:

- привязан к milestone и slice;
- его outcome понятен;
- scope и out-of-scope зафиксированы;
- зависимости известны;
- acceptance criteria сформулированы;
- ожидаемые artifacts понятны.

## Definition of Done

Issue считается done, если:

- заявленный результат реализован;
- acceptance criteria выполнены;
- нужные тесты, validation или документы добавлены;
- нет скрытого остатка, без которого capability фактически не работает.

## Канонические паттерны декомпозиции

### Integration issues

- получить ресурс;
- нормализовать ресурс;
- обработать ошибки;
- проверить на controlled dataset.

### Graph engine issues

- сформировать canonical structure;
- обеспечить инварианты;
- покрыть known cases тестами.

### UI flow issues

- дать entry point;
- обработать user action;
- показать результат;
- покрыть empty/error state.

### Export issues

- зафиксировать schema;
- реализовать generation;
- сформировать sample artifact;
- проверить format integrity.

### Testing and validation issues

- выбрать dataset;
- определить expected output;
- провести проверку;
- зафиксировать evidence.

### Docs issues

- описать кто читатель;
- какой сценарий документ поддерживает;
- какие ограничения и prerequisites в нем фиксируются.

## Правила для decision, spike и validation issues

### Decision issue

Нужен, если:

- выбор действительно влияет на реализацию;
- решение еще не принято.

Выход:

- принятое решение;
- rationale;
- статус.

### Spike issue

Нужен, если:

- есть техническая или интеграционная неопределенность;
- обсуждение не снимает риск.

Выход:

- прототип;
- измерение;
- краткий вывод.

### Validation issue

Нужен, если:

- нужно подтвердить correctness или usefulness.

Выход:

- expected vs actual;
- expert feedback;
- test note.

Главное правило: нерешенный spike не должен прятаться внутри implementation issue.

## Как собирать milestone из issues

Milestone должен содержать:

- implementation issues, закрывающие capability outcome;
- decision/spike issues, если без них capability unsafe to implement;
- validation issue;
- docs/issues, если без них capability нельзя использовать или принимать.

Milestone не считается завершенным, если “код вроде написан”, но нет validation и acceptance evidence.

## Антипаттерны backlog, которые запрещены

- issues без acceptance criteria;
- issues без привязки к milestone и slice;
- mega-issues вроде `build backend`;
- задачи `improve UX` без конкретного результата;
- смешение feature и spike в одной задаче;
- попадание deferred post-MVP themes в active MVP backlog как равноправных задач;
- backlog, состоящий только из слоевых технических задач без capability outcome.

## Правила для AI-generated issues

Если issues генерируются автоматически, AI prompt обязан включать:

- Idea-Final;
- полный пакет DocsCodex;
- текущий milestone;
- capability slice map;
- decision backlog;
- acceptance strategy;
- эти decomposition rules.

AI-generated issues должны:

- оставаться внутри заданного slice;
- иметь явный scope and out-of-scope;
- содержать acceptance criteria;
- не протаскивать hidden scope creep.

Человеческая проверка обязательна для каждого пакета AI-generated issues:

- убрать дубликаты;
- разбить oversized issues;
- проверить соответствие MVP boundaries;
- проверить связь с slice outcome.

## Вывод

Issue backlog ArchiLens OSS должен строиться как управляемое дерево от milestones к slices и далее к атомарным, проверяемым задачам. Хорошая декомпозиция не размазывает продукт по слоям технологии, а последовательно приближает команду к рабочему impact analysis MVP и делает этот путь воспроизводимым даже при участии AI-агентов.
