# Product Requirements Document (PRD)

> **Instructions:** This is your project specification. Fill in the sections below to define what you're building.

---

## Project Overview

**Project Name:** Reservation Check

**One-line Description:** Enter a location (from Google Maps or address/name); get a direct link to that place on Google Maps so you can check **Reserve** and see real availability (Resy, OpenTable, Tock) in one place.

**Type:** Web App (single page)

**Location input:** User provides the restaurant location in one of two ways:
- **Paste a Google Maps place URL** (e.g. from sharing a restaurant in Maps) — we extract the place and link to it.
- **Type an address or restaurant name** — we use Google Places API (Text Search) to find the place, then link to it on Maps.

**How availability works:** We do **not** fetch availability into our app (Google and the booking platforms don’t expose slot-level data to third-party apps). Instead we **deep-link to Google Maps**: the user clicks **"Check availability on Google Maps"** and opens that place on Maps, where they can tap **Reserve** to see real times (Resy/OpenTable/Tock show there via Reserve with Google).

---

## Guidelines

### Keep It Small!
- Your MVP should be buildable in **10 minutes**
- Think "proof of concept" not "production ready"
- If it sounds ambitious, make it simpler
- **Use Cursor to help you plan this!**
- This exercise is about learning the git flow and understanding where Cursor's features fit into the SDLC

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
- Anything with a database — tell Cursor to avoid this
- Anything requiring authentication
- Anything with multiple pages/screens
- Anything that "needs" an API

---

## Base MVP

> Build the minimal working version of your project first.

**What the MVP includes:**
- **Location input**
  - **Option A:** User pastes a **Google Maps place URL** (e.g. `https://www.google.com/maps/place/...`). Parse the URL to get place name/identifier; if the URL contains a `place_id` or we can derive one, use it. Otherwise use Places API **Find Place from URL** or **Text Search** with the place name from the URL.
  - **Option B:** User types an **address or restaurant name**; call **Places API Text Search** to get the first matching place (place_id, name, address).
- **Place card:** Show the resolved place (name, address). Optionally show **"Accepts reservations"** if the Places API returns `reservable: true` (Place Details, Enterprise+ field).
- **Primary CTA:** A button **"Check availability on Google Maps"** that opens the place on Google Maps in a new tab, e.g. `https://www.google.com/maps/search/?api=1&query=place_id:PLACE_ID`. There the user can click **Reserve** to see real availability (Resy, OpenTable, Tock) — we don’t show slots in our app; we send them to where they’re visible.
- **Backend:** A small backend or serverless function that calls the **Google Places API** (API key kept server-side). Frontend sends location (URL or text); backend returns place_id, displayName, formattedAddress, googleMapsUri (or build the search URL), and optionally `reservable`.

**What it does NOT include (stretch goals):**
- Showing actual time slots inside our app (not exposed by Google or booking platforms to us)
- Real Resy / OpenTable / Tock API integration
- Actual booking in our app
- User accounts or authentication

---

## Features

> Plan out the features you want to add after the MVP is working. Each feature should be in its own component file to keep things organized.

### Feature 1: Parse Google Maps URLs
- **Description:** When the user pastes a Google Maps place URL, parse it to extract place_id (or place name) so we can call Place Details or build the Maps link. Support common URL shapes (e.g. `/place/Name/...`, `?q=place_id:ChIJ...`).
- **Files to create:** `utils/parseMapsUrl.js` (or .ts), use in the existing location input / API handler.

### Feature 2: Reservable badge
- **Description:** Call Place Details with the `reservable` field (Places API Enterprise+). Show an "Accepts reservations" badge on the place card when true, and optionally hide or soften the CTA when false.
- **Files to create:** Update backend Place Details request and response; add `ReservableBadge.jsx` (or show inline in the place card).

### Feature 3: Recent / saved places
- **Description:** Let the user save or see recently looked-up places (e.g. in `localStorage`). Clicking a saved place fills the input and fetches the place again, then shows the same "Check availability on Google Maps" CTA.
- **Files to create:** `SavedPlaces.jsx`, `hooks/useSavedPlaces.js` (or equivalent); persist place_id and displayName.

---

## Success Criteria

- [ ] MVP runs locally
- [ ] At least one PR merged to the original repo
- [ ] Features work without breaking the base app
