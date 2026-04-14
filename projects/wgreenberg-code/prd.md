# Product Requirements Document (PRD)

> **Instructions:** This is your project specification. Fill in the sections below to define what you're building.

---

## Project Overview

**Project Name:** Trivia Quiz

**One-line Description:** A multiple-choice trivia game that presents questions, tracks your score, and shows results at the end.

**Type:** Single-page Web App (HTML/CSS/JS)

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
- A hardcoded set of ~5 trivia questions with 4 answer choices each
- Click an answer to select it, with immediate right/wrong feedback (color highlight)
- Running score display ("3 / 5 correct")
- A results screen at the end showing final score
- Simple, clean UI — no frameworks, just vanilla HTML/CSS/JS in a single `index.html`

**What it does NOT include (stretch goals):**
- Timer per question
- Category selection
- Detailed per-question results breakdown

---

## Features

> Plan out the features you want to add after the MVP is working. Each feature should be in its own component file to keep things organized.

### Feature 1: Timer per Question
- **Description:** Adds a countdown timer (e.g. 15 seconds) for each question. If time runs out, the question is marked wrong and auto-advances to the next one.
- **Files to create:** `base_mvp/timer.js`, updates to `index.html`

### Feature 2: Category Selector
- **Description:** A start screen where you pick a trivia category (e.g. Science, History, Sports). Each category has its own question set.
- **Files to create:** `base_mvp/categories.js`, updates to `index.html`

### Feature 3: Results Summary Screen
- **Description:** An enhanced end screen with a per-question breakdown showing which you got right/wrong and the correct answers. Includes a "Play Again" button to restart.
- **Files to create:** `base_mvp/results.js`, updates to `index.html`

---

## Success Criteria

- [ ] MVP runs locally
- [ ] At least one PR merged to the original repo
- [ ] Features work without breaking the base app
