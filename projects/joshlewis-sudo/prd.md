# Product Requirements Document (PRD)

> **Instructions:** This is your project specification. Fill in the sections below to define what you're building.

---

## Project Overview

**Project Name:** Angels Pitcher Matchup Dashboard

**One-line Description:** A single-page web app that displays upcoming Angels pitching matchup cards with stats, styled like a baseball broadcast overlay.

**Type:** Web App (React + Vite)

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
- A single page showing 3 matchup cards (one per upcoming Angels game)
- Each card displays: date, opponent, Angels pitcher name/hand/ERA vs. opponent pitcher name/hand/ERA
- All data is hardcoded (no API calls)
- Clean baseball-themed styling (dark background, red/white Angels color scheme)
- Responsive card layout using CSS flexbox/grid

**What it does NOT include (stretch goals):**
- Live data from any API
- Win/loss prediction logic
- Animated transitions between cards
- Historical stats or game results

---

## Features

> Plan out the features you want to add after the MVP is working. Each feature should be in its own component file to keep things organized.

### Feature 1: Pitcher Stat Bars
- **Description:** Add horizontal stat bars beneath each pitcher showing visual comparisons of ERA, WHIP, and strikeouts. The bars fill proportionally so you can visually compare the two starters at a glance.
- **Files to create:** `src/components/StatBar.jsx`, `src/styles/StatBar.css`

### Feature 2: Game Countdown Timer
- **Description:** Each matchup card shows a live countdown to first pitch (e.g., "First pitch in 2h 34m"). Uses hardcoded game times and `Date.now()` — no API needed.
- **Files to create:** `src/components/Countdown.jsx`

### Feature 3: Matchup Vote / Pick-a-Winner
- **Description:** Each card gets a "Who wins?" toggle that lets the user pick the Angels or the opponent. Selections are stored in component state and a summary at the bottom shows the user's picks. Fun and interactive — no backend required.
- **Files to create:** `src/components/VotePicker.jsx`, `src/components/PicksSummary.jsx`

---

## Success Criteria

- [ ] MVP runs locally
- [ ] At least one PR merged to the original repo
- [ ] Features work without breaking the base app
