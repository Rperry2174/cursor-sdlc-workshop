# Product Requirements Document (PRD)

> **Instructions:** This is your project specification. Fill in the sections below to define what you're building.

---

## Project Overview

**Project Name:** Flappy Bird

**One-line Description:** A browser-based Flappy Bird clone where you tap space to fly a bird through gaps in pipes.

**Type:** Web App (HTML Canvas game)

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
- A bird (simple shape) that falls with gravity
- Pressing the space bar makes the bird jump upward
- Pipes scroll from right to left at varying heights with a gap for the bird to pass through
- Collision detection: if the bird hits a pipe or the ground, the game stops and restarts
- A single HTML file with an inline canvas-based game loop

**What it does NOT include (stretch goals):**
- Score tracking
- Sound effects
- Difficulty progression (speed increase over time)
- Start screen or game-over screen with animations
- High score persistence

---

## Features

> Plan out the features you want to add after the MVP is working. Each feature should be in its own component file to keep things organized.

### Feature 1: Score Counter
- **Description:** Display the current score on screen, incrementing by 1 each time the bird successfully passes through a pair of pipes.
- **Files to create:** `src/ScoreCounter.js`

### Feature 2: Game Over Screen
- **Description:** When the bird collides with a pipe or the ground, show a "Game Over" overlay with the final score and a "Play Again" button instead of auto-restarting.
- **Files to create:** `src/GameOverScreen.js`

### Feature 3: Difficulty Progression
- **Description:** Gradually increase pipe scroll speed and narrow the gap between pipes as the score increases, making the game harder over time.
- **Files to create:** `src/DifficultyManager.js`

---

## Success Criteria

- [ ] MVP runs locally
- [ ] At least one PR merged to the original repo
- [ ] Features work without breaking the base app
