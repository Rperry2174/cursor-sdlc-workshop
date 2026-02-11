# Product Requirements Document (PRD)

> **Instructions:** This is your team's project specification. Fill in the sections below to define what you're building.

---

## Project Overview

**Project Name:** Sunny Day Weather

**One-line Description:** A simple single-page weather app that shows current conditions and a small forecast using stub data (no real API).

**Type:** Web App (React, single page)

---

## Guidelines

### Keep It Small!
- Your MVP should be buildable in **10 minutes** by one person
- Think "proof of concept" not "production ready"
- If it sounds ambitious, make it simpler
- **Use Cursor to help you plan this!** You need a project that has at least 5 features so everyone on your team can pick one and add it
- Feel free to take one of the ideas below — this exercise is about learning the git flow, collaborating as a team, and understanding where Cursor's features fit into the SDLC

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
- Anything with a database -- tell cursor to avoid this
- Anything requiring authentication
- Anything with multiple pages/screens
- Anything that "needs" an API

---

## Team Members & Tasks

> **Important:** Each team member MUST have their own task. Tasks should be independent features that can be built in parallel without stepping on each other's toes.

| Name   | Task              | Description                                              |
|--------|-------------------|----------------------------------------------------------|
| Jack   | Unit toggle       | Switch between °C and °F for all temperatures            |
| Allegra| Location selector | Dropdown or buttons to pick from 2–3 stub cities         |
| Hanna  | Condition icon    | Show a sun/cloud/rain icon based on current condition    |
| Nini   | Extra stats card  | Display "Feels like", humidity, wind from stub data      |

### Task Guidelines
- Each task should add something **visible** to the project
- Tasks should be **independent** — no dependencies on other tasks
- Think: new button, new section, new color scheme, new text, etc.
- Everyone should be able to work at the same time without conflicts

---

## Base MVP (Phase 2)

> **One person** creates the foundation that everyone else builds on.

**What the MVP includes:**
- A single React app (Vite + React) that runs with `npm run dev`
- Stub weather data in a file (e.g. `src/data/weatherStub.js`) with at least: location name, temperature (number), condition (e.g. "Sunny", "Cloudy", "Rainy")
- One main view that displays: current location name, current temperature in one unit, and the condition as text
- Basic layout and styling so the page looks like a simple weather card

**What it does NOT include:**
- Unit toggle (°C / °F) — for Jack
- Location selector / multiple cities — for Allegra
- Condition icon or illustration — for Hanna
- "Feels like", humidity, wind, or other stats — for Nini

---

## Feature Slots (Phase 3)

> These are the features team members will add. Design them to be **independent** so people can work in parallel.

### Feature 1: Unit toggle (°C / °F)
- **Assigned to:** Jack
- **Description:** A control (e.g. toggle or two buttons) that switches the displayed temperature between Celsius and Fahrenheit. Conversion can use the formula `F = C * 9/5 + 32`. Only the main current temperature needs to switch; other stats can follow the same unit if they’re added.
- **Files to modify/create:** `src/App.jsx` (or equivalent) to hold unit state; optionally a small `UnitToggle.jsx` component and its CSS.

### Feature 2: Location selector
- **Assigned to:** Allegra
- **Description:** Let the user pick from 2–3 hardcoded locations (e.g. "San Francisco", "New York", "London"). Stub data should include an entry per city (same shape: location, temperature, condition). Selecting a location updates the displayed weather to that city’s stub data.
- **Files to modify/create:** Extend `src/data/weatherStub.js` (or similar) with multiple cities; add `LocationSelector.jsx` (dropdown or button group); wire selection into `App.jsx` so current location state drives what’s shown.

### Feature 3: Condition icon
- **Assigned to:** Hanna
- **Description:** Based on the current condition string (e.g. "Sunny", "Cloudy", "Rainy"), show a simple icon or illustration next to the condition text. Icons can be emoji, SVG, or a small image — no external API or icon service required.
- **Files to modify/create:** `ConditionIcon.jsx` (or similar) that takes `condition` as a prop and renders the right icon; use it in the main weather view (e.g. in `App.jsx` or wherever current weather is rendered).

### Feature 4: Extra stats card
- **Assigned to:** Nini
- **Description:** Display extra stub fields: "Feels like" temperature, humidity (%), and wind (e.g. "5 mph"). Add these fields to the stub data and show them in a small card or section so the layout stays clear.
- **Files to modify/create:** Update `src/data/weatherStub.js` to include `feelsLike`, `humidity`, `wind` per location; add `ExtraStats.jsx` (or similar) and render it in the main view.

---

## Success Criteria

- [ ] MVP runs locally
- [ ] Each team member has merged at least one PR
- [ ] All features work together without breaking the app
