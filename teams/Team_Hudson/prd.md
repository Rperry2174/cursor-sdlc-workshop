# Product Requirements Document (PRD)

---

## Project Overview

**Project Name:** Hudson River Runner

**One-line Description:** A Temple Run-style top-down scrolling game where you pilot a boat down the Hudson River, dodge icebergs, and reach the Atlantic Ocean to win.

**Type:** Web App (React + HTML5 Canvas)

---

## Guidelines

- Frontend only -- no database, no server, no APIs
- Built with React (Vite) and the HTML5 Canvas API
- Single page, no routing needed
- Game state managed with React `useState` and `useRef`
- Game loop powered by `requestAnimationFrame`

---

## Game Concept

The player steers a boat from the top of the Hudson River (near midtown Manhattan) southward to the Atlantic Ocean. The river scrolls upward to simulate forward motion. Icebergs spawn at the top of the screen and scroll down toward the player. The player moves the boat left and right to dodge them.

- **Win condition:** Travel 12 miles (reach the ocean) without hitting an iceberg
- **Lose condition:** Collide with any iceberg
- **Controls:** Left/Right arrow keys or A/D keys

---

## How This Works (Git Workflow)

This project is split into **7 independent tasks**. Here's the workflow:

1. **Task 1 goes first.** One person scaffolds the base MVP game, opens a PR, and merges it.
2. **Tasks 2-7 happen in parallel.** Once the MVP is merged, six people each pick a task, create their own branch, build their feature, and open a PR.
3. **Everyone merges.** Each PR gets reviewed and merged into `main`. If there are merge conflicts, Cursor can help resolve them.

This mirrors a real software development lifecycle: one person builds the foundation, then the team works on features in parallel using branches and pull requests.

---

## All 7 Tasks at a Glance

| Task | Name | Branch Name | What You Build | Files You Own |
|------|------|-------------|----------------|---------------|
| 1 | **Base MVP** | `Team_Hudson/base-mvp` | Core game: river, boat, icebergs, collision, win/lose | All files in `src/` (initial scaffold) |
| 2 | **Scoreboard** | `[your-name]/scoreboard` | High score display, elapsed time, localStorage persistence | `src/Scoreboard.jsx`, `src/Scoreboard.css` |
| 3 | **Sound Effects** | `[your-name]/sound-effects` | Audio on game events (crash, win, engine hum) | `src/SoundEffects.jsx`, `public/sounds/` |
| 4 | **Difficulty Settings** | `[your-name]/difficulty` | Easy/Medium/Hard mode selector before the game starts | `src/DifficultySettings.jsx`, `src/DifficultySettings.css` |
| 5 | **Power-Ups** | `[your-name]/power-ups` | Collectible shield and slow-mo items on the river | `src/PowerUps.jsx`, `src/powerUpLogic.js` |
| 6 | **Visual Effects** | `[your-name]/visual-effects` | Wake trail, splash particles, confetti on win | `src/VisualEffects.jsx`, `src/particles.js` |
| 7 | **NYC Landmarks** | `[your-name]/landmarks` | Bridge silhouettes, mile markers, Statue of Liberty at the finish | `src/Landmarks.jsx`, `src/landmarkData.js` |

---

## Task 1: Base MVP (must merge first)

> **Branch:** `Team_Hudson/base-mvp`
> **Assigned to:** _[Name]_

This person scaffolds the entire project and builds the minimum playable game. Everyone else's work depends on this being merged first.

**What to build:**
- Vite + React project scaffold (`npm create vite@latest`)
- HTML5 Canvas rendering a scrolling blue river with green/gray shoreline banks
- A boat near the bottom of the screen that moves left/right with Arrow keys or A/D
- Icebergs that spawn at random horizontal positions at the top and scroll downward
- Bounding-box collision detection -- hitting an iceberg ends the game
- A distance meter on screen (e.g., "2.4 mi / 12 mi to the ocean")
- Three game states: Start screen, Playing, Game Over (win or lose) with restart

**What to deliberately leave out** (these are the other 6 tasks):
- No high scores or time tracking
- No sound
- No difficulty options
- No power-ups or collectibles
- No particle effects or fancy animations
- No landmark scenery

**File structure after this task:**

```
base_mvp/
  index.html
  package.json
  vite.config.js
  public/
  src/
    main.jsx             -- Vite entry point
    App.jsx              -- Game state manager (start / playing / won / lost)
    App.css              -- Global styles, dark background, canvas centering
    GameCanvas.jsx       -- Canvas element, game loop, keyboard input
    StartScreen.jsx      -- Title screen with "Press Space to Start"
    GameOverScreen.jsx   -- Win/lose screen with restart option
    gameLogic.js         -- Pure functions: spawn icebergs, move, detect collisions
    renderer.js          -- Canvas drawing: river, banks, boat, icebergs, HUD
    index.css            -- Base reset styles
```

**How to do it:**
1. Tell Cursor: "Read the PRD and build the base MVP in the `base_mvp/` folder"
2. Tell Cursor: "Run it locally and verify the game works"
3. Tell Cursor: "Commit with message 'Team_Hudson - Base MVP', push, and open a PR"

---

## Task 2: Scoreboard

> **Branch:** `[your-name]/scoreboard`
> **Assigned to:** _[Name]_
> **Files to create:** `src/Scoreboard.jsx`, `src/Scoreboard.css`
> **Files to modify:** `src/App.jsx` (import and render the Scoreboard component)

**What to build:**
- A `<Scoreboard />` component that overlays the game screen
- During gameplay: shows elapsed time and current distance traveled
- After game over: shows final time, final distance, and whether it's a new best
- Saves the best time and best distance to `localStorage` so it persists across page refreshes
- Shows a "Best: X" indicator on the start screen

**Key details:**
- Use `useState` for current scores and `localStorage` for persistence
- The component renders as an HTML overlay on top of the canvas (not drawn on the canvas)
- Style it so it looks like a heads-up display -- semi-transparent background, fixed position

---

## Task 3: Sound Effects

> **Branch:** `[your-name]/sound-effects`
> **Assigned to:** _[Name]_
> **Files to create:** `src/SoundEffects.jsx`, `public/sounds/` folder with audio files
> **Files to modify:** `src/App.jsx` (import and render the SoundEffects component)

**What to build:**
- A `<SoundEffects />` component that listens to game state and plays audio
- Sounds to include:
  - Water/engine ambient loop while playing
  - Crash/splash sound when the boat hits an iceberg
  - Victory horn or fanfare when the player reaches the ocean
  - A click/whoosh when the game starts
- A mute/unmute toggle button in the corner of the screen

**Key details:**
- Use the Web Audio API or simple `<audio>` elements
- Generate or find short royalty-free sound clips (or use Web Audio API to synthesize simple tones)
- Audio must not autoplay -- start on first user interaction (browser policy)

---

## Task 4: Difficulty Settings

> **Branch:** `[your-name]/difficulty`
> **Assigned to:** _[Name]_
> **Files to create:** `src/DifficultySettings.jsx`, `src/DifficultySettings.css`
> **Files to modify:** `src/App.jsx` (import and render DifficultySettings, pass config to GameCanvas)

**What to build:**
- A `<DifficultySettings />` component shown on the start screen
- Three buttons: Easy, Medium, Hard
- Each difficulty changes a config object that controls:
  - **Iceberg spawn rate** (how often new icebergs appear)
  - **Scroll speed** (how fast the river moves)
  - **Iceberg density** (how many can be on screen at once)
- Pass the selected config as a prop to `<GameCanvas />`
- Visually highlight the selected difficulty

**Suggested values:**

| Setting | Easy | Medium | Hard |
|---------|------|--------|------|
| Spawn interval | 2000ms | 1200ms | 700ms |
| Scroll speed | 2 | 3.5 | 5 |
| Max icebergs | 3 | 5 | 8 |

---

## Task 5: Power-Ups

> **Branch:** `[your-name]/power-ups`
> **Assigned to:** _[Name]_
> **Files to create:** `src/PowerUps.jsx`, `src/powerUpLogic.js`
> **Files to modify:** `src/gameLogic.js` (add power-up spawning and collection to the update loop), `src/renderer.js` (draw power-up items)

**What to build:**
- Two collectible power-up types that float down the river like icebergs:
  - **Shield** (drawn as a blue circle) -- grants 3 seconds of invincibility. Boat flashes/glows while active.
  - **Slow-Mo** (drawn as a yellow clock) -- halves the scroll speed for 3 seconds.
- Power-ups spawn less frequently than icebergs (roughly every 8-12 seconds)
- Collision with a power-up collects it (no damage) and activates the effect
- A small indicator on screen shows active power-up and remaining duration

**Key details:**
- `powerUpLogic.js` contains pure functions for spawning, collecting, and timing power-ups
- Keep power-up state in the same game state ref that icebergs use
- This task touches `gameLogic.js` and `renderer.js` -- coordinate with the MVP author if needed

---

## Task 6: Visual Effects

> **Branch:** `[your-name]/visual-effects`
> **Assigned to:** _[Name]_
> **Files to create:** `src/VisualEffects.jsx`, `src/particles.js`
> **Files to modify:** `src/renderer.js` (call particle/effect drawing functions)

**What to build:**
- **Boat wake:** Two white diverging lines trailing behind the boat as it moves
- **Splash particles:** Small white circles that burst outward when the boat collides with an iceberg
- **Win celebration:** Confetti or fireworks that fill the screen when the player wins
- **Parallax layer:** Faint cloud shadows or bridge silhouettes that scroll at a slower speed than the river, adding depth

**Key details:**
- `particles.js` exports pure functions: `createParticles()`, `updateParticles()`, `drawParticles()`
- Particle arrays live in the game state ref alongside icebergs
- Keep particle counts reasonable (under 100) so performance stays smooth
- Effects are purely visual -- they don't affect gameplay logic

---

## Task 7: NYC Landmarks

> **Branch:** `[your-name]/landmarks`
> **Assigned to:** _[Name]_
> **Files to create:** `src/Landmarks.jsx`, `src/landmarkData.js`
> **Files to modify:** `src/renderer.js` (draw landmarks at the correct distance intervals)

**What to build:**
- Landmark silhouettes that appear on the riverbanks as the player progresses:
  - **Mile 0-2:** Midtown skyline silhouette on the right bank
  - **Mile 3:** George Washington Bridge spanning across the top of the screen
  - **Mile 6:** Palisades cliffs on the left bank
  - **Mile 9:** Bayonne Bridge
  - **Mile 11-12:** Statue of Liberty silhouette on the right as you approach the finish
- Each landmark is a simple shape drawn on the canvas (rectangles, triangles, arcs)
- A "Now passing: [Landmark Name]" text briefly appears when each landmark scrolls by
- `landmarkData.js` contains an array of landmark objects: `{ name, milesAt, drawFn }`

**Key details:**
- Landmarks are drawn based on the player's current distance, not random spawning
- Draw them on the shoreline areas (outside the river channel) so they don't interfere with gameplay
- Keep the art style simple -- silhouettes and solid shapes, not detailed illustrations

---

## Architecture (after all tasks merge)

```
base_mvp/
  index.html
  package.json
  vite.config.js
  public/
    sounds/                  -- Task 3: audio files
  src/
    main.jsx                 -- Task 1: entry point
    App.jsx                  -- Task 1: game state (touched lightly by Tasks 2-4)
    App.css                  -- Task 1: global styles
    index.css                -- Task 1: reset styles
    GameCanvas.jsx           -- Task 1: canvas + game loop
    StartScreen.jsx          -- Task 1: title screen
    GameOverScreen.jsx       -- Task 1: win/lose screen
    gameLogic.js             -- Task 1: core logic (touched by Task 5)
    renderer.js              -- Task 1: drawing (touched by Tasks 5, 6, 7)
    Scoreboard.jsx           -- Task 2
    Scoreboard.css           -- Task 2
    SoundEffects.jsx         -- Task 3
    DifficultySettings.jsx   -- Task 4
    DifficultySettings.css   -- Task 4
    PowerUps.jsx             -- Task 5
    powerUpLogic.js          -- Task 5
    VisualEffects.jsx        -- Task 6
    particles.js             -- Task 6
    Landmarks.jsx            -- Task 7
    landmarkData.js          -- Task 7
```

---

## Success Criteria

- [ ] Base MVP runs locally with `npm run dev`
- [ ] Player can steer the boat left/right and dodge icebergs
- [ ] Reaching 12 miles triggers a win screen
- [ ] Hitting an iceberg triggers a game over screen
- [ ] All 7 tasks are completed on separate branches
- [ ] Each person has opened and merged at least one PR
- [ ] All features work together after merging without breaking the app
