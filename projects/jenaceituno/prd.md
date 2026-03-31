# Product Requirements Document (PRD)

> **Instructions:** This is your project specification. Fill in the sections below to define what you're building.

---

## Project Overview

**Project Name:** Pleasant Hill Age-5 Summer Camp Signup Guide

**One-line Description:** A single-page web app that lists summer camp options in Pleasant Hill, California for a 5-year-old and shows when families should sign up.

**Type:** Web App (static site — HTML/CSS/JS or a tiny React/Vite app in `base_mvp/`)

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
- One screen with title and note: "prototype dataset, verify with official camp pages."
- Default filter set to **age 5** (user can keep it locked to 5 for this project).
- A **read-only list** of Pleasant Hill camp options from a **local data file** in the repo (no API/database).
- For each camp card/row, show:
  - camp name
  - provider/organization
  - age range (must include age 5)
  - session dates or week labels
  - **signup window** (opens on / closes on or "register ASAP")
  - signup link (if available in the static data)
- Client-side filtering/sorting:
  - only show camps that accept age 5
  - sort by nearest signup opening date
- Empty state: clear message if no camps match.

**What it does NOT include (stretch goals):**
- Real-time scraping or live availability updates
- Payments, waitlist handling, or official registration checkout
- User accounts, saved favorites, notifications, or reminders
- Backend/database/API integrations
- Multi-page navigation (keep it as one page)

---

## Features

> Plan out the features you want to add after the MVP is working. Each feature should be in its own component file to keep things organized.

### Feature 1: Signup timeline helper
- **Description:** Add a "Coming up soon" section that groups camps by signup month so parents can quickly see what to register for next.
- **Files to create:** e.g. `SignupTimeline.jsx` or `signupTimeline.js`

### Feature 2: Camp detail panel
- **Description:** Expand a camp row to show hours, location notes, and what to prepare before signup (e.g., forms, payment method).
- **Files to create:** e.g. `CampDetail.jsx` or `campDetail.js`

### Feature 3: Calendar reminder link
- **Description:** Add a quick "Add reminder" link that builds a calendar event for each signup opening date.
- **Files to create:** e.g. `calendarLink.js` and minor UI wiring in main app component

---

## Success Criteria

- [ ] MVP runs locally
- [ ] At least one PR merged to the original repo
- [ ] Features work without breaking the base app
- [ ] At least 8-12 Pleasant Hill camp entries in local data where age 5 is eligible
- [ ] Each listed camp includes a signup timing field (open date or recommended deadline)
