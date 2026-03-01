# Idle Gems - Development Guide

## Build & Run Commands
- **Dev Server:** `npm run dev`
- **Build Production:** `npm run build`
- **Linting:** `npm run lint`
- **Preview Build:** `npm run preview`

## Core Technology Stack
- **Framework:** React 18
- **Build Tool:** Vite
- **Game Engine:** Custom HTML5 Canvas engine
- **Audio:** Tone.js

## Setup
```bash
npm install
npm run dev
```

## Project Structure
- `src/components/Game.jsx`: The central component managing the game loop, state, and Canvas rendering.
- `src/components/Navbar.jsx`: Top bar displaying gems, player level, and settings.
- `src/components/FooterActionButtons.jsx`: The UI for purchasing upgrades (Balls, Speed, Size, Damage).
- `src/components/Store.jsx` / `StoreItem.jsx`: Shop UI for purchasing upgrades.
- `src/components/GoalText.jsx`: Displays current goal/level progression text.
- `src/components/assetImports.js`: Centralized file for importing all audio and visual assets.
- `src/assets/`:
  - `bgmusic/`: Background music tracks.
  - `sfx/`: Sound effects (impacts, teleports, synth tones).
  - `images/`:
    - `UI/`: HUD icons and interface elements.
    - `textures/`: Gem textures (bluegemtexture, purplegemtexture, etc.).
    - `backgrounds/`: Background images.
- `src/main.jsx`: Entry point (renders `<Game />` directly).

## Coding Standards
- **Component Style:** Use functional React components and hooks.
- **Performance:** For high-frequency updates (e.g., ball/brick physics), use `useRef` to store data and update the Canvas directly inside a `requestAnimationFrame` loop within `Game.jsx`. Avoid React state for frequently changing physics data.
- **State Persistence:** Use `localStorage` to persist game progress (currency, upgrade levels).
- **Audio:** Utilize `Tone.js` for sound management and music playback.
- **Assets:** Always import assets through `src/components/assetImports.js` to keep imports organized.
- **Styling:** Use CSS files (`App.css`, `index.css`).

## Gotchas
- **Canvas size:** Fixed at 800×560px (`CANVAS_W`/`CANVAS_H` constants in `Game.jsx`). Responsive sizing must account for this.
- **Lint is strict:** `--max-warnings 0` means zero warnings allowed; fix all lint issues before building.
