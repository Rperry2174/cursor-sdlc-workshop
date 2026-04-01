# Product Requirements Document (PRD)

> **Instructions:** This is your project specification. Fill in the sections below to define what you're building.

---

## Project Overview

**Project Name:** Mini Sudoku Web App

**One-line Description:** A browser-based 9×9 Sudoku puzzle where players fill empty cells and the app enforces standard Sudoku validity so the grid never contains illegal duplicates.

**Type:** Web App (single HTML page + CSS + JavaScript, no backend)

---

## Guidelines

### Keep It Small!
- Your MVP should be buildable in **10 minutes**
- Think "proof of concept" not "production ready"
- If it sounds ambitious, make it simpler
- **Use Cursor to help you plan this!**
- This exercise is about learning the git flow and understanding where Cursor's features fit into the SDLC

### Scope for this project
Sudoku “valid” means **standard Sudoku rules**: for every digit the player places, it must not repeat in the same **row**, **column**, or **3×3 box**. The MVP uses **one fixed puzzle** with given cells locked; optional UX: warn on conflict, clear invalid entry, or highlight conflicting cells—pick one simple approach for speed.

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
- One **static page** served locally (`base_mvp/index.html` plus CSS/JS or small module structure).
- A **9×9 grid** displaying a **single pre-loaded puzzle** (some cells prefilled, “givens” are read-only / not editable).
- User can **select a blank cell** and enter digits **1–9** (keyboard and/or on-screen buttons).
- **Validity:** After each move (or on submit, but real-time is nicer), the app checks row, column, and 3×3 box. If the digit breaks rules, show clear feedback (e.g., red highlight + short message) and **do not treat the puzzle as solved** until every cell is filled and there are zero conflicts.
- **Win / complete:** When all **non-given** cells are filled and the board respects Sudoku rules, show a simple “Solved!” message (could be optional for the tiniest MVP, but recommended).

**What it does NOT include (stretch goals):**
- Puzzle generator, multiple puzzles, or difficulty levels (hardcode one valid puzzle + solution for checking if needed)
- Undo stack, pencil marks / notes, timers, leaderboards
- User accounts, saving progress, or any server/API/database
- Hint system or “auto-solve”

---

## Features

> Plan out the features you want to add after the MVP is working. Each feature should be in its own component file to keep things organized.

### Feature 1: Puzzle picker (still static)
- **Description:** Offer 2–3 different hardcoded puzzles in a dropdown or buttons; swapping puzzles resets the grid.
- **Files to create:** e.g. `base_mvp/puzzles.js` (exports puzzle strings or 2D arrays), wire-up in main JS.

### Feature 2: Timer and best time (local only)
- **Description:** Start timer on first edit; optional `localStorage` to remember best time per puzzle id (still no server).
- **Files to create:** e.g. `base_mvp/timer.js`

### Feature 3: Better UX — notes mode
- **Description:** Toggle “notes” to fill small candidate numbers in a cell without committing a final digit.
- **Files to create:** e.g. `base_mvp/notes.js` or extend grid component

---

## Success Criteria

- [ ] MVP runs locally
- [ ] At least one PR merged to the original repo
- [ ] Features work without breaking the base app

## Technical notes (for implementers)

- **Validity check:** For cell `(r, c)` with digit `d`, verify no other cell in row `r`, column `c`, or the same 3×3 block contains `d` (excluding empty cells and optionally excluding the cell itself when re-validating).
- **Given cells:** Store a parallel “fixed” mask or separate initial grid so givens cannot be overwritten (or are restored on invalid edit—simpler to lock them).
- **Solvability:** The starter puzzle should be a known-valid partial board; optionally store the full solution to verify “solved” matches the intended answer, or rely on “full + no conflicts” only (less strict but acceptable for a tiny MVP if the seed is valid).
