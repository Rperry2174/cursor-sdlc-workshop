# Product Requirements Document (PRD)

---

## Project Overview

**Project Name:** ManxPad

**One-line Description:** A Tinder-style property browser for houses on the Isle of Man — swipe right to like, swipe left to skip, then schedule viewings with one click.

**Type:** Web App (React + Vite)

---

## Guidelines

### Keep It Small!
- Your MVP should be buildable in **10 minutes**
- Think "proof of concept" not "production ready"
- If it sounds ambitious, make it simpler
- **Use Cursor to help you plan this!**
- This exercise is about learning the git flow and understanding where Cursor's features fit into the SDLC

### Workshop Constraints
- **No databases** — property data is hardcoded in a JavaScript file
- **No servers or APIs** — everything runs in the browser
- **No authentication** — no login or user accounts
- **No external API calls** — property data uses realistic but static entries
- **Scheduling** is handled via a `mailto:` link that opens the user's real email client

---

## Base MVP

> Build the minimal working version of your project first.

**What the MVP includes:**
- A hardcoded array of ~12 Isle of Man properties in `src/data/properties.js`, each with:
  - Property name and address (real Isle of Man towns: Douglas, Peel, Ramsey, Port Erin, Castletown, Onchan, Laxey, Port St Mary)
  - Price in GBP
  - Number of bedrooms and bathrooms
  - Short description
  - Property type (house, flat, cottage, townhouse)
  - Estate agent name and email
  - Placeholder property image URL
- A **PropertyCard** component displaying the current property (image, price, location, bedrooms, description)
- **Like / Skip buttons** to accept or reject each property
- A simple app flow managed by React state: swiping through cards one at a time
- When all cards are reviewed, a basic list of liked properties is shown
- Clean, modern styling that looks good on screen

**What it does NOT include (stretch goals):**
- Filter/criteria panel before swiping
- mailto-based viewing scheduler
- Swipe drag animations and visual polish

---

## Features

> Plan out the features you want to add after the MVP is working. Each feature should be in its own component file to keep things organized.

### Feature 1: Filter Criteria Panel
- **Description:** A screen shown before the swiping begins. The user can set preferences — maximum price (slider or dropdown), minimum number of bedrooms, and property type (house/flat/cottage/any). These filters narrow down the hardcoded property list so the user only swipes through relevant properties.
- **Files to create:** `src/components/FilterPanel.jsx`

### Feature 2: Schedule Viewing (mailto)
- **Description:** After all properties have been swiped, the results screen shows the user's liked properties grouped by estate agent. A "Schedule Viewings" button generates a `mailto:` link that opens the user's email client. The email is pre-filled with a subject line, a greeting, and a list of the liked properties with addresses — one email per estate agent, or a single email with all agents in the "to" field. This is a real action — it genuinely opens their email ready to send.
- **Files to create:** `src/components/ResultsScreen.jsx`

### Feature 3: Swipe Animations and Polish
- **Description:** Smooth card animations that make the swiping feel tactile and fun. When the user clicks like/skip (or drags the card), the current card slides off-screen to the right or left. A green checkmark or red X overlays the card while it's being dismissed. The next card slides in from behind. Adds visual personality to the app.
- **Files to create:** `src/components/SwipeCard.jsx`, `src/styles/animations.css`

---

## App Flow

```
[Filter Panel] --apply filters--> [Swipe Deck] --swipe right--> liked list
                                                --swipe left---> skipped
                                  [Swipe Deck] --no cards left--> [Results Screen]
                                  [Results Screen] --Schedule Viewings--> opens email client
```

---

## Tech Decisions

| Decision | Choice | Reason |
|---|---|---|
| Framework | React + Vite | Fast dev server, hot reload, workshop standard |
| State management | `useState` / `useRef` | Simple enough for this app, no libraries needed |
| Routing | None — state-driven views | Single-page app, switch views with a state variable |
| Styling | CSS (App.css + component styles) | Keep it simple, no CSS-in-JS libraries |
| Property data | Hardcoded JS array | No backend, realistic Isle of Man listings |
| Viewing requests | `mailto:` links | Real action, no server required |

---

## Success Criteria

- [ ] MVP runs locally with `npm run dev`
- [ ] Can swipe through all property cards
- [ ] Liked properties are tracked and shown at the end
- [ ] At least one PR merged to the original repo
- [ ] Features work without breaking the base app
