# Product Requirements Document (PRD)

> **Instructions:** This is your project specification. Fill in the sections below to define what you're building.

---

## Project Overview

**Project Name:** StreamLog

**One-line Description:** A personal fly fishing journal that lets you log, browse, and revisit every outing on the water.

**Type:** Web App (React, single-page, localStorage)

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
- A form to add a new log entry with fields: date, river/location, target species, fly used, water temp, weather conditions, and notes
- A scrollable list of log-entry cards displayed newest-first
- Data persisted in `localStorage` so entries survive page refreshes
- Clean, outdoors-inspired visual design: earthy greens and browns, simple typography

**What it does NOT include (stretch goals):**
- Editing or deleting existing entries
- Filtering or searching entries
- Stats or summary dashboard

---

## Features

> Plan out the features you want to add after the MVP is working. Each feature should be in its own component file to keep things organized.

### Feature 1: Edit & Delete Entries
- **Description:** Each log-entry card gets an "Edit" button that opens the form pre-filled with that entry's data, and a "Delete" button with a confirmation prompt. Allows correcting typos or removing test entries.
- **Files to create:** `src/components/EditEntryForm.jsx`

### Feature 2: Search & Filter
- **Description:** A toolbar above the card list with a text search (searches across river, species, fly, and notes) and dropdown filters for species and river. Lets you quickly find past outings.
- **Files to create:** `src/components/FilterBar.jsx`

### Feature 3: Trip Stats Dashboard
- **Description:** A collapsible summary panel at the top of the page showing: total outings logged, most-visited river, most-used fly, and a breakdown of species targeted. Gives a quick at-a-glance view of your fishing history.
- **Files to create:** `src/components/StatsDashboard.jsx`

---

## Success Criteria

- [ ] MVP runs locally
- [ ] At least one PR merged to the original repo
- [ ] Features work without breaking the base app
