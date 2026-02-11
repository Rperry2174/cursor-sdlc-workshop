# Product Requirements Document (PRD)

> **Instructions:** This is your team's project specification. Fill in the sections below to define what you're building.

---

## Project Overview

**Project Name:** Calm Call

**One-line Description:** A quick breathing exercise app to help sales reps regain composure after a tough call.

**Type:** Web App (single page)

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
- Anything with a database -- tell cursor to avoid this
- Anything requiring authentication
- Anything with multiple pages/screens
- Anything that "needs" an API

---

## Team Members & Tasks

> **Important:** Each team member MUST have their own task. Tasks should be independent features that can be built in parallel without stepping on each other's toes.

| Name | Task | Description |
|------|------|-------------|
| Brookey | Breathing pattern selector | Add dropdown/buttons to choose 4-4-4, 4-7-8, or box breathing |
| Pete | Calming theme | Soft gradient background with relaxing colors |
| Jesse | Cycle counter | Show "Breath 3 of 5" and total breaths completed |
| Parker | Visual breathing guide | Animated circle that expands (inhale) and contracts (exhale) |
| Krista | Duration presets | Quick (30s), Standard (1 min), Deep reset (2 min) buttons |

### Task Guidelines
- Each task should add something **visible** to the project
- Tasks should be **independent** — no dependencies on other tasks
- Think: new button, new section, new color scheme, new text, etc.
- Everyone should be able to work at the same time without conflicts

---

## Base MVP (Phase 2)

> **One person** creates the foundation that everyone else builds on.

**What the MVP includes:**
- Single page with a simple breathing exercise
- One default pattern: 4-4-4 (inhale 4 sec, hold 4 sec, exhale 4 sec)
- Text cues: "Breathe in" / "Hold" / "Breathe out" that cycle on screen
- Start and Stop buttons
- Basic timer/cycle logic (no fancy animation required — a pulsing circle or simple visual is enough)

**What it does NOT include:**
- Pattern options (4-7-8, box breathing) — Feature 1
- Calming background/theme — Feature 2
- Cycle counter display — Feature 3
- Animated breathing circle (expand/contract) — Feature 4
- Duration preset buttons (30s, 1 min, 2 min) — Feature 5

---

## Feature Slots (Phase 3)

> These are the features team members will add. Design them to be **independent** so people can work in parallel.

### Feature 1: Breathing Pattern Selector
- **Assigned to:** Brookey
- **Description:** Add a dropdown or button group to choose between 4-4-4 (default), 4-7-8, and box breathing. Each pattern has different inhale/hold/exhale timings.
- **Files to modify/create:** `App.jsx` or `BreathingExercise.jsx`, add a `patterns` config object and selector UI

### Feature 2: Calming Theme
- **Assigned to:** Pete
- **Description:** Apply a soft, relaxing gradient background (e.g., soft blue to lavender) and adjust text/button colors for a calming feel.
- **Files to modify/create:** `App.css`, possibly a new `Theme.css` or theme variables in existing CSS

### Feature 3: Cycle Counter
- **Assigned to:** Jesse
- **Description:** Display "Breath 3 of 5" (or similar) and optionally total breaths completed during the session. Updates in real time as user cycles through breaths.
- **Files to modify/create:** `App.jsx` (or main component), add state for cycle count and a small display section

### Feature 4: Animated Breathing Circle
- **Assigned to:** Parker
- **Description:** Add an animated circle that expands during "Breathe in," holds during "Hold," and contracts during "Breathe out." Sync timing with the active breathing pattern.
- **Files to modify/create:** New `BreathingCircle.jsx` component, `App.css` for animation keyframes

### Feature 5: Duration Presets
- **Assigned to:** Krista
- **Description:** Add "Quick (30 sec)", "Standard (1 min)", and "Deep reset (2 min)" buttons. Selecting one sets how many breath cycles to run before auto-stopping (or showing a "Done" state).
- **Files to modify/create:** `App.jsx`, add preset buttons and logic to limit total cycles based on selection

---

## Success Criteria

- [ ] MVP runs locally
- [ ] Each team member has merged at least one PR
- [ ] All features work together without breaking the app
