# Idle Gems v2: Phaser + React Edition

## 1. Vision
A high-performance, high-juice incremental game where the player manages a chaotic ecosystem of bouncing balls and gems. The goal is to move from a basic canvas loop to a robust game engine capable of handling hundreds of entities, complex physics modifiers, and explosive visual feedback.

---

## 2. Technical Architecture: The Hybrid Model
To ensure scalability, the project will split concerns between **Phaser 3** (Physics/Rendering) and **React** (HUD/Meta-Menus).

### A. Phaser (The "Engine")
- **Arcade Physics:** Handles collisions, velocities, and overlaps.
- **Particle Manager:** High-performance gem shards and impact effects.
- **Scene Management:** Separate scenes for Loading, the Main Game, and potentially a Background/Cosmos scene.
- **Data Registry:** Phaser’s internal `registry` will be used to store real-time values (current gems, combo count) that React can listen to.

### B. React (The "Commander")
- **HUD:** Navbar (Gems, Stats).
- **Store:** Upgrade buttons and cost logic.
- **Skill Tree:** The Astral Lab modal.
- **Persistence:** `localStorage` management and state hydration.

### C. The Bridge (EventBus)
A dedicated `EventBus.js` (simple EventEmitter) will allow React to tell Phaser when a ball is bought or a skill is unlocked, and allow Phaser to tell React when gems are earned.

---

## 3. Gameplay Mechanics (The Core Loop)

### A. The Entities
- **Balls:** Autonomous units that bounce around the screen. 
    - *Stats:* Speed, Damage, Radius.
    - *Action:* On collision with a brick, deal damage equal to the `ball.damage` stat and reflect velocity.
- **Bricks (Gems):** Static targets that spawn within the play area.
    - *Stats:* HP (Health Points), Gem Value (Currency dropped on death).
    - *Appearance:* Texture changes based on the Gem Value (e.g., Blue -> Purple -> Green -> Cosmic).

### B. Combat & Destruction
- **Collision Logic:** When a ball hits a brick:
    1. `brick.hp -= ball.damage`.
    2. A "Damage Number" ripple appears at the impact point.
    3. If `brick.hp <= 0`, the brick is destroyed, a particle burst is triggered, gems are added to the player's total, and a "Reward Text" (e.g., `+50g`) appears.
- **Click Interaction:** The player can directly click bricks.
    1. Deals `player.clickDamage` to the target.
    2. If clicking empty space (and the skill is unlocked), all balls teleport to the click location.

### C. Spawning Logic
- **Rate-Based Spawning:** New bricks spawn every `X` milliseconds.
- **Dynamic Scaling:** As the player clears bricks, the spawn rate increases (decreases in interval) to keep the screen active.
- **Cap:** A maximum number of bricks (e.g., 120) is maintained to prevent performance degradation.

### D. The Upgrade Loop
Players spend Gems in the React UI to:
1. **Buy New Balls:** Increases the total number of autonomous damage-dealers.
2. **Upgrade Ball Stats:** Increases Speed, Radius, or Damage globally for all balls.
3. **Upgrade Click Stats:** Increases the damage dealt by player clicks.

---

## 4. Core Systems (The "Extensible" Design)

### Ball System (Modifier Pattern)
Instead of hardcoding ball stats, each ball will calculate its stats based on a **Base Value** + **Multipliers** from the Skill Tree.
- *Future-Proofing:* Balls will be a Class (`Ball extends Phaser.Physics.Arcade.Sprite`). This allows adding behaviors like "Homing" or "Ghosting" by simply adding a method to the class.

### Brick System (The Factory)
A `BrickFactory` class will spawn bricks. 
- *Current:* Standard gem bricks with HP scaling based on the brick's ID or spawn count.
- *Future-Proofing:* Bricks will have a `type` property (e.g., `TNT`, `GOLD`, `BOSS`). The `onHit` logic will be a switch case, allowing new types to be added without touching the physics loop.

### Effect System (The Juice)
A centralized `EffectManager` in Phaser to handle:
- **Screen Shake:** Triggered by `events.emit('shake', intensity)`.
- **Particles:** A pool of emitters to prevent memory leaks.
- **Audio:** Music pitch scaling based on a `hitCombo` variable.

---

## 5. Feature Roadmap

### Phase 1: Engine Parity (The Foundation)
- [ ] Scaffold Phaser + React template.
- [ ] Implement `BallGroup` and `BrickGroup` using Arcade Physics.
- [ ] Basic "Buy Ball" and "Upgrade Stats" loop.
- [ ] Canvas-based damage numbers (Ripples).
- [ ] LocalStorage save/load parity.

### Phase 2: The Meta-Layer (Skill Tree)
- [ ] Implement **Skill Points (SP)** earned via lifetime gems.
- [ ] Create the **Astral Lab** (Skill Tree) Modal.
- [ ] Support for **Passive Modifiers** (e.g., `ball.damage * globalMultipliers.damage`).
- [ ] Support for **Active Modifiers** (e.g., "Fragmentation" split logic).

### Phase 3: Juice & Variety
- [ ] High-performance particle bursts on brick destruction.
- [ ] Screenshake implementation for big hits.
- [ ] Introduction of **Special Bricks** (TNT, Multiplier).
- [ ] Introduction of **Boss Gems** (Large, high-HP gems every X spawns).

---

## 6. Implementation Strategy for "Zero Refactor" Adds

### Adding a new Skill:
1. Add the skill definition to `config/skills.js`.
2. In React, the Skill Tree renders the new node automatically.
3. In Phaser, the `Ball` class checks `GameState.unlockedSkills.includes('HOMING')` in its `update()` loop to apply steering logic.

### Adding a new Brick Type:
1. Add an image to the assets.
2. In `BrickFactory`, add a case for the new type.
3. Define the custom logic in the brick's `onDestroy` handler (e.g., spawn TNT explosion).

---

## 7. Key Files Summary
- `src/game/main.js`: Phaser configuration.
- `src/game/scenes/MainScene.js`: The core physics/collision loop.
- `src/game/entities/Ball.js`: Individual ball logic.
- `src/components/UIBridge.jsx`: React component that wraps the Phaser canvas and handles communication.
- `src/store/GameState.js`: The central "Brain" containing gems, upgrades, and skill tree progress.
