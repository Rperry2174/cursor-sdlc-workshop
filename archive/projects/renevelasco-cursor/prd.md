# Product Requirements Document (PRD)

---

## Project Overview

**Project Name:** Galaga Arcade

**One-line Description:** A browser-based remake of the classic Galaga arcade shooter — move your ship, fire bullets, and destroy waves of alien enemies.

**Type:** Web App (single-page HTML/CSS/JS game)

---

## Base MVP

> Build the minimal working version of your project first.

**What the MVP includes:**
- A player ship at the bottom of the screen that moves left and right with arrow keys
- A fire button (spacebar) that shoots bullets upward
- A static grid of alien enemies displayed in formation at the top
- Bullet-to-enemy collision detection — hitting an enemy destroys it
- A win condition: all enemies destroyed shows a "You Win!" message
- Retro arcade visual style (dark background, pixel-style sprites or simple shapes)

**What it does NOT include (stretch goals):**
- Score tracking or high scores
- Enemy movement or dive attacks
- Player lives or a game-over state
- Sound effects or music
- Multiple waves/levels

---

## Features

> Plan out the features you want to add after the MVP is working. Each feature should be in its own component file to keep things organized.

### Feature 1: Score Display & High Score
- **Description:** Show the player's current score on screen (points per enemy destroyed). Track the highest score achieved during the browser session and display it alongside the current score.
- **Files to create:** `js/score.js` — score state, rendering, and high-score logic

### Feature 2: Enemy Movement & Dive Attacks
- **Description:** Enemies sway side-to-side in formation (classic Galaga oscillation). Randomly, individual enemies break formation and dive toward the player, firing projectiles downward as they go.
- **Files to create:** `js/enemy-movement.js` — formation sway and dive-attack AI

### Feature 3: Lives & Game Over
- **Description:** The player starts with 3 lives, displayed as ship icons in the corner. Getting hit by a diving enemy or enemy projectile costs one life. When all lives are lost, a "Game Over" screen appears with the final score and a prompt to restart.
- **Files to create:** `js/lives.js` — life tracking, hit detection against the player, and game-over screen

---

## Success Criteria

- [ ] MVP runs locally
- [ ] At least one PR merged to the original repo
- [ ] Features work without breaking the base app
