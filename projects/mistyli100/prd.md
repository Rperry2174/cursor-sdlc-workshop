# Product Requirements Document (PRD)

---

## Project Overview

**Project Name:** Misty's Ultimate Coffee Shop Ranking

**One-line Description:** A local-first app to rate and rank your favorite coffee shops.

**Type:** Web App (single-page, no backend)

---

## Guidelines

### Keep It Small!
- MVP is a single HTML file with inline CSS/JS
- No database — uses localStorage for persistence
- No API calls — everything runs in the browser
- Buildable in ~10 minutes

---

## Base MVP

**What the MVP includes:**
- Add a coffee shop with a name and a 1–5 star rating
- Display all shops sorted by rating (best first)
- Persist data in localStorage so it survives page refreshes
- Delete a shop from the list
- Clean, modern UI with a coffee-themed color palette

**What it does NOT include (stretch goals):**
- Photo or icon for each shop
- Filtering or searching
- Review notes or comments

---

## Features

### Feature 1: Drink Tags
- **Description:** Add one or more drink-type tags (Latte, Espresso, Drip, Cold Brew, etc.) to each shop so you can see what they're known for.
- **Files to create:** Tags are added inline in `index.html` (or extracted to `src/components/DrinkTags.jsx` if migrated to React)

### Feature 2: Search & Filter
- **Description:** A search bar that filters the list by shop name in real time, plus optional filter buttons by drink tag.
- **Files to create:** `src/components/SearchBar.jsx` (or inline in `index.html`)

### Feature 3: Visit Counter & Favorites
- **Description:** Track how many times you've visited each shop (increment button) and mark favorites with a heart icon that pins them to the top.
- **Files to create:** `src/components/VisitCounter.jsx`, `src/components/FavoriteToggle.jsx`

---

## Success Criteria

- [ ] MVP runs locally (just open `index.html`)
- [ ] At least one PR merged to the original repo
- [ ] Features work without breaking the base app
