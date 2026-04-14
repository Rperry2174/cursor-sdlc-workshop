# Product Requirements Document (PRD)

> **Instructions:** This is your project specification. Fill in the sections below to define what you're building.

---

## Project Overview

**Project Name:** Sky Hop Mini

**One-line Description:** A browser tap-to-fly game where you steer a bird through gaps between pipes, racking up points with each successful pass.

**Type:** Web App (single HTML page, canvas + vanilla JavaScript)

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
- One canvas showing sky, ground, scrolling pipes, and a controllable bird
- **Input:** tap/click or Space/Up to flap; start from a ready screen; retry after game over
- **Core loop:** gravity, collision with pipes and ground, score when passing a pipe gap
- **Feedback:** current score while playing, final score and best score (persisted in `localStorage`), basic sound via Web Audio (with mute control)
- **Run locally:** open `base_mvp/index.html` in a browser (no build step)

**What it does NOT include (stretch goals):**
- Difficulty presets, pause, or visual themes (planned as Features 1–3 below)
- Leaderboards, accounts, or networked high scores
- Separate routes or a backend

---

## Features

> Plan out the features you want to add after the MVP is working. Each feature should be in its own component file to keep things organized.

### Feature 1: Difficulty presets
- **Description:** Let the player pick Easy / Normal / Hard before starting (e.g. slower or faster pipes, wider or narrower gap). Constants like pipe speed and gap size change when a new round begins.
- **Files to create:** `base_mvp/feature-difficulty.js` (preset values + UI wiring), small markup block in `index.html` for the selector

### Feature 2: Pause and resume
- **Description:** During play, pressing **P** (or a visible Pause button) freezes the game loop; another press resumes. Overlays and inputs should not double-trigger flaps while paused.
- **Files to create:** `base_mvp/feature-pause.js` (pause state + keyboard/button handlers)

### Feature 3: Day / night theme
- **Description:** Toggle a second color palette (e.g. dusk or night sky, adjusted ground and pipe colors) for readability and variety, without changing game mechanics.
- **Files to create:** `base_mvp/feature-theme.js` (theme flag + apply colors to existing draw helpers), optional CSS variables in `index.html` if helpful

---

## Success Criteria

- [ ] MVP runs locally
- [ ] At least one PR merged to the original repo
- [ ] Features work without breaking the base app
