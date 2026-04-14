# Product Requirements Document (PRD)

> **Instructions:** This is your project specification. Fill in the sections below to define what you're building.

---

## Project Overview

**Project Name:** Diving Destinations

**One-line Description:** Find the best scuba destinations around the world for the particular time of year.

**Type:** web application

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
- A website interface with a date selector that allows you to choose your travel dates between Date 1 and Date 2. 
- The website will then search the web and or Claude to see what are the best scuba diving destinations for that time of year.
-It will then create a score out of 10 to rank them by a series of 5 factors:
1. Water temperature
2. Overall weather and precipitation
3. Visibility
4. Currents
5. Wildlife
- And it will list the results with 3 top photos from the dive locations of the conditions and the animals possible.

**What it does NOT include (stretch goals):**
- _[List features you'll add after the MVP works]_

---

## Features

> Plan out the features you want to add after the MVP is working. Each feature should be in its own component file to keep things organized.

### Feature 1: _[Name]_
- The website will then search the web and or Claude to see what are the best scuba diving destinations for that time of year.
-It will then create a score out of 10 to rank them by a series of 5 factors:
1. Water temperature
2. Overall weather and precipitation
3. Visibility
4. Currents
5. Wildlife
- And it will list the results with 3 top photos from the dive locations of the conditions and the animals possible.

### Feature 2: _[Name]_
- **Description:** _[What it does]_
- **Files to create:** _[Be specific]_

### Feature 3: _[Name]_
- **Description:** _[What it does]_
- **Files to create:** _[Be specific]_

---

## Success Criteria

- MVP runs locally
- Website compiles
- Search results return the correct dive destinations