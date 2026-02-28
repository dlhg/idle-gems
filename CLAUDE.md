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

## Project Structure
- `src/components/Game.jsx`: The central component managing the game loop, state, and Canvas rendering.
- `src/components/FooterActionButtons.jsx`: The UI for purchasing upgrades (Balls, Speed, Size, Damage).
- `src/components/assetImports.js`: Centralized file for importing all audio and visual assets.
- `src/assets/`:
  - `bgmusic/`: Background music tracks.
  - `sfx/`: Sound effects (impacts, teleports, synth tones).
  - `images/`: Textures and UI elements.
- `src/main.jsx`: Entry point (renders `<Game />` directly).

## Coding Standards
- **Component Style:** Use functional React components and hooks.
- **Performance:** For high-frequency updates (e.g., ball/brick physics), use `useRef` to store data and update the Canvas directly inside a `requestAnimationFrame` loop within `Game.jsx`. Avoid React state for frequently changing physics data.
- **State Persistence:** Use `localStorage` to persist game progress (currency, upgrade levels).
- **Audio:** Utilize `Tone.js` for sound management and music playback.
- **Assets:** Always import assets through `src/components/assetImports.js` to keep imports organized.
- **Styling:** Use CSS files (`App.css`, `index.css`).

