# M2-04 Technical Documentation

## Purpose

Global search bar for finding ArchiMate elements by name. Entry point to the impact analysis workflow (S-2 demo steps 1-2).

## Architecture

```
src/ui/components/Search/
├── SearchBar.tsx   # Input + dropdown component
├── index.ts        # Barrel export
└── __tests__/
    └── SearchBar.test.tsx
```

### Data Flow

```
User types query → debounce 200ms → filter graphStore.graph.nodes by name
    ↓
Dropdown: up to 10 matches (name, type, layer badge)
    ↓
User clicks result → analysisStore.selectElement(id) + uiStore.setScreen('impact')
```

### Search Algorithm

- Case-insensitive substring match: `element.name.toLowerCase().includes(query.toLowerCase())`
- Iterates `graphStore.graph.nodes.values()`, stops at 10 matches
- Debounced at 200ms to avoid excessive filtering during rapid typing

### Dropdown Behavior

| Event | Action |
|-------|--------|
| Input focus (with existing results) | Open dropdown |
| Type → debounce → matches found | Open dropdown |
| Type → debounce → no matches | Close dropdown |
| Click result | Select element, navigate, close |
| Click outside | Close dropdown |
| Escape key | Close dropdown |
| Clear input | Close dropdown |

### Placement

Added to `GlobalGraphView` toolbar between the "Connection" button and node/edge stats.

## Integration Points

- **M2-05 (Impact Analyzer Screen):** SearchBar sets `analysisStore.selectedElementId` and navigates to `'impact'` screen
- **graphStore:** reads `graph.nodes` for element data
- **nodeStyles:** uses `colorForLayer()` for layer badges
