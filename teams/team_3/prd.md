# Product Requirements Document (PRD)

---

## Project Overview

**Project Name:** AgentBoard

**One-line Description:** A Kanban-style webapp for visually managing AI agents across workflow stages, with simulated work animations.

**Type:** Web App (React, frontend-only)

---

## What We're Building

AgentBoard is a drag-and-drop-style Kanban board where each card represents an AI agent. Agents can be assigned to columns that represent workflow stages (e.g. "Researching", "Building"). When an agent is placed in a column, a loading animation plays for a random duration (5s–60s) to simulate the agent doing work. All data is dummy/hardcoded — no real API calls.

---

## Core Requirements

1. **5 default columns:** "Researching", "Designing", "Building", "Testing", "Deploying"
2. **Add column button:** Opens a form with two fields — "Name" and "Context" (a text box describing what agents in this stage are doing)
3. **Add agent button:** Opens a form with two fields — "Name" and "Personality" (rules, style, tone for that agent)
4. **Responsive layout:** Scales cleanly across screen sizes (desktop, tablet, mobile)
5. **Dummy data on load:** App starts with pre-populated agents and columns — no API calls, ever
6. **Loading animation:** When an agent is assigned to a column, a visible animation plays for a random duration between 5 seconds and 1 minute to simulate work being done

---

## Team Members & Tasks

> Each team member owns one feature as their own independent component file. No one edits the same file as a teammate.

| Name | Task | Description |
|------|------|-------------|
| _[Name 1]_ | Add Column Modal | Form UI to create a new Kanban column with Name + Context fields |
| _[Name 2]_ | Add Agent Modal | Form UI to create a new agent with Name + Personality fields |
| _[Name 3]_ | Agent Loading Animation | Spinner/progress bar that shows on an agent card when it's assigned to a column, with randomized 5s–60s duration |
| _[Name 4]_ | Responsive Layout & Styling | CSS to make the board scroll horizontally on mobile, stack gracefully, and look polished |
| _[Name 5]_ | Dummy Data & Agent Card Design | Hardcoded starter agents + columns in `data.js`, plus the visual design of each agent card |

---

## Base MVP (Phase 2)

> One person scaffolds the foundation. It should be runnable in under 10 minutes.

**What the MVP includes:**
- A `KanbanBoard` component that renders the 5 default columns side by side
- A simple `AgentCard` component showing just the agent's name
- Hardcoded dummy agents already placed in columns (imported from `data.js`)
- A placeholder "Add Column" button and "Add Agent" button (buttons exist, no modal yet)
- Basic styling so it's readable and horizontally scrollable

**What it does NOT include (left for teammates):**
- Working modals for adding columns or agents
- Loading/work animations
- Responsive polish
- Full agent card design with personality display

---

## Feature Slots (Phase 3)

### Feature 1: Add Column Modal
- **Assigned to:** _[Team member]_
- **Description:** Clicking "Add Column" opens a modal with a "Name" text input and a "Context" textarea. Submitting adds a new column to the board.
- **Files to create:** `src/components/AddColumnModal.jsx`, `src/components/AddColumnModal.css`

### Feature 2: Add Agent Modal
- **Assigned to:** _[Team member]_
- **Description:** Clicking "Add Agent" opens a modal with a "Name" text input and a "Personality" textarea. Submitting adds the agent to an unassigned/inbox column.
- **Files to create:** `src/components/AddAgentModal.jsx`, `src/components/AddAgentModal.css`

### Feature 3: Agent Loading Animation
- **Assigned to:** _[Team member]_
- **Description:** When an agent card is placed into a column, display a spinner or progress animation on the card. Use `setTimeout` with a random duration between 5000ms and 60000ms. After the timer completes, show a "Done" state on the card.
- **Files to create:** `src/components/AgentLoadingIndicator.jsx`, `src/components/AgentLoadingIndicator.css`

### Feature 4: Responsive Layout & Styling
- **Assigned to:** _[Team member]_
- **Description:** Update CSS so the Kanban board scrolls horizontally on smaller screens, columns have a min-width, and the overall UI looks clean and modern. No layout changes to JSX — CSS only.
- **Files to modify:** `src/App.css`, `src/components/KanbanBoard.css`

### Feature 5: Dummy Data & Agent Card Design
- **Assigned to:** _[Team member]_
- **Description:** Populate `data.js` with at least 3 pre-built agents (each with a name and personality) spread across the 5 default columns. Also design the `AgentCard` component to display the agent name, a personality snippet, and its current status.
- **Files to modify/create:** `src/data.js`, `src/components/AgentCard.jsx`, `src/components/AgentCard.css`

---

## Technical Notes

- **React + Vite** — scaffold with `npm create vite@latest -- --template react`
- **No backend, no API calls, no database** — all state lives in React `useState`
- **Dummy data** lives in `src/data.js` as a plain JavaScript export
- **Randomized timers** use `Math.random()` and `setTimeout` inside `useEffect`
- **One component per file** — keeps everyone's work independent and conflict-free

---

## Success Criteria

- [ ] MVP runs locally with `npm run dev`
- [ ] Board loads with dummy agents already placed in columns
- [ ] Users can add new columns and agents via modal forms
- [ ] Assigning an agent to a column triggers a visible loading animation
- [ ] Layout works on both wide and narrow screens
- [ ] Each team member has merged at least one PR
- [ ] All features work together without breaking the app
