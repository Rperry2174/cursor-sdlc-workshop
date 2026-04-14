# Product Requirements Document (PRD)

> **Instructions:** This is your project specification. Fill in the sections below to define what you're building.

---

## Project Overview

**Project Name:** Pong

**One-line Description:** A classic two-player paddle-and-ball game played in the browser.

**Type:** Web App (single HTML/CSS/JS page)

---

## Guidelines

### Keep It Small!
- Your MVP should be buildable in **10 minutes**
- Think "proof of concept" not "production ready"
- If it sounds ambitious, make it simpler
- **Use Cursor to help you plan this!**
- This exercise is about learning the git flow and understanding where Cursor's features fit into the SDLC

---

## Base MVP

> Build the minimal working version of your project first.

**What the MVP includes:**
- A canvas with two paddles (left and right) and a ball
- Ball bounces off top/bottom walls and paddles
- Player 1 controls left paddle with W/S keys; Player 2 controls right paddle with Up/Down arrow keys
- Ball resets to center when it passes a paddle (a point is scored)
- Simple score display at the top of the screen

**What it does NOT include (stretch goals):**
- Sound effects
- Difficulty / speed settings
- Visual polish (particles, animations, pause screen)

---

## Features

> Plan out the features you want to add after the MVP is working. Each feature should be in its own component file to keep things organized.

### Feature 1: Scoreboard & Win Condition
- **Description:** Track each player's score and end the game when a player reaches 5 points. Show a "Player X Wins!" overlay with a "Play Again" button.
- **Files to create:** `src/components/Scoreboard.js`

### Feature 2: Sound Effects
- **Description:** Add retro-style sound effects using the Web Audio API (no external files). Play a tone on paddle hit, wall bounce, scoring, and game over.
- **Files to create:** `src/components/SoundEffects.js`

### Feature 3: Difficulty Settings
- **Description:** Add a start screen where players can choose Easy, Medium, or Hard before the match begins. Higher difficulty increases ball speed and paddle responsiveness.
- **Files to create:** `src/components/DifficultySelect.js`

---

## Success Criteria

- [ ] MVP runs locally
- [ ] At least one PR merged to the original repo
- [ ] Features work without breaking the base app
