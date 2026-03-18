# 07. Domain Model

> Главный вопрос документа: «Из каких сущностей состоит система и как они соотносятся друг с другом?»

---

## Три слоя данных

| Слой | Описание | Пример |
|------|----------|--------|
| **Source** | Данные из Architeezy (source of truth) | Model, Element, Relationship, Diagram |
| **Derived** | Вычисленные ArchiLens данные | GraphNode, GraphEdge, ImpactResult, CoverageReport |
| **User Artifact** | Порождённые пользователем | ExportArtifact (файл GraphML/CSV) |

---

## Основные сущности

### Model (Source)

ArchiMate-модель из Architeezy. Контейнер для всех элементов.

| Поле | Тип | Описание |
|------|-----|----------|
| id | string | ID из Architeezy |
| name | string | Название модели |

---

### Element (Source)

Элемент ArchiMate (Application Component, Business Process и т.д.).

| Поле | Тип | Обязательное | Описание |
|------|-----|-------------|----------|
| id | string | Да | ID из Architeezy (primary key) |
| name | string | Да | Имя элемента |
| type | ElementType | Да | Тип ArchiMate |
| layer | Layer | Да (derived from type) | Слой ArchiMate |
| diagramIds | string[] | Да | Диаграммы, где присутствует |

Что НЕ входит в MVP: properties, documentation, tags, custom metadata, version info.

---

### Relationship (Source)

Связь между двумя элементами ArchiMate.

| Поле | Тип | Описание |
|------|-----|----------|
| id | string | ID из Architeezy |
| sourceId | string | ID элемента-источника |
| targetId | string | ID элемента-цели |
| type | string | Тип отношения ArchiMate (ServingRelationship, CompositionRelationship и др.) |

---

### Diagram (Source)

Диаграмма/View из модели.

| Поле | Тип | Описание |
|------|-----|----------|
| id | string | ID из Architeezy |
| name | string | Название диаграммы |
| elementIds | string[] | Элементы, присутствующие на диаграмме |

---

### Layer (Derived, enum)

```
Strategy | Business | Application | Technology | Physical |
Motivation | Implementation | Other
```

Layer определяется из ElementType по стандартному маппингу ArchiMate. Неизвестный тип → `Other`.

---

### GraphNode (Derived)

Узел в аналитическом графе — обёртка над Element с вычисленными метриками.

| Поле | Тип | Описание |
|------|-----|----------|
| element | Element | Ссылка на source element |
| degree | number | Общее число связей |
| inDegree | number | Входящие связи |
| outDegree | number | Исходящие связи |
| diagramsCount | number | Число диаграмм |
| isOrphan | boolean | degree == 0 ИЛИ diagramsCount == 0 |
| impactRadius? | number | (P1) Affected на глубину 3 |
| betweenness? | number | (P1) Betweenness centrality |

---

### GraphEdge (Derived)

Ребро в аналитическом графе — обёртка над Relationship.

| Поле | Тип | Описание |
|------|-----|----------|
| relationship | Relationship | Ссылка на source relationship |
| source | GraphNode | Узел-источник |
| target | GraphNode | Узел-цель |

---

### AnalysisGraph (Derived)

Полный граф модели с индексами для быстрого обхода.

| Поле | Тип | Описание |
|------|-----|----------|
| nodes | Map<string, GraphNode> | ID → узел |
| edges | GraphEdge[] | Все рёбра |
| adjacencyOut | Map<string, string[]> | ID → исходящие соседи |
| adjacencyIn | Map<string, string[]> | ID → входящие соседи |

---

### ImpactResult (Derived, transient)

Результат impact analysis для конкретного элемента. Ephemeral — не сохраняется.

| Поле | Тип | Описание |
|------|-----|----------|
| sourceElementId | string | Анализируемый элемент |
| depth | number | Глубина (1, 2, 3) |
| affectedElements | AffectedElement[] | id, name, type, layer, distance |
| affectedLayers | LayerSummary[] | layer, count |
| affectedDiagrams | DiagramRef[] | id, name |

---

### CoverageReport (Derived)

Результат coverage/hygiene анализа модели.

| Поле | Тип | Описание |
|------|-----|----------|
| totalElements | number | Всего элементов |
| orphanCount | number | Элементов без связей или без диаграмм |
| orphanPercent | number | orphanCount / totalElements * 100 |
| orphanElements | Element[] | Список orphans |
| layerDistribution | LayerSummary[] | Распределение по слоям |
| brokenReferences | BrokenReference[] | Битые ссылки |

---

## Единица анализа

Основная единица — **отдельный Element ArchiMate**. Пользователь выбирает элемент, от него строятся все проекции (impact, metrics). Вторичная единица — **модель целиком** (для coverage).

---

## Идентификация

В MVP используется **ID из Architeezy** как primary identifier. Все внутренние ссылки — по этому ID. Собственные UUID не генерируются. При переходе к мультимодельному режиму (Phase 3) — добавится namespace.

---

## Диаграммное представление

Один элемент может присутствовать на нескольких диаграммах. В MVP нас интересует только **факт присутствия** (`Element.diagramIds[]`), не визуальные свойства (позиция, размер). Отдельная сущность `DiagramElement` — post-MVP.

---

## Битые ссылки

| Поле | Тип | Описание |
|------|-----|----------|
| sourceId | string | ID отношения или элемента |
| targetId | string | ID, на который указывает ссылка |
| type | string | 'relationship' или 'diagram' |
| reason | string | 'target_not_found' и т.д. |

Битые ссылки собираются при построении графа. Отношения с битыми ссылками исключаются. Счётчик показывается в UI как warning.

---

## Граница source-of-truth и derived

| Данные | Source of truth | Где живут |
|--------|----------------|-----------|
| Element name, type, layer | Architeezy | Загружаются из API |
| Relationship source/target/type | Architeezy | Загружаются из API |
| Diagram name, membership | Architeezy | Загружаются из API |
| degree, inDegree, outDegree | ArchiLens | Вычисляются в памяти |
| isOrphan | ArchiLens | Вычисляется в памяти |
| impactResult | ArchiLens | Вычисляется on-demand |
| coverageReport | ArchiLens | Вычисляется при загрузке |

**Принцип:** ArchiLens никогда не мутирует source данные.

---

## Инварианты

1. В рамках одной модели каждый `element.id` уникален.
2. Relationship ссылается на существующие элементы (иначе — broken reference, warning).
3. Элемент принадлежит ровно одному слою (по типу).
4. Граф может содержать циклы (нормально для ArchiMate).
5. Граф может быть несвязным (orphan elements — отдельные компоненты).

---

## Сущности, не нужные в MVP

User, Permission, ModelVersion, Snapshot, SavedAnalysis, SavedView, Plugin, Extension, Comment, Annotation, Alert, Notification, DiagramElement (визуальное представление), Property/Tag.

---

*Связь с другими документами: FR → [05_Functional_Requirements](05_Functional_Requirements.md), архитектура → [08_System_Context](../03-solution/08_System_Context_and_Architecture.md), data flow → [09_Data_and_Integrations](../03-solution/09_Data_and_Integrations.md).*
