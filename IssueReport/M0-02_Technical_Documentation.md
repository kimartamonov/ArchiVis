# M0-02 Technical Documentation

**Issue:** M0-02 — Setup Project Skeleton
**Date:** 2026-03-18

---

## 1. Purpose

This document describes the ArchiLens project skeleton: technology stack, configuration, folder structure, and development workflow established by M0-02.

---

## 2. Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Runtime | Node.js | 20.x |
| Framework | React | 19.2 |
| Language | TypeScript | 5.9 (strict mode) |
| Build tool | Vite | 8.0 |
| Linter | ESLint | 9.x (flat config) |
| Formatter | Prettier | 3.8 |

---

## 3. Project Structure

```
ArchiVis/
├── index.html              # Entry point
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TS project references
├── tsconfig.app.json       # App TS config (strict mode)
├── tsconfig.node.json      # Node TS config (vite.config)
├── vite.config.ts          # Vite configuration
├── eslint.config.js        # ESLint flat config
├── .prettierrc             # Prettier config
├── .gitignore              # Git ignores
├── src/
│   ├── main.tsx            # React root entry
│   ├── App.tsx             # Root component (placeholder)
│   ├── App.css             # App styles
│   ├── index.css           # Global styles
│   ├── connectors/         # Data source connectors (M1-01, M1-02)
│   ├── engine/             # Graph engine, analysis (M1-03, M2-01)
│   ├── ui/                 # React components (M1-07+)
│   ├── stores/             # Zustand state stores (M1-06)
│   └── export/             # Export generators (M4-01, M4-02)
├── DocsClaude/             # Specification documents
├── Issue-Tree/             # Implementation plan
├── IssueReport/            # Implementation reports
└── docs/                   # Spike documents
```

---

## 4. Available Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `npm run dev` | `vite` | Start dev server with HMR |
| `npm run build` | `tsc -b && vite build` | Type-check and build for production |
| `npm run lint` | `eslint .` | Run ESLint on all TS/TSX files |
| `npm run preview` | `vite preview` | Preview production build locally |
| `npm run format` | `prettier --write "src/**/*.{ts,tsx,css}"` | Format source files |

---

## 5. TypeScript Configuration

- **Target:** ES2023
- **Module:** ESNext with bundler resolution
- **Strict mode:** Enabled (`strict: true`)
- **Additional checks:** `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `noUncheckedSideEffectImports`
- **JSX:** `react-jsx` (automatic runtime)
- **No emit:** True (Vite handles bundling)

---

## 6. ESLint Configuration

Flat config (`eslint.config.js`) with:
- `@eslint/js` recommended rules
- `typescript-eslint` recommended rules
- `eslint-plugin-react-hooks` recommended
- `eslint-plugin-react-refresh` for Vite HMR
- Globals: browser environment
- Ignores: `dist/`

---

## 7. Prettier Configuration

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2
}
```

---

## 8. Integration Points for Next Issues

| Next Issue | Where to Create Files |
|------------|----------------------|
| **M0-03** (Domain types) | `src/engine/types.ts`, `src/connectors/types.ts` |
| **M0-04** (Demo dataset) | `src/connectors/demo-data.json` or similar |
| **M1-01** (Demo connector) | `src/connectors/demo-connector.ts` |
| **M1-02** (Architeezy connector) | `src/connectors/architeezy-connector.ts` |
| **M1-03** (Graph engine) | `src/engine/graph.ts` |
| **M1-06** (Zustand stores) | `src/stores/` |
| **M1-07+** (UI components) | `src/ui/` |
| **M4-01, M4-02** (Export) | `src/export/` |

---

## 9. Constraints

- No domain-specific packages installed yet (React Flow, Zustand, TanStack Table, elkjs) — each installed by the issue that needs it
- `src/vite-env.d.ts` provides Vite client type declarations
- Build output goes to `dist/` (gitignored)
