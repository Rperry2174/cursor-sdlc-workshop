# Product Requirements Document (PRD)

> **Instructions:** This is your team's project specification. Fill in the sections below to define what you're building.

---

## Project Overview

**Project Name:** Snake

**One-line Description:** A browser-based Snake game where you control a growing snake, eat food, and try to beat your high score.

**Type:** Web App

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
| Simon | Snake movement | Arrow-key controls, snake body grows and follows head, wall/self collision ends game |
| Clint | Food | Spawn food at random grid cell; when snake eats it, body grows and score increases |
| Alex | Speed ramp | Game speed increases as score goes up (e.g. every N points or apples) |
| Ria | Game modes | E.g. Classic vs. No walls (wrap) or different grid sizes; mode selector before/at start |
| Simon | High scores | Show top N scores (e.g. localStorage); display on game over and optional “High scores” screen |

### Task Guidelines
- Each task should add something **visible** to the project
- Tasks should be **independent** — no dependencies on other tasks
- Think: new button, new section, new color scheme, new text, etc.
- Everyone should be able to work at the same time without conflicts

---

## Base MVP (Phase 2)

> **One person** creates the foundation that everyone else builds on.

**What the MVP includes:**
- Playable grid (e.g. canvas or div-based), one snake segment that moves with arrow keys, basic collision (walls or wrap), one food spawn that the snake can “eat” to grow by one segment, and a simple score display (increment on eat). Game over on wall hit (or wrap) and restart. No persistence, no speed change, single mode only.

**What it does NOT include:**
- Speed ramp; multiple game modes; persistent high scores / leaderboard; polish (sounds, animations).

---

## Feature Slots (Phase 3)

> These are the features team members will add. Design them to be **independent** so people can work in parallel.

### Feature 1: Snake movement
- **Assigned to:** Simon
- **Description:** Snake moves continuously in the current direction; arrow keys change direction (up/down/left/right). Snake body is a list of segments that follow the head; eating food adds a segment. Collision with wall (or self, if desired in MVP) ends the game.
- **Files to modify/create:** Core game loop and input handling (e.g. `App.jsx` or `Game.jsx`, or equivalent in vanilla JS); state for snake segments and direction. Possibly a small `useGameLoop` or `gameLoop.js` if using React.

### Feature 2: Food
- **Assigned to:** Clint
- **Description:** Food appears on a random empty grid cell. When the snake’s head enters that cell, the food is consumed, the snake grows by one segment, score increments, and new food spawns. Food must not spawn on the snake.
- **Files to modify/create:** Food spawn logic (e.g. `getRandomEmptyCell()` or similar), render food on grid, and “eat” detection in the main game loop (same file as movement, but clearly separated so Clint can own the food logic).

### Feature 3: Speed ramp
- **Assigned to:** Alex
- **Description:** As the player scores more (e.g. every 5 or 10 points), increase the game speed (shorten the tick interval). Speed should be configurable (e.g. a multiplier or step) so it doesn’t become unplayable.
- **Files to modify/create:** Game loop timing (e.g. `setInterval`/`requestAnimationFrame` and a `speed` or `tickMs` state). Optionally a small `speedRamp.js` or constants file for the ramp steps.

### Feature 4: Game modes
- **Assigned to:** Ria
- **Description:** At least two playable modes, e.g. “Classic” (die on wall) vs “No walls” (wrap around). Optional: different grid sizes. Player selects mode before starting; the chosen mode affects only the rules (wall vs wrap, maybe grid size).
- **Files to modify/create:** Mode selector UI (e.g. start screen or dropdown), a `mode` or `gameMode` setting (e.g. `'classic' | 'wrap'`), and use it in collision/boundary logic. Shared with movement code but Ria owns the mode value and selector.

### Feature 5: High scores
- **Assigned to:** Simon
- **Description:** Persist top N high scores (e.g. 5 or 10) in `localStorage`. On game over, show “New high score?” and update the list if applicable. Optional: simple “High scores” view (modal or section) showing the list.
- **Files to modify/create:** A small `highScores.js` (or similar) for read/write/update of scores; game over screen or overlay that shows current score and top scores; optionally a “View high scores” button that displays the list.

---

## Success Criteria

- [ ] MVP runs locally
- [ ] Each team member has merged at least one PR
- [ ] All features work together without breaking the app
