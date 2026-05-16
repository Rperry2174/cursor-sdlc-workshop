# Product Requirements Document (PRD)

> **Instructions:** This is your project specification. Fill in the sections below to define what you're building.

---

## Project Overview

**Project Name:** Neon Pong

**One-line Description:** A classic two-player Pong game with a neon arcade aesthetic, playable in the browser.

**Type:** Web App (single HTML file with canvas)

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
- A canvas with a dark background and a center divider line
- Two paddles (left player uses W/S keys, right player uses Up/Down arrow keys)
- A ball that bounces off the top/bottom walls and the paddles
- Ball resets to center when it passes a paddle (point scored)
- Simple score display at the top of the screen

**What it does NOT include (stretch goals):**
- Sound effects
- Speed increases / difficulty scaling
- Visual polish (glow effects, particles, animations)

---

## Features

> Plan out the features you want to add after the MVP is working. Each feature should be in its own component file to keep things organized.

### Feature 1: Sound Effects
- **Description:** Add retro arcade sounds using the Web Audio API (no external files). Play a tone on paddle hits, wall bounces, and scoring. Include a mute/unmute toggle button.
- **Files to create:** Add a `sounds.js` module with tone-generation helpers, integrate into `index.html`

### Feature 2: Speed Ramp & Difficulty
- **Description:** The ball speeds up slightly each time it bounces off a paddle, making rallies increasingly intense. First player to 7 points wins, and a "Game Over" overlay shows the winner with a "Play Again" button that resets everything.
- **Files to create:** Modify game logic in `index.html` (ball velocity scaling, win condition, overlay UI)

### Feature 3: Neon Glow & Ball Trail
- **Description:** Add a neon glow effect to the paddles, ball, and center line using canvas shadow rendering. The ball leaves a fading trail of previous positions, giving it a comet-like look. Paddles pulse briefly on hit.
- **Files to create:** Modify rendering logic in `index.html` (shadow/glow drawing, trail array, hit flash animation)

---

## Success Criteria

- [ ] MVP runs locally
- [ ] At least one PR merged to the original repo
- [ ] Features work without breaking the base app
