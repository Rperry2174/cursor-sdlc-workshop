# Product Requirements Document (PRD)

> This PRD scopes your existing Phoebe Philo mock review idea down into a workshop-sized MVP.

---

## Project Overview

**Project Name:** `Phoebe Philo Mock Review Board`

**One-line Description:** A small local web app for reviewing mock fashion listings with simple filters and editorial-style cards.

**Type:** Single-page web app using local mock JSON data

---

## Guidelines

### Keep It Small!
- The MVP should work with local dummy data only.
- No database, auth, scraping, or external APIs.
- Keep everything on one screen.
- Focus on a polished proof of concept, not a full production workflow.

### Project framing
- This is based on an existing mock review app you already created.
- For the workshop version, the goal is to capture the core experience in a much smaller build.
- The core experience is: load listings, browse them visually, and filter them quickly.

---

## Base MVP

> Build the minimal working version of your project first.

**What the MVP includes:**
- Load a local JSON file of mock listings
- Show listing cards with image, title, price, category, note, and review status
- Filter listings by category
- Filter listings by review status
- Toggle a `New only` view
- Show simple summary stats like total items and count by status

**What it does NOT include (stretch goals):**
- Scraping or syncing with a real marketplace
- Login, saving user preferences, or persistent edits
- Multiple pages or admin tools
- Complex search, sorting, or recommendation logic

---

## Features

> Plan out the features to add after the MVP works. Keep each feature isolated so it can be built safely.

### Feature 1: Filter Sidebar
- **Description:** Adds category, review status, and `New only` filters so the board feels fast to scan and easy to narrow down.
- **Files to create:** `base_mvp/src/components/FilterSidebar.js`, `base_mvp/src/data/listings.json`

### Feature 2: Stats Header
- **Description:** Adds a compact stats section showing totals for all items plus counts for `Buy`, `Maybe`, and `Pass`.
- **Files to create:** `base_mvp/src/components/StatsHeader.js`, `base_mvp/src/utils/stats.js`

### Feature 3: Curator's Pick
- **Description:** Adds one extra cool feature: a highlighted "best current pick" card that updates based on the active filters and surfaces the strongest `Buy` item on the board.
- **Files to create:** `base_mvp/src/components/CuratorsPick.js`, `base_mvp/src/utils/curatorsPick.js`

---

## Success Criteria

- [ ] MVP runs locally
- [ ] Listings render from local mock data
- [ ] Filters update the visible board correctly
- [ ] At least one PR merged to the original repo
- [ ] Stretch features work without breaking the base app
