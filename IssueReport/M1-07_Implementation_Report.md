# M1-07 Implementation Report

## Issue

| Field | Value |
|-------|-------|
| **Issue ID** | M1-07 |
| **Title** | Build Connection Screen |
| **Milestone** | M1 — Model Visualization |
| **Type** | UI |
| **Status** | Done |

## What Was Done

1. **Created ConnectionScreen component** (`src/ui/screens/ConnectionScreen/ConnectionScreen.tsx`):
   - URL input (pre-filled from `localStorage` via `connectionStore`)
   - Password input for API token
   - "Connect" button — creates `ArchiteezyConnector`, connects, loads model list
   - "Load Demo Dataset" button — creates `DemoConnector`, loads demo model, navigates to graph screen
   - Error alert area with CORS-specific guidance
   - Model selection dropdown (appears after successful connection)
   - "Open Model" button (loads selected model, navigates to graph screen)
   - "Disconnect" button (resets all stores)

2. **Updated App.tsx** — screen routing based on `uiStore.activeScreen`:
   - `'connection'` → ConnectionScreen
   - `'graph'` → placeholder (M1-08)
   - `'impact'` → placeholder (M2-05)

3. **Created 7 UI tests** (`ConnectionScreen.test.tsx`):
   - Renders without crash
   - Shows all interactive elements (inputs, buttons)
   - Demo load → model loaded, navigates to graph
   - Connect success → model list dropdown appears
   - Connect failure → error message displayed
   - Empty URL → validation error
   - Connect click → store status set to 'connecting'

4. **Installed test dependencies**: `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`

## Files Changed

| Path | Change |
|------|--------|
| `src/ui/screens/ConnectionScreen/ConnectionScreen.tsx` | Created |
| `src/ui/screens/ConnectionScreen/index.ts` | Created |
| `src/ui/screens/ConnectionScreen/__tests__/ConnectionScreen.test.tsx` | Created |
| `src/App.tsx` | Updated (screen routing) |
| `package.json` | Updated (test deps) |
| `package-lock.json` | Updated |

## Acceptance Criteria Status

| Criteria | Status |
|----------|--------|
| Connection screen renders on app load | Done |
| Valid URL + token → model list dropdown | Done (tested) |
| Invalid credentials → error message | Done (tested) |
| Unreachable URL → error message | Done |
| "Load Demo Dataset" → loads model, navigates | Done (tested) |
| URL persists in localStorage | Done (via connectionStore) |
| Token in sessionStorage | Done (via connectionStore) |
| Loading indicator during connection | Done ("Connecting…" button text) |
| Connect button disabled during loading | Done (disabled prop) |

## Checks Performed

- `npm run test` — 84/84 passed
- `npm run build` — successful
- `npm run lint` — 0 errors

## Out of Scope

- Progress bar for model loading
- "Remember last model" functionality
- CORS proxy configuration UI
- Visual polish (styling is functional, not final)

## Risks

- R4 (CORS): Handled with specific error message guiding users to configure proxy

## Unblocked

- **M1-08** (Global Graph View) — ConnectionScreen loads model into stores, sets screen to 'graph'
