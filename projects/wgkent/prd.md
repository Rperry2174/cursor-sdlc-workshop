# Product Requirements Document (PRD)

> **Instructions:** This is your project specification. Fill in the sections below to define what you're building.

---

## Project Overview

**Project Name:** SubSpend (subscription expense tracker)

**One-line Description:** A single-page web app to list recurring subscriptions, see each cost, and view an estimated monthly total—saved only in your browser (no login, no server).

**Type:** Web App (HTML/CSS/JS in `base_mvp/`)

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
- One HTML page with a small form: **subscription name**, **amount** (number), **billing period** (e.g. monthly or yearly)
- An **Add** button that saves the subscription to a visible list on the same page
- A clear **estimated monthly total** that treats yearly prices as amount ÷ 12 (show the math in the UI so it is obvious)
- Data persists in the browser with **`localStorage`** so refresh does not wipe the list
- Basic styling so the table or list is readable (alignment, spacing, headings)

**What it does NOT include (stretch goals):**
- Bank linking, email parsing, or automatic renewal detection
- Multi-currency or tax logic
- Passwords, accounts, or cloud sync
- Backend or database (everything stays local in the browser)

---

## Features

> Plan out the features you want to add after the MVP is working. Each feature should be in its own component file to keep things organized.

### Feature 1: Edit or remove one subscription
- **Description:** Each row has controls to **delete** a subscription or **edit** name, amount, or billing period; saving updates `localStorage` and the monthly total.
- **Files to create:** e.g. `base_mvp/js/subscriptions.js` (list + form handlers) or split `storage.js` / `render.js` if you prefer

### Feature 2: Category or tag (optional label)
- **Description:** Optional **category** field (text or small preset list: Streaming, Software, News, Other) shown on each row and used only for grouping or filtering in the UI—still no backend.
- **Files to create:** extend the same data shape in JS; optional `base_mvp/js/categories.js` if logic grows

### Feature 3: Empty state and yearly clarity
- **Description:** When there are no subscriptions, show a short prompt (“Add your first subscription”). For yearly items, show both **per-year** and **normalized per-month** so totals stay transparent.
- **Files to create:** handled in the render layer (`render.js` or the main script module)

---

## Success Criteria

- [ ] MVP runs locally
- [ ] At least one PR merged to the original repo
- [ ] Features work without breaking the base app
