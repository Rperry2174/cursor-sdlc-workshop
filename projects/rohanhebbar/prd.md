# Product Requirements Document (PRD)

> **Instructions:** This is your project specification. Fill in the sections below to define what you're building.

---

## Project Overview

**Project Name:** Game Zone

**One-line Description:** A lightweight arcade hub with classic browser games in one place.

**Type:** Single-page Web App (React + Vite)

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
- A game launcher hub/menu that lists available games and lets you click to play one
- **Minesweeper** as the first playable game
  - Configurable grid (9x9 with 10 mines)
  - Left-click to reveal a cell, right-click to flag/unflag
  - Auto-reveal of empty neighbors (flood fill)
  - Win/lose detection with visual feedback
- Single-page layout — no router, just conditional rendering to swap between the hub and the active game
- No database, no auth, no API calls

**What it does NOT include (stretch goals):**
- Tetris (Feature 1)
- Solitaire (Feature 2)
- Persistent score tracking across sessions (Feature 3)
- Sound effects, themes, or animations

---

## Features

> Plan out the features you want to add after the MVP is working. Each feature should be in its own component file to keep things organized.

### Feature 1: Tetris
- **Description:** Classic falling-block game. Tetrominoes drop from the top; the player can move, rotate, and hard-drop pieces. Completed rows are cleared and the score increases. Game ends when blocks stack to the top.
- **Files to create:** `src/components/Tetris.jsx`, `src/components/Tetris.css`

### Feature 2: Solitaire (Klondike)
- **Description:** Standard draw-one Klondike solitaire. Seven tableau columns, a stock/waste pile, and four foundation piles. Click to move cards between piles following rank/suit rules. Win by moving all cards to the foundations.
- **Files to create:** `src/components/Solitaire.jsx`, `src/components/Solitaire.css`

### Feature 3: Score Tracker
- **Description:** Lightweight leaderboard using localStorage to persist best scores per game across sessions. Shows a table of top scores accessible from the hub menu.
- **Files to create:** `src/components/ScoreTracker.jsx`, `src/components/ScoreTracker.css`

---

## Success Criteria

- [ ] MVP runs locally (`npm run dev` serves the hub + Minesweeper)
- [ ] Minesweeper is playable: reveal, flag, win, and lose all work
- [ ] At least one PR merged to the original repo
- [ ] Each feature (Tetris, Solitaire, Score Tracker) is added via its own PR
- [ ] Features work without breaking the base app or other games
