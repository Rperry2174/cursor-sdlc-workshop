# Product Requirements Document (PRD)

> **Instructions:** This is your project specification. Fill in the sections below to define what you're building.

---

## Project Overview

**Project Name:** Daily Notebook Planner

**One-line Description:** A single-page web app that looks like an open notebook and acts as a daily planner with a to-do list, time deadlines, and check-off that makes completed items disappear.

**Type:** Web App (HTML/CSS/JS or simple React)

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
- **Notebook look:** Page styled like an open notebook (e.g., paper texture, margin/line styling, maybe a “binding” or fold in the middle). Single “page” view.
- **Daily to-do list:** Add tasks by typing and submitting; each task is one line. Tasks stored in memory or `localStorage` (no backend database).
- **Time deadlines:** Each task can have an optional time (e.g., “9:00 AM” or “14:00”). Display time next to the task; no notifications needed for MVP.
- **Check-off behavior:** Each task has a checkbox. When checked, the task disappears from the list (or is clearly marked done and hidden). No “show completed” for MVP.
- **Personal input only:** No Slack/Notion/API—just what the user types in this page.

**What it does NOT include (stretch goals):**
- Pulling tasks from Slack, Notion, or any external API
- “Thought dump” text that gets synthesized into tasks
- Anecdotes section or stickers
- Multiple days or calendar view (single “today” list is enough for MVP)

---

## Features

> Plan out the features you want to add after the MVP is working. Each feature should be in its own component file to keep things organized.

### Feature 1: Thought dump → tasks
- **Description:** A text area where the user can paste or type long lines of thought (bullets, paragraphs, or run-on text). A “Synthesize” or “Turn into tasks” action parses the text and creates to-do items (e.g., split on newlines or common delimiters, trim, dedupe). New tasks appear in the daily list with optional default time.
- **Files to create:** `ThoughtDumpInput.jsx` (or `.js`), `synthesizeToTasks.js` (or inline logic in the component), and wire it into the main app/state.

### Feature 2: Anecdotes
- **Description:** A small section on the notebook (e.g., sidebar or bottom) for short anecdotes—quotes, notes, or “today I learned” style snippets. User can add, edit, and delete. Stored in `localStorage` or same in-memory store as tasks. Styled to fit the notebook (e.g., handwritten look or sticky-note style).
- **Files to create:** `AnecdotesSection.jsx`, `AnecdoteCard.jsx` (optional), and any shared storage helper if needed.

### Feature 3: Stickers
- **Description:** A set of decorative stickers (small images or emoji/SVG) the user can drag onto the notebook “page.” Stickers stay where they’re dropped (position saved in `localStorage`). Adds a fun, personal planner feel.
- **Files to create:** `StickerPalette.jsx` (list of stickers to choose from), `Sticker.jsx` (draggable sticker with position state), and persistence logic (e.g., in main app or a `useStickers` hook).

---

## Success Criteria

- [ ] MVP runs locally
- [ ] At least one PR merged to the original repo
- [ ] Features work without breaking the base app
