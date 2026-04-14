# Product Requirements Document (PRD)

> **Instructions:** This is your project specification. Fill in the sections below to define what you're building.

---

## Project Overview

**Project Name:** BabySteps

**One-line Description:** A vibrant, brutalist-styled baby milestone tracker for first-time Gen Z parents.

**Type:** Web App (single HTML page, no backend)

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
- A grid of ~15 common baby milestones (first smile, first laugh, sleeping through the night, first solid food, rolling over, crawling, first steps, first word, etc.)
- Each milestone is a tappable card that toggles between incomplete and complete
- Brutalist Gen Z visual theme: bold sans-serif fonts, bright/clashing accent colors, thick black borders, high contrast
- Responsive layout that works on mobile and desktop
- Client-side persistence via localStorage so progress survives page refreshes

**What it does NOT include (stretch goals):**
- Category filtering
- Celebration animations/confetti
- Local events or outings tab
- Any backend, database, or authentication

---

## Features

> Plan out the features you want to add after the MVP is working. Each feature should be in its own component file to keep things organized.

### Feature 1: Milestone Categories
- **Description:** Add category tags (Sleep, Feeding, Motor Skills, Social) to each milestone. A filter bar at the top lets parents show all milestones or filter to a single category.
- **Files to create:** `components/CategoryFilter.js`

### Feature 2: Celebration Mode
- **Description:** When a milestone is checked off, trigger a confetti/particle animation over the card to make the moment feel special.
- **Files to create:** `components/Celebration.js`

### Feature 3: Local Events & Outings (Mock View)
- **Description:** A tab that switches from the milestone tracker to a "Local Events" view. Shows ~5 hardcoded upcoming events (e.g., "Stroller Walk at Prospect Park", "Baby Music Class — Downtown Library") with dates, RSVP counts, and avatars of attending parents. Includes a "Parent Groups Near You" section with 2–3 dummy groups. All data is static — meant to showcase the product vision with a banner like "Sign up to connect with parents in your area."
- **Files to create:** `components/EventsTab.js`, `data/mockEvents.js`

---

## Success Criteria

- [ ] MVP runs locally
- [ ] At least one PR merged to the original repo
- [ ] Features work without breaking the base app
