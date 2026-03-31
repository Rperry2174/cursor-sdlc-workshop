# Product Requirements Document (PRD)

> **Instructions:** This is your project specification. Fill in the sections below to define what you're building.

---

## Project Overview

**Project Name:** _LocalLens_

**One-line Description:** _A lightweight web app that ranks nearby restaurants and recommends top picks based on your cuisine and vibe preferences plus simple taste history._

**Type:** _Single-page Web App (React + local mock data)_

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
- A single page that shows a list of 8-12 mock local restaurants (hardcoded JSON, no API/database)
- Preference controls for:
  - Favorite cuisines (multi-select)
  - Price comfort (cheap / moderate / premium)
  - Vibe preference (casual / date night / group-friendly)
- A basic "taste history" section where the user can mark a few places as "liked"
- A visible recommendation score for each restaurant based on:
  - Cuisine match
  - Price match
  - Vibe match
  - Bonus points if similar to liked places
- A "Top 3 For You" area that surfaces the highest-scoring matches

**What it does NOT include (stretch goals):**
- User accounts, login, or persistence across sessions
- External APIs (Google Places, Yelp API, maps)
- Multi-page routing, backend, or database
- Social feed/friends activity like Beli
- LLM-generated reviews or natural language chat search

---

## Features

> Plan out the features you want to add after the MVP is working. Each feature should be in its own component file to keep things organized.

### Feature 1: _Preference Panel_
- **Description:** Lets the user choose cuisines, preferred price level, and vibe to personalize recommendation scoring.
- **Files to create:** _`src/components/PreferencePanel.jsx`_

### Feature 2: _Restaurant Rank List_
- **Description:** Renders restaurants sorted by computed score with short reasons (e.g., "Cuisine + price match"), plus score badges.
- **Files to create:** _`src/components/RestaurantRankList.jsx`_

### Feature 3: _Taste History + Top Picks_
- **Description:** Allows marking restaurants as liked and updates recommendation weighting; displays a focused "Top 3 For You" recommendation block.
- **Files to create:** _`src/components/TasteHistory.jsx`, `src/components/TopPicks.jsx`_

---

## Success Criteria

- [ ] MVP runs locally
- [ ] At least one PR merged to the original repo
- [ ] Features work without breaking the base app
