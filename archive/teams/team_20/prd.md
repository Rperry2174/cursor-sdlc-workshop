# Product Requirements Document (PRD)

---

## Project Overview

**Project Name:** Wordle Arcade

**One-line Description:** A Wordle clone with retro arcade vibes, flashy animations, and a super fun, game-y UI.

**Type:** Web App (React + Vite)

---

## Guidelines

### Keep It Small!
- Your MVP should be buildable in **10 minutes** by one person
- Think "proof of concept" not "production ready"
- If it sounds ambitious, make it simpler
- **Use Cursor to help you plan this!** You need a project that has at least 5 features so everyone on your team can pick one and add it
- Feel free to take one of the ideas below — this exercise is about learning the git flow, collaborating as a team, and understanding where Cursor's features fit into the SDLC

### Technical Constraints
- **Frontend only** — no databases, servers, APIs, or authentication
- Word list is a **hardcoded JavaScript array** with `Math.random()` to pick the daily word
- All game state lives in React `useState` — no state management libraries
- High scores / streaks can use `localStorage` to survive refreshes
- Scaffold with `npm create vite@latest -- --template react`

---

## Team Members & Tasks

> **Important:** Each team member MUST have their own task. Tasks should be independent features that can be built in parallel without stepping on each other's toes.

| Name | Task | Description |
|------|------|-------------|
| _[Name 1]_ | Tile Flip Animations | Flip and bounce animations on letter tiles when a guess is submitted |
| _[Name 2]_ | Victory / Defeat Celebration | Confetti particles and a game-over modal when you win or lose |
| _[Name 3]_ | Sound Effects | Retro 8-bit sounds for typing, submitting, correct/wrong, and win/lose |
| _[Name 4]_ | Streak Tracker & Stats | Win streak counter and guess distribution chart, saved to localStorage |
| _[Name 5]_ | Theme Switcher | Toggle between neon arcade, retro pixel, and dark mode visual themes |

### Task Guidelines
- Each task should add something **visible** (or audible!) to the project
- Tasks should be **independent** — no dependencies on other tasks
- Each feature lives in its own component file — no merge conflicts
- Everyone should be able to work at the same time

---

## Base MVP (Phase 2)

> **One person** creates the foundation that everyone else builds on.

**What the MVP includes:**
- A 5-letter word guessing game with 6 attempts
- A grid of letter tiles (6 rows x 5 columns) that fills in as you type
- Color-coded feedback: green (correct spot), yellow (wrong spot), gray (not in word)
- An on-screen keyboard showing which letters have been used and their color state
- A hardcoded word list (~50-100 words) with `Math.random()` to pick the target word
- Basic game-y styling: dark background, bold colors, chunky fonts
- Win/lose detection (but no fancy celebration — that's a feature)

**What it does NOT include (left for team features):**
- No tile flip or bounce animations (Feature 1)
- No confetti or game-over modal (Feature 2)
- No sound effects (Feature 3)
- No streak tracking or stats (Feature 4)
- No theme switching (Feature 5)

---

## Feature Slots (Phase 3)

> These are the features team members will add. Design them to be **independent** so people can work in parallel.

### Feature 1: Tile Flip Animations
- **Assigned to:** _[Team member]_
- **Description:** When a guess is submitted, each tile flips over one-by-one (left to right, with a stagger delay) to reveal its color. Tiles also do a subtle bounce/pop when a letter is typed. Uses CSS keyframe animations.
- **Files to modify/create:** `src/components/TileAnimations.css` (keyframes and animation classes), minor className additions in the existing grid component

### Feature 2: Victory / Defeat Celebration
- **Assigned to:** _[Team member]_
- **Description:** When the player wins, a confetti particle burst covers the screen and tiles do a victory wave. When they lose, tiles shake. A modal pops up showing the result and a "Play Again" button. All visuals, no external libraries needed — use CSS animations and a simple canvas or DOM-based particle effect.
- **Files to modify/create:** `src/components/Celebration.jsx`, `src/components/Celebration.css`

### Feature 3: Sound Effects
- **Assigned to:** _[Team member]_
- **Description:** Retro 8-bit style sound effects that play on key events: a click sound when typing, a whoosh when submitting a guess, a rising chime for correct letters, a buzz for wrong, a fanfare for winning, and a sad trombone for losing. Uses the Web Audio API to generate sounds programmatically (no audio files needed).
- **Files to modify/create:** `src/components/SoundEffects.jsx` (hook or component that exposes play functions), `src/utils/sounds.js` (Web Audio API tone generators)

### Feature 4: Streak Tracker & Stats
- **Assigned to:** _[Team member]_
- **Description:** Tracks the player's win streak, total games played, win percentage, and guess distribution (bar chart showing how many games were won in 1, 2, 3... 6 guesses). Stats persist in `localStorage`. Displayed in a stats panel that slides in from the side or pops up as a modal.
- **Files to modify/create:** `src/components/StatsPanel.jsx`, `src/components/StatsPanel.css`

### Feature 5: Theme Switcher
- **Assigned to:** _[Team member]_
- **Description:** A toggle button (or dropdown) that switches between 3 visual themes: **Neon Arcade** (glowing borders, hot pink/cyan on black), **Retro Pixel** (pixelated font, muted earth tones, chunky borders), and **Dark Mode Classic** (clean dark theme, subtle grays). Themes are implemented as CSS custom properties (variables) that swap out when the theme changes. Selection persists in `localStorage`.
- **Files to modify/create:** `src/components/ThemeSwitcher.jsx`, `src/themes/neon.css`, `src/themes/retro.css`, `src/themes/dark.css`

---

## Success Criteria

- [ ] MVP runs locally with `npm run dev`
- [ ] Each team member has merged at least one PR
- [ ] All features work together without breaking the app
- [ ] The game feels fun and arcade-y — not like a homework assignment
