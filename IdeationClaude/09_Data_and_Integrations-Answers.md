# 09_Data_and_Integrations: ответы

---

### Какие API-ресурсы Architeezy нужны для MVP?

**Рассуждение:** Пока у нас нет полной спецификации API Architeezy (Swagger UI рендерится на клиенте, и мы не смогли извлечь схему). Но исходя из стандартной структуры ArchiMate-репозиториев, нам нужны:

**Решение — минимально необходимые endpoints:**

| # | Ресурс | Зачем |
|---|--------|-------|
| 1 | `GET /models` или `/repositories` | Список доступных моделей |
| 2 | `GET /models/{id}/elements` | Все элементы модели (id, name, type) |
| 3 | `GET /models/{id}/relationships` | Все отношения (id, source, target, type) |
| 4 | `GET /models/{id}/views` или `/diagrams` | Список диаграмм (id, name) |
| 5 | `GET /views/{id}/elements` или аналог | Какие элементы на какой диаграмме |

Если API отдаёт всё одним запросом (модель целиком) — ещё лучше. Если диаграмм-membership отдаётся внутри элемента — один запрос меньше.

**Первый spike:** исследовать реальный Swagger Architeezy и замаппить на наши потребности. Это блокирующая задача.

---

### Есть ли OpenAPI/Swagger?

**Решение:** У Architeezy есть Swagger UI на `architeezy.com/swagger-ui/index.html`. Точная структура схемы неизвестна (рендерится на клиенте).

**Стратегия:**
1. **Вариант A (preferred):** Если OpenAPI spec доступна — генерируем TypeScript client через `openapi-typescript-codegen` или `orval`.
2. **Вариант B (fallback):** Если spec недоступна — пишем ручной REST client с типизацией. Используем `fetch` + типы вручную.

Решение по варианту — после spike-этапа.

---

### Способ аутентификации

**Решение:** Пока неизвестно. Типичные варианты для enterprise API:
1. **API token в header** (Bearer token) — наиболее вероятно.
2. **Basic Auth** (login + password) — возможно.
3. **OAuth2** — маловероятно для MVP, но возможно.

Connector layer абстрагирует аутентификацию за интерфейсом:

```typescript
interface ConnectorAuth {
  type: 'bearer' | 'basic' | 'custom';
  credentials: Record<string, string>;
}
```

UI экрана подключения поддерживает: URL + token ИЛИ URL + login + password. Этого достаточно для MVP.

---

### Известные ограничения интеграции

| Ограничение | Как справляемся |
|-------------|----------------|
| Rate limits | Загружаем модель одним batch запросом. Если pagination — последовательные запросы с задержкой |
| Pagination | Connector автоматически забирает все страницы. Прогресс отображается |
| Размер ответа | Целевой размер модели < 500 элементов. JSON модели ~ 200-500 KB. Не проблема |
| Нестабильность схемы API | Connector layer изолирует маппинг. При изменении API — меняется только connector |
| Версии API | В MVP поддерживаем одну актуальную версию. Version negotiation — post-MVP |

---

### Какие данные загружаются целиком, а какие по требованию?

**Решение:** В MVP — **всё загружается целиком** при выборе модели:

```
User selects model
  → Load all elements (batch)
  → Load all relationships (batch)
  → Load all diagrams + membership (batch)
  → Build graph (in-memory)
  → Calculate base metrics
  → Ready
```

Lazy loading — не нужен для моделей < 500 элементов. Общий payload: < 1 MB JSON. На современном интернете это 1-2 секунды.

---

### Нужен ли локальный кэш модели?

**Решение:** **Нет в MVP.** Данные живут в памяти (Zustand stores). Закрыл вкладку — данные пропали. Это простой и предсказуемый подход. IndexedDB кэш — Phase 2, если загрузка окажется слишком медленной для больших моделей.

---

### Источник истины

**Решение:**
- **Source of truth для модели:** Architeezy. Всегда.
- **Source of truth для метрик:** ArchiLens (derived). Метрики пересчитываются при каждой загрузке.
- **ArchiLens не хранит своих данных** between sessions. Нет локального снимка, нет «ArchiLens version of truth».

Пользователь видит: «данные загружены из Architeezy в 14:35. Для обновления — перезагрузите модель.»

---

### Нужны ли persisted данные ArchiLens?

**Решение:** **Нет.** Весь state — transient (in-memory).

Что сохраняется между сессиями (localStorage):
- URL последнего подключения.
- ID последней модели.
- Настройки UI (если будут).

Что НЕ сохраняется:
- Данные модели.
- Результаты анализа.
- Метрики.

---

### Жизненный цикл данных в MVP

```
1. CONNECT     → User enters URL + token
2. DISCOVER    → Fetch list of models
3. SELECT      → User picks a model
4. LOAD        → Fetch elements, relationships, diagrams (batch)
5. NORMALIZE   → Connector maps raw API data → NormalizedModel
6. BUILD       → Graph Engine constructs AnalysisGraph
7. CALCULATE   → Base metrics computed (degree, orphan, etc.)
8. BROWSE      → User navigates graph, table, search
9. ANALYZE     → Impact analysis on-demand (BFS)
10. EXPORT     → Generate GraphML/CSV → download file
11. REPEAT     → Go to step 8, or step 3 for new model
12. CLOSE      → Tab closed → all data lost
```

---

### Валидация входных данных

| Проблема | Обработка |
|----------|-----------|
| Element без ID | Skip element. Warning |
| Element без name | Использовать ID как name. Warning |
| Element с неизвестным type | type = 'Unknown', layer = 'Other'. Warning |
| Relationship с несуществующим source/target | Skip relationship. Add to brokenReferences. Warning |
| Diagram ссылается на несуществующий элемент | Ignore reference. Warning |
| Дубликат element ID | Используем первый. Warning |
| Пустая модель (0 элементов) | Error message в UI |
| API возвращает неожиданную структуру | Connector catch → error с пояснением |

**Принцип:** максимально толерантная загрузка. Загружаем всё, что можем. Проблемы — в виде warnings, не errors.

---

### Сохранение промежуточных snapshots?

**Решение:** **Нет в MVP.** Пользователь не может сохранить результат анализа внутри ArchiLens. Может только экспортировать (GraphML/CSV). Повторное открытие snapshot — post-MVP.

---

### Экспортные форматы и структуры

#### GraphML

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
    <!-- ... more nodes -->
    <edge source="elem-1" target="elem-2">
      <data key="d4">ServingRelationship</data>
    </edge>
    <!-- ... more edges -->
  </graph>
</graphml>
```

Совместимость с yEd — основное требование. yEd читает GraphML с custom data attributes.

#### CSV

```csv
id,name,type,layer,degree,in_degree,out_degree,diagrams_count,is_orphan
elem-1,"Payment Gateway",ApplicationComponent,Application,8,3,5,4,false
elem-2,"Order Processing",BusinessProcess,Business,12,5,7,3,false
```

Столбцы фиксированы для MVP. Разделитель — запятая. Кодировка — UTF-8 с BOM (для Excel).

---

### Import обратно в систему?

**Решение:** **Нет.** ArchiLens — read-only аналитический слой. Экспорт — одностороннее действие. Нет import GraphML/CSV обратно.

---

### Конфликт устаревшего кэша и актуальных данных

**Решение:** Не применимо в MVP. Нет кэша = нет конфликтов. Данные всегда загружаются свежими из Architeezy. Пользователь видит timestamp загрузки. Если данные устарели — нажимает «Reload model».

---

### Demo dataset

**Решение:** Поставить в репозитории **один synthetic demo dataset** в формате NormalizedModel JSON:

**Характеристики demo dataset:**
- **Название:** «Digital Bank Architecture» (или аналогичное).
- **Размер:** 80-120 элементов, 150-250 отношений, 8-15 диаграмм.
- **Все 3 основных слоя:** Business (30%), Application (40%), Technology (30%).
- **Специальные элементы:**
  - 1-2 «хаба» (degree > 10) — для впечатляющего impact analysis.
  - 10-15 orphan elements — для coverage демо.
  - 5-8 элементов с высоким degree, но low diagrams count — для low-coverage.
  - 1-2 «цепочки» на 4-5 шагов через слои — для cross-layer wow.

**Формат файла:** `demo/digital-bank.json` — NormalizedModel JSON. Загружается через mock connector.

**Как использовать:** На экране подключения — кнопка «Load Demo Dataset» вместо ввода credentials.
