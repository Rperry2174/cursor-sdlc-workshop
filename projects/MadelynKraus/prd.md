# Product Requirements Document (PRD)

> **Instructions:** This is your project specification. Fill in the sections below to define what you're building.

---

## Project Overview

**Project Name:** Pilates Picks NYC

**One-line Description:** A single-page app for **Manhattan and Brooklyn** pilates studios only: you score each studio and the list re-sorts so your favorites float to the top—all in the browser.

**Type:** Web App (static HTML/CSS/JavaScript in `base_mvp/`)

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
- Studios loaded from `base_mvp/data/studios.json` (curated **Manhattan + Brooklyn** list). Each entry has at least: `id`, `name`, `neighborhood`, and `borough`. **`borough` is only `Manhattan` or `Brooklyn`**—no Queens, Bronx, or Staten Island in seed data or UI for this project.
- Render them as a simple list or cards on **one screen** (no separate routes).
- For each studio, a **personal score** control (for example 1–5 stars or a 1–5 dropdown). Changing the score **re-sorts** the list so higher scores appear first (ties broken by name or original order—your choice, just be consistent).
- Save scores in **`localStorage`** keyed by `id` so a refresh does not wipe your ranking (still no server or database).
- Use **sample / placeholder studio names** for the workshop unless you have verified public info you are comfortable shipping in the repo.

**What it does NOT include (stretch goals):**
- Logins, shared crowdsourced rankings, Google Maps / booking APIs, scraping the web for studio lists, admin tools, multiple pages, or a real backend.
- Studios outside **Manhattan** and **Brooklyn** (other boroughs are out of scope).

---

## Features

> Plan out the features you want to add after the MVP is working. Each feature should be in its own component file to keep things organized.

### Feature 1: Borough filter
- **Description:** Buttons or a dropdown with exactly **Manhattan**, **Brooklyn**, and **All** (only those two boroughs exist in data). Choosing one **hides** studios outside that borough; **All** shows both. Keep scores and sort behavior the same within the filtered set.
- **Files to create:** `base_mvp/js/boroughFilter.js`

### Feature 2: Visited checklist
- **Description:** A per-studio “I’ve been here” toggle stored in `localStorage`. Optionally show visited studios first, or dim unvisited ones—pick one behavior and stick to it for v1.
- **Files to create:** `base_mvp/js/visitedToggle.js`

### Feature 3: Personal notes per studio
- **Description:** A small notes field (one line or short textarea) per studio; save to `localStorage` by `id`. Notes do not affect sort unless you explicitly add that rule later.
- **Files to create:** `base_mvp/js/studioNotes.js`

---

## Success Criteria

- [ ] MVP runs locally
- [ ] At least one PR merged to the original repo
- [ ] Features work without breaking the base app
