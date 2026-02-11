# Product Requirements Document (PRD)

> **Instructions:** This is your team's project specification. Fill in the sections below to define what you're building.

---

## Project Overview

**Project Name:** FreshFind

**One-line Description:** A farmers' market directory where you can browse markets, see vendors, view photos, and leave reviews.

**Type:** Web App (React, frontend-only)
**Project Name:** Cursor SDLC Board

**One-line Description:** A simple visual board that shows the six SDLC stages (Plan → Design → Develop → Test → Review → Deploy) and where Cursor helps at each step.

**Type:** Web App (React, single page)

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
| Person 1 (MVP builder) | Base Game | Build the base game: 3x3 grid, moles pop up randomly, click to score, 30-second round |
| Person 2 | Scoreboard | Display current score, track high score in localStorage, show "New High Score!" message |
| Person 3 | Difficulty Settings | Slider or buttons to change mole speed (easy/medium/hard), persist choice |
| Person 4 | Sound Effects | Whack sound on hit, miss sound on click-empty, round-start/round-end sounds |
| Person 5 | Timer and Round Display | Countdown bar, round number, "Game Over" screen with stats |
| Person 6 | Animations | Mole pop-up/pop-down CSS transitions, shake on miss, confetti on new high score |

### Task Guidelines
- Each task should add something **visible** to the project
- Tasks should be **independent** — no dependencies on other tasks
- Think: new button, new section, new color scheme, new text, etc.
- Everyone should be able to work at the same time without conflicts

---

## Base MVP (Phase 2)

> **One person** creates the foundation that everyone else builds on.

**What the MVP includes:**
- 3x3 grid of "holes"
- Moles appear in random holes every ~800ms
- Click a mole to score +1
- Basic score counter at the top
- 30-second game timer
- Scaffolded with Vite (`npm create vite@latest -- --template react`)

**What it does NOT include:**
- No high score tracking (Scoreboard feature)
- No difficulty options (Difficulty Settings feature)
- No audio (Sound Effects feature)
- No fancy timer UI or game-over screen (Timer feature)
- No CSS animations or confetti (Animations feature)

---

## Feature Slots (Phase 3)

> These are the features team members will add. Design them to be **independent** so people can work in parallel.

### Feature 1: Scoreboard
- **Assigned to:** Person 2
- **Description:** Display the current score prominently, track the all-time high score in localStorage, and show a "New High Score!" message when the player beats it.
- **Files to modify/create:** `src/components/Scoreboard.jsx`

### Feature 2: Difficulty Settings
- **Assigned to:** Person 3
- **Description:** Add a slider or button group to change mole speed (easy/medium/hard). Persist the chosen difficulty so it survives a page refresh.
- **Files to modify/create:** `src/components/Settings.jsx`

### Feature 3: Sound Effects
- **Assigned to:** Person 4
- **Description:** Play a whack sound on hit, a miss sound when clicking an empty hole, and round-start/round-end sounds.
- **Files to modify/create:** `src/components/SoundEffects.jsx`, `src/data/sounds/`

### Feature 4: Timer and Round Display
- **Assigned to:** Person 5
- **Description:** Replace the basic timer with a visual countdown bar, add a round number, and show a "Game Over" screen with stats (score, accuracy, time).
- **Files to modify/create:** `src/components/Timer.jsx`

### Feature 5: Animations
- **Assigned to:** Person 6
- **Description:** Add CSS transitions for mole pop-up/pop-down, a shake effect on miss, and confetti when the player sets a new high score.
- **Files to modify/create:** `src/components/Animations.jsx`

---

## Success Criteria

- [ ] MVP runs locally
- [ ] Each team member has merged at least one PR
- [ ] All features work together without breaking the app
