# Product Requirements Document (PRD)

> **Instructions:** This is your project specification. Fill in the sections below to define what you're building.

---

## Project Overview

**Project Name:** Fitness and Recovery Calendar

**One-line Description:** A single-page web app that generates a personalized weekly exercise and recovery schedule based on your age, injury history, and fitness goals.

**Type:** Web App (React + Vite)

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
- A single-page app with an input form that collects: age, fitness goal (e.g. lose weight / build muscle / improve endurance / general wellness), and any current injuries (checkboxes: knee, back, shoulder, ankle, none)
- A generated 7-day calendar view that assigns exercise days and recovery days based on the inputs
- Each day shows a short label (e.g. "Upper Body", "Rest & Stretch", "Light Cardio")
- All logic is client-side (no database, no API) — uses simple rules to build the schedule

**What it does NOT include (stretch goals):**
- Detailed recovery tips per day (Feature 1)
- Ability to toggle between weekly and monthly views (Feature 2)
- Visual progress indicators and color-coded day types (Feature 3)

---

## Features

> Plan out the features you want to add after the MVP is working. Each feature should be in its own component file to keep things organized.

### Feature 1: Recovery Tips Panel
- **Description:** When a user clicks on a recovery day in the calendar, a panel expands showing specific recovery recommendations (stretches, foam rolling, hydration reminders) tailored to their injury history.
- **Files to create:** `src/components/RecoveryTips.jsx`

### Feature 2: Monthly Calendar View
- **Description:** Add a toggle that switches the calendar between a 7-day week view and a full month view, so users can see their entire training plan at a glance.
- **Files to create:** `src/components/MonthView.jsx`

### Feature 3: Day Type Styling and Legend
- **Description:** Color-code calendar days by type (strength = blue, cardio = green, rest = yellow, active recovery = orange) and add a legend so the schedule is easy to scan at a glance.
- **Files to create:** `src/components/Legend.jsx`, `src/styles/dayTypes.css`

---

## Success Criteria

- [ ] MVP runs locally
- [ ] At least one PR merged to the original repo
- [ ] Features work without breaking the base app
