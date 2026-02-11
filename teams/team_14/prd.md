# Product Requirements Document (PRD)

> **Instructions:** This is your team's project specification. Fill in the sections below to define what you're building.

---

## Project Overview

**Project Name:** Memory Card Match

**One-line Description:** A web game where players flip cards to find matching pairs.

**Type:** Web App (React, frontend-only)

---

## Guidelines

### Keep It Small!

- Your MVP should be buildable in **10 minutes** by one person
- Think "proof of concept" not "production ready"
- If it sounds ambitious, make it simpler
- **Use Cursor to help you plan this!** You need a project that has at least 5 features so everyone on your team can pick one and add it
- Feel free to take one of the ideas below — this exercise is about learning the git flow, collaborating as a team, and understanding where Cursor's features fit into the SDLC

### Good Project Ideas

**Pong** — classic paddle-and-ball game

- *Example features:* scoreboard, sound effects, difficulty/speed settings

**Memory Card Match** — flip cards to find matching pairs

- *Example features:* move counter, timer, win animation/confetti

**Drawing Pad** — simple canvas you can sketch on

- *Example features:* color picker, brush size slider, eraser tool

**Typing Speed Game** — type a passage and measure your words per minute

- *Example features:* WPM display, accuracy tracker, difficulty levels

**Trivia Quiz** — multiple choice questions with score tracking

- *Example features:* timer per question, category selector, results summary screen

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
| Maureen | Move Counter | Displays how many card flips the player has made |
| Tina | Timer | Shows elapsed time since game start |
| James | Win Animation | Confetti or celebration when all pairs are matched |
| Pranathi | Restart Button | Button to shuffle and start a new game |

### Task Guidelines

- Each task should add something **visible** to the project
- Tasks should be **independent** — no dependencies on other tasks
- Think: new button, new section, new color scheme, new text, etc.
- Everyone should be able to work at the same time without conflicts

---

## Base MVP (Phase 2)

> **One person** creates the foundation that everyone else builds on.

**What the MVP includes:**
- 4×4 grid of face-down cards (8 pairs)
- Click to flip two cards at a time
- Match logic: matching pairs stay face-up; non-matches flip back after a short delay
- Simple "You win!" message when all pairs are matched
- Basic styling (cards, grid layout)

**What it does NOT include:**
- Move counter
- Timer
- Win animation/confetti
- Restart button

---

## Feature Slots (Phase 3)

> These are the features team members will add. Design them to be **independent** so people can work in parallel.

### Feature 1: Move Counter
- **Assigned to:** Maureen
- **Description:** Display a count of how many moves (card flips) the player has made. Increment when two cards are flipped (whether they match or not).
- **Files to modify/create:** `App.jsx` or main game component, `App.css` or styles for the counter display

### Feature 2: Timer
- **Assigned to:** Tina
- **Description:** Show elapsed time in seconds (and optionally minutes) since the game started. Pause or stop when the player wins.
- **Files to modify/create:** `App.jsx` or main game component, `App.css` for timer display

### Feature 3: Win Animation
- **Assigned to:** James
- **Description:** When all pairs are matched, trigger a celebration (confetti, animation, or visual effect) instead of or in addition to the "You win!" message.
- **Files to modify/create:** `App.jsx` or main game component, possibly a confetti library (e.g., `canvas-confetti`) or custom CSS animation

### Feature 4: Restart Button
- **Assigned to:** Pranathi
- **Description:** Add a "New Game" or "Restart" button that reshuffles the cards and resets the game state so the player can play again.
- **Files to modify/create:** `App.jsx` or main game component, `App.css` for button styling

---

## Success Criteria

- MVP runs locally
- Each team member has merged at least one PR
- All features work together without breaking the app

