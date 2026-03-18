# 08. System Context and Architecture

> Главный вопрос документа: «Как система концептуально устроена?»

---

## Системный контекст

```
┌─────────────┐     REST API      ┌──────────────┐
│  Architeezy │ ◄───────────────► │  ArchiLens   │
│  Repository │    (read-only)    │  (Browser)   │
└─────────────┘                   └──────┬───────┘
                                         │
                                         │ File Download
                                         ▼
                                  ┌──────────────┐
                                  │  yEd / Excel │
                                  │  (External)  │
                                  └──────────────┘
```

### Внешние системы

1. **Architeezy** — источник данных (REST API, read-only). Единственная интеграция в MVP.
2. **yEd** — потребитель GraphML export (формат файла, не runtime интеграция).
3. **Excel / CSV reader** — потребитель CSV export.

НЕ входят: SSO, CI/CD, telemetry, demo hosting.

---

## Ключевое архитектурное решение: Frontend-only SPA

ArchiLens в MVP — **полностью клиентское приложение** (SPA). Нет backend-сервера.

**Почему:**
- Деплой = статика (GitHub Pages, Vercel, `npx serve dist/`). Нулевая инфраструктура.
- Конфиденциальность: данные модели не покидают машину пользователя.
- Модели до 500 элементов обрабатываются в браузере за миллисекунды.
- Нет серверного процесса, базы данных, стейтфул компонентов.

**CORS:** Если Architeezy не поддерживает CORS, пользователь запускает ArchiLens локально (`localhost`). Или используется конфигурируемый CORS proxy (опциональный, документируется в README).

---

## Технологический стек

| Слой | Технология | Обоснование |
|------|-----------|-------------|
| UI Framework | React 18+ | Зрелая экосистема, React Flow |
| Language | TypeScript | Сильная типизация, DX |
| Build | Vite | Быстрый dev server, production build |
| Graph Visualization | React Flow | Продуктовый UI для node-based интерфейсов |
| Graph Layout | elkjs | Мощный hierarchical/layered layout |
| Table | TanStack Table | Headless, гибкий, хорошо с React |
| State Management | Zustand | Лёгкий, без boilerplate |
| Graph Analysis | Ручной BFS/DFS (TypeScript) | 20-30 строк кода, нет лишних зависимостей |
| Linting | ESLint + Prettier | Стандартный стек |
| Testing | Vitest + Playwright | Unit + E2E |

---

## Архитектурные слои

```
┌─────────────────────────────────────────────┐
│                  UI Layer                    │
│  React + React Flow + TanStack Table        │
├─────────────────────────────────────────────┤
│              State Management                │
│  Zustand stores                             │
├─────────────────────────────────────────────┤
│              Insight Engine                  │
│  Impact analysis, coverage, metrics         │
├─────────────────────────────────────────────┤
│              Graph Engine                    │
│  Graph construction, BFS/DFS, indexes       │
├─────────────────────────────────────────────┤
│              Connector Layer                 │
│  Architeezy API client, data normalization  │
└─────────────────────────────────────────────┘
```

### Почему именно так

1. **Connector Layer** — изолирует source-специфичную логику. Замена коннектора не затрагивает остальное.
2. **Graph Engine** — чистая графовая структура + алгоритмы. Headless, без UI-зависимостей. Переиспользуется в CLI/тестах.
3. **Insight Engine** — бизнес-логика анализа поверх Graph Engine. Не знает про UI.
4. **State Management** — мост между движками и UI. Zustand stores для реактивности.
5. **UI Layer** — только отображение и пользовательские действия.

**Принцип:** Graph Engine + Insight Engine = reusable headless ядро. UI = заменяемый слой.

---

## Архитектурный контракт: Connector → Graph Engine

```typescript
interface NormalizedModel {
  id: string;
  name: string;
  elements: NormalizedElement[];
  relationships: NormalizedRelationship[];
  diagrams: NormalizedDiagram[];
  warnings: LoadWarning[];
}

interface NormalizedElement {
  id: string;
  name: string;
  type: string;
  diagramIds: string[];
}

interface NormalizedRelationship {
  id: string;
  sourceId: string;
  targetId: string;
  type: string;
}

interface NormalizedDiagram {
  id: string;
  name: string;
  elementIds: string[];
}
```

Connector нормализует сырые данные API в этот контракт. Graph Engine не знает про Architeezy.

---

## State Management

| Store | Ответственность |
|-------|----------------|
| `connectionStore` | URL, token, connection status |
| `modelStore` | Загруженная модель, список моделей, loading state |
| `graphStore` | Построенный граф, GraphNode[], GraphEdge[] |
| `analysisStore` | Текущий impact result, выбранный элемент, глубина |
| `filterStore` | Активные фильтры (слой, тип) |
| `uiStore` | Активный экран, sidebar state, search query |

Stores — flat. Каждый обновляется независимо.

---

## Синхронность вычислений

| Операция | Sync / Async |
|----------|-------------|
| API-запросы к Architeezy | Async (fetch) |
| Построение графа | Sync (< 50 мс для 500 узлов) |
| Расчёт базовых метрик | Sync |
| Impact analysis (BFS) | Sync (< 1 мс для 500 узлов) |
| Coverage report | Sync |
| Фильтрация, поиск | Sync |
| Экспорт (генерация файла) | Sync |

Web Workers не нужны в MVP. Все операции мгновенны для целевого размера данных.

---

## Структура UI-модулей

```
src/
  connectors/
    architeezy/          # Architeezy API connector
    demo/                # Demo dataset loader
    types.ts             # Connector interfaces
  engine/
    graph/               # Graph construction, adjacency, indexes
    insight/             # Impact analysis, coverage, metrics
    types.ts             # Domain types
  ui/
    layout/              # Shell, Sidebar, TopBar
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
  stores/                # Zustand stores
  export/                # GraphML, CSV generators
```

---

## Развёртывание

**Артефакт:** папка `dist/` с HTML/JS/CSS (static assets).

| Способ | Описание |
|--------|----------|
| Локально | `npm run dev` (dev) или `npm run build && npx serve dist` (prod-like) |
| GitHub Pages / Vercel / Netlify | Push = deploy. Бесплатная статика |
| Docker | `Dockerfile` с nginx. Для self-hosted |

Нет серверного процесса. Нет базы данных.

---

## Точки расширения (интерфейсы, не runtime plugins)

```typescript
interface DataConnector {
  connect(config: ConnectorConfig): Promise<void>;
  listModels(): Promise<ModelSummary[]>;
  loadModel(id: string): Promise<NormalizedModel>;
}

interface MetricCalculator {
  name: string;
  description: string;
  calculate(node: GraphNode, graph: AnalysisGraph): number;
}

interface ExportFormatter {
  format: string;
  extension: string;
  generate(data: ExportData): string | Blob;
}
```

Runtime plugins — post-MVP. В MVP — fork + implement interface.

---

## Необратимые архитектурные решения

| # | Решение | Последствия |
|---|---------|-------------|
| 1 | Frontend-only SPA | Нет server-side caching, CORS constraints |
| 2 | React + TypeScript | Весь UI-стек и экосистема |
| 3 | React Flow для графа | Переезд на Cytoscape.js/D3 — дорогой |
| 4 | Zustand для state | Пронизывает весь UI |
| 5 | NormalizedModel как контракт | Формат данных между connector и engine |
| 6 | ID Architeezy как primary key | Вся адресация |

---

## Ограничения MVP, влияющие на архитектуру

- **Read-only** → нет write endpoints, optimistic updates, conflict resolution.
- **Одна модель** → нет namespace в ID.
- **До 500 элементов** → sync вычисления, нет pagination, нет lazy loading.
- **Без persistence** → нет IndexedDB, нет backend DB.
- **Explainability** → каждая метрика introspectable.
- **Open source** → MIT, модульная структура для контрибуции.

---

*Связь с другими документами: domain model → [07_Domain_Model](../02-requirements/07_Domain_Model.md), data flow → [09_Data_and_Integrations](09_Data_and_Integrations.md), roadmap → [10_Roadmap](../04-delivery/10_Roadmap_and_Delivery_Plan.md).*
