# Product Requirements Document (PRD)

---

## Project Overview

**Project Name:** Rush Hour Puzzle

**One-line Description:** A browser-based sliding block puzzle where you free the red car by moving blocking vehicles on a 6×6 grid.

**Type:** Web App (single HTML page with CSS + JS)

---

## Guidelines

### Keep It Small!
- MVP should be buildable in **10 minutes**
- Single HTML file, no build tools, no backend
- Puzzle levels are hardcoded as JSON data
- All 50 levels can be added as a feature after the core engine works

---

## Base MVP

> Build the minimal working version first.

**What the MVP includes:**
- A 6×6 grid rendered on a canvas or with DOM elements
- Vehicles represented as colored blocks (2-wide or 3-wide, horizontal or vertical)
- Click-and-drag (or arrow-key) movement constrained to each vehicle's axis
- The red car (always horizontal, row 3) must reach the right edge to win
- 5 hardcoded starter puzzles (easy → medium)
- "You win!" message when the red car exits
- A "Next Level" button to advance

**What it does NOT include (stretch goals):**
- Full 50-level pack
- Move counter or star rating
- Timer
- Undo/reset button
- Animations or sound effects
- Level select screen

---

## Features

> Plan out the features to add after the MVP is working. Each feature should be in its own component file to keep things organized.

### Feature 1: Level Pack (50 Levels)
- **Description:** Expand from 5 to 50 puzzles with a progressive difficulty curve (easy → expert). Add a level-select grid screen where completed levels show a checkmark and the current level is highlighted. Persist progress in localStorage.
- **Files to create:** `levels.js` (puzzle data), level-select UI in main file

### Feature 2: Move Counter & Star Rating
- **Description:** Track the number of moves per level. Award 3 stars if solved within the "par" move count, 2 stars within 1.5× par, 1 star otherwise. Display stars on the win screen and on the level-select grid.
- **Files to create:** Scoring logic and star display in main file

### Feature 3: Undo & Reset
- **Description:** An undo button that steps back one move at a time (maintain a move history stack). A reset button that restores the puzzle to its initial state. Both buttons sit below the grid.
- **Files to create:** Move history logic in main file

---

## Success Criteria

- [ ] MVP runs locally (open index.html in browser)
- [ ] At least one PR merged to the original repo
- [ ] Red car can be dragged and exits the grid to win
- [ ] 5 starter puzzles are playable in sequence
- [ ] Features work without breaking the base app
