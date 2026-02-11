# Product Requirements Document (PRD)

> **Instructions:** This is your team's project specification. Fill in the sections below to define what you're building.

---

## Project Overview

**Project Name:** Quick Todo

**One-line Description:** A minimal single-page todo list where you can add and manage items.

**Type:** Single-page web app (HTML, CSS, JavaScript)

---

## Guidelines

### Keep It Small!
- Your MVP should be buildable in **10 minutes** by one person
- Think "proof of concept" not "production ready"
- If it sounds ambitious, make it simpler

### Good Project Ideas
- A simple Chrome extension (e.g., changes page colors, adds a button)
- A single-page web app (e.g., a counter, a todo list, a timer)
- A typing-speed game that measures your words per minute

### Bad Project Ideas (Too Big!)
- Anything with a database
- Anything requiring authentication
- Anything with multiple pages/screens
- Anything that "needs" an API

---

## Team Members & Tasks

> **Important:** Each team member MUST have their own task. Tasks should be independent features that can be built in parallel without stepping on each other's toes.

| Name | Task | Description |
|------|------|-------------|
| Clint | Clear All button | Button that removes all todos from the list |
| _[Name 2]_ | Item counter | Display "X items" (or "No items") above the list |
| _[Name 3]_ | Basic styling | Add CSS so the list and input look like a simple card |
| _[Name 4]_ | Mark complete | Checkbox or toggle on each item to mark it done (strikethrough) |
| _[Name 5]_ | Persist with localStorage | Save todos so they're still there after refresh |

### Task Guidelines
- Each task should add something **visible** to the project
- Tasks should be **independent** — no dependencies on other tasks
- Think: new button, new section, new color scheme, new text, etc.
- Everyone should be able to work at the same time without conflicts

---

## Base MVP (Phase 2)

> **One person** creates the foundation that everyone else builds on.

**What the MVP includes:**
- One HTML page with an input field and "Add" button
- A list (ul/ol) where new todos appear when you click Add
- Basic JavaScript to add items to the list (no styling required)
- All in one file or simple index.html + script is fine

**What it does NOT include:**
- Clear All, item counter, styling, mark complete, or localStorage (those are Phase 3 features)

---

## Feature Slots (Phase 3)

> These are the features team members will add. Design them to be **independent** so people can work in parallel.

### Feature 1: Clear All button
- **Assigned to:** Clint
- **Description:** A "Clear All" button that removes every item from the todo list when clicked.
- **Files to modify/create:** Same HTML/JS file as MVP (e.g. `index.html` or `app.js`). Add button, wire click handler to clear the list DOM and any in-memory array.

### Feature 2: Item counter
- **Assigned to:** _[Name 2]_
- **Description:** Display a line like "3 items" or "No items" that updates when items are added or removed.
- **Files to modify/create:** Same file(s) as MVP. Add an element for the count and update it whenever the list changes.

### Feature 3: Basic styling
- **Assigned to:** _[Name 3]_
- **Description:** Add CSS so the input, button, and list look like a simple card (e.g. box, padding, maybe a border or shadow).
- **Files to modify/create:** MVP HTML file and/or a new `style.css`; link the stylesheet and add classes as needed.

### Feature 4: Mark complete
- **Assigned to:** _[Name 4]_
- **Description:** Each todo item gets a checkbox (or toggle). When checked, show the item as complete (e.g. strikethrough). Toggling off removes the strikethrough.
- **Files to modify/create:** Same file(s) as MVP. When rendering each item, add a checkbox and style the text based on checked state.

### Feature 5: Persist with localStorage
- **Assigned to:** _[Name 5]_
- **Description:** Save the list of todos to localStorage when it changes, and load from localStorage on page load so todos survive a refresh.
- **Files to modify/create:** Same JS as MVP. On load, read from localStorage and render; on add/remove/clear, write the current list to localStorage.

---

## Success Criteria

- [ ] MVP runs locally
- [ ] Each team member has merged at least one PR
- [ ] All features work together without breaking the app
