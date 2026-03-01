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
- `src/components/Game.jsx`: Central component — game loop, all state, Canvas rendering, buy functions.
- `src/components/ShopPanel.jsx`: Tabbed shop UI (Balls / Upgrades / Perks). Contains `BALL_TYPES` constant.
- `src/components/UpgradeCard.jsx`: Reusable shop card component (icon, name, price, accentColor).
- `src/components/Navbar.jsx`: Top bar — gem count, ball stats, New Game button.
- `src/components/assetImports.js`: Centralized file for importing all audio and visual assets.
- `src/assets/`:
  - `bgmusic/`: Background music tracks.
  - `sfx/`: Sound effects (impacts, teleports, synth tones).
  - `images/`:
    - `UI/`: HUD icons and interface elements.
    - `textures/`: Gem textures (bluegemtexture, purplegemtexture, etc.).
    - `backgrounds/`: Background images.
- `src/main.jsx`: Entry point (renders `<Game />` directly).

## Ball Type System
Each ball type lives in `BALL_TYPES` (ShopPanel.jsx) and needs these additions in Game.jsx:
1. State: `[xBallCount, setXBallCount]`, `[xBallPrice, setXBallPrice]`, upgrade prices
2. Refs: price refs + `xCurrentSpeed/Radius/DamageRef`
3. Init in the startup `useEffect` (load from localStorage)
4. Entries in `saveGameState`
5. `buyXBall()` function + upgrade functions (filter `b.type === "x"`)
6. Type-specific behavior in the game loop (e.g. homing steering, bomb AoE)
7. Type-specific render pass (e.g. targeting lines, explosion rings)

Ball properties: `{ id, x, y, speed, direction, damage, type, color, radius, ...typeSpecific }`

## Coding Standards
- **Component Style:** Use functional React components and hooks.
- **Performance:** For high-frequency updates (e.g., ball/brick physics), use `useRef` to store data and update the Canvas directly inside a `requestAnimationFrame` loop within `Game.jsx`. Avoid React state for frequently changing physics data.
- **State Persistence:** Use `localStorage` to persist game progress (currency, upgrade levels).
- **Audio:** Utilize `Tone.js` for sound management and music playback.
- **Assets:** Always import assets through `src/components/assetImports.js` to keep imports organized.
- **Styling:** Use CSS files (`App.css`, `index.css`).

## Gotchas
- **Canvas size:** Fixed at 800×560px (`CANVAS_W`/`CANVAS_H` constants in `Game.jsx`). Responsive sizing must account for this.
- **Lint:** Project has pre-existing prop-types errors (~70). `npm run build` passes; `npm run lint` does not.
- **localStorage save state:** Changing a default stat value only affects new games. Existing saves load the old value. Use "New Game" to test fresh defaults.
- **Ball radius localStorage:** `brickRadius` and `ballRadius` are persisted — changed defaults won't apply until the save is cleared.
