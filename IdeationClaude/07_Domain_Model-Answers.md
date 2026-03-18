# 07_Domain_Model: ответы

---

### Основные доменные сущности MVP

**Рассуждение:** Нужно разделить три слоя данных:
1. **Source entities** — то, что приходит из Architeezy (source of truth).
2. **Derived entities** — то, что ArchiLens вычисляет (граф, метрики).
3. **User artifacts** — то, что порождает пользователь (экспорты).

**Решение:**

| Сущность | Слой | Описание |
|----------|------|----------|
| `Model` | Source | ArchiMate-модель из Architeezy. Контейнер для всего |
| `Element` | Source | Элемент ArchiMate (Application Component, Business Process, etc.) |
| `Relationship` | Source | Связь между двумя элементами ArchiMate |
| `Diagram` | Source | Диаграмма/View из модели. Содержит список элементов |
| `Layer` | Derived (enum) | Слой ArchiMate (Business, Application, Technology, etc.) |
| `ElementType` | Derived (enum) | Тип элемента ArchiMate |
| `GraphNode` | Derived | Узел в аналитическом графе (обёртка над Element + метрики) |
| `GraphEdge` | Derived | Ребро в аналитическом графе (обёртка над Relationship) |
| `AnalysisGraph` | Derived | Полный граф модели с индексами для быстрого обхода |
| `ImpactResult` | Derived | Результат impact analysis для конкретного элемента и глубины |
| `CoverageReport` | Derived | Результат coverage/hygiene анализа модели |
| `ExportArtifact` | User | Сгенерированный файл (GraphML, CSV) |

---

### Что является единицей анализа?

**Решение:** Основная единица анализа — **отдельный Element ArchiMate**. Пользователь выбирает один элемент, и от него строятся все аналитические проекции:
- Impact analysis = BFS от выбранного элемента.
- Метрики = свойства конкретного элемента в графе.

Вторичная единица — **модель целиком** (для coverage/hygiene). Подграф — это результат анализа, а не единица.

---

### Обязательные поля сущности Element

```
Element {
  id: string              // ID из Architeezy (source ID)
  name: string            // Имя элемента
  type: ElementType       // Тип ArchiMate (ApplicationComponent, BusinessProcess, etc.)
  layer: Layer            // Слой ArchiMate (Business, Application, Technology, etc.)
  diagramIds: string[]    // Список ID диаграмм, на которых присутствует элемент

  // Derived fields (вычисляются при построении графа):
  degree: number          // Общее число связей
  inDegree: number        // Входящие связи
  outDegree: number       // Исходящие связи
  diagramsCount: number   // Число диаграмм
  isOrphan: boolean       // true если degree == 0 ИЛИ diagramsCount == 0
}
```

**Что НЕ входит в MVP:** properties, documentation, tags, custom metadata, version info.

---

### Идентификация сущностей

**Рассуждение:** Варианты:
1. Внутренний ID Architeezy — зависим от формата Architeezy, но просто.
2. Собственный UUID — независимость, но сложнее маппинг.
3. Составной ключ (model_id + element_id) — надёжно для мультимодельного сценария.

**Решение:** В MVP используем **ID из Architeezy** как primary identifier. Все ссылки внутри ArchiLens — по этому ID. Мы не генерируем собственные UUID. Причина: MVP работает с одной моделью, коллизий не будет. При переходе к мультимодельному режиму (Phase 3) — добавим namespace (model_id + element_id).

---

### Представление типов ArchiMate и слоёв

**Решение:** Используем enums в TypeScript:

```typescript
enum Layer {
  Strategy = 'Strategy',
  Business = 'Business',
  Application = 'Application',
  Technology = 'Technology',
  Physical = 'Physical',
  Motivation = 'Motivation',
  Implementation = 'Implementation',
  Other = 'Other'           // fallback для неизвестных
}

// ElementType — полный список типов ArchiMate 3.x
// Маппинг type → layer зашит в коде (стандарт ArchiMate)
```

Layer определяется из ElementType по стандартному маппингу ArchiMate. Если тип неизвестен — Layer.Other.

---

### Нужна ли отдельная сущность для диаграммного представления элемента?

**Рассуждение:** В ArchiMate один элемент может присутствовать на нескольких диаграммах с разными визуальными свойствами (позиция, размер, стиль). Нужна ли нам эта информация?

**Решение:** **Нет.** В MVP нас не интересует визуальное представление на диаграмме. Нас интересует только факт: «элемент X присутствует на диаграмме Y». Это моделируется через `Element.diagramIds[]` — плоский массив ссылок. Отдельная сущность `DiagramElement` с позицией/стилем — post-MVP.

---

### Как моделируются производные метрики?

**Решение:** Метрики — **вычисляемые поля GraphNode**, а не отдельные записи. Они рассчитываются при построении графа и хранятся в памяти:

```typescript
interface GraphNode {
  element: Element         // ссылка на source element
  degree: number
  inDegree: number
  outDegree: number
  diagramsCount: number
  isOrphan: boolean
  // P1:
  impactRadius?: number    // число affected на глубину 3
  betweenness?: number     // betweenness centrality
}
```

Impact analysis result — отдельная transient структура, не хранится в GraphNode:

```typescript
interface ImpactResult {
  sourceElementId: string
  depth: number
  affectedElements: AffectedElement[]   // id, name, type, layer, distance
  affectedLayers: LayerSummary[]        // layer, count
  affectedDiagrams: DiagramRef[]        // id, name
}
```

---

### Нужна ли сущность AnalysisSession?

**Решение:** **Нет в MVP.** Impact result — ephemeral. Пользователь делает анализ, смотрит результат, экспортирует если нужно. Сохранение сессий — post-MVP. Нет persistence — нет необходимости в session entity.

---

### Как хранить identity элемента, если он на нескольких view?

**Решение:** Элемент — это **одна сущность с одним ID**, независимо от числа диаграмм. `Element.diagramIds[]` содержит все диаграммы, где он присутствует. Это архитектурно правильно: ArchiMate специально разделяет model-level elements и view-level representations.

---

### Как моделировать битые ссылки?

**Решение:**

```typescript
interface BrokenReference {
  sourceId: string         // ID отношения или элемента, содержащего ссылку
  targetId: string         // ID, на который ссылка указывает
  type: 'relationship' | 'diagram'  // тип ссылки
  reason: string           // 'target_not_found' | 'source_not_found'
}
```

Битые ссылки собираются при построении графа. Отношения с битыми ссылками исключаются из графа. Счётчик `brokenReferences` показывается в UI как warning. Список — доступен в coverage report.

---

### Пользовательские артефакты в MVP

**Решение:** Единственный пользовательский артефакт в MVP — **ExportArtifact** (файл, скачанный пользователем). Он не хранится в системе. Это просто trigger генерации файла + download. Не нужна сущность в доменной модели.

Сохранённые фильтры, сохранённый анализ, комментарии — всё post-MVP.

---

### Граница между source-of-truth и derived

| Данные | Source of truth | Где живут |
|--------|----------------|-----------|
| Element name, type, layer | Architeezy | Загружаются из API |
| Relationship source/target/type | Architeezy | Загружаются из API |
| Diagram name, element membership | Architeezy | Загружаются из API |
| degree, inDegree, outDegree | ArchiLens (derived) | Вычисляются в памяти |
| isOrphan | ArchiLens (derived) | Вычисляется в памяти |
| impactResult | ArchiLens (derived) | Вычисляется on-demand |
| coverageReport | ArchiLens (derived) | Вычисляется при загрузке |

**Принцип:** ArchiLens **никогда не мутирует** source данные. Все derived данные — read-only проекции.

---

### Обязательные инварианты

1. **Уникальность ID элемента** — в рамках одной модели каждый element.id уникален.
2. **Relationship ссылается на существующие элементы** — если нет, это broken reference (warning, не error).
3. **Элемент принадлежит ровно одному слою** — определяется по типу. Если тип неизвестен — Layer.Other.
4. **Diagram reference ссылается на существующую диаграмму** — если нет, ссылка игнорируется.
5. **Граф может содержать циклы** — это нормально для ArchiMate.
6. **Граф может быть несвязным** — orphan elements образуют отдельные компоненты.

---

### Нужны ли версии/снимки модели в MVP?

**Решение:** **Нет.** MVP работает с текущим состоянием модели из Architeezy. Нет версионирования, нет diff, нет time-based анализа. Это Phase 2-3.

---

### Какие сущности точно не нужны в MVP?

1. `User` — нет аутентификации ArchiLens.
2. `Permission` — нет разграничения доступа.
3. `ModelVersion` / `Snapshot` — нет версионирования.
4. `SavedAnalysis` / `SavedView` — нет persistence.
5. `Plugin` / `Extension` — нет plugin system.
6. `Comment` / `Annotation` — нет коллаборации.
7. `Alert` / `Notification` — нет мониторинга.
8. `DiagramElement` (визуальное представление) — не нужна в MVP.
9. `Property` / `Tag` (метаданные элемента) — не загружаются в MVP.
