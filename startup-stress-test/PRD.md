# Product Requirements Document (PRD)

> **Startup Stress Tester** — Evaluate startup ideas across key business dimensions

---

## Project Overview

**Project Name:** Startup Stress Tester

**One-line Description:** A tool that scores startup ideas across market size, competition, feasibility, and other key dimensions to surface strengths, weaknesses, and risks.

**Type:** Web App (React + Vite)

---

## Problem Statement

Entrepreneurs and investors often evaluate startup ideas based on gut feeling or incomplete analysis. This app provides a structured framework to stress-test ideas across multiple dimensions, producing:
- Objective scores for each dimension
- Visual representation of strengths vs weaknesses
- Actionable recommendations based on the analysis

---

## Target Users

- **Entrepreneurs** evaluating their own startup concepts
- **Investors** doing initial screening of pitch decks
- **Product managers** assessing new product opportunities
- **Business students** learning startup evaluation frameworks

---

## Core Features (MVP)

### Input Form
Collects startup metrics across 10 dimensions:

| Dimension | Input Type | Options |
|-----------|------------|---------|
| Startup Name | Text | Free text |
| Industry | Dropdown | Tech, Healthcare, Fintech, E-commerce, Education, SaaS, Consumer, Hardware, Marketplace, Other |
| Total Addressable Market (TAM) | Dropdown | $0-1M, $1M-10M, $10M-100M, $100M-1B, $1B+ |
| Market Growth Rate | Slider | Declining → Explosive |
| Competition Level | Slider | None → Saturated |
| Barriers to Entry | Slider | None → Very High |
| Technical Feasibility | Slider | Very Hard → Trivial |
| Capital Requirements | Slider | Minimal → Massive |
| Time to Market | Slider | 3+ years → Under 3 months |
| Revenue Model Clarity | Slider | No idea → Proven |
| Risks | Multi-select | Regulatory, Technical, Market timing, Key person, IP/legal, Funding, Customer acquisition |
| Opportunities | Multi-select | First mover, Network effects, Recurring revenue, Platform play, Underserved market, Emerging tech |

### Scoring Engine
- Converts each input to a 0-100 normalized score
- Applies category weights (TAM 15%, Feasibility 12%, etc.)
- Computes weighted overall score
- Maps scores to letter grades: A (90+), B (80-89), C (70-79), D (60-69), F (<60)

### Output: Three Views

1. **Scorecard** — Grid of all dimensions with letter grades, numeric scores, and color-coded progress bars

2. **Radar Chart** — SVG spider chart plotting all dimensions on radial axes with gridlines at 25/50/75/100

3. **Report Summary** — Generated text with:
   - Verdict (one-line assessment)
   - Strengths (dimensions scoring B or above)
   - Weaknesses (dimensions scoring D or below)
   - Risk flags (from selected risks + derived from score patterns)
   - Recommendations (2-3 actionable suggestions)

---

## Technical Constraints

- **No backend** — All logic runs client-side
- **No database** — State lives in React useState
- **No external APIs** — All scoring is hardcoded
- **No charting libraries** — Radar chart is pure SVG
- **Cursor brand colors** — Dark theme with #f54e00 accent

---

## Component Structure

```
startup-stress-test/
  src/
    App.jsx              # Main layout, form/results toggle
    App.css              # Global styles (Cursor dark theme)
    data/
      scoringModel.js    # Scoring algorithm, weights, grades
      industries.js      # Industry options and benchmarks
    components/
      IdeaForm.jsx       # Input form with all fields
      Scorecard.jsx      # Letter-grade grid
      RadarChart.jsx     # SVG spider chart
      ReportSummary.jsx  # Text report with risk flags
      GradeBadge.jsx     # Reusable letter-grade pill
```

---

## Team Members & Tasks

> For teams wanting to extend this app, here are 5 independent features that can be built in parallel.

| Name | Task | Description |
|------|------|-------------|
| _[Name 1]_ | Comparison Mode | Save multiple ideas to localStorage and compare side-by-side |
| _[Name 2]_ | Export Results | Copy results to clipboard or download as PNG/text |
| _[Name 3]_ | Industry Benchmarks | Show how the startup compares to industry averages |
| _[Name 4]_ | Dark/Light Toggle | Add theme switcher with light mode colors |
| _[Name 5]_ | Share Link | Encode inputs in URL for shareable stress test links |

---

## Base MVP (Already Built)

**What the MVP includes:**
- Complete input form with all 10 dimensions + risks/opportunities
- Scoring engine with weighted calculations
- Scorecard with letter grades and progress bars
- Radar chart visualization
- Report summary with verdict, strengths, weaknesses, and recommendations
- Dark theme styling with Cursor brand colors
- Responsive layout for laptop and projected screens

**What it does NOT include (left for feature slots):**
- Saving/comparing multiple ideas
- Exporting results
- Industry benchmark comparisons
- Light mode theme
- Shareable URLs

---

## Feature Slots (For Team Extension)

### Feature 1: Comparison Mode
- **Assigned to:** _[Team member]_
- **Description:** Save completed stress tests to localStorage. Add a "Compare" view showing 2-3 ideas side by side with their scores.
- **Files to create:** `src/components/ComparisonMode.jsx`
- **Files to modify:** `src/App.jsx` (add comparison state and view toggle)

### Feature 2: Export Results
- **Assigned to:** _[Team member]_
- **Description:** Add buttons to copy results as text or download the results section as an image.
- **Files to create:** `src/components/ExportResults.jsx`
- **Files to modify:** `src/App.jsx` (add export buttons to results header)

### Feature 3: Industry Benchmarks
- **Assigned to:** _[Team member]_
- **Description:** Show industry average scores alongside the startup's scores. Display "vs benchmark" indicators.
- **Files to create:** `src/components/BenchmarkComparison.jsx`
- **Files to modify:** `src/data/industries.js` (expand benchmark data)

### Feature 4: Dark/Light Theme Toggle
- **Assigned to:** _[Team member]_
- **Description:** Add a toggle button to switch between dark and light mode. Use Cursor brand light colors.
- **Files to create:** `src/components/ThemeToggle.jsx`
- **Files to modify:** `src/App.css` (add light mode CSS variables), `src/App.jsx` (add theme state)

### Feature 5: Shareable Links
- **Assigned to:** _[Team member]_
- **Description:** Encode form inputs in URL parameters. Add "Share" button that copies a link. Auto-populate form from URL on load.
- **Files to create:** `src/components/ShareLink.jsx`
- **Files to modify:** `src/App.jsx` (add URL parsing on mount)

---

## Success Criteria

- [x] MVP runs locally with `npm run dev`
- [x] Form accepts all inputs and validates correctly
- [x] Scorecard displays accurate letter grades
- [x] Radar chart renders all 10 dimensions
- [x] Report shows meaningful verdict and recommendations
- [ ] Each team member has merged at least one feature PR
- [ ] All features work together without breaking the app

---

## How to Run

```bash
cd startup-stress-test
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

---

## Design Notes

### Color Palette (Cursor Dark Theme)
| Name | Hex | Usage |
|------|-----|-------|
| bg | #14120b | Main background |
| fg | #edecec | Primary text |
| accent | #f54e00 | Buttons, highlights, chart fill |
| card | #1b1913 | Card backgrounds |
| card-03 | #26241e | Borders, dividers |

### Grade Colors
| Grade | Color | Hex |
|-------|-------|-----|
| A | Green | #22c55e |
| B | Teal | #14b8a6 |
| C | Yellow | #eab308 |
| D | Orange | #f97316 |
| F | Red | #ef4444 |
