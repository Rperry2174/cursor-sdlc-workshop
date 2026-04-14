# Product Requirements Document (PRD)

> **Instructions:** This is your project specification. Fill in the sections below to define what you're building.

---

## Project Overview

**Project Name:** BabyNext

**One-line Description:** A "what do I do now?" app for parents of infants that shows the current activity and counts down to the next feed or nap based on the baby's daily schedule.

**Type:** Web App (single-page, React + Vite)

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
- A single-page app with a clean, calming UI
- The baby's real daily schedule hardcoded as the default:
  - 7:00 AM — Wake + Bottle (8 oz)
  - 8:30 AM — Solids Meal #1
  - 9:00–10:30 AM — Nap 1
  - 11:00 AM — Bottle (8 oz)
  - 12:30–2:00 PM — Nap 2
  - 3:00 PM — Bottle (8 oz)
  - 4:00–4:45 PM — Nap 3
  - 5:00 PM — Solids Meal #2
  - 6:30 PM — Wind-down routine
  - 7:00 PM — Bottle (8 oz) / Bedtime
- A large, clear display showing: **what to do now** (e.g., "Nap 1"), **how long until the next activity** (countdown timer), and a simple timeline of the day's remaining schedule
- **Solids meal suggestions**: For each solids meal, suggest 2–3 foods to offer. Use a list of foods the baby has already tried as "safe" picks, and optionally include up to 1 new food per day (not yet tried). Clearly label which food is the "new" one.
- A pre-loaded list of foods already tried: banana, peanut butter, bread, mango, strawberry, applesauce, eggs, avocado, pineapple, sweet potato
- A curated list of common baby-safe foods to suggest as "new" introductions
- All state lives in memory (no database, no localStorage in MVP)

**What it does NOT include (stretch goals):**
- Editing the schedule or wake-up time
- Logging actual feed/nap times
- Dark/night mode for late-night checks

---

## Features

> Plan out the features you want to add after the MVP is working. Each feature should be in its own component file to keep things organized.

### Feature 1: Solids Tracker
- **Description:** Let the parent mark which "new" food the baby tried today and whether it went well (no reaction). Persists the tried-foods list in localStorage so it grows over time and the suggestions get smarter. Add an "Add new food" button to manually expand the safe list.
- **Files to create:** `src/components/SolidsTracker.jsx`, `src/hooks/useSolidsLog.js`

### Feature 2: Activity Log
- **Description:** Add a "Done" button so the parent can mark when a feed or nap actually happened. Show a simple log of completed activities for the day. Persist the log in localStorage so it survives page refreshes.
- **Files to create:** `src/components/ActivityLog.jsx`, `src/hooks/useActivityLog.js`

### Feature 3: Night Mode
- **Description:** A toggle that switches the app to a dark, low-brightness color scheme with soft amber tones — designed for 2 AM feeds without blinding the parent. Remembers the preference in localStorage.
- **Files to create:** `src/components/NightModeToggle.jsx`, `src/styles/night-mode.css`

---

## Success Criteria

- [ ] MVP runs locally
- [ ] At least one PR merged to the original repo
- [ ] Features work without breaking the base app
