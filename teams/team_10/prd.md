# Product Requirements Document (PRD)

> **Instructions:** This is your team's project specification. Fill in the sections below to define what you're building.

---

## Project Overview

**Project Name:** Inbox One

**One-line Description:** A single interface to see notifications from email, text, WhatsApp, and Instagram, grouped by urgency, with a simple way to respond.

**Type:** Single-page web app (HTML + CSS + JS, or simple React/Vue)

---

## Guidelines

### Keep It Small!
- Your MVP should be buildable in **10 minutes** by one person
- Think "proof of concept" not "production ready"
- If it sounds ambitious, make it simpler

### MVP Scope (Unified Notifications)
- **No real integrations** — use mock/sample notification data only
- **No database or auth** — everything in memory or a single JSON/JS file
- **One page** — one screen that shows all notifications and a reply area

### Bad Project Ideas (Too Big!)
- Anything with a database
- Anything requiring authentication
- Anything with multiple pages/screens
- Real API connections to Gmail, WhatsApp, etc. (save for later)

---

## Team Members & Tasks

> **Important:** Each team member MUST have their own task. Tasks should be independent features that can be built in parallel without stepping on each other's toes.

| Name | Task | Description |
|------|------|-------------|
| _[Name 1]_ | Urgency filter/tabs | Add tabs or buttons to filter by Urgent / Normal / Low |
| _[Name 2]_ | Channel badges | Show source (Email, SMS, WhatsApp, Instagram) with icons or labels |
| _[Name 3]_ | Reply UI | Styling and behavior for the reply box (e.g. placeholder, send button) |
| _[Name 4]_ | Notification cards | Card layout and styling for each notification row |
| _[Name 5]_ | Header & layout | App title, simple nav, and overall layout (sidebar optional) |

### Task Guidelines
- Each task should add something **visible** to the project
- Tasks should be **independent** — no dependencies on other tasks
- Think: new button, new section, new color scheme, new text, etc.
- Everyone should be able to work at the same time without conflicts

---

## Base MVP (Phase 2)

> **One person** creates the foundation that everyone else builds on.

**What the MVP includes:**
- A single HTML page (or one main view in a framework) that displays a **list of mock notifications**.
- Each notification has: **source** (Email, SMS, WhatsApp, Instagram), **sender/preview**, **short preview text**, and **urgency** (e.g. Urgent / Normal / Low).
- Notifications are **grouped by urgency** (e.g. Urgent first, then Normal, then Low).
- A **simple reply area** at the bottom or in a panel (e.g. text input + “Send” button). For MVP, “Send” can just show an alert or append to the page — no real sending.
- Mock data: 6–10 sample notifications in a JS array or JSON, covering all four channels and at least two urgency levels.

**What it does NOT include:**
- Real email/SMS/WhatsApp/Instagram APIs
- Login or user accounts
- Persistence (refresh = reset)
- Fancy filtering, search, or settings — those are feature slots for the team

---

## Feature Slots (Phase 3)

> These are the features team members will add. Design them to be **independent** so people can work in parallel.

### Feature 1: Urgency filter / tabs
- **Assigned to:** _[Team member]_
- **Description:** Buttons or tabs (e.g. “Urgent”, “Normal”, “Low”, “All”) that filter the visible notifications by urgency.
- **Files to modify/create:** Main HTML/JS or main component; optional `styles.css` for tab styling.

### Feature 2: Channel badges
- **Assigned to:** _[Team member]_
- **Description:** Each notification shows a clear label or icon for its source (Email, SMS, WhatsApp, Instagram). Use text labels, emoji, or simple SVG/icons.
- **Files to modify/create:** Markup and CSS for notification rows; optional `icons.css` or small icon assets.

### Feature 3: Reply UI
- **Assigned to:** _[Team member]_
- **Description:** Improve the reply area: placeholder text, styled input and button, and on “Send” either show a confirmation or append a “Reply sent” message to the selected notification (mock).
- **Files to modify/create:** Main HTML/JS or reply component; `styles.css` for reply box.

### Feature 4: Notification cards
- **Assigned to:** _[Team member]_
- **Description:** Each notification is a card (border, padding, maybe avatar/icon area) with clear typography and spacing. Cards can have a hover state.
- **Files to modify/create:** HTML structure and CSS for notification cards; ensure mock data still populates cards.

### Feature 5: Header & layout
- **Assigned to:** _[Team member]_
- **Description:** Add an app header (e.g. “Inbox One”), optional subtitle, and a simple layout (e.g. list on the left, reply panel on the right, or stacked). Keep it minimal.
- **Files to modify/create:** Main HTML and CSS; optional `layout.css`.

---

## Success Criteria

- [ ] MVP runs locally and shows mock notifications grouped by urgency
- [ ] Each team member has merged at least one PR
- [ ] All features work together without breaking the app
- [ ] User can see Email, SMS, WhatsApp, and Instagram in one view and use the reply area (mock)
