# 08_System_Context_and_Architecture: ответы

---

### Где должен выполняться graph engine в MVP?

**Рассуждение:** Три варианта:
1. **Полностью в браузере (SPA)** — никакого backend. Браузер загружает данные из Architeezy API, строит граф, считает метрики. Максимально простой деплой (статика), минимальная инфраструктура, работает offline после загрузки.
2. **Отдельный backend** — Node.js/Python сервис. Проксирует API Architeezy, строит граф на сервере. Лучше для больших моделей, но требует инфраструктуру.
3. **Гибридная схема** — лёгкий backend для проксирования API (CORS), тяжёлые вычисления в браузере.

**Решение:** **Полностью в браузере (SPA)** для MVP. Причины:
- Деплой = `npx serve dist/` или любой CDN / GitHub Pages. Нулевая инфраструктура.
- Конфиденциальность: данные модели не покидают машину пользователя.
- Модели до 500 элементов легко обрабатываются в браузере (граф из 500 узлов — тривиальная задача для JS).
- Eliminates backend maintenance, hosting, scaling.

**CORS challenge:** Если Architeezy не поддерживает CORS для нашего домена, пользователь запускает ArchiLens локально (`localhost`), что решает проблему. Или используем конфигурируемый CORS proxy (опциональный, документируем в README).

---

### Нужен ли собственный backend?

**Решение:** **Нет для MVP.** Архитектура — frontend-only SPA. Это ключевое архитектурное решение:

- Frontend делает запросы напрямую к Architeezy REST API.
- Все вычисления (граф, метрики, impact) — в браузере.
- Все данные — in-memory.
- Экспорт — генерация файлов в браузере + `<a download>`.

Если CORS станет непреодолимым — добавим минимальный proxy (3 строки на Express), но это fallback, а не core architecture.

---

### Какие внешние системы входят в системный контекст?

```
┌─────────────┐     REST API     ┌──────────────┐
│  Architeezy │ ◄──────────────► │  ArchiLens   │
│  Repository │                  │  (Browser)   │
└─────────────┘                  └──────┬───────┘
                                        │
                                        │ File Download
                                        ▼
                                 ┌──────────────┐
                                 │  yEd / Excel │
                                 │  (External)  │
                                 └──────────────┘
```

Внешние системы:
1. **Architeezy** — источник данных (REST API, read-only).
2. **yEd** — потребитель GraphML export (не интеграция, просто формат файла).
3. **Excel/CSV-reader** — потребитель CSV export.

НЕ входят в контекст: SSO, CI/CD, telemetry, demo hosting (это infrastructure concern, не system context).

---

### Вариант развёртывания для MVP

**Решение:** **Статический web app.** Артефакт сборки — папка `dist/` с HTML/JS/CSS.

Способы запуска:
1. **Локально:** `npm run dev` для разработки, `npm run build && npx serve dist` для production-like.
2. **GitHub Pages / Vercel / Netlify:** push = deploy. Бесплатный хостинг статики.
3. **Docker (optional):** `Dockerfile` с nginx, отдающим статику. Для self-hosted сценариев.

Нет серверного процесса. Нет базы данных. Нет стейтфул компонентов.

---

### Почему именно такой разрез слоёв?

```
┌─────────────────────────────────────────────┐
│                  UI Layer                     │
│  (React + React Flow + TanStack Table)       │
├─────────────────────────────────────────────┤
│              State Management                 │
│  (Zustand stores)                            │
├─────────────────────────────────────────────┤
│              Insight Engine                   │
│  (Impact analysis, coverage, metrics)        │
├─────────────────────────────────────────────┤
│              Graph Engine                     │
│  (Graph construction, BFS/DFS, indexes)      │
├─────────────────────────────────────────────┤
│              Connector Layer                  │
│  (Architeezy API client, data normalization) │
└─────────────────────────────────────────────┘
```

**Почему:**
1. **Connector Layer** — изолирует source-специфичную логику. Замена коннектора не затрагивает остальное.
2. **Graph Engine** — чистая графовая структура данных + алгоритмы. Headless, без UI-зависимостей. Можно использовать в CLI/тестах.
3. **Insight Engine** — бизнес-логика анализа. Работает поверх Graph Engine. Не знает про UI.
4. **State Management** — мост между движками и UI. Zustand stores для реактивности.
5. **UI Layer** — только отображение и пользовательские действия.

Принцип из Idea-Final: **отделить движок анализа от визуального слоя**. Graph Engine + Insight Engine — это reusable ядро. UI — заменяемый слой.

---

### Нужен ли API слой самого ArchiLens?

**Решение:** **Нет.** В MVP — модульная библиотека, не сервис. Вызовы между слоями — обычные function calls в TypeScript.

```typescript
// Пример использования:
const connector = new ArchiteezyConnector(url, token);
const rawModel = await connector.loadModel(modelId);
const graph = GraphEngine.build(rawModel);
const impact = InsightEngine.analyzeImpact(graph, elementId, depth);
```

Внутренний HTTP API — только если появится backend (post-MVP).

---

### Управление состоянием

**Решение:** **Zustand** — лёгкий, без boilerplate, хорошо сочетается с React.

Stores:

| Store | Ответственность |
|-------|----------------|
| `connectionStore` | URL, token, connection status |
| `modelStore` | Загруженная модель, список моделей, loading state |
| `graphStore` | Построенный граф, GraphNode[], GraphEdge[] |
| `analysisStore` | Текущий impact result, выбранный элемент, глубина |
| `filterStore` | Активные фильтры (слой, тип) |
| `uiStore` | Активный экран, sidebar state, search query |

Stores — flat, без вложенных tree structures. Каждый store обновляется независимо. GraphStore подписывается на изменения ModelStore (при загрузке новой модели).

---

### Синхронные vs асинхронные вычисления

| Операция | Синхронная / Асинхронная |
|----------|------------------------|
| API-запросы к Architeezy | Async (fetch) |
| Построение графа | Sync (для < 500 элементов — мгновенно) |
| Расчёт базовых метрик | Sync (часть построения графа) |
| Impact analysis (BFS) | Sync (< 1ms для 500 узлов) |
| Coverage report | Sync |
| Фильтрация | Sync |
| Поиск | Sync (in-memory, < 200ms) |
| Экспорт GraphML | Sync (генерация строки) |
| Файловая загрузка | Sync (Blob + URL.createObjectURL) |

**Решение:** Все аналитические вычисления — **синхронные**. Размер данных в MVP не оправдывает усложнение через async/workers.

---

### Нужно ли выносить вычисления в Web Worker?

**Решение:** **Нет в MVP.** Для графа из 500 узлов BFS работает за < 1ms. Построение графа — за < 50ms. Экспорт — за < 100ms. Ни одна операция не блокирует UI. Web Workers добавляют сложность (serialization, message passing) без ощутимой пользы для целевого размера данных. Если в Phase 2 целевой размер вырастет до 5000+ — тогда Workers.

---

### Архитектурный контракт между Connector и Graph Engine

```typescript
// Connector возвращает нормализованные данные:
interface NormalizedModel {
  id: string;
  name: string;
  elements: NormalizedElement[];
  relationships: NormalizedRelationship[];
  diagrams: NormalizedDiagram[];
  warnings: LoadWarning[];  // broken refs, unknown types
}

interface NormalizedElement {
  id: string;
  name: string;
  type: string;        // ArchiMate type string
  diagramIds: string[];
}

interface NormalizedRelationship {
  id: string;
  sourceId: string;
  targetId: string;
  type: string;        // ArchiMate relationship type
}

interface NormalizedDiagram {
  id: string;
  name: string;
  elementIds: string[];
}
```

**Принцип:** Connector отвечает за нормализацию сырых данных API в этот контракт. Graph Engine не знает про Architeezy. Новый коннектор (например, для .archimate файлов) — реализует тот же контракт.

---

### CLI/batch mode в MVP?

**Решение:** **Нет.** Но архитектура позволяет. Graph Engine и Insight Engine — headless TypeScript модули без зависимости от React/DOM. Их можно импортировать в Node.js скрипт:

```typescript
// Будущий CLI (post-MVP):
import { ArchiteezyConnector } from './connectors/architeezy';
import { GraphEngine } from './engine/graph';
import { InsightEngine } from './engine/insight';
```

Это работает «из коробки» благодаря архитектурному разделению.

---

### Extension API подход

**Решение:** В MVP — **интерфейсы TypeScript**, а не runtime plugins.

```typescript
// Точки расширения:
interface DataConnector { ... }        // для новых источников
interface MetricCalculator { ... }     // для новых метрик
interface ExportFormatter { ... }      // для новых форматов
```

Runtime plugins (динамическая загрузка модулей) — post-MVP. Сейчас достаточно fork + implement interface.

---

### Высокоуровневая структура UI-модулей

```
src/
  ui/
    layout/           # Shell, Sidebar, TopBar
    screens/
      ConnectionScreen/
      ModelExplorer/
      GlobalGraph/
      ImpactAnalyzer/
      TableView/
      CoverageView/
    components/
      Search/
      ElementCard/
      LayerBadge/
      ExportButton/
      FilterPanel/
```

Каждый Screen — отдельный React component. Screens подключаются к Zustand stores. Компоненты — reusable UI primitives.

---

### Необратимые архитектурные решения

Решения, которые нужно зафиксировать ДО начала разработки:

| # | Решение | Обоснование |
|---|---------|-------------|
| 1 | **Frontend-only SPA, без backend** | Определяет всю архитектуру: in-memory state, CORS constraints, deployment model |
| 2 | **React + TypeScript** | Определяет весь UI-стек и экосистему |
| 3 | **React Flow для графа** | Определяет визуальный слой. Переезд на Cytoscape.js/D3 потом — дорогой |
| 4 | **Zustand для state** | Пронизывает весь UI. Замена — рефакторинг всего state management |
| 5 | **NormalizedModel как контракт** | Определяет формат данных между connector и engine |
| 6 | **ID из Architeezy как primary key** | Определяет всю адресацию. Миграция на UUID — сложная |

---

### Ограничения MVP, влияющие на архитектуру

1. **Read-only** → нет write endpoints, нет optimistic updates, нет conflict resolution.
2. **Одна модель** → нет namespace/model prefix в ID. Упрощает адресацию.
3. **До 500 элементов** → sync вычисления, нет pagination в UI, нет lazy loading графа.
4. **Без persistence** → нет IndexedDB, нет backend DB, state = memory only.
5. **Explainability** → каждая метрика должна быть introspectable (формула + inputs).
6. **Open source** → MIT license, прозрачный код, модульная структура для контрибуции.
