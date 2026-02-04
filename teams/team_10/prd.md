# Product Requirements Document (PRD)

> **Instructions:** This is your team's project specification. Fill in the sections below to define what you're building.

---

## Project Overview

**Project Name:** Hyrox Daily Plan

**One-line Description:** A single-page web app that shows today’s Hyrox workout and can send you a browser notification.

**Type:** Single-page web app (HTML, CSS, JavaScript — no build step)

---

## Guidelines

### Keep It Small!
- Your MVP should be buildable in **10 minutes** by one person
- Think "proof of concept" not "production ready"
- If it sounds ambitious, make it simpler

### Good Project Ideas
- A simple Chrome extension (e.g., changes page colors, adds a button)
- A single-page web app (e.g., a counter, a todo list, a timer)

### Bad Project Ideas (Too Big!)
- Anything with a database
- Anything requiring authentication
- Anything with multiple pages/screens
- Anything that "needs" an API

---

## Team Members & Tasks

> **Important:** Each team member MUST have their own task. Tasks should be independent features that can be built in parallel without stepping on each other's toes.

| Name | Task | Description |
|------|------|-------------|
| _[Name 1]_ | Notify button | Add "Notify me" button that sends a browser notification with today’s workout |
| _[Name 2]_ | This week list | Add a "This week" section listing all 7 days and workout names, with today highlighted |
| _[Name 3]_ | Styling / theme | Improve layout and colors (e.g. card for today, readable typography, responsive) |
| _[Name 4]_ | Station reference | Add a collapsible or separate section showing the 8 Hyrox stations (from appendix below) |
| _[Name 5]_ | Copy / UX text | Add short instructions, better headings, and a "How to use" line at the top |

### Task Guidelines
- Each task should add something **visible** to the project
- Tasks should be **independent** — no dependencies on other tasks
- Think: new button, new section, new color scheme, new text, etc.
- Everyone should be able to work at the same time without conflicts

---

## Base MVP (Phase 2)

> **One person** creates the foundation that everyone else builds on.

**What the MVP includes:**
- One HTML page that shows **today’s day name** (e.g. "Wednesday") and **today’s workout** (title + short description + purpose).
- Workout data for all 7 days stored in JavaScript (e.g. array of objects: day name, workout name, summary, purpose).
- Basic styling so the page is readable (header, main content area).
- App lives in `teams/team_10/hyrox-app/` (e.g. `index.html`, `app.js`, `styles.css`).

**What it does NOT include:**
- No notification button (Feature 1).
- No "This week" list (Feature 2).
- No polished theme or responsive layout (Feature 3).
- No station reference section (Feature 4).
- No extra copy or "How to use" (Feature 5).

---

## Feature Slots (Phase 3)

> These are the features team members will add. Design them to be **independent** so people can work in parallel.

### Feature 1: Notify button
- **Assigned to:** _[Team member 1]_
- **Description:** A button that requests notification permission (if needed) and sends one browser notification with today’s workout (title + short body). Use the browser Notification API.
- **Files to modify/create:** `index.html` (add button), `app.js` (add click handler, permission request, `new Notification(...)`).

### Feature 2: This week list
- **Assigned to:** _[Team member 2]_
- **Description:** A section "This week" that lists all 7 days with their workout names. The current day is visually highlighted (e.g. bold or different color).
- **Files to modify/create:** `index.html` (add section/container), `app.js` (render list, set "today" class or style).

### Feature 3: Styling / theme
- **Assigned to:** _[Team member 3]_
- **Description:** Improve the look: card or box for today’s workout, clear typography, spacing, and basic responsiveness (readable on mobile). No new behavior, only CSS and minor HTML structure if needed.
- **Files to modify/create:** `styles.css` (main changes), optionally `index.html` (class names, wrapper divs).

### Feature 4: Station reference
- **Assigned to:** _[Team member 4]_
- **Description:** Add a section (e.g. "Station reference" or "Race standards") that shows the 8 Hyrox stations in a table or list: station name, distance/reps, short note. Can be collapsible or below the fold. Use the table from the appendix below.
- **Files to modify/create:** `index.html` (section + table or list), optionally `app.js` if you render from data, `styles.css` for the section.

### Feature 5: Copy / UX text
- **Assigned to:** _[Team member 5]_
- **Description:** Add a one-line "How to use" or tagline at the top, clearer headings (e.g. "Today’s workout"), and any short instructions (e.g. "Click the button to get a notification with today’s workout"). Text only; no new features.
- **Files to modify/create:** `index.html` (headings, paragraph text, maybe a small intro).

---

## Success Criteria

- [ ] MVP runs locally (open `hyrox-app/index.html` in a browser or use a local server)
- [ ] Each team member has merged at least one PR
- [ ] All features work together without breaking the app

---

## Appendix: Hyrox Weekly Training Plan (source data)

Use this for the workout content and station reference in the app.

### Weekly plan (by day: Sunday = 0, Monday = 1, … Saturday = 6)

| Day | Workout name | Summary | Purpose |
|-----|--------------|---------|---------|
| Sunday | Active Recovery or Optional | Walk, swim, or bike 20–40 min easy — or light station practice (wall balls + farmer’s carry) + stretch. | Recovery and readiness for Monday |
| Monday | Run + Station Focus | Easy run 20–30 min (Zone 2) + 2–3 station primers. Example: 1 round of 250m SkiErg, 25m sled push, 20 wall balls (light). | Aerobic base, movement prep, low fatigue |
| Tuesday | Strength + Engine | Strength: lower body + core (squats, lunges, leg curls, planks, carries). Engine: 15–20 min intervals (1 min hard / 1 min easy on row or SkiErg). | Build strength and work capacity |
| Wednesday | Running Intervals | 6–8 × 400m or 4–5 × 800m with 90s–2 min rest (race-pace effort). Optional: short core or hip mobility. | Run speed and race-pace 1 km efforts |
| Thursday | Rest or Easy | Full rest, or 20–30 min easy run or bike + stretching/mobility. | Recovery before weekend load |
| Friday | Station Practice + Short Run | 2–3 rounds of 2–3 stations (e.g. sled push + sled pull + burpee broad jump; 50–70% of race). Run: 2–3 × 1 km steady with 2 min rest. | Race-specific skills and run–station sequencing |
| Saturday | Long Run or Tempo | 40–60 min easy, or 25–35 min with 15–20 min at tempo. | Aerobic endurance and time on feet |

### Station reference (race standards)

| Station | Distance/Reps | Notes |
|---------|----------------|-------|
| 1. SkiErg | 1000 m | Pace for 4–5 min |
| 2. Sled push | 50 m | Heavy; practice technique |
| 3. Sled pull | 50 m | Grip + hip hinge |
| 4. Burpee broad jump | 80 m | 20–40 reps typically |
| 5. Rowing | 1000 m | Steady split |
| 6. Farmer’s carry | 200 m | Grip + core |
| 7. Sandbag lunges | 100 m | Weight by division |
| 8. Wall balls | 75 reps | 9 ft target, 4 kg / 6 kg |
