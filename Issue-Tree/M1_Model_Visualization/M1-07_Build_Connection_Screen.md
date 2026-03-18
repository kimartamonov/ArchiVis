# M1-07: Build Connection Screen

## Metadata

| Field                | Value                                                        |
|----------------------|--------------------------------------------------------------|
| **Issue ID**         | M1-07                                                        |
| **Type**             | UI                                                           |
| **Status**           | Proposed                                                     |
| **Milestone**        | M1 — Model Visualization                                     |
| **Capability Slice** | S-1 ("Вижу модель как граф")                                 |
| **Priority**         | P0                                                           |
| **Sequence Order**   | 7                                                            |
| **Depends On**       | M1-01 (Demo Connector), M1-02 (Architeezy Connector), M1-06 (Zustand Stores) |
| **Unlocks**          | M1-08 (Global Graph View)                                    |
| **FR References**    | FR-1.1, FR-1.2, FR-1.4, FR-1.8                              |
| **AC References**    | AC-1.1, AC-1.4                                               |
| **Decision Refs**    | —                                                            |
| **Demo Refs**        | SC-1 steps 1–3, S-1 step 2                                  |
| **Risk Refs**        | R4 (CORS)                                                    |

## Goal

Build the connection screen — the app's entry point where a user either connects to an Architeezy instance (URL + token) or loads the demo dataset with a single click.

## Why Now

This is the first screen users see. It bridges the connectors (M1-01, M1-02) and stores (M1-06) with the UI layer. Without it, there is no way for a user to load data into the application.

## User / System Outcome

A user opens ArchiLens and sees a clean connection form. They can:
1. Enter an Architeezy URL and API token, click "Connect", and select a model from the returned list.
2. Click "Load Demo Dataset" to instantly load the demo model.
3. See clear error messages if connection fails (wrong URL, invalid token, CORS issue).

## Scope

- `src/ui/screens/ConnectionScreen/ConnectionScreen.tsx` — main component.
- `src/ui/screens/ConnectionScreen/index.ts` — barrel export.
- UI elements:
  - Text input for Architeezy server URL (pre-filled from localStorage if available).
  - Password/text input for API token.
  - "Connect" button.
  - "Load Demo Dataset" button (visually distinct, always available).
  - Error alert area for connection failures.
  - Loading spinner/indicator during connection attempt.
  - Model selection dropdown (appears after successful connection, lists available models).
  - "Open Model" button (enabled after model selection).

## Out of Scope

- Progress bar for model loading.
- "Remember last model" functionality.
- Multiple simultaneous connections.
- CORS proxy configuration UI.

## Preconditions

- M1-01: `DemoConnector` implemented and exported.
- M1-02: `ArchiteezyConnector` implemented and exported.
- M1-06: `connectionStore`, `modelStore`, `uiStore` created.

## Implementation Notes

- React functional component using Zustand store hooks.
- **Connect flow:**
  1. User fills URL + token, clicks "Connect".
  2. `connectionStore.setConnection(url, token)` — persists to storage.
  3. `connectionStore.setStatus('connecting')`.
  4. Instantiate `ArchiteezyConnector`, call `connector.connect({ url, token })`.
  5. On success: `connector.listModels()` → `modelStore.setModels(list)` → show dropdown.
  6. On error: `connectionStore.setError(message)` → show error alert.
- **Demo flow:**
  1. User clicks "Load Demo Dataset".
  2. Instantiate `DemoConnector`, call `loadModel("demo")`.
  3. `modelStore.setCurrentModel(model)` → `uiStore.setScreen('graph')`.
- **Model selection flow:**
  1. User picks model from dropdown, clicks "Open Model".
  2. `connector.loadModel(id)` → `modelStore.setCurrentModel(model)` → `uiStore.setScreen('graph')`.
- Show CORS-specific error guidance if fetch fails with a TypeError (likely CORS).

## Files and Artifacts Expected to Change

| Path                                                   | Change   |
|--------------------------------------------------------|----------|
| `src/ui/screens/ConnectionScreen/ConnectionScreen.tsx` | Create   |
| `src/ui/screens/ConnectionScreen/index.ts`             | Create   |
| `src/App.tsx` (or router config)                       | Update (add route/screen) |

## Acceptance Criteria

- [ ] Connection screen renders on app load.
- [ ] Valid URL + token → model list dropdown appears.
- [ ] Invalid credentials → error message displayed (not a crash).
- [ ] Unreachable URL → error message displayed.
- [ ] "Load Demo Dataset" → demo model loads and app navigates to graph view.
- [ ] URL persists in localStorage across page reloads.
- [ ] Token stored in sessionStorage (cleared on tab close).
- [ ] Loading indicator shown during connection attempt.
- [ ] "Connect" button disabled during loading.

## Required Tests

### Functional

- Connect flow with mocked connector: success → model list shown.
- Connect flow with mocked error: error message displayed.
- Demo load: click → model loaded, screen transitions.
- URL pre-fill from localStorage on mount.

### Smoke

- Screen renders without crash.
- All interactive elements (inputs, buttons) are present.

### Regression

- Stores still work correctly after UI integration.
- DemoConnector and ArchiteezyConnector interfaces unchanged.

## Handoff to Next Issue

User can enter the app and load data via either path. The loaded `NormalizedModel` is in `modelStore`. The `uiStore.activeScreen` is set to `'graph'`. M1-08 (Global Graph View) renders the graph from this state.

## Done Definition

- All acceptance criteria checked.
- Code compiles without errors.
- Tests pass.
- Screen is visually functional (styling polish is not required at this stage).
- Connection screen exported and routed in the app.
