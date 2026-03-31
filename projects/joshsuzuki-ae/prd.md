# Product Requirements Document (PRD)

## Project Overview

**Project Name:** Brick Breaker

**One-line Description:** A web-only, ultra-simple Brick Breaker clone: move a paddle to bounce a ball and clear a small grid of bricks.

**Type:** Single-page web app (vanilla HTML + CSS + JavaScript, one `<canvas>`)

---

## Guidelines

### Keep It Small!

- MVP buildable in **~10–15 minutes**; proof of concept, not production polish.
- Single level, single ball, no power-ups, no multiple lives.
- **Use Cursor to help you plan and implement.**

### Scope

**In scope**

- Open `index.html` directly (no build step).
- Keyboard: Left/Right or A/D; Space to start/restart; optional mouse to move paddle.
- Ball bounces off walls, ceiling, paddle, and bricks; bricks disappear on hit.
- Win when all bricks cleared; game over when ball falls below the paddle.
- Score = bricks destroyed; states: ready, playing, won, lost.
- ~60 FPS via `requestAnimationFrame`.

**Out of scope**

- Sound, multiple levels, power-ups, multiple balls, touch-first UX, heavy animations.

---

## Base MVP

**What the MVP includes:**

- One HTML file with inline CSS + JS, single canvas (e.g. 480×360).
- Fixed brick grid (e.g. 5×3), paddle, circular ball, constant ball speed.
- HUD: score + short state messages (press Space to start / win / game over).

**What it does NOT include (stretch goals):**

- Row-based brick colors, paddle “english” tuning, extra polish.

---

## Features (post-MVP ideas)

### Feature 1: Visual polish

- **Description:** Row brick colors, subtle paddle/ball styling.
- **Files:** same `index.html` or split `style.css` / `game.js` (Option B).

### Feature 2: Difficulty tweak

- **Description:** Slightly faster ball or narrower paddle after win (optional).
- **Files:** constants in `index.html` (or `game.js`).

### Feature 3: Mobile-friendly (stretch)

- **Description:** Touch drag for paddle — only if scope allows.
- **Files:** event listeners in main game file.

---

## Success Criteria

- [ ] MVP runs by opening `base_mvp/index.html` in a browser (once implemented).
- [ ] At least one PR merged to the workshop repo (participant folder + PRD).
- [ ] Win/lose and score behave as specified above.
