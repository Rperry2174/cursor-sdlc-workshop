# Product Requirements Document (PRD)

> **Instructions:** This is your team's project specification. Fill in the sections below to define what you're building.

---

## Project Overview

**Project Name:** Trial Follow-up Tracker

**One-line Description:** Track people in trials and see when they hit 1-, 2-, and 3-week markers so you know when to follow up, with a mock Slack-style alert to the owner.

**Type:** Web App (React, single page)

---

## Guidelines

### Keep It Small!
- Your MVP should be buildable in **10 minutes** by one person
- Think "proof of concept" not "production ready"
- If it sounds ambitious, make it simpler
- **Use Cursor to help you plan this!** You need a project that has at least 5 features so everyone on your team can pick one and add it
- Feel free to take one of the ideas below — this exercise is about learning the git flow, collaborating as a team, and understanding where Cursor's features fit into the SDLC

### Scope for this project
- **No real Slack or backend** — we stub it: an "Alerts" panel shows what *would* be sent to the owner (or a button that adds to a "Sent to Slack" list on the page).
- **No database** — trial contacts live in a hardcoded list (or in-memory state); one person can add a simple "Add contact" form that uses React state.
- **Single page** — one React app: list of trial contacts, start dates, milestone markers (1w, 2w, 3w), and owner. Alerts are simulated in the UI.

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

> **Note:** All tasks are assigned to one person. Tasks are independent features you can build in any order.

| Name        | Task                    | Description |
|-------------|-------------------------|-------------|
| Jack Fisher | Milestone badges        | Show 1w / 2w / 3w badges on each trial contact card based on start date. |
| Jack Fisher | Owner display           | Show owner per contact (column or label) so we know who gets the alert. |
| Jack Fisher | Follow-up alerts panel  | Panel that lists "Would notify in Slack" (or mock "Sent") for contacts at a marker, to their owner. |
| Jack Fisher | Filter by milestone     | Filter the list: All / 1 week / 2 weeks / 3 weeks. |
| Jack Fisher | Add trial contact form  | Form to add a new trial contact (name, start date, owner); updates in-memory list. |

### Task Guidelines
- Each task should add something **visible** to the project
- Tasks should be **independent** — minimal dependencies so you can build in any order
- Think: new button, new section, new component, new filter, etc.

---

## Base MVP (Phase 2)

> **You** create the foundation, then add the features below.

**What the MVP includes:**
- Single React page (Vite + React) with a **hardcoded list** of 3–5 trial contacts (e.g. in `data/trialContacts.js` or at top of `App.jsx`).
- Each contact has: **name**, **trial start date**, **owner** (string).
- List or card layout showing each contact.
- **Milestone logic**: given a fixed "today" (or real `new Date()`), compute for each contact whether they’ve hit 1 week, 2 weeks, or 3 weeks; show this as plain text (e.g. "1w ✓, 2w ✓, 3w —") so the app is usable before the Milestone badges feature.
- Minimal styling so the app runs and is readable.

**What it does NOT include:**
- Fancy milestone badges (Feature 1)
- Owner column/label (Feature 2)
- Alerts / "Slack" panel (Feature 3)
- Filter UI (Feature 4)
- Add-contact form (Feature 5)

---

## Feature Slots (Phase 3)

> These are the features you will add. They are **independent** so you can build them in any order.

### Feature 1: Milestone badges
- **Assigned to:** Jack Fisher
- **Description:** For each trial contact, show 1w / 2w / 3w as visual badges (e.g. pills or tags). Green or checkmark when reached, gray or empty when not. Use the same date logic as the base MVP.
- **Files to modify/create:** `src/components/MilestoneBadges.jsx` (new); use it in the contact list/card in `App.jsx` or the main list component.

### Feature 2: Owner display
- **Assigned to:** Jack Fisher
- **Description:** Show the owner for each trial contact (e.g. a column in the list or a label on each card). Makes it clear who "gets" the follow-up alert for that contact.
- **Files to modify/create:** `src/components/OwnerDisplay.jsx` (new), or add an owner column/cell in the existing list/card component.

### Feature 3: Follow-up alerts panel (Slack stub)
- **Assigned to:** Jack Fisher
- **Description:** A panel/section that shows follow-up alerts: e.g. "Would send to Slack to [Owner]: [Contact] hit 2-week marker." Can be a list of such messages, or a button "Send to Slack" that adds the message to a "Sent to Slack" list on the page (no real API).
- **Files to modify/create:** `src/components/FollowUpAlertsPanel.jsx` (new); App passes contacts that are at a marker and their owners.

### Feature 4: Filter by milestone
- **Assigned to:** Jack Fisher
- **Description:** Dropdown or tabs: "All" | "1 week" | "2 weeks" | "3 weeks". Filter the visible list so only contacts at the selected milestone(s) are shown.
- **Files to modify/create:** `src/components/MilestoneFilter.jsx` (new); App holds filter state and passes filtered list (or filter value) to the list component.

### Feature 5: Add trial contact form
- **Assigned to:** Jack Fisher
- **Description:** Form with fields: name, trial start date, owner. On submit, add the contact to the list (React state or state lifted to App). No backend — in-memory only.
- **Files to modify/create:** `src/components/AddTrialContactForm.jsx` (new); App manages the list state and adds the new contact.

---

## Success Criteria

- [ ] MVP runs locally
- [ ] At least one PR merged (or all work committed and pushed)
- [ ] All features work together without breaking the app
