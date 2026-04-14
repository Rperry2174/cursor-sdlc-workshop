# Product Requirements Document (PRD)

---

## Project Overview

**Project Name:** Yahtzee

**One-line Description:** An interactive Yahtzee dice game for 1–4 players with score tracking, player icons, and an AI opponent for solo play.

**Type:** Web App (React, single-page)

---

## Base MVP

> The minimal working version: a single-player Yahtzee game with core mechanics.

**What the MVP includes:**
- A start screen where you enter your name
- Five dice that you can roll (up to 3 rolls per turn)
- Ability to hold/lock individual dice between rolls
- A scorecard on the right showing all 13 Yahtzee categories (Ones through Sixes, Three of a Kind, Four of a Kind, Full House, Small Straight, Large Straight, Yahtzee, Chance)
- Automatic score calculation — click a category to lock in your score for that turn
- Upper section bonus (35 points if upper total >= 63)
- Game ends after 13 rounds; final score is displayed
- Two-panel layout: dice + roll controls on the left, scorecard on the right

**What it does NOT include (stretch goals):**
- Multiplayer support (2–4 players)
- AI computer opponent
- Player icons / avatars

---

## Features

> Each feature is additive — it builds on the working MVP without rewriting core logic.

### Feature 1: Multiplayer (2–4 Players)
- **Description:** A player-select screen lets you choose 1–4 players and enter a name for each. The game rotates turns between players, highlighting whose turn it is. Each player has their own scorecard column. A winner is declared at the end.
- **Files to create:**
  - `src/components/PlayerSetup.jsx` — player count picker + name entry form
  - `src/components/PlayerIndicator.jsx` — shows whose turn it is with a highlight

### Feature 2: AI Computer Opponent
- **Description:** When only 1 human player is selected, a computer opponent is added automatically. The AI takes its turn after the human, using a simple strategy (prioritize high-value categories, re-roll low dice). Its rolls and scoring animate briefly so the player can follow along.
- **Files to create:**
  - `src/components/ComputerPlayer.jsx` — AI turn logic and animation
  - `src/data/aiStrategy.js` — scoring heuristics for which dice to hold and which category to pick

### Feature 3: Player Icons / Avatars
- **Description:** Each player picks an icon/avatar (emoji-based) during setup. The icon appears next to their name on the scorecard, on the dice area when it's their turn, and on the final results screen.
- **Files to create:**
  - `src/components/IconPicker.jsx` — grid of emoji icons to choose from
  - `src/data/avatars.js` — list of available avatar emojis

---

## Success Criteria

- [ ] MVP runs locally with `npm run dev`
- [ ] Single-player Yahtzee is fully playable (all 13 rounds, correct scoring)
- [ ] At least one PR merged to the original repo
- [ ] Features work without breaking the base app
