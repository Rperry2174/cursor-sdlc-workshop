# Product Requirements Document (PRD)

> **Instructions:** This is your project specification. Fill in the sections below to define what you're building.

---

## Project Overview

**Project Name:** Plot — Garden Tracker

**One-line Description:** A single-page web app to remind the user what they need to do on a monthly/weekly basis to manage the plants in the garden.

**Type:** Web App (React, single screen)

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

- *Example features:* scoreboard, sound effects, difficulty/speed settings

**Memory Card Match** — flip cards to find matching pairs

- *Example features:* move counter, timer, win animation/confetti

**Drawing Pad** — simple canvas you can sketch on

- *Example features:* color picker, brush size slider, eraser tool

**Typing Speed Game** — type a passage and measure your words per minute

- *Example features:* WPM display, accuracy tracker, difficulty levels

**Trivia Quiz** — multiple choice questions with score tracking

- *Example features:* timer per question, category selector, results summary screen

### Bad Project Ideas (Too Big!)

- Anything with a database — tell Cursor to avoid this
- Anything requiring authentication
- Anything with multiple pages/screens
- Anything that "needs" an API

---

## Base MVP

> Build the minimal working version of your project first.

**What the MVP includes:**

- One page focused on **garden care reminders** (not a generic plant inventory).
- **Add reminder** — short title (what to do), **cadence** weekly (every 7 days) or monthly (every **30** days for this MVP), optional **last done** date; if never done, the task is treated as **due now**.
- **Next due** is computed from last done + cadence; **“Due this week”** lists anything **overdue** or due on or before **end of Sunday** of the current calendar week.
- **All reminders** — full list **sorted by next due date**, with **Mark done today** (sets last done to today and moves the next due forward) and **Remove**.
- Data is stored in **`localStorage`** in this browser only (no server, auth, or database).

**What it does NOT include (stretch goals):**

- User accounts, login, or cloud sync
- Separate routes or multiple screens
- Weather API, plant ID API, push notifications, or image uploads
- A real database (Postgres, Firebase, etc.)
- Calendar-accurate “month” lengths (MVP uses **+30 days** for monthly cadence)

---

## Features

> Plan out the features you want to add after the MVP is working. Each feature should be in its own component file to keep things organized.

### Feature 1: Filter / search

- **Description:** Text filter to narrow “All reminders” by title.
- **Files to create:** e.g. `ReminderFilter.jsx`

### Feature 2: Per-plant grouping

- **Description:** Optional “plant name” field so multiple reminders can be grouped visually under the same plant.
- **Files to create:** e.g. extend `ReminderForm.jsx`, `ReminderRow.jsx`

### Feature 3: Export / import JSON

- **Description:** Download reminders as a file and load them back (still client-only).
- **Files to create:** e.g. `backupUtils.js`, small UI in `App.jsx`

---

## Success Criteria

- MVP runs locally
- At least one PR merged to the original repo
- Features work without breaking the base app
