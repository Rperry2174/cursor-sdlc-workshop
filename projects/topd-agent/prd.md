# Product Requirements Document (PRD)

---

## Project Overview

**Project Name:** CC Sweeper

**One-line Description:** Classic Minesweeper, but the mines are Anthropic.

**Type:** Web App (single-page React app)

---

## Base MVP

> The minimal working version — a playable Minesweeper grid.

**What the MVP includes:**
- A fixed-size grid (9×9) with 10 hidden mines
- Left-click to reveal a cell
- Revealed cells show the number of adjacent mines (1–8), or blank if zero neighbors
- Blank cells auto-expand to reveal all connected empty cells (flood fill)
- Hitting a mine ends the game and reveals all mines as the Anthropic logo (a simple ✦ sparkle or inline SVG)
- A "New Game" button to reset the board
- Clean, modern styling with a grid layout

**What it does NOT include (stretch goals):**
- Right-click flagging
- Timer / stopwatch
- Win detection with celebration animation

---

## Features

> Each feature is a self-contained component added after the MVP works.

### Feature 1: Flagging
- **Description:** Right-click (or long-press) a cell to place/remove a flag. Display a flag counter showing remaining mines minus placed flags. Flagged cells cannot be accidentally revealed by left-click.
- **Files to create:** `src/components/Flag.jsx`, update `src/components/Cell.jsx`

### Feature 2: Timer
- **Description:** A stopwatch that starts on the first cell click and stops when the game ends (win or loss). Displays elapsed time in seconds at the top of the board next to the mine counter.
- **Files to create:** `src/components/Timer.jsx`

### Feature 3: Win Detection & Celebration
- **Description:** Detect when all non-mine cells are revealed (player wins). Show a confetti animation and a "You won!" message with the final time. All mines are revealed with the Anthropic logo on win as well.
- **Files to create:** `src/components/Celebration.jsx`

---

## Success Criteria

- [ ] MVP runs locally
- [ ] At least one PR merged to the original repo
- [ ] Features work without breaking the base app
