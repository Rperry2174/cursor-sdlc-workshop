# Product Requirements Document (PRD)

---

## Project Overview

**Project Name:** TerritoryBalancer

**One-line Description:** A visual tool that evenly distributes Salesforce accounts across 10 Account Executives using a round-robin methodology, with a dashboard showing each AE's book of business.

**Type:** Web App (React, single page)

---

## Guidelines

### Keep It Small!
- MVP is buildable in **10 minutes**
- No real Salesforce connection — uses hardcoded sample account data
- No database, no authentication, no API calls
- All state managed with React `useState`
- Single-page app, no routing

---

## Base MVP

> The minimal working version: a table of sample accounts, a list of 10 AEs, and a button that assigns accounts equally using round-robin.

**What the MVP includes:**
- A hardcoded dataset of 30 sample Salesforce accounts (company name, ARR, industry, region)
- A hardcoded list of 10 Account Executives
- A "Balance Territories" button that runs round-robin assignment (sorts accounts by ARR descending, then deals them to AEs one at a time so total ARR is roughly equal)
- A summary dashboard showing each AE's assigned accounts, account count, and total ARR
- Clean, modern styling with a RevOps / Salesforce-inspired color palette

**What it does NOT include (stretch goals):**
- Drag-and-drop manual reassignment
- Filtering or sorting the account list
- Export to CSV
- Territory balance scoring / fairness metric

---

## Features

> Plan out the features you want to add after the MVP is working. Each feature should be in its own component file to keep things organized.

### Feature 1: Balance Score
- **Description:** After assignment, display a fairness score (0–100) that compares each AE's total ARR against the ideal equal split. Shows a color-coded bar per AE (green = within 10% of ideal, yellow = 10–25% off, red = >25% off).
- **Files to create:** `src/components/BalanceScore.jsx`

### Feature 2: Filter & Sort Controls
- **Description:** Let the user filter the account table by industry or region, and sort by ARR or company name. Filters apply before the assignment so you can balance a subset of accounts.
- **Files to create:** `src/components/FilterControls.jsx`

### Feature 3: CSV Export
- **Description:** A button that exports the current territory assignments to a downloadable CSV file (AE Name, Account, ARR, Industry, Region) — no server needed, uses browser download.
- **Files to create:** `src/components/ExportButton.jsx`

---

## Success Criteria

- [ ] MVP runs locally with `npm run dev`
- [ ] 30 sample accounts are distributed across 10 AEs with a single click
- [ ] Dashboard clearly shows each AE's book of business and total ARR
- [ ] At least one PR merged to the original repo
- [ ] Features work without breaking the base app
