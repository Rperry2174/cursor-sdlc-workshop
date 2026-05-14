# Product Requirements Document (PRD)

> **Instructions:** This is your project specification. Fill in the sections below to define what you're building.

---

## Project Overview

**Project Name:** RadiusFit Today

**One-line Description:** Find workout classes near you that still have same-day spots (or waitlists you can watch), and get notified when a waitlist slot opens.

**Type:** Single-page web app (HTML/JS or React in `base_mvp/`)

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
- **Static class list** in a local JSON or in-code array: each item has studio name, class type, start time (today or “later today”), latitude/longitude, capacity state (`open`, `full_waitlist`), and optional `waitlistOpen` flag.
- **“My location”**: either browser **Geolocation** (one prompt) or a **typed address / zip** mapped to a single lat/lng for the demo (no geocoding API required if you use a fixed center + offset coords in the seed data).
- **3-mile filter**: Haversine (or simple distance check) from the user point to each class; hide anything farther than 3 miles.
- **Same-day only**: filter classes to those whose date is **today** (use the device’s local date).
- **Waitlist notify (demo)**: for classes marked full with waitlist, a **“Notify me if a spot opens”** control. MVP simulates an opening: e.g. a **“Simulate spot opened”** button (dev/demo) or a short `setInterval` that flips one class to `open` and fires **`Notification`** API or `alert()` (with permission prompt once). No server, no real studio systems.

**What it does NOT include (stretch goals):**
- Real studio booking APIs (Mindbody, ClassPass, momence, etc.), scraping, or OAuth
- User accounts, saved favorites in a database, or email/SMS
- Push notifications when the tab is closed (requires service worker + backend or third-party service)
- Calendar sync, maps UI (optional map embed is stretch), or multi-day scheduling
- Accurate geocoding for arbitrary addresses without an API key

---

## Features

> Plan out the features you want to add after the MVP is working. Each feature should be in its own component file to keep things organized.

### Feature 1: Rich class cards
- **Description:** Show time, studio, distance, spots/waitlist badge, and primary action (Book link as `#` or external placeholder).
- **Files to create:** e.g. `base_mvp/components/ClassCard.js` (or `.jsx`) or a single module `classCard.js` if staying vanilla.

### Feature 2: Waitlist watcher (client-side simulation)
- **Description:** Track which class IDs the user asked to watch; when simulated state says a spot opened, show in-app toast/banner plus optional browser notification.
- **Files to create:** e.g. `base_mvp/waitlistWatcher.js` — small state + `Notification.requestPermission` handling.

### Feature 3: Location controls
- **Description:** Toggle between “Use my location” and “Use demo location” (preset lat/lng near your seed studios) so the demo works even if geolocation is denied.
- **Files to create:** e.g. `base_mvp/location.js` — geolocation wrapper + demo coordinates.

---

## Success Criteria

- [ ] MVP runs locally
- [ ] At least one PR merged to the original repo
- [ ] Features work without breaking the base app
