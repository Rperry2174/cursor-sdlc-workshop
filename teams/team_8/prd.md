# Product Requirements Document (PRD)

> **Instructions:** This is your team's project specification. Fill in the sections below to define what you're building.

---

## Project Overview

**Project Name:** Pong

**One-line Description:** A classic two-player paddle-and-ball game played on the same keyboard.

**Type:** Web App (React, Vite)

---

## Guidelines

### Keep It Small!
- Your MVP should be buildable in **10 minutes** by one person
- Think "proof of concept" not "production ready"
- If it sounds ambitious, make it simpler
- **Use Cursor to help you plan this!** You need a project that has at least 5 features so everyone on your team can pick one and add it
- Feel free to take one of the ideas below — this exercise is about learning the git flow, collaborating as a team, and understanding where Cursor's features fit into the SDLC

### Good Project Ideas

**Pong** — classic paddle-and-ball game
- _Example features:_ scoreboard, sound effects, difficulty/speed settings

**Memory Card Match** — flip cards to find matching pairs
- _Example features:_ move counter, timer, win animation/confetti

**Drawing Pad** — simple canvas you can sketch on
- _Example features:_ color picker, brush size slider, eraser tool

**Typing Speed Game** — type a passage and measure your words per minute
- _Example features:_ WPM display, accuracy tracker, difficulty levels

**Trivia Quiz** — multiple choice questions with score tracking
- _Example features:_ timer per question, category selector, results summary screen

### Bad Project Ideas (Too Big!)
- Anything with a database -- tell cursor to avoid this
- Anything requiring authentication
- Anything with multiple pages/screens
- Anything that "needs" an API

---

## Team Members & Tasks

> **Important:** Each team member MUST have their own task. Tasks should be independent features that can be built in parallel without stepping on each other's toes.

| Name | Task | Description |
|------|------|-------------|
| _[Name 1]_ | Scoreboard | Displays scores outside the canvas, optional game history, "New Game" button |
| _[Name 2]_ | Sound Effects | Plays audio on paddle hit, wall bounce, and point scored |
| _[Name 3]_ | Settings Panel | Sliders for ball speed, paddle size, and winning score threshold |
| _[Name 4]_ | Pause / Restart Controls | Pause, resume, restart buttons; Space key to pause |
| _[Name 5]_ | Win Animation | Confetti or celebration overlay when a player wins |

### Task Guidelines
- Each task should add something **visible** to the project
- Tasks should be **independent** — no dependencies on other tasks
- Think: new button, new section, new color scheme, new text, etc.
- Everyone should be able to work at the same time without conflicts

---

## Base MVP (Phase 2)

> **One person** creates the foundation that everyone else builds on.

**What the MVP includes:**
- React app scaffolded with Vite, in `base_mvp/`
- `App.jsx` — layout shell that renders `<GameCanvas />`
- `GameCanvas.jsx` — HTML `<canvas>`, game loop via `requestAnimationFrame`, ball + two paddles, basic collision, scores drawn on canvas
- Two-player controls: W/S for left paddle, Arrow Up/Down for right paddle
- Minimal dark-background styling in `App.css`
- **Image puck** — the ball is drawn using 6 provided images (see below); the image changes to the next one whenever the puck hits either paddle (cycling 0–5)

**What it does NOT include:**
- Scoreboard component (Feature 1)
- Sound effects (Feature 2)
- Settings panel (Feature 3)
- Pause / restart controls (Feature 4)
- Win animation (Feature 5)

### Game Mechanics (MVP)

#### Canvas and Layout
- Canvas size: 800x500px, dark background (`#1a1a2e` or similar)
- Paddles: 10px wide, 80px tall, positioned 20px from each edge
- Ball/puck: 40px diameter (scaled from 512px images)
- Center dashed line for visual separation
- Scores drawn at top-center of each half

#### Ball Physics
- Ball starts at center with random direction (left or right) and slight vertical angle
- Constant velocity vector `(vx, vy)`, initial speed ~4-5px/frame
- Bounces off top/bottom walls: `vy = -vy`
- Bounces off paddles: `vx = -vx`, adjust `vy` based on where it hits the paddle (hit near edge = steeper angle)
- Speed increases slightly after each paddle hit (e.g. multiply by 1.05, cap at some max)

#### Paddle Movement
- Left paddle: W (up) / S (down)
- Right paddle: ArrowUp / ArrowDown
- Track pressed keys via `keydown`/`keyup` event listeners on `window`
- Move paddles each frame by a fixed speed (~5px/frame) while key is held
- Clamp paddle position so it stays within canvas bounds

#### Collision Detection
- Paddle hit: ball overlaps paddle rectangle (check `ballX - radius` vs paddle right edge for left paddle, `ballX + radius` vs paddle left edge for right paddle, and `ballY` within paddle top/bottom)
- Wall bounce: `ballY - radius <= 0` or `ballY + radius >= canvasHeight`
- Score: `ballX < 0` (right player scores) or `ballX > canvasWidth` (left player scores)

#### Scoring and Reset
- When ball passes a paddle, increment opponent's score
- Reset ball to center with a new random direction
- Reset puck image index to 0 on score
- No win condition in MVP (that's Feature 5)

#### Game Loop
- Use `requestAnimationFrame` inside a `useEffect`
- Each frame: move paddles, move ball, check collisions, draw everything
- Store all mutable game state in `useRef` (not `useState`) to avoid re-renders
- Only use `useState` for score (to optionally expose to parent via callback)

### Image Puck (MVP)

Use 6 provided images as the puck instead of a drawn circle. The puck image **cycles to the next one** whenever it hits either paddle.

**Source images** (copy from Cursor project assets into the repo):
- `E09BJQ7MU86-U09RNG3UWKF-...png` → `puck-1.png`
- `E09BJQ7MU86-U09EZB563A8-...png` → `puck-2.png`
- `E09BJQ7MU86-U0AC6FGJYSJ-...png` → `puck-3.png`
- `E09BJQ7MU86-U0917AD74Q3-...png` → `puck-4.png`
- `E09BJQ7MU86-U08S7NAHV4K-...png` → `puck-5.png`
- `E09BJQ7MU86-U098NUPGM1S-...png` → `puck-6.png`

**Target:** `base_mvp/public/puck/puck-1.png` through `puck-6.png`

**Implementation:**
1. Copy the 6 images into `base_mvp/public/puck/`
2. In `GameCanvas.jsx`, preload `Image` objects for all 6 in `useEffect`
3. Replace `ctx.arc()` ball drawing with `ctx.drawImage(puckImages[currentIndex], x, y, size, size)`
4. On paddle collision (left or right), set `currentIndex = (currentIndex + 1) % 6`
5. Scale images to a reasonable puck size (e.g. 40–60px diameter); images are 512x512

Use `ctx.drawImage(img, ballX - radius, ballY - radius, diameter, diameter)` so the puck is centered.

---

## Feature Slots (Phase 3)

> These are the features team members will add. Design them to be **independent** so people can work in parallel.

### Feature 1: Scoreboard
- **Assigned to:** _[Team member]_
- **Description:** Renders player scores, optional game/set history, and a "New Game" button outside the canvas. Receives score props from `App.jsx` and calls `onRestart` when the user clicks New Game.
- **Files to modify/create:** `src/components/Scoreboard.jsx`, `src/components/Scoreboard.css`; update `App.jsx` to render `<Scoreboard />` and pass props

### Feature 2: Sound Effects
- **Assigned to:** _[Team member]_
- **Description:** Plays short audio clips on paddle hit, wall bounce, and point scored. Uses `new Audio()` with local or embedded audio files. Wraps game or listens to events via callbacks from `App.jsx` / `GameCanvas`.
- **Files to modify/create:** `src/components/SoundEffects.jsx`; add `public/` or `src/assets/` audio files; update `App.jsx` to wire sound callbacks

### Feature 3: Settings Panel
- **Assigned to:** _[Team member]_
- **Description:** Sliders for ball speed, paddle size, and winning score threshold. Passes config as props to `App.jsx` / `GameCanvas` and applies on restart.
- **Files to modify/create:** `src/components/Settings.jsx`, `src/components/Settings.css`; update `App.jsx` to render `<Settings />` and pass config down

### Feature 4: Pause / Restart Controls
- **Assigned to:** _[Team member]_
- **Description:** Pause, resume, and restart buttons plus Space key to pause. Exposes `onPause`, `onResume`, `onRestart` and receives `isPaused` from `App.jsx`.
- **Files to modify/create:** `src/components/GameControls.jsx`, `src/components/GameControls.css`; update `App.jsx` to render `<GameControls />` and wire callbacks

### Feature 5: Win Animation
- **Assigned to:** _[Team member]_
- **Description:** Confetti or celebration overlay when a player reaches the winning score. Receives `winner` (e.g. "left" | "right" | null) and `onDismiss` from `App.jsx`.
- **Files to modify/create:** `src/components/WinAnimation.jsx`, `src/components/WinAnimation.css`; update `App.jsx` to render `<WinAnimation />` when there is a winner

---

## Success Criteria

- [ ] MVP runs locally
- [ ] Each team member has merged at least one PR
- [ ] All features work together without breaking the app
