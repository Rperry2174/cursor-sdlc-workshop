# Product Requirements Document (PRD)

> **Instructions:** This is your team's project specification. Fill in the sections below to define what you're building.

---

## Project Overview

**Project Name:** Crossword Puzzle

**One-line Description:** A browser-based crossword puzzle with a small grid, across/down clues, and letter input — buildable as a single-page React app.

**Type:** Web App (React, Vite)

---

## Guidelines

### Keep It Small!
- Your MVP should be buildable in **10 minutes** by one person
- Think "proof of concept" not "production ready"
- If it sounds ambitious, make it simpler
- **Use Cursor to help you plan this!** You need a project that has at least 5 features so everyone on your team can pick one and add it
- Feel free to take one of the ideas below — this exercise is about learning the git flow, collaborating as a team, and understanding where Cursor's features fit into the SDLC

### Good Project Ideas

**Crossword Puzzle** — grid, clues, type letters in cells
- _Example features:_ timer, check answers, clue highlighting, reveal letter/word, theme switcher

**Memory Card Match** — flip cards to find matching pairs
- _Example features:_ move counter, timer, win animation/confetti

**Drawing Pad** — simple canvas you can sketch on
- _Example features:_ color picker, brush size slider, eraser tool

**Typing Speed Game** — type a passage and measure your words per minute
- _Example features:_ WPM display, accuracy tracker, difficulty levels

**Trivia Quiz** — multiple choice questions with score tracking
- _Example features:_ timer per question, category selector, results summary screen

### Bad Project Ideas (Too Big!)
- Anything with a database -- tell cursor to avoid this
- Anything requiring authentication
- Anything with multiple pages/screens
- Anything that "needs" an API

---

## Team Members & Tasks

> **Important:** Each team member MUST have their own task. Tasks should be independent features that can be built in parallel without stepping on each other's toes.

| Name | Task | Description |
|------|------|-------------|
| Jenna | Timer | Displays elapsed time (MM:SS); optional pause button. Receives `isPaused` and `onPause` from App. |
| Max | Check / Validate | "Check" button that highlights correct letters (e.g. green) and incorrect (e.g. red). Receives grid state and exposes result or callback. |
| Ryan Tan | Clue Highlighting | When a cell is focused, highlight the current word (across or down) in the grid and highlight the corresponding clue in the clue list. |
| _[Name]_ | Reveal Help | "Reveal letter" and/or "Reveal word" buttons that fill in one letter or one word from the answer key. |
| _[Name]_ | Theme / Styling | Theme selector (e.g. Light, Dark, Newspaper) that changes colors and fonts for the grid and clues. |

### Task Guidelines
- Each task should add something **visible** to the project
- Tasks should be **independent** — no dependencies on other tasks
- Think: new button, new section, new component, new styling
- Everyone should be able to work at the same time without conflicts

---

## Base MVP (Phase 2)

> **One person** creates the foundation that everyone else builds on.

**What the MVP includes:**
- React app scaffolded with Vite, in `base_mvp/`
- `App.jsx` — layout shell that renders `<CrosswordGrid />` and `<ClueList />` (or a single `<Crossword />` that contains both)
- A **single small puzzle** hardcoded in JS: grid layout (which cells are black vs white), clue numbers, across clues, down clues, and answers
- Grid: e.g. 5×5 or 7×7; black cells for blocks, white cells for input; each white cell can hold one letter
- User can **click a cell** to focus it and **type a letter** to fill it; Backspace to clear; arrow keys or Tab to move between cells
- Clues listed in two sections: "Across" and "Down", with numbers matching the grid
- Minimal styling: readable font, clear grid lines, distinct clue areas

**What it does NOT include:**
- Timer (Feature 1)
- Check / validate answers (Feature 2)
- Clue highlighting when cell is focused (Feature 3)
- Reveal letter/word (Feature 4)
- Theme switcher (Feature 5)

### Puzzle Data (MVP)

Store one puzzle in a JS file (e.g. `src/data/puzzle.js` or inside the main component):

- **Grid definition:** 2D array or flat array where each cell is `null` (block) or `''` (empty) or a number (clue number). Example 5×5:
  - Row 0: 1, 2, block, 3, 4
  - Row 1: empty, empty, empty, empty, empty
  - etc.
- **Clues:** arrays of `{ number, clue, answer }` for across and down (e.g. `1 Across: "Toy on a string" → KITE`).
- **Answers:** same structure or derived so the app can check or reveal (only used by features, not required for MVP display).

### Grid and Input (MVP)

- Render the grid with `<input>` or `<div contentEditable>` per cell (input is simpler for one letter per cell).
- Track "current cell" (focused) and "user answers" in state (e.g. object `{ "0-0": "K", "0-1": "I" }` or 2D array).
- On keydown: if letter A–Z, put it in current cell and move to next; if Backspace, clear current and move to previous.
- Only allow one character per cell; focus moves to next logical cell (right for across, down for down — MVP can keep it simple, e.g. always move right then down).

### Layout (MVP)

- Grid on the left or top; clue list on the right or below.
- Clue list shows "Across" and "Down" with numbered clues. No need to highlight or sync with grid in MVP.

---

## Feature Slots (Phase 3)

> These are the features team members will add. Design them to be **independent** so people can work in parallel.

### Feature 1: Timer
- **Assigned to:** Jenna
- **Description:** Displays elapsed time in MM:SS format. Optional pause button that stops the timer. Receives `isPaused` and `onPause` from `App.jsx`; timer starts when the puzzle first receives focus or on a "Start" action. No need to persist time across page reload.
- **Files to modify/create:** `src/components/Timer.jsx`, `src/components/Timer.css`; update `App.jsx` to render `<Timer />` and pass props

### Feature 2: Check / Validate
- **Assigned to:** Max
- **Description:** A "Check" button that compares current grid entries to the answer key and highlights cells: correct letters (e.g. green background), incorrect (e.g. red). Can be a single "Check" that runs once, or toggle "Check mode" on/off. Component receives grid state (user answers) and answer key from `App.jsx`.
- **Files to modify/create:** `src/components/CheckAnswers.jsx`, `src/components/CheckAnswers.css`; update `App.jsx` to pass answers and render `<CheckAnswers />`

### Feature 3: Clue Highlighting
- **Assigned to:** Ryan Tan
- **Description:** When the user focuses a cell, highlight the full word that cell belongs to (across or down) in the grid, and highlight the corresponding clue in the clue list. Component receives `focusedCell`, grid definition, and clue list from `App.jsx`; can receive callbacks if clue list needs to scroll into view.
- **Files to modify/create:** `src/components/ClueHighlight.jsx` (or integrate into existing ClueList/Grid); update `App.jsx` to pass focused cell and clue data

### Feature 4: Reveal Help
- **Assigned to:** _[Team member]_
- **Description:** "Reveal letter" and/or "Reveal word" buttons. Reveal letter fills the current focused cell with the correct letter; reveal word fills the entire current word (across or down). Component receives current cell, grid state, answer key, and callback to update grid from `App.jsx`.
- **Files to modify/create:** `src/components/RevealHelp.jsx`, `src/components/RevealHelp.css`; update `App.jsx` to render `<RevealHelp />` and wire callbacks

### Feature 5: Theme / Styling
- **Assigned to:** _[Team member]_
- **Description:** Theme selector (e.g. dropdown or buttons: Light, Dark, Newspaper) that changes the look of the grid and clue area (background color, text color, font). Use CSS variables or a class on a wrapper so the theme applies across the puzzle. Receives `theme` and `onThemeChange` from `App.jsx`.
- **Files to modify/create:** `src/components/ThemeSelector.jsx`, `src/components/ThemeSelector.css`; update `App.jsx` to hold theme state and render `<ThemeSelector />`

---

## Success Criteria

- [ ] MVP runs locally
- [ ] Each team member has merged at least one PR
- [ ] All features work together without breaking the app
