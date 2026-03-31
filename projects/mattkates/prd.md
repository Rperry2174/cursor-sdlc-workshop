# Product Requirements Document (PRD)

> **Instructions:** This is your project specification. Fill in the sections below to define what you're building.

---

## Project Overview

**Project Name:** _SpendSense Lite_

**One-line Description:** _A simple home finance dashboard that organizes monthly expenses and highlights where to cut spending first._

**Type:** _Single-page Web App_

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
- One page with hardcoded sample expense data across categories (rent, utilities, groceries, credit card payments, subscriptions).
- A summary section that shows:
  - total monthly spending
  - top 3 spending categories
  - total monthly subscription cost
- A simple "Actionable Advice" panel with basic rule-based suggestions, for example:
  - "Your subscriptions are over $X/month, review and cancel unused services."
  - "Dining out is your #1 variable expense, reduce by 15% to save $Y/month."
  - "Credit card payments exceed X% of budget, prioritize highest-interest balance first."

**What it does NOT include (stretch goals):**
- User accounts or authentication
- Database storage / backend server
- Bank integrations or real credit card API connections
- Multi-page navigation
- Advanced forecasting or ML predictions

---

## Features

> Plan out the features you want to add after the MVP is working. Each feature should be in its own component file to keep things organized.

### Feature 1: _Editable Expense Input_
- **Description:** Replace hardcoded values with a simple form so users can enter/update monthly category amounts directly in the app.
- **Files to create:** _`src/components/ExpenseForm.jsx`, `src/components/ExpenseTable.jsx`_

### Feature 2: _Subscription Cleanup Assistant_
- **Description:** Add a dedicated subscriptions list with toggles (keep/cancel) and show projected monthly savings after canceling selected subscriptions.
- **Files to create:** _`src/components/SubscriptionList.jsx`, `src/components/SavingsPreview.jsx`_

### Feature 3: _Budget Target Tracker_
- **Description:** Let users set a target monthly spend and display progress with over/under indicators by category.
- **Files to create:** _`src/components/BudgetTargetForm.jsx`, `src/components/BudgetProgress.jsx`_

---

## Success Criteria

- [ ] MVP runs locally
- [ ] At least one PR merged to the original repo
- [ ] Features work without breaking the base app
