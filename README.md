# ArchiLens

> Visual architecture analysis for ArchiMate models

[![CI](https://github.com/kimartamonov/ArchiVis/actions/workflows/ci.yml/badge.svg)](https://github.com/kimartamonov/ArchiVis/actions/workflows/ci.yml)
[![Deploy](https://github.com/kimartamonov/ArchiVis/actions/workflows/deploy.yml/badge.svg)](https://github.com/kimartamonov/ArchiVis/actions/workflows/deploy.yml)

**Live demo:** [https://kimartamonov.github.io/ArchiVis/](https://kimartamonov.github.io/ArchiVis/)

ArchiLens loads ArchiMate models from [Architeezy](https://architeezy.com) (or a built-in demo dataset), renders them as interactive graphs, and provides impact analysis, quality metrics, and export capabilities — all in the browser with no backend required.

## Features

- **Interactive Graph** — zoom, pan, click nodes; 8 ArchiMate layer colours via React Flow + elkjs layout
- **Impact Analysis** — BFS traversal at depth 1 / 2 / 3; source card, affected list, layer summary, affected diagrams
- **Table View** — sortable, filterable element table (TanStack Table) with degree metrics
- **Coverage Report** — orphan detection, layer distribution, broken reference warnings
- **Cross-Screen Navigation** — click any element in any view to drill into impact analysis
- **Export GraphML** — impact subgraph export compatible with yEd
- **Export CSV** — full element table with UTF-8 BOM for Excel

## Quick Start

Prerequisites: **Node.js 20+** and **npm**.

```bash
git clone https://github.com/kimartamonov/ArchiVis.git
cd ArchiVis
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 5-Minute Demo

1. Click **Load Demo** on the Connection screen.
2. Select **Digital Bank Architecture** — the graph renders with 102 elements and 160 edges.
3. Click any node to see its **Element Card** (name, type, layer, degree, orphan badge).
4. Click **Analyze Impact** — the Impact Analyzer shows affected elements at depth 1. Switch to depth 2 or 3.
5. Click **Export GraphML** — download the impact subgraph; open in [yEd](https://www.yworks.com/products/yed).
6. Navigate to **Table** via the sidebar — sort by degree, filter by layer.
7. Click **Export CSV** — download the element table; open in Excel.
8. Navigate to **Coverage** — see orphan count, orphan percentage, layer distribution.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript 5.9 |
| Build | Vite 8 |
| Graph | React Flow + elkjs |
| Table | TanStack Table v8 |
| State | Zustand 5 |
| Tests | Vitest 4 + Testing Library |
| Lint | ESLint 9 + Prettier |
| CI | GitHub Actions |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | TypeScript check + production build |
| `npm run test` | Run all tests (281) |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |
| `npm run preview` | Preview production build |

## Project Structure

```
src/
  connectors/       Architeezy + Demo data connectors
  engine/
    graph/          buildGraph, calculateMetrics
    insight/        impactAnalysis, coverageReport
    types.ts        Domain types (NormalizedModel, GraphNode, etc.)
  export/           GraphML + CSV generators
  stores/           Zustand stores (connection, model, graph, analysis, filter, ui)
  ui/
    components/     ElementCard, SearchBar, ExportButton
    hooks/          useNavigateToElement
    layout/         Sidebar, AppLayout
    screens/        ConnectionScreen, GlobalGraph, ImpactAnalyzer, TableView, CoverageView
  validation/       Milestone validation test suites
public/
  digital-bank.json Demo dataset (102 elements, 160 relationships, 10 diagrams)
```

## Known Limitations

- **Demo dataset only** — the Architeezy connector is implemented but requires a running Architeezy server; the demo dataset works out of the box.
- **No authentication persistence** — Architeezy token is stored in `sessionStorage` (cleared on tab close).
- **No back navigation** — screen transitions are forward-only; use the sidebar to navigate.
- **GraphML export** — exports the impact subgraph only (not the full model graph).
- **No URL deep linking** — screen state is not reflected in the URL.
- **Single-user, single-tab** — no multi-user collaboration or cross-tab sync.

## License

[MIT](LICENSE)
