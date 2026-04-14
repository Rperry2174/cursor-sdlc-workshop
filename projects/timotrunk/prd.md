# Product Requirements Document (PRD)

> **Instructions:** This is your project specification. Fill in the sections below to define what you're building.

---

## Project Overview

**Project Name:** Football Trivia

**One-line Description:** A multiple-choice soccer trivia quiz that tests your knowledge of the beautiful game.

**Type:** Web App (single-page HTML/CSS/JS)

---

## Guidelines

### Keep It Small!
- Your MVP should be buildable in **10 minutes**
- Think "proof of concept" not "production ready"
- If it sounds ambitious, make it simpler
- **Use Cursor to help you plan this!**
- This exercise is about learning the git flow and understanding where Cursor's features fit into the SDLC

---

## Base MVP

> Build the minimal working version of your project first.

**What the MVP includes:**
- A set of 10 hardcoded soccer trivia questions (multiple choice, 4 options each)
- Questions cover World Cup history, famous players, club records, and basic rules
- One question displayed at a time with four clickable answer buttons
- Visual feedback on correct/incorrect answers (green/red highlight)
- A running score counter ("3 / 10")
- A results screen at the end showing the final score

**What it does NOT include (stretch goals):**
- Timer per question
- Difficulty levels
- Category selector

---

## Features

> Plan out the features you want to add after the MVP is working. Each feature should be in its own component file to keep things organized.

### Feature 1: Question Timer
- **Description:** A countdown timer (e.g. 15 seconds) per question. If time runs out, the question is marked wrong and the quiz advances. Adds a visual progress bar that shrinks as time ticks down.
- **Files to create:** `timer.js`, `timer.css`

### Feature 2: Difficulty Levels
- **Description:** Three difficulty modes — Easy, Medium, Hard — each with its own question pool. Easy questions cover well-known facts, Hard questions cover obscure stats and historical records. A difficulty selector appears before the quiz starts.
- **Files to create:** `difficulty.js`, `questions-easy.js`, `questions-medium.js`, `questions-hard.js`

### Feature 3: Results Summary with Stats
- **Description:** An enhanced end screen that shows a breakdown of which questions were answered correctly vs. incorrectly, time spent per question (if timer is enabled), and a shareable text summary (e.g. "I scored 8/10 on Football Trivia — Hard mode!").
- **Files to create:** `results.js`, `results.css`

---

## Success Criteria

- [ ] MVP runs locally
- [ ] At least one PR merged to the original repo
- [ ] Features work without breaking the base app
