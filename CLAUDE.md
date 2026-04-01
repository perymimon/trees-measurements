# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Project Overview

**max-trees-measurements** — A 3D visualization web app (Ampple - Apple Mapping)
for monitoring tree health data. It renders a 25×20 grid of 3D tree models whose
height and foliage color update based on CSV measurement data (watering status,
flowering density) across multiple dates.

## Commands

```bash
npm run dev       # Start Vite dev server (localhost:5173)
npm run build     # Production build → /dist
npm run preview   # Serve the built /dist locally
```

No tests are configured.

## Tech Stack

- **React 18** + **Vite 2.9** — UI and build
- **Three.js 0.139** + **@react-three/fiber** + **@react-three/drei** — 3D scene
- **Valtio** — proxy-based reactive state
- **SCSS** — styling

## Architecture

### Data Flow

```
/public/data/*.csv  →  state.js (Valtio proxy)  →  React components (useSnapshot)
```

CSV files are named `YYYY-MM-DD - {type}.csv` (`flowering_top`, `flowering_bot`,
`watered`). `state.js` loads them at startup, parses them into a flat `datums[]`
array, and computes board layout (25 cols × 20 rows = 500 trees). All components
subscribe reactively via `useSnapshot(state)`.

### Key Files

| File                                                            | Role                                                                                     |
|-----------------------------------------------------------------|------------------------------------------------------------------------------------------|
| `src/state.js`                                                  | Central Valtio store — CSV loading, day switching, focus/selection, board layout math    |
| `src/App.jsx`                                                   | Top-level layout — mounts the R3F `<Canvas>` and 2D UI panels                            |
| `src/blocks/Groves.jsx`                                         | 3D scene root — composes Trees, Grounds, Rulers, Markers                                 |
| `src/components/tree-fiver/Tree.jsx`                            | Single 3D tree — `useFrame` lerps height & foliage color each tick                       |
| `src/blocks/Grounds.jsx`                                        | `InstancedMesh` of 500 colored squares showing water levels (performance-critical)       |
| `src/blocks/Rulers.jsx` / `src/components/tree-fiver/Ruler.jsx` | Axis rulers; hover emits `markColumns()`/`markRows()` to state                           |
| `src/components/tree-fiver/MiniMap.jsx`                         | Date selector + drag-drop file upload; rendered inside the canvas via `<Html>`           |
| `src/components/Grid.jsx`                                       | 2D HTML table of raw measurement data; click/hover drives camera focus                   |
| `src/blocks/FocusControl.jsx`                                   | Extends OrbitControls — smoothly animates camera to a focused tree                       |
| `src/helper/math.js`                                            | `domain2range()`, `lerpKey()`, `clamp()`, `findMinMax2D()` — core data-to-visual mapping |
| `src/helper/csvParsers.js`                                      | CSV parser (configurable delimiter)                                                      |

### Visual Encoding

- **Tree height** → `domain2range([0,4], [0.5,2])` applied to `watered` value
- **Foliage color** → `domain2range([0,500], [20,100])` on density → HSL,
  painted onto a 10×20 canvas texture updated per frame
- The canvas texture is cached per-tree using `LetMap` (`src/helper/let-map.js`)
  so textures aren't recreated on every render

### State Shape (Valtio proxy in `state.js`)

- `days[]` — list of loaded date strings
- `dayIndex` — currently viewed day
- `datums[]` — flat array of `{index, densities:[top,bot], watered}` for all 500
  trees
- `focus` — currently selected tree index (drives camera)
- `board` — computed grid geometry (cell size, offsets)
- Getters: `dayName`, `dayInfo`
- Actions: `setFocus()`, `addDay()`, `applyFilesDay()`, `markColumns()`,
  `markRows()`

## Static Assets

- `public/data/` — CSV measurement files (two example dates pre-loaded)
- `public/3d-models/treeModel-leafsMerge.glb` — main tree GLB (nodes: `tree`,
  `foliage`, `leaf`)
- `code-reference/` — scratch/reference files, not part of the build
