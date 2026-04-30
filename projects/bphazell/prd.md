# Product Requirements Document (PRD)

> **Instructions:** This is your project specification. Fill in the sections below to define what you're building.

---

## Project Overview

**Project Name:** `Quick Quiz Blitz`

**One-line Description:** A single-page trivia quiz app that asks multiple choice questions and shows your final score.

**Type:** Web App (single page)

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
- Render a fixed set of 5 trivia questions from a local array
- Show one question at a time with 4 multiple-choice answers
- Let user select an answer and move to the next question
- Track score and show a final results screen at the end
- Add a "Play Again" button to restart the quiz

**What it does NOT include (stretch goals):**
- Question timer
- Category selection
- Detailed answer review
- Difficulty levels

---

## Features

> Plan out the features you want to add after the MVP is working. Each feature should be in its own component file to keep things organized.

### Feature 1: `Question Timer`
- **Description:** Adds a countdown per question and auto-submits as incorrect if time runs out.
- **Files to create:** `base_mvp/src/components/QuestionTimer.jsx`

### Feature 2: `Category Selector`
- **Description:** Lets users choose a category (e.g., General, Tech, Sports) before starting the quiz.
- **Files to create:** `base_mvp/src/components/CategorySelector.jsx`, `base_mvp/src/data/questionsByCategory.js`

### Feature 3: `Answer Review`
- **Description:** Shows each question after game end with the correct answer and the user's selected answer.
- **Files to create:** `base_mvp/src/components/AnswerReview.jsx`

---

## Success Criteria

- [ ] MVP runs locally
- [ ] At least one PR merged to the original repo
- [ ] Features work without breaking the base app
