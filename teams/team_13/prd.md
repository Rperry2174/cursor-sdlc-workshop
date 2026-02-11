# Product Requirements Document (PRD)

This is a markdown file.

> **Instructions:** This is your team's project specification. Fill in the sections below to define what you're building.

---

## Project Overview

**Project Name:** World Cup Prediction

**One-line Description:** Pick your favorite World Cup team and the app shows their **% chance of winning the World Cup** (using stub data — no real API).

**Type:** Web App (React, single page)

**Key note:** The core flow is **choose a team → see that team’s win probability**. All percentages are hardcoded or derived from stub data; no backend or live API.

---

## Guidelines

### Keep It Small!
- Your MVP should be buildable in **10 minutes** by one person
- Think "proof of concept" not "production ready"
- You need at least **5 features** so everyone on your team can pick one and add it
- No database, no auth, no real API — use hardcoded team list and stub win percentages

### Bad Project Ideas (Too Big!)
- Anything with a database — avoid
- Anything requiring authentication
- Anything with multiple pages/screens
- Anything that "needs" a live API

---

## Team Members & Tasks

> **Important:** Each team member MUST have their own task. Tasks should be independent features that can be built in parallel.

| Name    | Task                 | GitHub              | Description                                                                 |
|---------|----------------------|---------------------|-----------------------------------------------------------------------------|
| Joe T   | Team picker          | @josephtuccicursor  | List of World Cup teams; user selects “my favorite” (dropdown, cards, or buttons) |
| Alex D  | Win % display        | _(add username)_    | Shows the selected team’s % chance of winning (big, clear number + team name)   |
| David C | "Why this %"         | _(add username)_    | Short breakdown or factors (e.g. form, draw, history) — all stub copy
| Chris D | Team rankings        | _(add username)_    | All teams ranked by win % (table or list from stub data)                      |
| Sam G   | Theme or celebration | _(add username)_    | Light/dark/World Cup theme toggle, or confetti/celebration when you pick a team  |

### Task Guidelines
- Each task should add something **visible** to the project
- Tasks should be **independent** — no dependencies on other tasks
- One component per person where possible to avoid merge conflicts

---

## Base MVP (Phase 2)

> **One person** creates the foundation that everyone else builds on.

**What the MVP includes:**
- Single-page React app (Vite + React)
- Hardcoded list of **World Cup teams** in a data file (e.g. `src/data/teams.js`) with team name and a **stub win %** per team (e.g. `{ name: "Brazil", winPercent: 18 }`)
- One way to **pick a team** (e.g. dropdown or first team pre-selected)
- Display that team’s **% chance of winning** (read from stub data)
- Minimal UI: title, picker, one big “X%” for selected team; no backend — all state in React

**What it does NOT include:**
- Fancy team selector / cards (Joe T)
- Polished win % display (Alex D)
- “Why this %” breakdown (David C)
- Full rankings table (Chris D)
- Theme or celebration (Sam G)

---

## Feature Slots (Phase 3)

> These are the features team members add. Design them to be **independent** so people can work in parallel.

### Feature 1: Team picker
- **Assigned to:** Joe T
- **Description:** Let the user choose their favorite team from the World Cup list — e.g. dropdown, clickable cards, or button grid. Selection updates the displayed win % (state in React).
- **Files to modify/create:** `src/components/TeamPicker.jsx` (or extend base); use `src/data/teams.js`. Wire selection to `App.jsx` state.

### Feature 2: Win % display
- **Assigned to:** Alex D
- **Description:** Show the selected team’s win percentage prominently (e.g. big number, team name, “Chance of winning the World Cup”). Read from stub data based on selected team.
- **Files to modify/create:** `src/components/WinPercentDisplay.jsx`; add to `App.jsx`; receive selected team (or team id) as props.

### Feature 3: “Why this %” breakdown
- **Assigned to:** David C
- **Description:** Short breakdown of why the team has that % — e.g. “Form 20%, Draw difficulty 30%, History 50%.” All stub copy per team (or one generic message). No real logic.
- **Files to modify/create:** `src/components/WhyThisPercent.jsx` or `Breakdown.jsx`; optional `src/data/breakdowns.js`; add to `App.jsx`.

### Feature 4: Team rankings
- **Assigned to:** Chris D
- **Description:** List or table of all teams ranked by win % (highest first). Data from `src/data/teams.js`. User can see where their pick ranks.
- **Files to modify/create:** `src/components/TeamRankings.jsx`; add to `App.jsx`.

### Feature 5: Theme or celebration
- **Assigned to:** Sam G
- **Description:** Either a light/dark or World Cup–themed style toggle, or a simple celebration (e.g. confetti/emoji) when the user picks a team. Purely UI.
- **Files to modify/create:** `src/components/ThemeToggle.jsx` or `Celebration.jsx`; add to `App.jsx` and any CSS needed.

---

## Success Criteria

- [ ] MVP runs locally (`npm run dev`)
- [ ] Each team member has merged at least one PR
- [ ] All features work together without breaking the app
- [ ] No backend, no auth — stub team list and win percentages only
