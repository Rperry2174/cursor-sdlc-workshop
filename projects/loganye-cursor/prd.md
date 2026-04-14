# Product Requirements Document (PRD)

> **Instructions:** This is your project specification. Fill in the sections below to define what you're building.

---

## Project Overview

**Project Name:** MatchPairs — Memory Card Game

**One-line Description:** A browser-based memory game where you flip two cards at a time to find matching pairs until the board is cleared.

**Type:** Web App (single HTML page + JavaScript)

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
- One screen with a **4×4 grid** of face-down cards (8 matching pairs), using simple shapes, letters, or emoji as card faces.
- Click/tap to flip **up to two** cards; if they match, they stay face-up; if not, they flip back after a short delay.
- When all pairs are matched, show a simple **“You win”** message (text is enough).
- All logic runs in the browser with **no backend**, **no login**, and **no extra pages**.

**What it does NOT include (stretch goals):**
- Move counter, countdown timer, sound, themes, difficulty levels, animations beyond basic flip, persistence (localStorage), or a “new game” button with reshuffle (those move into Features below).

---

## Features

> Plan out the features you want to add after the MVP is working. Each feature should be in its own component file to keep things organized.

### Feature 1: Move counter
- **Description:** Track how many pair attempts the player has made (each time two cards are flipped counts as one move) and show the count on screen.
- **Files to create:** `base_mvp/js/move-counter.js` — owns counter state updates and renders the label (or exports a small API the main game calls).

### Feature 2: Timer
- **Description:** Show elapsed time from the first flip until the win state, updating every second (or on a `requestAnimationFrame` loop); stop the timer when the game is won.
- **Files to create:** `base_mvp/js/timer.js` — start/stop/reset behavior and a readable `MM:SS` display.

### Feature 3: Win celebration overlay
- **Description:** When the last pair is matched, show a lightweight overlay (e.g. semi-transparent backdrop + panel) with final **moves** and **time**, plus a **“Play again”** button that reshuffles and resets the board, counter, and timer.
- **Files to create:** `base_mvp/js/win-overlay.js` — builds the overlay DOM, wires the button, and calls back into the main game to reset.

---

## Success Criteria

- [ ] MVP runs locally
- [ ] At least one PR merged to the original repo
- [ ] Features work without breaking the base app
