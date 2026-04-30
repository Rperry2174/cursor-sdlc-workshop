# Product Requirements Document (PRD)

> **Instructions:** This is your project specification. Fill in the sections below to define what you're building.

---

## Project Overview

**Project Name:** SDLC Workshop Quiz

**One-line Description:** A single-page web quiz that tests recall of the software development lifecycle stages and how common tools (including Cursor) map to each stage.

**Type:** Web App (static HTML/CSS/JS or a tiny React/Vite app in `base_mvp/`)

---

## Guidelines

### Keep It Small!
- Your MVP should be buildable in **10 minutes**
- Think "proof of concept" not "production ready"
- If it sounds ambitious, make it simpler
- **Use Cursor to help you plan this!**
- This exercise is about learning the git flow and understanding where Cursor's features fit into the SDLC

### Scope notes for this project
- **Quiz content** should align with the workshop: **Plan → Design → Develop → Test → Review → Deploy**, plus high-level ideas like the **Git Sandwich** (branch → work → PR) and **Cursor** touchpoints (e.g. Plan Mode, Agent, BugBot in Review).
- **No database, auth, or external APIs** — questions live in a static array or JSON in the repo.

---

## Base MVP

> Build the minimal working version of your project first.

**What the MVP includes:**
- One page the user opens locally (`npm run dev` or open `index.html`).
- **5–8 multiple-choice questions** covering SDLC stages and/or which stage a given activity belongs to (e.g. “Where does BugBot fit?” → Review).
- User selects an answer per question; **Submit** (or auto-advance) shows **correct/incorrect** feedback.
- **Final score** (e.g. “6 / 8”) and a one-line encouragement at the end.
- Readable layout (title, progress like “Question 3 of 8”, clear buttons).

**What it does NOT include (stretch goals):**
- Timer per question
- Randomized question order
- Categories / filters by SDLC stage
- Saving scores or leaderboards
- Multiple separate routes/pages (keep it one scrollable flow or one screen at a time in the same file)

---

## Features

> Plan out the features you want to add after the MVP is working. Each feature should be in its own component file to keep things organized.

### Feature 1: Results summary
- **Description:** After the last question, show score, list missed questions with the **correct answer** and a one-sentence explanation (still static copy).
- **Files to create:** e.g. `components/ResultsSummary.jsx` (or `.js`) + optional `data/explanations.md` for copy.

### Feature 2: Progress & polish
- **Description:** Progress bar or step dots; subtle styles so the quiz feels finished (typography, spacing, focus states for a11y).
- **Files to create:** e.g. `components/ProgressBar.jsx`, `styles/quiz.css`

### Feature 3: Expand question bank
- **Description:** Add more questions (target 12–15) covering **Plan / Design / Develop / Test / Review / Deploy** evenly, still 100% client-side.
- **Files to create:** e.g. `data/questions.js` — single source of truth for prompts and correct indices.

---

## Example question topics (for you or Cursor to turn into MCQs)

Use these as seeds when writing `questions` in code:

| Topic | Example angle |
|-------|----------------|
| **Plan** | Breaking work into tasks; issues/backlog tools |
| **Design** | Architecture / UX before coding; design handoff |
| **Develop** | IDE, git branches, implementing features |
| **Test** | CI, automated checks, manual QA |
| **Review** | PRs, code review, BugBot |
| **Deploy** | Shipping to staging/production |
| **Cursor × SDLC** | Plan Mode (planning), Agent (develop), BugBot (review), etc. |
| **Git Sandwich** | Sync → branch → work → commit → PR → merge |

---

## Success Criteria

- [ ] MVP runs locally
- [ ] At least one PR merged to the original repo
- [ ] Features work without breaking the base app
- [ ] Quiz clearly tests **SDLC stage literacy** (not trick questions; workshop-aligned answers)
