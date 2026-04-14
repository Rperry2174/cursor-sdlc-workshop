# Product Requirements Document (PRD)

## Project Overview

**Project Name:** Breakout

**One-line Description:** A classic arcade brick-breaker game where the player bounces a ball off a paddle to destroy a grid of bricks.

**Type:** Web App (single-page HTML/CSS/JS Canvas game)

---

## Base MVP

> The minimal playable version of Breakout — a ball, a paddle, and bricks.

**What the MVP includes:**
- A paddle at the bottom of the screen controlled by mouse movement (and left/right arrow keys)
- A ball that launches upward and bounces off walls, the paddle, and bricks
- A grid of bricks (e.g. 8 columns x 5 rows) that disappear when hit by the ball
- Basic collision detection (ball vs. walls, paddle, and bricks)
- A score counter that increments each time a brick is destroyed
- A "Game Over" state when the ball falls below the paddle
- A "You Win" state when all bricks are cleared
- A start/restart prompt so the player can replay

**What it does NOT include (stretch goals):**
- Sound effects
- Multiple lives
- Power-ups
- Multiple levels with increasing difficulty
- High-score persistence

---

## Features

> Post-MVP features to add once the base game is working. Each feature lives in its own JS file to keep things modular.

### Feature 1: Sound Effects
- **Description:** Add retro arcade sounds for paddle hits, brick breaks, wall bounces, game over, and win. Use the Web Audio API (no external files needed).
- **Files to create:** `base_mvp/sounds.js`

### Feature 2: Multi-Life System
- **Description:** Give the player 3 lives instead of instant game over. Display remaining lives on screen. Losing a life resets the ball and paddle position but keeps the current brick layout and score. Game over triggers when all lives are lost.
- **Files to create:** `base_mvp/lives.js`

### Feature 3: Power-Ups
- **Description:** Certain bricks drop a power-up when destroyed (roughly 1 in 5 chance). Power-ups fall toward the paddle and activate on catch. Types: wide paddle (temporarily doubles paddle width), multi-ball (spawns a second ball), slow ball (reduces ball speed for a few seconds).
- **Files to create:** `base_mvp/powerups.js`

---

## Technical Constraints

- **Single `index.html` file for the MVP** — all HTML, CSS, and JS in one file for simplicity
- **No frameworks or build tools** — vanilla JS with the Canvas API
- **No external assets** — all visuals drawn programmatically, all sounds via Web Audio API
- **No database, no API, no auth** — everything runs client-side in the browser

---

## Success Criteria

- [ ] MVP runs locally (open `index.html` or serve via `python3 -m http.server`)
- [ ] Ball bounces correctly off walls, paddle, and bricks
- [ ] Bricks disappear on hit and score increments
- [ ] Game ends on ball loss (Game Over) or all bricks cleared (You Win)
- [ ] At least one PR merged to the original repo
- [ ] Post-MVP features work without breaking the base game
