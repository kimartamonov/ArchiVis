# 13 Decision Backlog

## Назначение

Decision backlog — это operational слой между пакетом спецификаций и рабочим backlog реализации. Его задача — отделить уже достаточно принятые решения от тех, которые еще блокируют безопасную декомпозицию в capability slices и issues.

## Как использовать decision backlog

Decision backlog нужен, чтобы ответить на вопросы:

- на какие решения уже можно опираться в roadmap и slicing;
- какие решения еще надо принять или подтвердить;
- какие темы сознательно отложены за пределы MVP;
- какие неопределенности требуют spike или validation, а не обсуждения.

## Формат и статусы

Рекомендуемый формат:

- компактная backlog-таблица или список решений;
- ADR-like записи для дорогих и необратимых решений.

Статусы:

- `proposed`;
- `in review`;
- `decided`;
- `validated`;
- `blocked`;
- `deferred`;
- `rejected`.

`Validated` нужен отдельно, потому что некоторые решения для MVP мало просто принять — их нужно подтвердить прототипом или тестовым прогоном.

## Принципы принятия решений для MVP

Решения принимаются в следующем порядке приоритетов:

1. Проверяемая ценность для primary user.
2. Минимизация риска срыва главного e2e-flow.
3. Explainability и доверие к результату.
4. Скорость доведения до usable MVP.
5. Расширяемость без premature complexity.

## Сводка решений, уже достаточно принятых

- primary user — архитектор, анализирующий последствия изменений;
- MVP строится вокруг impact analysis;
- продукт работает в read-only режиме;
- первая версия поддерживает одну модель за раз;
- первая версия опирается на Architeezy как основной источник данных;
- export в CSV и GraphML обязателен;
- explainability не является optional feature;
- продукт не должен конкурировать с editor/repository функциями Architeezy.

## Решения, критичные для декомпозиции в slices и issues

До полноценной нарезки backlog критичны:

- решение о наличии BFF/backend;
- подтверждение интеграционного контракта с Architeezy;
- фиксация канонической доменной модели;
- acceptance datasets и expected outputs;
- baseline метрик и quality rules;
- финальная P0-граница MVP.

## Решения, которые нужно принять до старта разработки

- MVP scope и out-of-scope;
- архитектурная форма MVP;
- deployment baseline;
- source integration baseline;
- набор datasets для приемки;
- правила работы с чувствительными данными;
- список необратимых решений.

## Решения, которые можно принимать инкрементально

- точная форма risk summary;
- richness глобального graph mode;
- число вторичных фильтров;
- визуальная полировка;
- удобные, но не критические enrichments export и coverage UI.

## Темы, отложенные за пределы MVP

- compare states;
- saved views;
- shareable links;
- multi-model analysis;
- plugin runtime system;
- community extension marketplace;
- alerts;
- executive storytelling suite;
- полноценный CLI как отдельный пользовательский режим.

## Детальная карточка ключевых решений

### DB-01 Основная гипотеза MVP

- Status: `decided`
- Owner: Product Owner
- Decision: MVP проверяет ценность explainable impact analysis на одной реальной модели.
- Why it matters: определяет весь delivery path.

### DB-02 Primary user and ICP

- Status: `decided`
- Owner: Product Owner
- Decision: основной пользователь — Solution/Enterprise Architect в среде с существующим ArchiMate-репозиторием.
- Why it matters: определяет приоритеты UX и scope.

### DB-03 P0 scope of MVP

- Status: `decided`
- Owner: Product Owner + Tech Lead
- Decision: загрузка модели, поиск, impact analysis, coverage basics, export, explainability.
- Why it matters: защищает MVP от scope creep.

### DB-04 BFF/backend strategy

- Status: `in review`
- Owner: Tech Lead
- Decision candidate: использовать тонкий backend/BFF.
- Why it matters: влияет на security, integration model и deployment.

### DB-05 Architeezy integration contract

- Status: `in review`
- Owner: Tech Lead
- Decision candidate: preferred generated client plus custom connector contract.
- Why it matters: блокирует early implementation slices.

### DB-06 Canonical domain model

- Status: `decided`
- Owner: Tech Lead
- Decision: source and derived сущности разделены, view-level representation вынесено отдельно.
- Why it matters: стабилизирует contracts и analysis logic.

### DB-07 Acceptance datasets and expected outputs

- Status: `proposed`
- Owner: Product Owner + Tech Lead
- Why it matters: необходимы для приемки и validation.

### DB-08 Explainability and quality rules baseline

- Status: `proposed`
- Owner: Product Owner + Tech Lead
- Why it matters: влияет на доверие к продукту.

### DB-09 OSS license and dependency policy

- Status: `proposed`
- Owner: Product Owner
- Why it matters: влияет на публикацию проекта и legal cleanliness.

### DB-10 Deferred beyond MVP list

- Status: `decided`
- Owner: Product Owner
- Why it matters: помогает держать roadmap чистым.

## Что из decision backlog напрямую влияет на roadmap

На roadmap должны немедленно влиять:

- все `blocked`, `proposed` и `in review` решения, без которых нельзя пройти e2e-flow;
- все `deferred` темы, которые нельзя смешивать с MVP milestones;
- все `validated` решения, которые уже можно использовать как опору для capability slices.

## Вывод

Decision backlog для ArchiLens OSS должен оставаться коротким, управляемым и напрямую связанным с roadmap. Он нужен не для архивирования мыслей, а для безопасного перехода от документации к slices, milestones и issues.
