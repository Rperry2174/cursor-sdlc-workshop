# Product Requirements Document (PRD)

> Commanders Jeopardy — a Jeopardy-style trivia board about Washington's NFL team!

---

## Project Overview

**Project Name:** Commanders Jeopardy

**One-line Description:** A Jeopardy-style trivia board game with categories and point values testing knowledge of the Washington Commanders — their history, players, stats, and memorable moments.

**Type:** Web App (single HTML file, no build tools)

---

## Constraints

- Single `index.html` file — all HTML, CSS, and JS inline
- No database, no API calls, no authentication
- All trivia questions hardcoded in a JS array/object
- Must run by simply opening the file in a browser
- Use the current Commanders "W" logo and branding

---

## Base MVP

> The minimal playable version of the game.

**What the MVP includes:**
- **Setup screen** where players enter names (1–4 players). If only 1 human player, a CPU opponent ("Coach") is automatically added.
- A Jeopardy-style game board with **5 categories** and **5 point values** ($100–$500) per category
- 25 total questions covering Washington Commanders history, players, and facts
- Categories: "Franchise History", "Legendary Players", "Super Bowl Era", "Modern Commanders", "By the Numbers"
- **Turn-based play** — current player's name is highlighted; turns rotate after each question
- The active player clicks a tile to open a question modal with the clue
- 4 multiple-choice answer options per question
- Instant right/wrong feedback — green flash for correct, red for wrong
- Points awarded to the answering player for correct answers, no deduction for wrong
- **CPU opponent ("Coach")** — when it's the CPU's turn, it auto-selects a tile, "thinks" for 1–2 seconds, then picks an answer. CPU has ~60% accuracy (weighted random) so it's beatable but competitive.
- **Scoreboard** showing all players' scores, always visible above or beside the board
- Current player indicator (glowing border or arrow) so everyone knows whose turn it is
- Answered tiles become disabled/dimmed on the board
- Team-themed design: burgundy (`#773141`), gold (`#FFB612`), and white
- Commanders "W" drawn via CSS/SVG in the header
- Clean Jeopardy board aesthetic — blue tiles with gold dollar amounts, dark background

**What it does NOT include (stretch goals):**
- Timer per question
- Sound effects
- Daily Double mechanic
- Detailed results breakdown

---

## Features

> Each feature is a self-contained enhancement added after the MVP works.

### Feature 1: Countdown Timer
- **Description:** Add a 15-second countdown timer that appears when a question is opened. If time runs out, the question is marked wrong and the modal closes. A horizontal progress bar drains from gold to red as time decreases. The last 5 seconds pulse to create urgency.
- **Files to modify:** `base_mvp/index.html` (add timer bar to question modal + JS countdown logic)

### Feature 2: Daily Double
- **Description:** Randomly assign 2 tiles as "Daily Doubles" each game. When a player clicks a Daily Double tile, they see a "DAILY DOUBLE!" animation before the question appears. If answered correctly, the point value is doubled. The Daily Double assignment is randomized on each new game.
- **Files to modify:** `base_mvp/index.html` (add Daily Double selection logic, animation, and double-score handling)

### Feature 3: Results Breakdown & Fun Verdict
- **Description:** When all 25 tiles are answered (or the player clicks "Finish Game"), show a full results screen. Display final score, a per-category breakdown (points earned vs. available), and a fun verdict based on total score (e.g., 0–2000: "Bench Warmer", 2100–4000: "Season Ticket Holder", 4100–5500: "Pro Bowler", 5600–7500: "Hail to the Commander!"). Include a "Play Again" button that reshuffles Daily Doubles and restarts.
- **Files to modify:** `base_mvp/index.html` (add results overlay with category breakdown + verdict logic)

---

## Success Criteria

- [ ] MVP runs locally by opening `index.html` in a browser
- [ ] Jeopardy board renders correctly with all 25 tiles clickable
- [ ] Multiplayer turn rotation works for 2–4 players
- [ ] Solo mode auto-adds CPU opponent that plays its turns automatically
- [ ] At least one PR merged to the original repo
- [ ] Features work without breaking the base app
- [ ] All 25 trivia questions have verified correct answers
