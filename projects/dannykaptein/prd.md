# Product Requirements Document (PRD)

> **Instructions:** This is your project specification. Fill in the sections below to define what you're building.

---

## Project Overview

**Project Name:** Pac-Man

**One-line Description:** A classic Pac-Man arcade game where you navigate a maze, eat dots, and avoid ghosts.

**Type:** Web App (single-page HTML/CSS/JS)

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
- A grid-based maze rendered on an HTML canvas
- Pac-Man character that moves with arrow keys
- Dots placed throughout the maze that disappear when Pac-Man moves over them
- One ghost that moves randomly through the maze
- Collision detection: game over if a ghost touches Pac-Man
- Win condition: all dots eaten
- Score display (number of dots eaten)

**What it does NOT include (stretch goals):**
- Sound effects
- Power pellets / frightened ghost mode
- Multiple ghost AI behaviors
- Level progression / increasing difficulty
- High score persistence
- Animations and visual polish

---

## Features

> Plan out the features you want to add after the MVP is working. Each feature should be in its own component file to keep things organized.

### Feature 1: Power Pellets
- **Description:** Add 4 large power pellets in the maze corners. When Pac-Man eats one, ghosts turn blue/"frightened" for a few seconds and can be eaten for bonus points.
- **Files to create:** `base_mvp/power-pellets.js`

### Feature 2: Sound Effects
- **Description:** Add retro arcade sounds using the Web Audio API — a chomp when eating dots, a siren while ghosts chase, and a death jingle on game over.
- **Files to create:** `base_mvp/sound.js`

### Feature 3: Multiple Ghost AI
- **Description:** Add 3 more ghosts (Blinky, Pinky, Inky, Clyde) each with a distinct movement behavior — one chases directly, one ambushes, one patrols, one moves randomly.
- **Files to create:** `base_mvp/ghost-ai.js`

---

## Success Criteria

- [ ] MVP runs locally
- [ ] At least one PR merged to the original repo
- [ ] Features work without breaking the base app
