# Product Requirements Document (PRD)

---

## Project Overview

**Project Name:** Trivia Blitz

**One-line Description:** A multiple-choice trivia quiz that scores you as you answer questions from a hardcoded question bank.

**Type:** Web App (single-page React app)

---

## Base MVP

> The minimal working version — just enough to play a round of trivia.

**What the MVP includes:**
- A hardcoded set of 10 trivia questions (general knowledge) stored in a data file
- Display one question at a time with four multiple-choice answer buttons
- Highlight correct/incorrect answer on click, then advance to the next question
- Track and display the running score (e.g., "3 / 5")
- A simple end screen showing the final score with a "Play Again" button

**What it does NOT include (stretch goals):**
- Timer per question
- Category selection
- Results summary with per-question breakdown

---

## Features

> Each feature is a self-contained component added after the MVP works.

### Feature 1: Question Timer
- **Description:** A countdown timer (e.g., 15 seconds) for each question. If time runs out the question is marked wrong and the quiz advances automatically.
- **Files to create:** `src/components/Timer.jsx`, `src/components/Timer.css`

### Feature 2: Category Selector
- **Description:** A start screen that lets you pick a trivia category (e.g., Science, History, Pop Culture). Each category has its own question set in the data file. The quiz only shows questions from the selected category.
- **Files to create:** `src/components/CategoryPicker.jsx`, `src/components/CategoryPicker.css`, update `src/data/questions.js` with categorized questions

### Feature 3: Results Summary
- **Description:** An end-of-quiz breakdown showing each question, the answer you chose, and whether it was correct or wrong — so you can learn from your mistakes.
- **Files to create:** `src/components/ResultsSummary.jsx`, `src/components/ResultsSummary.css`

---

## Success Criteria

- [ ] MVP runs locally
- [ ] At least one PR merged to the original repo
- [ ] Features work without breaking the base app
