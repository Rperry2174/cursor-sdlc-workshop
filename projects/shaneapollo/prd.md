# Product Requirements Document (PRD)

> **Instructions:** This is your project specification. Fill in the sections below to define what you're building.

---

## Project Overview

**Project Name:** Ink Memory Match

**One-line Description:** A terminal-based memory card matching game where you flip face-down cards to find pairs, all rendered in the CLI using React via Ink.

**Type:** CLI Tool (Node.js + TypeScript + [Ink](https://github.com/vadimdemedes/ink))

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
- A Node.js CLI entrypoint (`npx ink-memory-match` or `npm start`) that renders an Ink app in the terminal.
- A fixed **4×3 grid (12 cards = 6 pairs)** of face-down cards, each labeled with an emoji or single character when revealed.
- **Keyboard navigation** with arrow keys (↑ ↓ ← →); the currently-selected card is visually highlighted.
- **Flip** a card with `Space` or `Enter`. After two cards are flipped:
  - If they match → they stay revealed.
  - If they don't match → both flip back face-down after a short delay (~800ms).
- **Win state**: once all pairs are matched, show a simple "You win!" message and exit on any key.
- Deterministic shuffle per run (no persistence, no save files).

**What it does NOT include (stretch goals):**
- Move counter, timer, difficulty/grid size selection
- Sound, animations beyond simple flip delay
- Saving high scores to disk
- Multiplayer or network play
- Any database, auth, or HTTP server

---

## Features

> Plan out the features you want to add after the MVP is working. Each feature should be in its own component file to keep things organized.

### Feature 1: Move Counter
- **Description:** Track how many times the player has flipped a pair of cards (each two-card turn = 1 move). Display the count at the top of the screen, and include it in the win message (e.g. "You won in 14 moves!").
- **Files to create:**
  - `base_mvp/src/components/MoveCounter.tsx` — Ink component that reads a `moves` prop and renders it as a `<Text>` line.
  - Update `base_mvp/src/App.tsx` to maintain `moves` state and increment it each time a second card is flipped.

### Feature 2: Game Timer
- **Description:** Show elapsed time (mm:ss) since the first card was flipped. Timer starts on the first flip and stops when the game is won. Display alongside the move counter.
- **Files to create:**
  - `base_mvp/src/components/Timer.tsx` — Ink component that uses `setInterval` inside `useEffect` to tick every second; exposes `running` and `onTick` props or an internal state.
  - `base_mvp/src/hooks/useGameClock.ts` — small reusable hook returning `{ elapsedMs, start, stop, reset }`.
  - Update `base_mvp/src/App.tsx` to start the clock on first flip and stop it on win.

### Feature 3: Difficulty / Grid Size Selector
- **Description:** On launch, show a small menu letting the player pick Easy (2×2), Medium (4×3), or Hard (4×4). Selected size determines the number of pairs dealt. After selection, the game board renders at that size.
- **Files to create:**
  - `base_mvp/src/components/DifficultySelect.tsx` — Ink component using `ink-select-input` (or a hand-rolled list + `useInput`) to pick a difficulty.
  - `base_mvp/src/lib/deck.ts` — pure function `buildDeck(pairCount: number): Card[]` so the deck size is data-driven, not hard-coded.
  - Update `base_mvp/src/App.tsx` with a top-level `phase` state machine: `'menu' | 'playing' | 'won'`.

---

## Success Criteria

- [ ] MVP runs locally via `npm start` (or `npx tsx src/cli.tsx`) and is playable end-to-end in the terminal
- [ ] At least one PR merged to the original repo
- [ ] Features work without breaking the base app (each feature is self-contained in its own component/file)
