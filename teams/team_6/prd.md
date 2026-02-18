# Product Requirements Document (PRD)

> **Instructions:** This is your team's project specification. Fill in the sections below to define what you're building.

---

## Project Overview

**Project Name:** Daily Productivity Tracker

**One-line Description:** Input what you've done for the day and get a score so you can see how productive you were.

**Type:** Web App (single-page React app, no backend)

---

## Plan: What This Can Look Like

**User flow:** You open the app, type or add items for what you did today (e.g. "Shipped feature X", "Answered 10 emails", "30 min workout"), hit a button, and get a score (e.g. 0–100 or a letter grade) plus optional breakdown.

**Screen layout (single page):**

1. **Input area** — Text field or "add item" list where you enter what you've done. Simple and fast.
2. **Score area** — Big, clear score (number or letter) after you click "Get my score" or "Calculate".
3. **Optional:** A short summary of what you entered, a progress bar or gauge for the score, and (if we keep it simple) category tags (e.g. Work / Personal / Health) that slightly change how the score is calculated.

**Scoring (simple, no backend):** Score can be based on number of items (e.g. 10 pts per item, max 100), or a simple formula (items + categories). No database — everything in component state or a simple in-memory list.

**Tech:** React, single HTML page, no auth, no API. Fits the "10-minute MVP" rule: one person builds the base (input + button + score display), then the team adds the 5 features below in parallel.

---

## Guidelines

### Keep It Small!

- Your MVP should be buildable in **10 minutes** by one person
- Think "proof of concept" not "production ready"
- If it sounds ambitious, make it simpler
- **Use Cursor to help you plan this!** You need a project that has at least 5 features so everyone on your team can pick one and add it
- Feel free to take one of the ideas below — this exercise is about learning the git flow, collaborating as a team, and understanding where Cursor's features fit into the SDLC

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

- Anything with a database -- tell cursor to avoid this
- Anything requiring authentication
- Anything with multiple pages/screens
- Anything that "needs" an API

---

## Team Members & Tasks

> **Important:** Each team member MUST have their own task. Tasks should be independent features that can be built in parallel without stepping on each other's toes.


| Name       | Task            | Description                                             |
| ---------- | --------------- | ------------------------------------------------------- |
| Megan      | Input form      | Text area or add-item list for "what I did today"       |
| *[Name 2]* | Score display   | Big score number or letter grade after Calculate        |
| *[Name 3]* | Score breakdown | Show why (e.g. X items, optional category weights)      |
| *[Name 4]* | Visual feedback | Progress bar or color (e.g. red/yellow/green) for score |
| *[Name 5]* | Summary list    | Show today's entered items in a readable list           |


### Task Guidelines

- Each task should add something **visible** to the project
- Tasks should be **independent** — no dependencies on other tasks
- Think: new button, new section, new color scheme, new text, etc.
- Everyone should be able to work at the same time without conflicts

---

## Base MVP (Phase 2)

> **One person** creates the foundation that everyone else builds on.

**What the MVP includes:**

- Single page with a text input (or simple list) to add "what I did today"
- A "Get my score" / "Calculate" button
- A score displayed (e.g. 0–100 or letter grade) using a simple rule (e.g. 10 pts per item, max 100)
- No backend, no database — all in React state

**What it does NOT include:**

- Fancy score display, progress bar, or color feedback (Feature 4)
- Score breakdown or categories (Feature 3)
- Summary list of entered items (Feature 5)
- Any persistence (refresh = reset)

---

## Feature Slots (Phase 3)

> These are the features team members will add. Design them to be **independent** so people can work in parallel.

### Feature 1: Input form

- **Assigned to:** Megan
- **Description:** Text area or "add item" list where the user enters what they did today. Submit or add items that get passed into the scoring logic.
- **Files to modify/create:** e.g. `src/components/InputForm.jsx` or input section in `App.jsx`

### Feature 2: Score display

- **Assigned to:** *[Team member 2]* 
- **Description:** Prominent score (number 0–100 or letter grade A–F) shown after the user clicks Calculate. Reads score from shared state or props.
- **Files to modify/create:** e.g. `src/components/ScoreDisplay.jsx` or score section in `App.jsx`

### Feature 3: Score breakdown

- **Assigned to:** *[Team member 3]*
- **Description:** Short explanation of the score (e.g. "5 items × 10 pts = 50") or optional category labels (Work / Personal) that affect the score.
- **Files to modify/create:** e.g. `src/components/ScoreBreakdown.jsx` or extend scoring logic in a small util

### Feature 4: Visual feedback

- **Assigned to:** *[Team member 4]*
- **Description:** Progress bar, gauge, or color (red / yellow / green) based on score so the result is visible at a glance.
- **Files to modify/create:** e.g. `src/components/ScoreGauge.jsx` or styles in `App.css`

### Feature 5: Summary list

- **Assigned to:** *[Team member 5]*
- **Description:** Display the list of items the user entered for today in a simple, readable format (bullets or cards).
- **Files to modify/create:** e.g. `src/components/SummaryList.jsx` or list section in `App.jsx`

---

## Success Criteria

- MVP runs locally
- Each team member has merged at least one PR
- All features work together without breaking the app

