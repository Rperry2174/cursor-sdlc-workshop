# Product Requirements Document (PRD)

---

## Project Overview

**Project Name:** PageTurner

**One-line Description:** A lightweight book tracker where you can browse a catalog, mark books as "read" or "want to read," and rate the ones you've finished.

**Type:** Web App (React, frontend-only)

---

## How It Works

- A hardcoded catalog of ~20 books (title, author, cover color, genre) lives in a `data.js` file
- Users browse the catalog, click a book to see details, and toggle shelf status ("Want to Read" / "Reading" / "Read")
- All state lives in React `useState` — no database, no API, no auth
- `localStorage` persists shelves and ratings across page refreshes

---

## Team Members & Tasks

| Name | Task | Description |
|------|------|-------------|
| Kevin | Base MVP | Catalog grid, book data, shelf toggle |
| _[Name 2]_ | Star Ratings | Rate finished books 1–5 stars |
| _[Name 3]_ | Search & Filter | Search by title/author, filter by genre |
| _[Name 4]_ | Reading Stats | Dashboard showing books read, pages, genre breakdown |
| _[Name 5]_ | Theme Switcher | Light/dark mode toggle with persisted preference |

---

## Base MVP (Phase 2)

> **One person** (Kevin) creates the foundation that everyone else builds on.

**What the MVP includes:**
- A hardcoded book catalog in `src/data/books.js` (~20 books with title, author, genre, pages, cover color)
- `BookCard` component — displays a book's cover, title, and author
- `BookGrid` component — renders all books in a responsive grid
- `ShelfBadge` component — shows current shelf status and lets you toggle between "Want to Read" / "Reading" / "Read"
- State managed in `App.jsx` with `useState`, persisted to `localStorage`
- Clean, modern CSS with a bookshelf-inspired palette

**What it does NOT include:**
- Star ratings (Feature 1)
- Search or filtering (Feature 2)
- Reading statistics (Feature 3)
- Theme switching (Feature 4)

---

## Feature Slots (Phase 3)

> Each feature is its own component file — teammates work in parallel with no merge conflicts.

### Feature 1: Star Ratings
- **Assigned to:** _[Team member]_
- **Description:** After marking a book as "Read," display a clickable 1–5 star rating. Ratings persist to `localStorage`. Stars appear on the book card and in a detail view.
- **Files to create:** `src/components/StarRating.jsx`, `src/components/StarRating.css`

### Feature 2: Search & Filter
- **Assigned to:** _[Team member]_
- **Description:** A search bar at the top that filters books by title or author as you type. Genre filter buttons (e.g., Fiction, Sci-Fi, Non-Fiction) that narrow the displayed catalog.
- **Files to create:** `src/components/SearchBar.jsx`, `src/components/GenreFilter.jsx`

### Feature 3: Reading Stats Dashboard
- **Assigned to:** _[Team member]_
- **Description:** A stats panel showing total books read, total pages, and a simple genre breakdown (e.g., "Fiction: 5, Sci-Fi: 3"). Reads shelf data from the same state in `App.jsx`.
- **Files to create:** `src/components/ReadingStats.jsx`, `src/components/ReadingStats.css`

### Feature 4: Theme Switcher
- **Assigned to:** _[Team member]_
- **Description:** A toggle button in the header that switches between light and dark mode. Uses CSS variables so the entire app updates. Preference persists to `localStorage`.
- **Files to create:** `src/components/ThemeSwitcher.jsx`, `src/styles/themes.css`

### Feature 5: Book Notes
- **Assigned to:** _[Team member]_
- **Description:** A small text area on each book card (when expanded) to jot down personal notes or a one-line review. Notes persist to `localStorage`.
- **Files to create:** `src/components/BookNotes.jsx`, `src/components/BookNotes.css`

---

## Success Criteria

- [ ] MVP runs locally with `npm run dev`
- [ ] Each team member has merged at least one PR
- [ ] All features work together without breaking the app
- [ ] Shelves and ratings persist across page refreshes
