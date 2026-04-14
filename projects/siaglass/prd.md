# Product Requirements Document (PRD)

> **Instructions:** This is your project specification. Fill in the sections below to define what you're building.

---

## Project Overview

**Project Name:** Sky Hop

**One-line Description:** A single-page browser game where you tap or click to keep a bird aloft and slip through gaps between pipes while your score climbs.

**Type:** Web App (single HTML page + inline CSS/JS; optional split into `js/` files later)

---

## Guidelines

### Keep It Small!
- Your MVP should be buildable in **10 minutes**
- Think "proof of concept" not "production ready"
- If it sounds ambitious, make it simpler
- **Use Cursor to help you plan this!**
- This exercise is about learning the git flow and understanding where Cursor's features fit into the SDLC

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
- _Example features:_ timer per question, category selector, results summary

### Bad Project Ideas (Too Big!)
- Anything with a database — tell Cursor to avoid this
- Anything requiring authentication
- Anything with multiple pages/screens
- Anything that "needs" an API

---

## Base MVP

> Build the minimal working version of your project first.

**What the MVP includes:**
- Canvas with a bird that falls with gravity and moves upward on tap/click (or spacebar if you add it)
- Obstacles (pipes) that scroll in; passing a pair without hitting it increases the **current run score**
- Collision with pipe or ground/ceiling ends the run; show a **game over** state with **restart**
- One screen only; no routing, no backend

**What it does NOT include (stretch goals):**
- Pause / resume during a run
- User-selectable difficulty or automatic ramping difficulty
- Extra polish like medals, themes, or particle effects (those are tracked as features below)

_Note: The workshop `base_mvp/index.html` starter may already include extras such as best score (localStorage) and a sound toggle. Treat the bullet list above as the **definition of “done” for the MVP concept**; keep or refactor the starter as you prefer._

---

## Features

> Plan out the features you want to add after the MVP is working. Each feature should be in its own component file to keep things organized.

### Feature 1: Pause and resume
- **Description:** Let the player freeze the game mid-run (e.g. **P** key or an on-screen button) and resume without losing the current score or pipe layout. While paused, ignore input that would flap.
- **Files to create:** `base_mvp/js/pause.js` (logic + listeners); wire from `index.html` or move shared state into a small `game.js` if you split the file.

### Feature 2: Difficulty presets
- **Description:** Add a simple control (buttons or a `<select>`) for **Easy / Medium / Hard** that adjusts pipe gap size, scroll speed, and/or spawn rate so players can pick their challenge level before starting a run.
- **Files to create:** `base_mvp/js/difficulty.js` (constants + UI hook); optionally `base_mvp/css/difficulty.css` if you want styles separate from the main page.

### Feature 3: Progressive difficulty
- **Description:** As the **current run score** increases, gradually increase pipe speed or shrink the gap slightly (with a sensible cap) so the game gets harder without a separate menu—complements or replaces static presets if you merge the ideas later.
- **Files to create:** `base_mvp/js/progressive-speed.js` (score thresholds + applied multipliers); call from your main game loop.

---

## Success Criteria

- [ ] MVP runs locally
- [ ] At least one PR merged to the original repo
- [ ] Features work without breaking the base app
