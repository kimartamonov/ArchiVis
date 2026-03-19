# M1-07 Technical Documentation

## Purpose

Entry point screen for ArchiLens. Users either connect to an Architeezy instance or load the demo dataset.

## Architecture

### File Structure

```
src/ui/screens/ConnectionScreen/
├── ConnectionScreen.tsx      # Main component
├── index.ts                  # Barrel export
└── __tests__/
    └── ConnectionScreen.test.tsx
```

### Screen Routing (App.tsx)

`App.tsx` reads `uiStore.activeScreen` and renders the corresponding screen:

```
activeScreen === 'connection' → <ConnectionScreen />
activeScreen === 'graph'      → placeholder (M1-08)
activeScreen === 'impact'     → placeholder (M2-05)
```

### Data Flows

#### Connect to Architeezy

```
User enters URL + token → clicks "Connect"
  1. setError(null)
  2. connectionStore.setConnection(url, token) → persists to storage
  3. connectionStore.setStatus('connecting')
  4. new ArchiteezyConnector().connect({ url, token })
  5a. Success → connector.listModels() → modelStore.setModels(list)
                → connectionStore.setStatus('connected')
                → dropdown appears
  5b. Error → connectionStore.setError(message) → error alert
```

#### Load Demo Dataset

```
User clicks "Load Demo Dataset"
  1. new DemoConnector().loadModel('demo')
  2. modelStore.setCurrentModel(model)
  3. uiStore.setScreen('graph') → App re-renders graph view
```

#### Open Selected Model

```
User selects model from dropdown → clicks "Open Model"
  1. connector.loadModel(selectedModelId)
  2. modelStore.setCurrentModel(model)
  3. uiStore.setScreen('graph')
```

### Store Integration

| Store | Usage |
|-------|-------|
| `connectionStore` | URL, token, status, error management |
| `modelStore` | Model list after connect, current model after load |
| `uiStore` | Screen navigation (`setScreen('graph')` after model load) |

### Error Handling

- Empty URL → immediate validation error (no network call)
- `TypeError` with "fetch" or "network" → CORS-specific guidance
- Other errors → raw error message displayed in alert

### Styling

Inline styles using CSS custom properties from `index.css` (`--accent`, `--border`, `--text-h`, etc.). Supports light and dark themes via `prefers-color-scheme`.

## Constraints

- No React Router — screen switching via Zustand store state
- Connector instances are ephemeral — created per connect/demo-load action, stored in `useRef` for model selection
- No progress bar for model loading (out of scope)

## Integration Points

- **M1-08 (Global Graph View):** After model load, `modelStore.currentModel` is set and `uiStore.activeScreen` is `'graph'`. M1-08 reads the model and builds the graph.
- **M1-06 stores:** ConnectionScreen is the first consumer of `connectionStore`, `modelStore`, and `uiStore`.
- **M1-01 / M1-02 connectors:** ConnectionScreen instantiates `DemoConnector` and `ArchiteezyConnector` directly.
