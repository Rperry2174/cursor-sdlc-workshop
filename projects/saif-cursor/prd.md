# Product Requirements Document (PRD)

> **Instructions:** This is your project specification. Fill in the sections below to define what you're building.

---

## Project Overview

**Project Name:** Leaf Arena Brawl

**One-line Description:** A single-page, same-keyboard two-player fighting game inspired by Tekken: pick Naruto-themed fighters, use punch, kick, and defend until one health bar hits zero.

**Type:** Web app (single HTML page, local — open in the browser)

**Note on IP:** Fighter **names** evoke the Naruto series for fun; the MVP uses **original chibi-style canvas drawings** (colors and silhouettes only — not official anime/game art, sprites, or logos).

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
- _Example features:_ timer per question, category selector, results summary screen

### Bad Project Ideas (Too Big!)
- Anything with a database — tell Cursor to avoid this
- Anything requiring authentication
- Anything with multiple pages/screens
- Anything that "needs" an API

---

## Base MVP

> Build the minimal working version of your project first.

**What the MVP includes:**
- **Two-player local** on one machine: both use the keyboard (control legend on screen).
- **Character select:** each player picks one of four Naruto-inspired fighters (names + colors only).
- **Fight stage:** side-view arena, two characters face each other, move left/right along the ground.
- **Actions (each player):** **punch** (short range), **kick** (longer range), **defend** (hold to block — incoming damage is heavily reduced).
- **Health bars** above each fighter; **first to zero HP loses**; winner message + rematch control.
- Runs locally by opening `index.html` (no build step, no server required).

**What it does NOT include (stretch goals):**
- Character-specific damage/speed tuning (planned feature)
- Sound, hitstop, or particle effects
- Rounds / best-of-three, super moves, or online play
- Joystick/gamepad support

---

## Features

> Plan out the features you want to add after the MVP is working. Each feature should be in its own component file to keep things organized.

### Feature 1: Character stats
- **Description:** Give each pick different punch/kick damage, move speed, or max HP so choices matter beyond color.
- **Files to create:** [`base_mvp/js/characterStats.js`](base_mvp/js/characterStats.js)

### Feature 2: Audio and hit feedback
- **Description:** Web Audio or short tones for punch, kick, block, and KO; optional brief hitstop on connect.
- **Files to create:** [`base_mvp/js/audio.js`](base_mvp/js/audio.js)

### Feature 3: Rounds (best of 3)
- **Description:** Reset positions and HP after a round; first to two round wins takes the match; show round counter on UI.
- **Files to create:** [`base_mvp/js/rounds.js`](base_mvp/js/rounds.js), [`base_mvp/styles/hud.css`](base_mvp/styles/hud.css)

---

## Success Criteria

- [ ] MVP runs locally
- [ ] At least one PR merged to the original repo
- [ ] Features work without breaking the base app
