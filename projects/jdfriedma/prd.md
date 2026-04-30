# Product Requirements Document (PRD)

> **Instructions:** This is your project specification. Fill in the sections below to define what you're building.

---

## Project Overview

**Project Name:** Marvis Bacon Judges Typing

**One-line Description:** A single-page typing practice app where you retype a short passage and get judged on speed and accuracy — Marvis Bacon is watching.

**Type:** Web App (React + Vite, single screen)

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
- A **single hardcoded passage** (string in a `.js` or `.json` file — no fetch, no database).
- A **typing area** (controlled input) where the user types forward through the passage. Compare input to the target **character-by-character** for the current position and show **inline feedback** (e.g. correct characters vs mistakes) — keep the rules simple (linear typing only, no click-to-cursor for MVP if that’s easier).
- **Detect completion** when the typed text matches the full passage and show a simple **“Finished!”** message (text is enough).
- One React `App` shell plus basic state (`useState` / maybe `useEffect` for timing later) — **no routing, no backend.**

**What it does NOT include (stretch goals):**
- WPM, percentage accuracy, multiple difficulty passages, countdown timers, leaderboards, or sound — keep **timing out of MVP** so Feature 1 can own “first key → done” duration later.

---

## Features

> Plan out the features you want to add after the MVP is working. Each feature should be in its own component file to keep things organized.

### Feature 1: WPM display
- **Description:** After the user finishes (or live while typing), show **words per minute** using elapsed time from **first keystroke** to completion. Use hardcoded assumptions: **5 characters = 1 word** (standard for typing tests) unless you document a different rule. Reset timing when starting a new run.
- **Files to create:** `src/components/WpmDisplay.jsx` (receives duration + typed length or final stats via props from `App.jsx`)
- **Status:** Implemented: gross WPM with live estimate while typing and final WPM at completion (`CHARS_PER_WORD = 5` in `src/data/passages.js`).

### Feature 2: Accuracy tracker
- **Description:** Show **accuracy** as a percentage: correct keystrokes vs total keystrokes attempted (define clearly — e.g. every key that advances or attempts the next expected character counts). Display on finish or update live; avoid needing a server.
- **Files to create:** `src/components/AccuracyTracker.jsx`
- **Status:** Implemented: percentage = correct forward keystrokes ÷ total forward keystrokes; backspaces do not add to the denominator.

### Feature 3: Difficulty levels
- **Description:** Let the user pick a **difficulty** that only changes which **hardcoded passage** loads (e.g. short / medium / long strings in an array — still no API). Reset progress when the passage changes.
- **Files to create:** `src/components/DifficultyPicker.jsx` (and keep passages in e.g. `src/data/passages.js`)
- **Status:** Implemented in `base_mvp` with Easy / Medium / Hard tiers and Marvis-themed passages in `src/data/passages.js`.

---

## Success Criteria

- [ ] MVP runs locally
- [ ] At least one PR merged to the original repo
- [ ] Features work without breaking the base app
