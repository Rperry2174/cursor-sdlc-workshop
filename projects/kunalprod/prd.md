# Product Requirements Document (PRD)

> **Instructions:** This is your project specification. Fill in the sections below to define what you're building.

---

## Project Overview

**Project Name:** FitForge

**One-line Description:** A single-page workout plan generator that builds custom routines from a built-in exercise library based on your preferences.

**Type:** Web App (single HTML file)

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
- A single-page UI with dropdowns/buttons for selecting a muscle group (upper body, lower body, core, full body) and difficulty level (beginner, intermediate, advanced)
- A "Generate Workout" button that produces a randomized workout plan (exercise name, sets, reps) pulled from a hardcoded JavaScript exercise array
- A clean card-based display of the generated plan

**What it does NOT include (stretch goals):**
- Equipment or workout-style filters
- Saving or viewing past sessions
- Built-in workout timer
- Exercise illustrations or animations

---

## Features

> Plan out the features you want to add after the MVP is working. Each feature should be in its own component file to keep things organized.

### Feature 1: Advanced Filters
- **Description:** Adds secondary filter controls — equipment type (bodyweight, dumbbells, resistance bands, kettlebell), workout style (strength, HIIT, circuit), and target duration (10/20/30 min). The generator narrows the exercise pool using these filters before building the plan.
- **Files to create:** `filters.js` (filter UI component and logic), update `index.html` to mount the filter panel

### Feature 2: Session History
- **Description:** After completing a workout, the user can tap "Save Session." The workout plan and a timestamp are persisted to `localStorage`. A collapsible "History" panel lists past sessions with date, muscle group, and exercise count; tapping one expands the full routine.
- **Files to create:** `history.js` (save/load/render history from localStorage), update `index.html` to add the history panel

### Feature 3: Workout Timer
- **Description:** Adds a "Start Workout" button to the generated plan that launches a configurable interval timer (work duration / rest duration per exercise). Displays a large countdown, current exercise name, and progress through the routine. Audio beep on transitions.
- **Files to create:** `timer.js` (timer UI, countdown logic, audio cues), update `index.html` to integrate the timer overlay

---

## Success Criteria

- [ ] MVP runs locally
- [ ] At least one PR merged to the original repo
- [ ] Features work without breaking the base app
