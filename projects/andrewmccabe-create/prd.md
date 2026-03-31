# Product Requirements Document (PRD)

> **Instructions:** This is your project specification. Fill in the sections below to define what you're building.

---

## Project Overview

**Project Name:** Flickshot (Angry Birds–style physics puzzle)

**One-line Description:** Slingshot a bird into a block tower to knock the pig off the screen.

**Type:** Single-page web game (HTML/CSS/Canvas)

> **Note:** The Notion PRD at [Angry Birds PRD (Notion)](https://www.notion.so/cursorai/Angry-Birds-style-Physics-Puzzle-Game-PRD-for-Cursor-98ce4719bece436e8436e3b920c078c3) was not readable from here (login wall). This MVP matches the title and a typical workshop-sized scope.

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
- One level: sling, bird, wood stack, pig, ground/sky
- Drag-to-aim, release-to-launch controls
- Simple gravity, collisions, win (pig falls) / soft lose (bird stops), reset

**What it does NOT include (stretch goals):**
- Multiple levels, scoring stars, different birds, sound, parallax art, a physics library

---

## Features

> Plan out the features you want to add after the MVP is working. Each feature should be in its own component file to keep things organized.

### Feature 1: _[Name]_
- **Description:** _[What it does]_
- **Files to create:** _[Be specific]_

### Feature 2: _[Name]_
- **Description:** _[What it does]_
- **Files to create:** _[Be specific]_

### Feature 3: _[Name]_
- **Description:** _[What it does]_
- **Files to create:** _[Be specific]_

---

## Success Criteria

- [ ] MVP runs locally
- [ ] At least one PR merged to the original repo
- [ ] Features work without breaking the base app
