# Product Requirements Document (PRD)

---

## Project Overview

**Project Name:** Wardrobe Generator

**One-line Description:** A single-page React app that randomly generates outfits from a hardcoded wardrobe of tops, bottoms, and shoes — displayed on a visual mannequin you can re-roll with one click.

**Type:** Web App (React, frontend-only)

---

## Guidelines

### Keep It Small!
- The MVP is buildable in **10 minutes** by one person
- Frontend-only — no database, no server, no API calls
- All clothing data is hardcoded in a JS file
- Single page, no routing
- State managed with React `useState` — no extra libraries

---

## Team Members & Tasks

> **Important:** Each team member has their own independent feature. All features are separate components that plug into the MVP without conflicting with each other.

| Name | Task | Description |
|------|------|-------------|
| Faisal | Weather / Season Filter | Add a season selector that filters clothing items to weather-appropriate choices |
| Noah Zender | Saved Outfits Gallery | Add ability to favorite/save generated outfits and view them in a gallery strip |
| Ryan Aznar | Color Palette Matcher | Add a color-theme picker that constrains generated outfits to complementary color palettes |
| Zoë | Occasion Selector | Add an occasion picker (Casual, Work, Party, Sport) that filters items by dress code |
| Audrey | Outfit History | Add a "recently generated" timeline that shows the last several outfits you rolled |
| Will | Randomize Animation | Add a fun slot-machine spin animation when generating a new outfit |

### Task Guidelines
- Each task should add something **visible** to the project
- Tasks should be **independent** — no dependencies on other tasks
- Each feature lives in its own component file to avoid merge conflicts
- Everyone should be able to work at the same time without conflicts

---

## Base MVP (Phase 2)

> **One person** creates the foundation that everyone else builds on.

**What the MVP includes:**
- A React app scaffolded with Vite (`npm create vite@latest -- --template react`)
- A hardcoded wardrobe data file (`src/data/wardrobe.js`) containing arrays of tops, bottoms, and shoes — each item has a `name`, `color`, `emoji`, and `tags` (e.g., `["summer", "casual"]`)
- An `App.jsx` that displays a simple visual outfit card (emoji-based mannequin showing the selected top, bottom, and shoes)
- A **"Generate Outfit"** button that randomly picks one item from each category
- Basic, clean styling in `App.css` — centered layout, modern fonts, card-style outfit display

**What it does NOT include:**
- No weather/season filtering (Faisal's feature)
- No saved outfits or favorites (Noah's feature)
- No color coordination or palette matching (Ryan's feature)
- No occasion/dress-code filtering (Zoë's feature)
- No outfit history timeline (Audrey's feature)
- No spin/shuffle animation (Will's feature)

---

## Feature Slots (Phase 3)

> These are the features team members will add. Design them to be **independent** so people can work in parallel.

### Feature 1: Weather / Season Filter
- **Assigned to:** Faisal ([@F-shaikh](https://github.com/F-shaikh))
- **Description:** Adds a row of season buttons (Summer, Winter, Spring, Fall) above the outfit card. When a season is selected, the "Generate Outfit" logic filters the wardrobe data to only include items whose `tags` array contains the selected season. A highlighted button shows the active filter. An "All Seasons" option clears the filter. The component renders the filter UI and exposes the selected season via a callback prop so `App.jsx` can pass it to the generate logic.
- **Files to modify/create:**
  - Create `src/components/SeasonFilter.jsx` — the filter button row component
  - Create `src/components/SeasonFilter.css` — styling for the filter buttons
  - Modify `App.jsx` — import `SeasonFilter`, add state for `selectedSeason`, pass it to the generate function

### Feature 2: Saved Outfits Gallery
- **Assigned to:** Noah Zender ([@noah-zender](https://github.com/noah-zender))
- **Description:** Adds a "Save Outfit" heart/bookmark button on the outfit card. Clicking it saves the current outfit to a list stored in `localStorage`. Below the main outfit card, a horizontal gallery strip displays saved outfits as small thumbnail cards. Clicking a saved outfit loads it back into the main display. A small "x" button on each thumbnail removes it from saved outfits.
- **Files to modify/create:**
  - Create `src/components/SavedOutfits.jsx` — the gallery strip component
  - Create `src/components/SavedOutfits.css` — styling for the gallery thumbnails
  - Modify `App.jsx` — import `SavedOutfits`, add state for `savedOutfits`, add the save button and wire up localStorage read/write

### Feature 3: Color Palette Matcher
- **Assigned to:** Ryan Aznar ([@raznar](https://github.com/raznar))
- **Description:** Adds a color-theme dropdown or set of palette swatches (e.g., "Monochrome", "Earth Tones", "Bold & Bright", "Pastels"). When a palette is selected, the generate logic only picks items whose `color` field matches one of the colors in that palette. Each palette is defined as a hardcoded mapping of palette name to allowed color values. An "Any Colors" option disables the filter. The active palette visually previews its colors as small circles.
- **Files to modify/create:**
  - Create `src/components/ColorPalette.jsx` — the palette picker component
  - Create `src/components/ColorPalette.css` — styling for the swatches and dropdown
  - Modify `App.jsx` — import `ColorPalette`, add state for `selectedPalette`, pass it to the generate function

### Feature 4: Occasion Selector
- **Assigned to:** Zoë ([@zoe-barnswell](https://github.com/zoe-barnswell))
- **Description:** Adds a row of occasion/dress-code buttons (Casual, Work, Party, Sport) above or beside the outfit card. When an occasion is selected, the generate logic filters wardrobe items to only those whose `tags` array includes the selected occasion. A highlighted pill shows the active occasion. An "Any Occasion" option clears the filter. Works independently from the Season Filter — both can be active at the same time since they both filter on the `tags` array.
- **Files to modify/create:**
  - Create `src/components/OccasionSelector.jsx` — the occasion button row component
  - Create `src/components/OccasionSelector.css` — styling for the occasion pills
  - Modify `App.jsx` — import `OccasionSelector`, add state for `selectedOccasion`, pass it to the generate function

### Feature 5: Outfit History
- **Assigned to:** Audrey ([@pippi888](https://github.com/pippi888))
- **Description:** Adds a "Recently Generated" section below the main outfit card that shows the last 5 outfits you rolled as small cards in a horizontal row (newest on the left). Each history card displays the three emojis stacked vertically. Clicking a history card loads that outfit back into the main display. The history resets on page refresh (kept in React state only, no localStorage). A small "Clear History" button lets you wipe the list.
- **Files to modify/create:**
  - Create `src/components/OutfitHistory.jsx` — the history timeline component
  - Create `src/components/OutfitHistory.css` — styling for the history strip
  - Modify `App.jsx` — import `OutfitHistory`, add state for `outfitHistory` array, push to it each time "Generate Outfit" is clicked

### Feature 6: Randomize Animation
- **Assigned to:** Will
- **Description:** Adds a fun slot-machine-style spin animation when the "Generate Outfit" button is clicked. Each clothing slot (top, bottom, shoes) rapidly cycles through random emojis for about 1 second before landing on the final pick, with each slot stopping in sequence (top first, then bottom, then shoes). Uses CSS keyframes and `setTimeout` — no animation libraries needed. While the animation is playing, the "Generate" button shows a spinner and is disabled to prevent double-clicks.
- **Files to modify/create:**
  - Create `src/components/SpinAnimation.jsx` — the animated outfit display component (wraps the emoji slots)
  - Create `src/components/SpinAnimation.css` — keyframe animations and transition styles
  - Modify `App.jsx` — import `SpinAnimation`, add `isSpinning` state, use `SpinAnimation` in place of the static emoji display when generating

---

## Wardrobe Data Shape

For reference, each item in `src/data/wardrobe.js` should follow this shape so all features can rely on the same structure:

```js
export const TOPS = [
  { name: "White T-Shirt", emoji: "👕", color: "white", tags: ["summer", "spring", "casual", "sport"] },
  { name: "Black Hoodie", emoji: "🧥", color: "black", tags: ["winter", "fall", "casual"] },
  { name: "Blazer", emoji: "🧥", color: "navy", tags: ["fall", "spring", "work", "party"] },
  // ...
];

export const BOTTOMS = [
  { name: "Blue Jeans", emoji: "👖", color: "blue", tags: ["winter", "fall", "spring", "casual"] },
  { name: "Chinos", emoji: "👖", color: "khaki", tags: ["spring", "fall", "work", "casual"] },
  // ...
];

export const SHOES = [
  { name: "White Sneakers", emoji: "👟", color: "white", tags: ["summer", "spring", "casual"] },
  // ...
];
```

---

## Success Criteria

- [ ] MVP runs locally with `npm run dev`
- [ ] Each team member has merged at least one PR
- [ ] All six features work together without breaking the app
- [ ] Outfit generation works with any combination of filters active
