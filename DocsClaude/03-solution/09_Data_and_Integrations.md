# 09. Data and Integrations

> Главный вопрос документа: «Как именно хранятся и движутся данные?»

---

## Интеграция с Architeezy

### Необходимые API-ресурсы

| # | Ресурс | Зачем |
|---|--------|-------|
| 1 | `GET /models` или `/repositories` | Список доступных моделей |
| 2 | `GET /models/{id}/elements` | Все элементы модели (id, name, type) |
| 3 | `GET /models/{id}/relationships` | Все отношения (id, source, target, type) |
| 4 | `GET /models/{id}/views` | Список диаграмм (id, name) |
| 5 | `GET /views/{id}/elements` или аналог | Membership: какие элементы на какой диаграмме |

### Аутентификация

Точный формат определяется на spike-этапе. Connector layer абстрагирует через:

```typescript
interface ConnectorAuth {
  type: 'bearer' | 'basic' | 'custom';
  credentials: Record<string, string>;
}
```

UI поддерживает: URL + token ИЛИ URL + login + password.

### Известные ограничения

| Ограничение | Как справляемся |
|-------------|----------------|
| Rate limits | Одна batch-загрузка при выборе модели. Последовательные запросы с задержкой при pagination |
| Pagination | Connector автоматически забирает все страницы |
| Размер ответа | Целевой < 500 элементов ≈ 200-500 KB JSON |
| Нестабильность схемы API | Connector layer изолирует маппинг |

---

## Стратегия загрузки

Всё загружается **целиком** при выборе модели:

```
User selects model → Load elements → Load relationships →
Load diagrams + membership → Normalize → Build graph → Ready
```

Lazy loading не нужен для моделей < 500 элементов. Общий payload: < 1 MB.

---

## Жизненный цикл данных

```
1. CONNECT     → URL + token
2. DISCOVER    → Fetch list of models
3. SELECT      → User picks a model
4. LOAD        → Fetch elements, relationships, diagrams (batch)
5. NORMALIZE   → Connector maps raw API → NormalizedModel
6. BUILD       → Graph Engine constructs AnalysisGraph
7. CALCULATE   → Base metrics (degree, orphan)
8. BROWSE      → User navigates graph, table, search
9. ANALYZE     → Impact analysis on-demand (BFS)
10. EXPORT     → Generate GraphML/CSV → download
11. REPEAT     → Back to step 8, or step 3 for new model
12. CLOSE      → Tab closed → all data lost
```

---

## Source of truth

| Данные | Source of truth |
|--------|----------------|
| Model structure (elements, relationships, diagrams) | **Architeezy** — всегда |
| Derived metrics (degree, orphan, impact) | **ArchiLens** — пересчитываются при каждой загрузке |

ArchiLens не хранит данных between sessions. Нет «ArchiLens version of truth».
UI показывает timestamp загрузки: «Data loaded from Architeezy at 14:35».

---

## Persisted vs Transient state

| Данные | Хранение | Где |
|--------|----------|-----|
| URL последнего подключения | Persisted | localStorage |
| ID последней модели | Persisted | localStorage |
| API token | Session | sessionStorage (очищается при закрытии) |
| Данные модели | Transient | In-memory (Zustand) |
| Результаты анализа | Transient | In-memory |
| Метрики | Transient | In-memory |

---

## Валидация входных данных

| Проблема | Обработка |
|----------|-----------|
| Element без ID | Skip. Warning |
| Element без name | Использовать ID как name. Warning |
| Неизвестный type | type = 'Unknown', layer = 'Other'. Warning |
| Relationship с несуществующим source/target | Skip. BrokenReference. Warning |
| Diagram ссылается на несуществующий элемент | Ignore reference. Warning |
| Дубликат element ID | Используем первый. Warning |
| Пустая модель | Error message в UI |
| Неожиданная структура API | Connector catch → error |

**Принцип:** максимально толерантная загрузка. Загружаем всё, что можем. Проблемы — warnings, не errors.

---

## Экспортные форматы

### GraphML

```xml
<?xml version="1.0" encoding="UTF-8"?>
<graphml xmlns="http://graphml.graphstruct.org/graphml">
  <key id="d0" for="node" attr.name="name" attr.type="string"/>
  <key id="d1" for="node" attr.name="type" attr.type="string"/>
  <key id="d2" for="node" attr.name="layer" attr.type="string"/>
  <key id="d3" for="node" attr.name="degree" attr.type="int"/>
  <key id="d4" for="edge" attr.name="type" attr.type="string"/>
  <graph edgedefault="directed">
    <node id="elem-1">
      <data key="d0">Payment Gateway</data>
      <data key="d1">ApplicationComponent</data>
      <data key="d2">Application</data>
      <data key="d3">8</data>
    </node>
    <edge source="elem-1" target="elem-2">
      <data key="d4">ServingRelationship</data>
    </edge>
  </graph>
</graphml>
```

Совместимость с yEd — основное требование.

### CSV

```csv
id,name,type,layer,degree,in_degree,out_degree,diagrams_count,is_orphan
elem-1,"Payment Gateway",ApplicationComponent,Application,8,3,5,4,false
```

Разделитель — запятая. Кодировка — UTF-8 с BOM (для Excel).

---

## Import

**Нет.** ArchiLens — read-only аналитический слой. Экспорт — одностороннее действие.

---

## Demo Dataset

Встроенный synthetic dataset в формате NormalizedModel JSON.

**Характеристики:**
- Название: «Digital Bank Architecture»
- Размер: 80-120 элементов, 150-250 отношений, 8-15 диаграмм
- Слои: Business (30%), Application (40%), Technology (30%)
- Специальные элементы:
  - 1-2 хаба (degree > 10)
  - 10-15 orphan elements
  - 5-8 элементов high degree + low diagrams
  - 1-2 длинные цепочки через слои

**Файл:** `demo/digital-bank.json`

**Использование:** кнопка «Load Demo Dataset» на экране подключения.

---

## Кэширование

Нет в MVP. Данные загружаются свежими при каждом подключении. IndexedDB кэш — Phase 2 при необходимости.

---

*Связь с другими документами: domain model → [07_Domain_Model](../02-requirements/07_Domain_Model.md), архитектура → [08_System_Context](08_System_Context_and_Architecture.md).*
