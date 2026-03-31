# Product Requirements Document (PRD)

> **Instructions:** This is your project specification. Fill in the sections below to define what you're building.

---

## Project Overview

**Project Name:** `Fairway Match`

**One-line Description:** A simple swipe-style web app that helps golfers discover compatible playing partners based on skill level, availability, and course preferences.

**Type:** `Single-page Web App`

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
- A hardcoded list of golfer profiles shown one at a time as swipe-style cards
- Each card displays name, handicap or skill range, distance, preferred course, availability, and a short bio
- Like and Pass buttons to move through profiles
- A simple "matches" area that stores liked golfers locally in memory
- Basic compatibility hints on each card such as shared course or similar skill level

**What it does NOT include (stretch goals):**
- Real chat or messaging
- Real scheduling or calendar invites
- Live location or distance calculations
- Authentication, moderation, or reporting flows
- Real course directory or tee-time booking integrations
- Native mobile app support

---

## Features

> Plan out the features you want to add after the MVP is working. Each feature should be in its own component file to keep things organized.

### Feature 1: `Filter Controls`
- **Description:** Let users narrow profiles by handicap band, preferred tee time, and 9 vs 18 holes preference.
- **Files to create:** `src/components/Filters.jsx`, `src/data/profiles.js`

### Feature 2: `Round Proposal Panel`
- **Description:** Allow a matched golfer to pick a course, day, and time window in a mock scheduling panel.
- **Files to create:** `src/components/RoundProposal.jsx`, `src/components/MatchList.jsx`

### Feature 3: `Post-Round Feedback`
- **Description:** Add a lightweight "Would play again?" interaction after a mock round to reflect the original PRD's quality and safety loop.
- **Files to create:** `src/components/FeedbackPrompt.jsx`, `src/components/MatchList.jsx`

---

## Success Criteria

- [ ] MVP runs locally
- [ ] User can browse at least 3 sample golfer profiles
- [ ] User can like or pass profiles without breaking the app
- [ ] Liked profiles appear in a simple matches list
- [ ] At least one PR merged to the original repo
- [ ] Features work without breaking the base app
