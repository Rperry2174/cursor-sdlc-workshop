# Product Requirements Document (PRD)

> **Instructions:** This is your project specification. Fill in the sections below to define what you're building.

---

## Project Overview

**Project Name:** Family Home Organizer (Workshop MVP)

**One-line Description:** A single-page home dashboard with mock data that previews the structure of the full Family Home Organizer app, built with a clean design aesthetic.

**Type:** Web App (single page, static/mock data)

**Reference Project:** `~/Documents/family-home-organizer` — Full app with Next.js, Prisma, NextAuth, and features for events, pets, cleaning, and yard work. This workshop MVP is a stripped-down proof of concept inspired by its layout and purpose.

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
- One HTML page (or simple Vite + React) with a **Family Home Dashboard** layout
- Four card sections (matching the reference app): **Today's Events**, **Upcoming**, **Cleaning**, **Yard Work**
- **Hardcoded mock data** — no database, no API (e.g. 2–3 sample events, 3–4 cleaning tasks, 1–2 yard tasks)
- **Clean design**: generous whitespace, clear typography (distinctive font), subtle borders/shadows, restrained color palette (no generic purple-on-white)
- Cleaning tasks with **checkboxes** that toggle checked state (localStorage only, no backend)

**What it does NOT include (stretch goals):**
- Database, authentication, or API calls
- Multiple pages/routing
- Add/edit/delete functionality
- Real date logic or recurring events

---

## Features

> Plan out the features you want to add after the MVP is working. Each feature should be in its own component file to keep things organized.

### Feature 1: Add / Edit Cleaning Tasks
- **Description:** Form to add new cleaning tasks and edit existing ones (with area selector); persisted in localStorage.
- **Files to create:** `components/CleaningForm.jsx`, `components/CleaningTaskItem.jsx`

### Feature 2: Month Picker for Cleaning
- **Description:** Month/Year selector to view cleaning tasks for different months; tasks reset or filter by month in localStorage.
- **Files to create:** `components/MonthPicker.jsx`, update `App.jsx` to pass selected month

### Feature 3: Today + Upcoming Tabs
- **Description:** Tabs or toggle to switch between "Today's events" and "Upcoming (next 7 days)" views, using mock date-aware mock data.
- **Files to create:** `components/TodayUpcomingTabs.jsx`, `data/mockEvents.js`

---

## Success Criteria

- [ ] MVP runs locally
- [ ] At least one PR merged to the original repo
- [ ] Features work without breaking the base app
