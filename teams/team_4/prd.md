# Product Requirements Document (PRD)

> **Instructions:** This is your team's project specification. Fill in the sections below to define what you're building.

---

## Project Overview

**Project Name:** LinkedIn Tracker

**One-line Description:** A single-page app to track LinkedIn follow-ups by date & time and accounts reached out to by week with notes.

**Type:** Web App (single-page, frontend only — no database, no auth, no API)

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
| Cameron | Add follow-up form | Form to add a new follow-up with date, time, and note; appends to the follow-ups list |
| _[Name 2]_ | Add outreach entry | Form to add an account + week + notes to the "Outreach by week" section |
| _[Name 3]_ | Filter follow-ups by date | Control (e.g. date picker or "Today / This week") to show only follow-ups in that range |
| _[Name 4]_ | Week selector for outreach | Dropdown or buttons to choose which week to view in the outreach section |
| _[Name 5]_ | Delete / edit items | Buttons to delete (or edit) a follow-up or an outreach entry |

### Task Guidelines
- Each task should add something **visible** to the project
- Tasks should be **independent** — no dependencies on other tasks
- Think: new button, new section, new color scheme, new text, etc.
- Everyone should be able to work at the same time without conflicts

---

## Base MVP (Phase 2)

> **One person** creates the foundation that everyone else builds on.

**What the MVP includes:**
- **Single page** with two clear sections: **Follow-ups** and **Outreach by week**.
- **Follow-ups section:** A list of items, each showing **date**, **time**, and a short **note** (e.g. "Follow up with Jane at Acme"). Data from a stub array in JS (e.g. `src/data/followUps.js`).
- **Outreach by week section:** A list grouped by week (e.g. "Week of Feb 17" or "2025-W07"), each with **accounts reached out to** and **notes**. Data from a stub array (e.g. `src/data/outreach.js`).
- **No forms yet** — display only. State can be in React state or simple JS; optional: persist in `localStorage` so refreshes keep data.
- Basic layout and styling so both sections are readable and clearly labeled.

**What it does NOT include:**
- No form to add follow-ups (Feature 1)
- No form to add outreach entries (Feature 2)
- No filter for follow-ups by date (Feature 3)
- No week selector for outreach (Feature 4)
- No delete/edit for items (Feature 5)

---

## Feature Slots (Phase 3)

> These are the features team members will add. Design them to be **independent** so people can work in parallel.

### Feature 1: Add follow-up form
- **Assigned to:** Cameron
- **Description:** A form (inputs for date, time, and note) that adds a new follow-up to the list. Submitting appends to the in-memory/list state and the new row appears in the Follow-ups section. Use a simple date and time input (or two text inputs) and a text area or input for the note.
- **Files to modify/create:** `base_mvp/src/App.jsx` (or a parent component) for state and form submit handler; optionally `base_mvp/src/components/FollowUpForm.jsx` and `base_mvp/src/components/FollowUpList.jsx`.

### Feature 2: Add outreach entry
- **Assigned to:** _[Name 2]_
- **Description:** A form to add an outreach entry: account name (or identifier), week (e.g. week picker or "current week"), and notes. Submitting adds the entry to the Outreach by week data and displays it in the correct week.
- **Files to modify/create:** `base_mvp/src/App.jsx` for outreach state and form handler; optionally `base_mvp/src/components/OutreachForm.jsx` and `base_mvp/src/components/OutreachList.jsx`.

### Feature 3: Filter follow-ups by date
- **Assigned to:** _[Name 3]_
- **Description:** A control (e.g. date picker, or buttons like "Today" / "This week" / "All") that filters the follow-ups list to show only items in the selected date range. Default can be "All".
- **Files to modify/create:** `base_mvp/src/App.jsx` (or FollowUpList) for filter state and filtered list; optionally `base_mvp/src/components/FollowUpFilter.jsx`.

### Feature 4: Week selector for outreach
- **Assigned to:** _[Name 4]_
- **Description:** A dropdown or set of buttons to choose which week to display in the Outreach by week section (e.g. "Week of Feb 10", "Week of Feb 17"). Only the selected week’s accounts and notes are shown.
- **Files to modify/create:** `base_mvp/src/App.jsx` for selected week state and filtering outreach by week; optionally `base_mvp/src/components/WeekSelector.jsx`.

### Feature 5: Delete / edit items
- **Assigned to:** _[Name 5]_
- **Description:** Each follow-up and each outreach entry has a "Delete" button (and optionally "Edit") so the user can remove or update an item. Editing can be inline or via a small modal; minimal scope is delete-only.
- **Files to modify/create:** `base_mvp/src/App.jsx` for delete (and edit) handlers; list components or new `base_mvp/src/components/FollowUpItem.jsx` and outreach item component to show the button(s).

---

## Success Criteria

- [ ] MVP runs locally
- [ ] Each team member has merged at least one PR
- [ ] All features work together without breaking the app
