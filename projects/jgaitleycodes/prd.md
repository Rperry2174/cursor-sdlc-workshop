# Product Requirements Document (PRD)

> **Instructions:** This is your project specification. Fill in the sections below to define what you're building.

---

## Project Overview

**Project Name:** TypeRush

**One-line Description:** A browser typing game that shows a passage, scores you on speed and accuracy, and saves your best result.

**Type:** Web App (single-page, vanilla HTML/CSS/JS — no build step, no backend)

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
- A single page (`base_mvp/index.html`) with a fixed practice passage hardcoded in the HTML
- A "Start" button that begins the round and starts a timer
- An `<input>` (or contenteditable area) where the user types the passage
- Live highlighting: characters already typed correctly turn green, mistyped ones turn red
- When the user finishes the passage:
  - Stop the timer
  - Compute and display **WPM** (words per minute) using the standard formula `(correct chars / 5) / minutes`
  - Show a "Try again" button that resets state

**What it does NOT include (stretch goals):**
- Accuracy percentage display (Feature 1)
- Multiple difficulty levels / passage selection (Feature 2)
- Persistent best score across page reloads (Feature 3)
- User accounts, leaderboards, multiple pages, any backend or database

---

## Features

> Plan out the features you want to add after the MVP is working. Each feature should be in its own component file to keep things organized.

### Feature 1: Accuracy Tracker
- **Description:** Track every keystroke and display a live accuracy percentage during the round, plus a final accuracy score at the end. Accuracy = `correct keystrokes / total keystrokes`. Backspaces count toward total (so users can't game it by deleting mistakes).
- **Files to create:**
  - `base_mvp/js/accuracy.js` — exports `createAccuracyTracker()` returning `{ recordKey(expected, typed), getAccuracy(), reset() }`
  - Update `base_mvp/index.html` — add an `<span id="accuracy">` next to the WPM display and import the script

### Feature 2: Difficulty Levels
- **Description:** Add an Easy / Medium / Hard selector before the round starts. Easy = short, common-word passage (~15 words). Medium = ~30 words with punctuation. Hard = ~50 words with mixed case, numbers, and symbols. Selection determines which passage gets loaded into the typing area.
- **Files to create:**
  - `base_mvp/js/passages.js` — exports `getPassage(difficulty)` and an inline data object with three passages
  - `base_mvp/js/difficulty.js` — wires up the difficulty `<select>` element to `passages.js` and to the round-start logic
  - Update `base_mvp/index.html` — add the difficulty `<select>` and import the new scripts

### Feature 3: Best Score Persistence
- **Description:** Save the player's best WPM (and accuracy from Feature 1) to `localStorage`, scoped per difficulty. Display the current best next to the active round so the player has a number to beat. Include a small "Reset best" button.
- **Files to create:**
  - `base_mvp/js/scoreboard.js` — exports `getBest(difficulty)`, `saveIfBest(difficulty, wpm, accuracy)`, `resetBest(difficulty)` using the `localStorage` key `typerush:best:<difficulty>`
  - Update `base_mvp/index.html` — add a "Best: 0 WPM" badge and "Reset best" button, wire them up after each round ends

---

## Success Criteria

- [ ] MVP runs locally
- [ ] At least one PR merged to the original repo
- [ ] Features work without breaking the base app
