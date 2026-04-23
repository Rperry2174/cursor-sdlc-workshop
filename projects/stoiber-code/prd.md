# Product Requirements Document (PRD)

> **Instructions:** This is your project specification. Fill in the sections below to define what you're building.

---

## Project Overview

**Project Name:** Pixel Pace

**One-line Description:** A single-page running log where a pixel-art runner visibly gets fitter as you record completed workouts—like a tiny RPG hero leveling up from your real miles.

**Type:** Web App (one HTML page or one SPA screen—no extra routes)

**Stack (project default):** Vanilla **HTML + CSS + JavaScript** in [`base_mvp/`](base_mvp/README.md), same as the workshop template—no React/Vite unless you add them yourself later. Feature work should use **`.js` modules** (e.g. `run-history.js`), not `.jsx`.

---

## Guidelines

### Keep It Small!
- For **Pixel Pace**, prioritize a **one-button run log** and a **visible tier change** on the character over extra fields, animation polish, or perfect pixel art.
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
- **One screen** with a pixel-art-style character (CSS grid, canvas, or a few small sprite images—keep assets simple).
- **Log a run** with one clear action: e.g. a “Finished a run” button, or optional minutes/distance in two small fields—your choice, but logging must be trivial.
- **Fitness tiers** tied to **total runs logged**. Tier names (example): Couch Potato → Warming Up → Steady Runner → Marathon Mind. The character’s look **changes** at each tier (different pose, colors, or sprite frame).
- **Tier thresholds (total runs, inclusive):**

  | Tier | Total runs | Label (example) |
  |------|------------|-------------------|
  | 0 | 0 | Couch Potato |
  | 1 | 1–4 | Warming Up |
  | 2 | 5–14 | Steady Runner |
  | 3 | 15+ | Marathon Mind |

- **MVP persistence:** `localStorage` holds **`{ totalRuns: number }` only** (not a server database). When you add **Run history** (Feature 1), extend storage with a `runs` array (e.g. `{ at: <ISO timestamp> }[]`) so each log can be listed.
- **Progress that survives refresh** via that `localStorage` payload.

**What it does NOT include (stretch goals):**
- Accounts, passwords, or “real” auth
- Backend, hosted API, or syncing to Strava/Garmin/etc.
- Maps, GPS, or phone sensors
- Multiple separate pages or a router-heavy app
- Pixel-perfect art pipeline (AI generators, huge sprite sheets)—keep it charming and small

---

## Features

> Plan out the features you want to add after the MVP is working. Each feature should be in its own component file to keep things organized.

### Feature 1: Run history strip
- **Description:** Show the last few logged runs (date + optional label) under the character so progress feels tangible, not just a counter. **Requires** persisting a `runs` array (see Base MVP); keep `totalRuns` in sync when logging.
- **Files to create:** e.g. `run-history.js` + optional `run-history.css`

### Feature 2: Streaks & weekly goal
- **Description:** Track consecutive days with at least one run and/or a simple “runs this week” bar so the character’s journey has short-term goals.
- **Files to create:** e.g. `streak-badge.js`, `weekly-goal.js` (+ CSS as needed)

### Feature 3: Character picker or seasonal skins
- **Description:** Let the user swap between 2–3 pixel runners (same tier system, different costumes) for fun without new backend work.
- **Files to create:** e.g. `character-select.js`, `characters.js` (tier → sprite metadata)

---

## Success Criteria

**Pixel Pace (app)**

- [ ] Logging a run increments `totalRuns` and the **tier** updates per the threshold table
- [ ] The **character** visibly matches the current tier
- [ ] **Refresh** does not reset progress (`localStorage`)

**Workshop**

- [ ] MVP runs locally
- [ ] At least one PR merged to the original repo
- [ ] Features work without breaking the base app
