# Product Requirements Document (PRD)

> **Instructions:** This is your team's project specification. Fill in the sections below to define what you're building.

---

## Project Overview

**Project Name:** Speed Typing Game

**One-line Description:** Type a passage as fast as you can and see how you measure up.

**Type:** Web App (React)

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

| Name | Task | Description |
|------|------|-------------|
| Alex | WPM Display | Show real-time words per minute as the user types |
| Sasha | Accuracy Tracker | Show % of characters typed correctly vs incorrectly |
| Adam | Difficulty Levels | Add easy/medium/hard passages (different lengths) with a selector |
| Sabhia | Timer Display | Show elapsed time (seconds) while typing |
| Alison | Results Summary Screen | Show final WPM, accuracy, and time when the passage is complete |

### Task Guidelines
- Each task should add something **visible** to the project
- Tasks should be **independent** — no dependencies on other tasks
- Think: new button, new section, new color scheme, new text, etc.
- Everyone should be able to work at the same time without conflicts

---

## Base MVP (Phase 2)

> **One person** creates the foundation that everyone else builds on.

**What the MVP includes:**
- A fixed passage of text to type (e.g., "The quick brown fox jumps over the lazy dog.")
- A text input area where the user types
- Visual feedback: correct characters in one color, incorrect in another (or highlight errors)
- Detection of when the passage is completed

**What it does NOT include:**
- WPM display
- Accuracy percentage
- Difficulty selector or alternate passages
- Visible timer
- Results/summary screen after completion

---

## Feature Slots (Phase 3)

> These are the features team members will add. Design them to be **independent** so people can work in parallel.

### Feature 1: WPM Display
- **Assigned to:** Alex
- **Description:** Display real-time words per minute as the user types. Update continuously based on words completed and time elapsed.
- **Files to modify/create:** Main game component (e.g., `App.tsx` or `TypingGame.tsx`), add a WPM readout element

### Feature 2: Accuracy Tracker
- **Assigned to:** Sasha
- **Description:** Show the percentage of characters typed correctly vs incorrectly. Update as the user types.
- **Files to modify/create:** Main game component, add an accuracy percentage element

### Feature 3: Difficulty Levels
- **Assigned to:** Adam
- **Description:** Add a selector (e.g., dropdown or buttons) for easy/medium/hard. Each level uses a different passage length. Easy = short (1–2 sentences), medium = paragraph, hard = longer passage.
- **Files to modify/create:** Add passage data (e.g., `passages.ts` or inline), add selector UI to the game component

### Feature 4: Timer Display
- **Assigned to:** Sabhia
- **Description:** Show elapsed time in seconds (and optionally minutes) from when the user starts typing until they finish.
- **Files to modify/create:** Main game component, add a timer element that starts on first keystroke

### Feature 5: Results Summary Screen
- **Assigned to:** Alison
- **Description:** When the user completes the passage, show a summary screen with final WPM, accuracy, and total time. Include a "Try Again" button to reset and start over.
- **Files to modify/create:** Create a `ResultsScreen.tsx` component (or similar), integrate into main game component to show on completion

---

## Success Criteria

- [ ] MVP runs locally
- [ ] Each team member has merged at least one PR
- [ ] All features work together without breaking the app
