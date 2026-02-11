# Product Requirements Document (PRD)

---

## Project Overview

**Project Name:** Cursor Battle Station

**One-line Description:** An interactive competitive intelligence dashboard that helps AEs quickly surface Cursor value drivers, battle card talking points, and customer-specific guidance before and after sales calls.

**Type:** Web App (React, frontend-only)

---

## Context & Vision

The GTM team needs a single place to look up competitive intel, review value drivers, and prepare for customer conversations. In production, this would pull from live docs, CRM data, and call transcription services. **For this workshop**, all data is hardcoded/stubbed so we can focus on the UI and interaction patterns without needing a backend.

**What we're simulating:**
- Public Cursor documentation → hardcoded feature/capability data
- Internal battle cards & value drivers → hardcoded JSON data files
- Call transcript ingestion → a text area where you paste/type notes
- AI-generated guidance → pre-written talking point templates matched by keyword

---

## Team Members & Tasks

> Each team member owns one independent feature as its own component file. No stepping on each other's toes.

| Name | Task | Description |
|------|------|-------------|
| _[Name 1 — MVP Owner]_ | Base MVP | Scaffold the app, layout shell, competitor selector, and basic battle card display |
| _[Name 2]_ | Competitor Comparison Matrix | Side-by-side feature comparison table across competitors |
| _[Name 3]_ | Call Notes Analyzer | Text area to paste call notes; highlights keywords and surfaces matching talking points |
| _[Name 4]_ | Value Driver Cards | Interactive, expandable cards showcasing Cursor's core value propositions |
| _[Name 5]_ | Customer Profile Panel | Input form for customer details (industry, size, pain points) that filters/prioritizes recommendations |

### Task Guidelines
- Each task should add something **visible** to the project
- Tasks should be **independent** — no dependencies on other tasks
- Each feature is its own component file — one person per file, no merge conflicts
- Everyone should be able to work at the same time

---

## Base MVP (Phase 2)

> **One person** creates the foundation that everyone else builds on.

**What the MVP includes:**
- A clean app shell with a header ("Cursor Battle Station") and a sidebar/nav area
- A dropdown or button group to select a competitor (e.g., GitHub Copilot, Windsurf, Tabnine, JetBrains AI)
- When a competitor is selected, display a basic battle card with: competitor name, overview, strengths, weaknesses, and 2-3 key Cursor differentiators
- All competitor data lives in a `data/competitors.js` file as a hardcoded array of objects
- Simple, modern styling — dark theme preferred to match Cursor's brand

**What it does NOT include (left for teammates):**
- No comparison matrix (Feature 1)
- No call notes / transcript analysis (Feature 2)
- No value driver detail cards (Feature 3)
- No customer profile or personalization (Feature 4)

---

## Data Structure (Stubbed)

All data is hardcoded in files under `src/data/`. No databases, no APIs.

```javascript
// src/data/competitors.js
export const COMPETITORS = [
  {
    id: "copilot",
    name: "GitHub Copilot",
    overview: "AI pair programmer by GitHub/Microsoft...",
    strengths: ["Large user base", "GitHub ecosystem integration", "Enterprise trust"],
    weaknesses: ["Limited agentic capabilities", "No multi-file editing", "Less context awareness"],
    cursorDifferentiators: [
      "Cursor's agentic mode handles multi-step tasks autonomously",
      "Full codebase context with @-mentions for files, folders, and docs",
      "Built-in terminal, browser, and MCP tool integrations"
    ]
  },
  // ... more competitors
];

// src/data/valueDrivers.js
export const VALUE_DRIVERS = [
  {
    id: "speed",
    title: "Developer Velocity",
    summary: "Ship features 2-3x faster",
    details: "Cursor accelerates the entire SDLC...",
    proofPoints: ["Customer X reduced sprint cycle by 40%", "..."]
  },
  // ... more drivers
];

// src/data/talkingPoints.js
export const TALKING_POINTS = [
  {
    keywords: ["security", "compliance", "SOC2"],
    points: [
      "Cursor offers Privacy Mode — code never stored or trained on",
      "SOC 2 Type II certified",
      "Supports self-hosted / on-prem deployment options"
    ]
  },
  // ... more keyword-matched talking points
];
```

---

## Feature Slots (Phase 3)

> These are the features team members will add. Each is its own component file.

### Feature 1: Competitor Comparison Matrix
- **Assigned to:** _[Team member]_
- **Description:** A side-by-side table comparing Cursor against 2-3 selected competitors across key dimensions (context awareness, multi-file editing, agentic capabilities, privacy, pricing, IDE support). Uses data from `competitors.js`. AE can toggle which competitors to compare.
- **Files to create:** `src/components/ComparisonMatrix.jsx`, `src/components/ComparisonMatrix.css`

### Feature 2: Call Notes Analyzer
- **Assigned to:** _[Team member]_
- **Description:** A text area where an AE pastes call notes or a transcript snippet. On submit, the component scans for keywords (from `talkingPoints.js`) and displays matched talking points below, highlighted by relevance. Simple string-matching — no AI needed.
- **Files to create:** `src/components/CallNotesAnalyzer.jsx`, `src/components/CallNotesAnalyzer.css`

### Feature 3: Value Driver Cards
- **Assigned to:** _[Team member]_
- **Description:** A grid of interactive cards showing Cursor's core value propositions (speed, quality, security, developer experience). Each card expands on click to show details, proof points, and suggested talk track. Data from `valueDrivers.js`.
- **Files to create:** `src/components/ValueDriverCards.jsx`, `src/components/ValueDriverCards.css`

### Feature 4: Customer Profile Panel
- **Assigned to:** _[Team member]_
- **Description:** A small form/panel where the AE inputs customer context: company name, industry (dropdown), team size (small/mid/enterprise), and primary pain points (checkboxes). Based on selections, the panel displays a "Recommended Focus" section with prioritized value drivers and talking points. All logic is simple conditional filtering — no backend.
- **Files to create:** `src/components/CustomerProfile.jsx`, `src/components/CustomerProfile.css`

### Feature 5: Quick Reference Cheat Sheet
- **Assigned to:** _[Team member]_
- **Description:** A collapsible/searchable cheat sheet of common objections and responses (e.g., "We already use Copilot" → response). AE can search by keyword or browse by category. Data hardcoded in a `src/data/objections.js` file.
- **Files to create:** `src/components/CheatSheet.jsx`, `src/components/CheatSheet.css`, `src/data/objections.js`

---

## Success Criteria

- [ ] MVP runs locally with `npm run dev`
- [ ] Each team member has merged at least one PR
- [ ] All features work together without breaking the app
- [ ] An AE can select a competitor and see relevant battle card info
- [ ] An AE can paste call notes and get matched talking points
- [ ] The app looks clean and professional on a projected screen
