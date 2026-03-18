# 07 Domain Model

## Принцип модели

Доменная модель ArchiLens OSS не должна быть копией API Architeezy и не должна быть случайным набором внутренних структур. Она должна задавать канонический аналитический язык продукта.

В модели различаются три уровня:

- source-of-truth сущности, пришедшие из Architeezy;
- derived сущности аналитического слоя;
- пользовательские артефакты, которые создаются по итогам анализа.

## Основные сущности MVP

### Model

Представляет одну загруженную ArchiMate-модель.

Ключевые поля:

- `modelId`;
- `name`;
- `sourceInfo`;
- `loadedAt`;
- `sourceRevision`, если доступна.

### Element

Каноническая архитектурная сущность модели.

Ключевые поля:

- `sourceId`;
- `modelId`;
- `name`;
- `type`;
- `layer`;
- `documentation`, если доступно;
- `properties`, как расширяемый контейнер;
- `statusFlags`, например `isOrphan`, `isLowCoverage`.

### Relationship

Связь между двумя элементами модели.

Ключевые поля:

- `sourceId`;
- `modelId`;
- `type`;
- `sourceElementId`;
- `targetElementId`;
- `properties`, если доступны.

### View / Diagram

Диаграмма или представление модели.

Ключевые поля:

- `viewId`;
- `modelId`;
- `name`;
- `type`, если различается;
- `metadata`, если есть.

### ElementViewRef

Связь между каноническим элементом и его представлением в одной или нескольких диаграммах.

Ключевые поля:

- `elementId`;
- `viewId`;
- `presentationId`, если источник предоставляет отдельный идентификатор представления.

### MetricSet

Derived-сущность для базовых расчетных показателей.

Ключевые поля:

- `elementId`;
- `degree`;
- `inDegree`;
- `outDegree`;
- `diagramsCount`;
- `isOrphan`;
- `isLowCoverage`.

### ImpactAnalysisRequest

Параметры запроса impact analysis.

Ключевые поля:

- `modelId`;
- `elementId`;
- `depth`;
- `direction`, если поддерживается;
- `timestamp`.

### ImpactAnalysisResult

Derived-результат impact analysis.

Ключевые поля:

- `requestId`;
- `seedElementId`;
- `affectedElementIds`;
- `affectedViewIds`;
- `affectedLayers`;
- `summary`.

### Subgraph

Подграф, соответствующий результату анализа.

Ключевые поля:

- `nodeIds`;
- `edgeIds`;
- `context`, например `impact-result`.

### ExportArtifact

Пользовательский артефакт, полученный из анализа.

Ключевые поля:

- `type` — CSV или GraphML;
- `context` — impact или coverage;
- `createdAt`;
- `sourceReference`.

### DataIssue

Фиксирует проблему исходных данных.

Ключевые поля:

- `issueType`;
- `level`;
- `sourceRef`;
- `severity`;
- `message`.

## Единица анализа

Основная единица анализа в MVP — отдельный `Element` внутри выбранной `Model`.

Но реальный результат анализа — это связанный `Subgraph` и `ImpactAnalysisResult`, а не отдельный элемент сам по себе.

## Правила идентичности

### Канонический ключ

Для MVP используется составная идентичность:

- `modelId + sourceId` для source сущностей;
- отдельный внутренний stable ID допустим для внутренних graph operations.

### Identity при нескольких view

Один и тот же архитектурный объект остается одним `Element`, даже если встречается в нескольких `View`.

Для этого используется отдельная сущность `ElementViewRef`, а не дублирование элементов.

## Представление типов и слоев

`type` и `layer` — разные понятия.

- `type` задает конкретный тип ArchiMate-сущности;
- `layer` задает укрупненный архитектурный слой.

Оба поля нужны, потому что:

- тип нужен для точной навигации и объяснения;
- слой нужен для фильтров, агрегатов и summary.

## Граница между source и derived сущностями

### Source-of-truth

- Model;
- Element;
- Relationship;
- View.

### Derived

- ElementViewRef;
- MetricSet;
- ImpactAnalysisRequest;
- ImpactAnalysisResult;
- Subgraph;
- DataIssue;
- ExportArtifact.

Архитектурный принцип:

Architeezy сообщает, что существует в модели, а ArchiLens добавляет слой аналитической интерпретации.

## Основные инварианты модели

В MVP обязательно соблюдаются следующие инварианты:

- `Element` уникален в рамках `modelId + sourceId`;
- каждый `Element` имеет `type`;
- каждый `Element` имеет `layer` явно или через детерминированное отображение;
- `Relationship` ссылается на существующие элементы либо фиксируется как `DataIssue`;
- `View` принадлежит одной модели;
- `ElementViewRef` связывает существующий `Element` и существующий `View`, либо фиксируется как `DataIssue`;
- `ImpactAnalysisResult` всегда связан с конкретным `ImpactAnalysisRequest`.

## Что сознательно не входит в доменную модель MVP

Чтобы не переусложнить модель, в MVP не вводятся:

- полноценные `ModelVersion` и snapshots как persisted domain aggregate;
- `SavedView`;
- `Comment` или `Annotation`;
- `ShareLink`;
- `AnalysisSession` с историей действий;
- `Plugin` как runtime entity;
- `ComparisonResult` для compare states.

## Вывод

Доменная модель MVP должна оставаться компактной, но аналитически достаточной. Она строится вокруг Model, Element, Relationship и View как source-слоя, а дальше дополняется derived сущностями, необходимыми для impact analysis, coverage, explainability и export. Это создает устойчивую основу для solution-слоя и будущего расширения продукта.
