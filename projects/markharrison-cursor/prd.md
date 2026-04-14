# Product Requirements Document (PRD)

---

## Project Overview

**Project Name:** Masters Draft

**One-line Description:** A single-page auction draft app where friends bid on golfers with a $40 budget to build 4-player fantasy teams for major golf tournaments.

**Type:** Web App (single HTML page, no backend)

---

## Guidelines

- No database, no authentication, no API calls
- All state lives in the browser (localStorage for persistence between refreshes)
- Single page — different "phases" are shown/hidden, not separate routes
- Golfer list is hardcoded (2025 Masters field)
- Designed for pass-the-laptop or screen-share use during a live draft

---

## Base MVP

> The auction draft flow — the core of the entire app.

**What the MVP includes:**
- A hardcoded list of ~30 top golfers in the field
- Setup screen: enter player names (up to 20 people)
- Randomized draft order displayed before bidding starts
- Auction round: current golfer is nominated, players bid in $1 increments
  - Each person has a **$40 budget**
  - Min bid: **$1**, Max bid: **$37**
  - Budget validation — can't bid more than you can afford while still filling your roster
  - Winning bidder gets the golfer added to their team
- Each person drafts exactly **4 golfers**
- Draft summary screen showing all teams and remaining budgets

**What it does NOT include (stretch goals):**
- Live tournament scoring
- Cut-line tracking and final scoring
- Nomination choice (MVP uses a preset golfer order; players just bid)

---

## Features

### Feature 1: Player Nomination Choice
- **Description:** Instead of going through golfers in a fixed order, each round a player (following the randomized draft order) gets to nominate which golfer goes up for auction. This adds strategy — you can nominate a golfer you want to drive up someone else's budget, or nominate a sleeper you hope to win cheap.
- **Files to create:** `nomination.js` — nomination UI and turn logic

### Feature 2: Cut-Line Scoring
- **Description:** After the draft, enter real tournament results. Mark which golfers made the cut. For each team, take the 2 lowest-scoring golfers who made the cut plus the other 2 golfers' scores. Display a leaderboard ranking all 20 players by combined score (lowest wins). Highlight teams where fewer than 2 golfers made the cut (penalty/disqualification).
- **Files to create:** `scoring.js` — score entry form, cut tracking, and leaderboard calculation/display

### Feature 3: Draft History & Recap
- **Description:** A scrollable log of every auction result — who was nominated, the winning bid, and the winning bidder. Includes stats like "biggest spender," "best bargain," and "most contested golfer." Visible during and after the draft.
- **Files to create:** `history.js` — draft log tracking and recap stats display

---

## Success Criteria

- [ ] MVP runs locally
- [ ] At least one PR merged to the original repo
- [ ] Features work without breaking the base app
