# Product Requirements Document (PRD)

> **Instructions:** This is your project specification. Fill in the sections below to define what you're building.

---

## Project Overview

**Project Name:** GlucoCalc

**One-line Description:** An all-in-one diabetes dashboard that looks up carbs in food, calculates insulin doses based on your personal ratios, tracks active insulin on board, and logs blood sugar readings — all in a single page.

**Type:** Web App (single-page, vanilla HTML/CSS/JS, no backend)

---

## Guidelines

### Keep It Small!
- Your MVP should be buildable in **10 minutes**
- Think "proof of concept" not "production ready"
- If it sounds ambitious, make it simpler
- **Use Cursor to help you plan this!**
- This exercise is about learning the git flow and understanding where Cursor's features fit into the SDLC

### Design Constraints
- **No database** — all data stored in `localStorage`
- **No authentication** — single-user, local-only
- **Single page** — all panels visible on one dashboard
- **No external APIs** — carb data is a bundled local JSON lookup table
- All user settings (insulin-to-carb ratio, correction factor, target BG, insulin duration) are editable in a settings panel and persisted to `localStorage`

---

## Base MVP

> Build the minimal working version of your project first.

**What the MVP includes:**
- A **settings panel** where the user enters their personal insulin parameters:
  - Insulin-to-carb ratio (e.g., 1 unit per 10g carbs)
  - Correction factor (e.g., 1 unit drops BG by 50 mg/dL)
  - Target blood glucose (e.g., 120 mg/dL)
  - Insulin duration / active time (e.g., 4 hours)
- A **carb lookup** search box with a bundled list of ~50 common foods and their carb counts. User types a food name, sees matching results, and can tap to select one (or enter a custom carb amount).
- A **dose calculator** that takes the selected carb grams + current BG reading and outputs a recommended insulin dose:
  - `carb_dose = carbs / insulin_to_carb_ratio`
  - `correction_dose = (current_bg - target_bg) / correction_factor` (only if BG is above target)
  - `suggested_dose = carb_dose + correction_dose - active_iob`
- A **"Log Dose"** button that records the dose with a timestamp into `localStorage`
- An **Active Insulin on Board (IOB)** display that decays each logged dose linearly over the configured insulin duration and shows the current remaining IOB
- A **Blood Sugar Log** — a simple list where the user can add a BG reading (mg/dL) with a timestamp, stored in `localStorage`

**What it does NOT include (stretch goals):**
- Real Dexcom CGM integration or Bluetooth connectivity
- Actual food API (like USDA FoodData Central)
- Charts / graphs of BG over time
- Meal history or multi-day trends
- Multiple user profiles
- Export / share functionality

---

## Features

> Plan out the features you want to add after the MVP is working. Each feature should be in its own component file to keep things organized.

### Feature 1: Blood Sugar Trend Chart
- **Description:** A visual line chart that plots logged BG readings over time so the user can see trends at a glance. Uses an HTML `<canvas>` element — no chart library needed. Displays the last 24 hours of readings with time on the x-axis and mg/dL on the y-axis. Color-codes zones: green (in-range 70–180), yellow (high 180–250), red (very high 250+ or low <70).
- **Files to create:** `base_mvp/bg-chart.js`

### Feature 2: Expanded Food Database with Favorites
- **Description:** Grow the bundled food list from ~50 to ~200 items organized by category (fruits, grains, dairy, fast food, snacks, etc.). Add a "favorites" feature so the user can star frequently eaten foods and they appear at the top of search results. Favorites are persisted in `localStorage`.
- **Files to create:** `base_mvp/food-db.js` (expanded data), `base_mvp/favorites.js` (favorites logic)

### Feature 3: Dose History & Daily Summary
- **Description:** A scrollable log of all insulin doses taken, showing timestamp, carbs eaten, BG at the time, and dose given. Includes a daily summary card at the top: total carbs consumed, total insulin dosed, and average BG for the day. History persisted in `localStorage`.
- **Files to create:** `base_mvp/dose-history.js`

---

## Success Criteria

- [ ] MVP runs locally by opening `index.html` in a browser (no build step needed)
- [ ] User can search for a food and see its carb count
- [ ] Dose calculator correctly factors in carb ratio, correction, and active IOB
- [ ] Logged doses decay over time and IOB updates accordingly
- [ ] BG readings can be added and viewed in a log
- [ ] All data persists across page refreshes via `localStorage`
- [ ] At least one PR merged to the original repo
- [ ] Features work without breaking the base app
