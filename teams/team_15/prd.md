# Product Requirements Document (PRD)

> **Instructions:** This is your team's project specification. Fill in the sections below to define what you're building.

---

## Project Overview

**Project Name:** GTM Coffee Chat Tracker

**One-line Description:** A single-page web app to track coffee chats between Cursor GTM team members and visualize connection progress.

**Type:** Single-Page Web App (HTML/CSS/JS with localStorage)

---

## Guidelines

### Keep It Small!
- Your MVP should be buildable in **10 minutes** by one person
- Think "proof of concept" not "production ready"
- If it sounds ambitious, make it simpler

### Good Project Ideas
- A simple Chrome extension (e.g., changes page colors, adds a button)
- A single-page web app (e.g., a counter, a todo list, a timer)
- A typing-speed game that measures your words per minute

### Bad Project Ideas (Too Big!)
- Anything with a database
- Anything requiring authentication
- Anything with multiple pages/screens
- Anything that "needs" an API

---

## Team Members & Tasks

> **Important:** Each team member MUST have their own task. Tasks should be independent features that can be built in parallel without stepping on each other's toes.

| Name | Task | Description |
|------|------|-------------|
| _[Name 1]_ | Random Pairing | Add a "Suggest Random Chat" button that picks two unconnected people |
| _[Name 2]_ | Stats Dashboard | Add a stats section showing total chats, completion percentage |
| _[Name 3]_ | Search & Filter | Add search box to filter team members by name |
| _[Name 4]_ | Theme Toggle | Add dark/light mode toggle with custom color schemes |
| _[Name 5]_ | Chat Notes | Add ability to add notes/topics to each completed chat |

### Task Guidelines
- Each task should add something **visible** to the project
- Tasks should be **independent** — no dependencies on other tasks
- Think: new button, new section, new color scheme, new text, etc.
- Everyone should be able to work at the same time without conflicts

---

## Base MVP (Phase 2)

> **One person** creates the foundation that everyone else builds on.

**What the MVP includes:**
- Single HTML page with embedded CSS and JS
- Hardcoded list of GTM team members displayed as a grid of cards
- Click a team member card to toggle "chat completed" state (visual checkmark)
- LocalStorage persistence so state survives page refresh
- Simple, clean Cursor-branded styling (dark background, accent colors)

**What it does NOT include:**
- No random pairing feature (Feature 1)
- No stats/analytics section (Feature 2)
- No search or filtering (Feature 3)
- No theme switching (Feature 4)
- No notes or additional chat details (Feature 5)

---

## Feature Slots (Phase 3)

> These are the features team members will add. Design them to be **independent** so people can work in parallel.

### Feature 1: Random Pairing Suggester
- **Assigned to:** _[Team member 1]_
- **Description:** Adds a "Suggest a Chat" button at the top of the page. When clicked, it randomly selects a team member you haven't chatted with yet and highlights their card with an animation. If you've chatted with everyone, shows a congratulations message.
- **Files to modify/create:** `index.html` — add button in header section and JS function `suggestRandomChat()`

### Feature 2: Stats Dashboard
- **Assigned to:** _[Team member 2]_
- **Description:** Adds a stats bar/section showing: total team members, chats completed, chats remaining, and a visual progress bar. Updates dynamically when chats are marked complete.
- **Files to modify/create:** `index.html` — add stats section div and JS function `updateStats()`

### Feature 3: Search & Filter
- **Assigned to:** _[Team member 3]_
- **Description:** Adds a search input field that filters the team member grid in real-time as you type. Shows only members whose names match the search query. Includes a clear button.
- **Files to modify/create:** `index.html` — add search input in header and JS function `filterMembers()`

### Feature 4: Theme Toggle
- **Assigned to:** _[Team member 4]_
- **Description:** Adds a toggle button (sun/moon icon) to switch between dark mode and light mode. Saves preference to localStorage. Includes smooth CSS transitions between themes.
- **Files to modify/create:** `index.html` — add theme toggle button and CSS variables for both themes, JS function `toggleTheme()`

### Feature 5: Chat Notes
- **Assigned to:** _[Team member 5]_
- **Description:** When a team member card is clicked (and marked as chatted), shows a small text input to add optional notes about the conversation (topics discussed, follow-ups). Notes are saved to localStorage and displayed on the card.
- **Files to modify/create:** `index.html` — add notes input/display to card template and JS function `saveNote()`

---

## Success Criteria

- [ ] MVP runs locally (just open index.html in browser)
- [ ] Each team member has merged at least one PR
- [ ] All features work together without breaking the app
- [ ] Coffee chat status persists across page refreshes
- [ ] App displays all GTM team members in a clean, scannable grid
