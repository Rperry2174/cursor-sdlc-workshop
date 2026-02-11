# Product Requirements Document (PRD)

> **Instructions:** This is your team's project specification. Fill in the sections below to define what you're building.

---

## Project Overview

**Project Name:** Hat Try-On

**One-line Description:** Upload a photo of yourself and try on different hats to see how you look.

**Type:** Web App (React, Vite)

---

## Guidelines

### Keep It Small!
- Your MVP should be buildable in **10 minutes** by one person
- Think "proof of concept" not "production ready"
- **Frontend only** — no server, no database, no auth, no external APIs
- Photo stays in the browser (file input → preview). Hats are static images overlaid on the photo.
- You need at least 5 features so everyone on your team can pick one and add it

### In Scope (Frontend-Only)
- User selects a photo from their device (file input)
- Photo is shown on screen; hat images are overlaid at a fixed position (e.g. top of photo)
- Clicking or selecting a hat switches which hat is shown
- All data in memory or localStorage only — no backend

### Out of Scope (Too Big for This Workshop)
- No face detection or automatic hat placement (use a fixed or manually adjustable position)
- No saving photos to a server or cloud
- No user accounts or login

---

## Team Members & Tasks

> **Important:** Each team member MUST have their own task. Tasks should be independent features that can be built in parallel.

| Name | Task | Description |
|------|------|-------------|
| _[Name 1]_ | Hat gallery / more hats | Add a visible grid or list of all hats to choose from |
| _[Name 2]_ | Hat position & size | Sliders or controls to move the hat and change its size |
| _[Name 3]_ | Compare view | Side-by-side or before/after view (e.g. no hat vs selected hat) |
| _[Name 4]_ | Favorites / “best look” | Mark one or more hats as favorites; show a simple favorites list (state only) |
| _[Name 5]_ | Download result | Button to download the photo-with-hat as an image file (canvas export) |

### Task Guidelines
- Each task should add something **visible** to the project
- Tasks should be **independent** — no dependencies on other tasks
- One component or one clear area of the app per person to avoid merge conflicts

---

## Base MVP (Phase 2)

> **One person** creates the foundation that everyone else builds on.

**What the MVP includes:**
- Single-page React app (Vite) with a file input to upload a photo
- Display the selected photo (e.g. in an `<img>` or on a canvas)
- A small set of hat images (e.g. from `public/hats/`) overlaid at a **fixed position** on the photo (e.g. top-center)
- A way to switch the active hat (e.g. buttons or a dropdown) so the overlay updates
- Minimal layout: upload area, photo + hat preview, and basic hat selector

**What it does NOT include:**
- No hat gallery UI — just enough to switch between 1–2 hats for the demo
- No position/size controls, compare view, favorites, or download — those are feature slots

---

## Feature Slots (Phase 3)

> These are the features team members will add. Design them to be **independent** so people can work in parallel.

### Feature 1: Hat gallery / more hats
- **Assigned to:** _[Team member]_
- **Description:** Show all available hats in a grid or list. Clicking one sets it as the active hat. Uses existing hat assets in `public/hats/`.
- **Files to modify/create:** e.g. `src/components/HatGallery.jsx`, and wire it into `App.jsx`

### Feature 2: Hat position & size
- **Assigned to:** _[Team member]_
- **Description:** Add sliders (or simple buttons) to move the hat up/down/left/right and to change its size so it fits different photos better.
- **Files to modify/create:** e.g. `src/components/HatControls.jsx`, and use the values in the component that renders the hat overlay

### Feature 3: Compare view
- **Assigned to:** _[Team member]_
- **Description:** A way to see “no hat” vs “current hat” side by side (or a toggle), so users can compare how they look with and without a hat.
- **Files to modify/create:** e.g. `src/components/CompareView.jsx`, and optional state in `App.jsx` for compare mode

### Feature 4: Favorites / “best look”
- **Assigned to:** _[Team member]_
- **Description:** Let the user mark the current hat as a favorite. Show a simple list or strip of favorited hats (state only; can use `useState` or `localStorage`). No backend.
- **Files to modify/create:** e.g. `src/components/Favorites.jsx`, and state/callbacks in `App.jsx` if needed

### Feature 5: Download result
- **Assigned to:** _[Team member]_
- **Description:** A “Download” button that exports the current photo-with-hat as an image file (e.g. PNG) using the Canvas API, so the user can save or share it.
- **Files to modify/create:** e.g. `src/components/DownloadButton.jsx` and a small helper that draws photo + hat to a canvas and triggers download; wire into `App.jsx`

---

## Success Criteria

- [ ] MVP runs locally (`npm run dev` in `hat-photo`)
- [ ] User can upload a photo and see at least one hat overlaid
- [ ] Each team member has merged at least one PR (one feature per person)
- [ ] All features work together without breaking the app
