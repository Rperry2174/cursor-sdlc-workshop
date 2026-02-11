# Product Requirements Document (PRD)

> **Instructions:** This is your team's project specification. Fill in the sections below to define what you're building.

---

## Project Overview

**Project Name:** Cursor SDLC Board

**One-line Description:** A simple visual board that shows the six SDLC stages (Plan → Design → Develop → Test → Review → Deploy) and where Cursor helps at each step.

**Type:** Web App (React, single page)

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
- Anything with a database -- tell cursor to avoid this
- Anything requiring authentication
- Anything with multiple pages/screens
- Anything that "needs" an API

---

## Team Members & Tasks

> **Important:** Each team member MUST have their own task. Tasks should be independent features that can be built in parallel without stepping on each other's toes.

| Name  | Task               | Description                                                                 |
|-------|--------------------|-----------------------------------------------------------------------------|
| Joe   | Progress tracker   | Shows how many stages are "complete" (e.g. 2/6) with a simple progress bar  |
| David | Stage descriptions | Expandable or hover text for each stage with a short Cursor tip             |
| Sam   | Timer              | Elapsed time since "starting" the board (or a countdown)                    |
| Alex  | Theme toggle       | Switch between light and dark (or Cursor-style blue) theme                  |
| Chris | What's next        | Highlights the "current" stage and shows a short call-to-action tip         |

### Task Guidelines
- Each task should add something **visible** to the project
- Tasks should be **independent** — no dependencies on other tasks
- Think: new button, new section, new color scheme, new text, etc.
- Everyone should be able to work at the same time without conflicts

---

## Base MVP (Phase 2)

> **One person** creates the foundation that everyone else builds on.

**What the MVP includes:**
- Single-page React app (Vite + React)
- Six stage cards in a row: **Plan**, **Design**, **Develop**, **Test**, **Review**, **Deploy**
- Each card shows the stage name and a one-line description (e.g. "Define requirements, break down tasks")
- Minimal styling: readable layout, one color accent (e.g. Cursor blue)
- No backend, no auth — all state in React or localStorage if needed

**What it does NOT include:**
- Progress bar or "stages complete" counter (Joe)
- Rich/expandable descriptions or Cursor tips per stage (David)
- Timer or countdown (Sam)
- Theme/color toggle (Alex)
- "Current stage" highlight or "what's next" call-to-action (Chris)

---

## Feature Slots (Phase 3)

> These are the features team members will add. Design them to be **independent** so people can work in parallel.

### Feature 1: Progress tracker
- **Assigned to:** Joe
- **Description:** A component that displays "X/6 stages" and a progress bar. Stages can be marked complete (e.g. click to toggle) — state in React or localStorage.
- **Files to modify/create:** New component e.g. `src/components/ProgressTracker.jsx`; add it to `App.jsx`.

### Feature 2: Stage descriptions
- **Assigned to:** David
- **Description:** Each stage card shows a short Cursor tip (e.g. "Plan Mode, multi-model reasoning" for Plan). Can be expand/collapse or hover tooltip — one component or a small description module.
- **Files to modify/create:** New component e.g. `src/components/StageDescriptions.jsx` or extend the stage card component; optional `src/data/stageTips.js` for the copy.

### Feature 3: Timer
- **Assigned to:** Sam
- **Description:** Displays elapsed time since the user "started" (e.g. since page load or since clicking Start). Simple MM:SS display.
- **Files to modify/create:** New component e.g. `src/components/Timer.jsx`; add it to `App.jsx`.

### Feature 4: Theme toggle
- **Assigned to:** Alex
- **Description:** A control (button or toggle) to switch between two themes — e.g. light vs dark, or default vs Cursor-blue. Use CSS variables or a theme class on a wrapper.
- **Files to modify/create:** New component e.g. `src/components/ThemeToggle.jsx`; add theme styles (e.g. in `App.css` or a small `themes.css`); add to `App.jsx`.

### Feature 5: What's next
- **Assigned to:** Chris
- **Description:** Highlights the "current" stage (e.g. first incomplete, or user-selectable) and shows a short call-to-action (e.g. "Next: Design — sketch your components").
- **Files to modify/create:** New component e.g. `src/components/WhatsNext.jsx`; add it to `App.jsx`. May read "current stage" from shared state or props if the team adds it.

---

## Success Criteria

- [ ] MVP runs locally
- [ ] Each team member has merged at least one PR
- [ ] All features work together without breaking the app
