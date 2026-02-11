# Product Requirements Document (PRD)

> **Instructions:** This is your team's project specification. Fill in the team member names and GitHub handles, then use this doc as your guide for building FreshFind.

---

## Project Overview

**Project Name:** FreshFind

**One-line Description:** Browse the best farmers' markets in Marin County, read user-submitted reviews, view photos, and save your favorites — all powered by stub data, no backend needed.

**Type:** Web App (React, single page)

**Key note:** All market data, reviews, and photos are **hardcoded stub data** in JavaScript files. There is no database, no API, and no authentication. New reviews submitted through the form are stored in React state for the current session only.

---

## Guidelines

### Keep It Small!
- Your MVP should be buildable in **10 minutes** by one person
- Think "proof of concept" not "production ready"
- You need at least **5 features** so everyone on your team can pick one and add it
- No database, no auth, no real API — use hardcoded market list, stub reviews, and placeholder photos

### Bad Project Ideas (Too Big!)
- Anything with a database — avoid
- Anything requiring authentication
- Anything with multiple pages/screens
- Anything that "needs" a live API

---

## Team Members & Tasks

> **Important:** Each team member MUST have their own task. Tasks should be independent features that can be built in parallel.

| Name | Task | GitHub | Description |
|------|------|--------|-------------|
| _[Name 1]_ | Market Cards | _(add username)_ | Styled card layout for each market with name, location, schedule, and placeholder image |
| _[Name 2]_ | Review List | _(add username)_ | Display stub user reviews (name, star rating, comment) for the selected market |
| _[Name 3]_ | Review Form | _(add username)_ | Form to submit a new review (name, rating, comment); stored in React state |
| _[Name 4]_ | Photo Gallery | _(add username)_ | Grid of placeholder photos for the selected market |
| _[Name 5]_ | Favorites Bar | _(add username)_ | Heart/star toggle to favorite markets and a quick-access bar showing saved picks |

### Task Guidelines
- Each task should add something **visible** to the project
- Tasks should be **independent** — no dependencies on other tasks
- One component per person to avoid merge conflicts
- Everyone should be able to work at the same time without conflicts

---

## Base MVP (Phase 2)

> **One person** creates the foundation that everyone else builds on.

**What the MVP includes:**
- Single-page React app (Vite + React)
- Hardcoded list of **~8 Marin County farmers' markets** in a data file (`src/data/markets.js`) with fields: name, location, days/hours, description, and a stub star rating (e.g. `{ id: 1, name: "Marin Civic Center Farmers' Market", location: "Marin Center, San Rafael", days: "Sundays 8am–1pm", description: "One of the largest in the Bay Area", rating: 4.5 }`)
- A simple **list of market names**; clicking one shows its basic info (name, location, hours, description)
- Minimal UI: title ("FreshFind — Marin County Farmers' Markets"), clickable list on the left, detail panel on the right
- All state managed with React `useState`

**What it does NOT include:**
- Styled market cards (Feature 1)
- Review display (Feature 2)
- Review submission form (Feature 3)
- Photo gallery (Feature 4)
- Favorites bar (Feature 5)

---

## Feature Slots (Phase 3)

> These are the features team members add. Design them to be **independent** so people can work in parallel.

### Feature 1: Market Cards
- **Assigned to:** _[Name 1]_
- **Description:** Replace the plain market list with visually styled cards. Each card shows the market name, location, schedule, and a placeholder image (use a colored box or emoji if no image URL). Clicking a card selects that market. Should look clean and modern with a simple CSS grid or flexbox layout.
- **Files to modify/create:** `src/components/MarketCard.jsx`, `src/components/MarketCard.css`; wire into `App.jsx` to replace the basic list.

### Feature 2: Review List
- **Assigned to:** _[Name 2]_
- **Description:** Show user reviews for the currently selected market. Reviews come from a stub data file with fields: reviewer name, star rating (1–5), and comment text. Display each review as a small card with stars rendered as filled/empty icons or emoji. When no market is selected, show a prompt like "Select a market to see reviews."
- **Files to modify/create:** `src/components/ReviewList.jsx`, `src/data/reviews.js`; add component to `App.jsx` in the detail panel area. Receives the selected market ID as a prop.

### Feature 3: Review Form
- **Assigned to:** _[Name 3]_
- **Description:** A form that lets users submit a new review for the selected market. Fields: your name (text input), rating (1–5 clickable stars or a dropdown), and comment (text area). On submit, the new review is added to React state so it appears in the Review List immediately. No persistence — reviews reset on page refresh.
- **Files to modify/create:** `src/components/ReviewForm.jsx`, `src/components/ReviewForm.css`; add to `App.jsx` below the review list. Calls a callback prop (e.g. `onAddReview`) to update shared state.

### Feature 4: Photo Gallery
- **Assigned to:** _[Name 4]_
- **Description:** A grid of photos for the selected market. Since there's no real backend, use placeholder colored boxes with market-themed emoji (e.g. vegetables, fruit, flowers) or free placeholder image URLs. Display 4–6 items in a responsive grid. Clicking a photo could show it slightly larger (optional stretch goal).
- **Files to modify/create:** `src/components/PhotoGallery.jsx`, `src/components/PhotoGallery.css`; optional `src/data/photos.js` for stub photo data per market. Add to `App.jsx` in the detail panel.

### Feature 5: Favorites Bar
- **Assigned to:** _[Name 5]_
- **Description:** Add a heart or star icon on each market (in the list or card) that toggles it as a favorite. Show a small bar at the top of the page listing favorited market names for quick access — clicking a name in the bar selects that market. Favorites stored in React state with `useState`. Optional stretch: persist favorites with `localStorage`.
- **Files to modify/create:** `src/components/FavoritesBar.jsx`, `src/components/FavoritesBar.css`; add to `App.jsx` above the main content area. Receives favorites array and an `onToggleFavorite` callback as props.

---

## Success Criteria

- [ ] MVP runs locally (`npm run dev`)
- [ ] Each team member has merged at least one PR
- [ ] All features work together without breaking the app
- [ ] No backend, no auth — stub market data, reviews, and photos only
