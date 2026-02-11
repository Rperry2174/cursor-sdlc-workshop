# Product Requirements Document (PRD)

> **Instructions:** This is your team's project specification. Fill in the sections below to define what you're building.

---

## Project Overview

**Project Name:** MotoFrogger

**One-line Description:** A Frogger-style arcade game where you ride a motorcycle across lanes of traffic to reach the finish line.

**Type:** Web App (HTML/CSS/JS — single page, no backend)

---

## Guidelines

- Keep it simple — single HTML file with embedded CSS/JS for the MVP
- No databases, no auth, no APIs
- Must run by opening the HTML file in a browser
- All features should be independent so team members can work in parallel

---

## Team Members & Tasks

| Name | Task | Description |
|------|------|-------------|
| Talal | Score & Lives HUD | Add a heads-up display showing current score, high score, and remaining lives |
| Person 2 | Power-Ups | Add collectible items (speed boost, shield) that spawn randomly on the road |
| Person 3 | Sound Effects & Polish | Add engine/crash sounds and visual effects (exhaust trail, screen shake on crash) |

### Task Guidelines
- Each task should add something **visible** to the project
- Tasks should be **independent** — no dependencies on other tasks
- Everyone should be able to work at the same time without conflicts

---

## Base MVP (Phase 2)

> **One person** creates the foundation that everyone else builds on.

**What the MVP includes:**
- A canvas-based game with a motorcycle sprite at the bottom
- Arrow key controls to move the motorcycle up, down, left, right
- Multiple lanes of traffic (cars/trucks) moving at different speeds in alternating directions
- Collision detection — hitting a vehicle resets the motorcycle to the start
- Reaching the top row = completing a level (motorcycle resets to bottom)
- Simple retro/arcade visual style with lane markings

**What it does NOT include:**
- No score tracking or lives (Feature 1)
- No power-ups or collectibles (Feature 2)
- No sound effects or visual polish (Feature 3)

---

## Feature Slots (Phase 3)

> These are the features team members will add. Design them to be **independent** so people can work in parallel.

### Feature 1: Score & Lives HUD
- **Assigned to:** Talal
- **Description:** Add a HUD overlay showing current score (increments each time the motorcycle reaches the top), a persisted high score (localStorage), and 3 lives. Losing all lives shows a "Game Over" screen with a restart button.
- **Files to modify/create:** Modify `base_mvp/index.html` — add HUD rendering in the draw loop, game-over logic, and restart handler

### Feature 2: Power-Ups
- **Assigned to:** Person 2
- **Description:** Spawn random collectible items on the road — a speed boost (yellow lightning bolt, temporarily doubles movement speed) and a shield (blue circle, grants one free hit). Items appear for a few seconds then disappear.
- **Files to modify/create:** Modify `base_mvp/index.html` — add power-up spawning, rendering, collision with motorcycle, and timed effects

### Feature 3: Sound Effects & Visual Polish
- **Assigned to:** Person 3
- **Description:** Add Web Audio API sound effects for engine idle, acceleration, crash, and level complete. Add a particle-based exhaust trail behind the motorcycle and a screen shake effect on collision.
- **Files to modify/create:** Modify `base_mvp/index.html` — add audio context setup, sound generation functions, particle system, and shake animation

---

## Success Criteria

- [ ] MVP runs locally by opening `index.html` in a browser
- [ ] Each team member has merged at least one PR
- [ ] All features work together without breaking the app
