# Product Requirements Document (PRD)

> Internal tool to standardize discount guidance and reduce quote back-and-forth for sales reps.

---

## Project Overview

**Project Name:** Cursor Deal Pricing Calculator

**One-line Description:** An input-driven web calculator that takes seats, pre-committed usage per user, and term to output ACV range and corresponding CTR rate range.

**Type:** Internal Web App (single page)

**Primary Users:**
- Account Executives (AEs)
- Sales Engineers
- Deal Desk / Pricing Operations

**Problem Statement:**
- Reps currently estimate discounts manually across multiple dimensions (usage/user, seat tier, term, ACV, and CTR rules), which is error-prone and slow.
- Teams need one consistent source of truth for discount eligibility and final quote math.

**Business Outcome:**
- Reduce time to produce a pricing proposal.
- Improve consistency and policy adherence in discounting.
- Increase confidence in approvals by showing transparent math.

---

## Guidelines

### Keep It Small!
- MVP should support one complete deal-calculation flow end-to-end.
- No backend required for MVP; pricing rules are hardcoded from approved policy tables.
- Outputs should be clear enough to copy into deal notes.

### Out of Scope (MVP)
- CRM integrations (Salesforce, HubSpot)
- Authentication and role permissions
- Persisting scenarios to a database
- Approval workflow orchestration

---

## Pricing Rules (Source of Truth)

### List Prices
- Seat license fee: `$40` per seat
- Committed usage minimum: `$20` per user (can be higher)
- CTR list rate: `$0.25` per 1M tokens

### Discount Matrix: Usage/User x Seat Tier
Base discount for seat license + committed usage line items:

| Avg Monthly Pre-committed Usage per User | 0-500 seats | 500-1,000 seats | 1,000+ seats |
|---|---:|---:|---:|
| $20 | 0% | 5% | 10% |
| $30 | 5% | 5% | 10% |
| $40 | 10% | 15% | 20% |
| $50 | 15% | 20% | 25% |
| $60 | 20% | 25% | 30% |
| $70 | 25% | 30% | 35% |
| $80 | 30% | 35% | 40% |
| $90 | 35% | 40% | 45% |
| $100 | 40% | 45% | 50% |

### Commitment Term Uplift (Additive)
Apply additional discount to seat license + committed usage:
- 1 year: `+0%`
- 2 years: `+5%`
- 3+ years: `+10%`

Final discount for seat + committed usage line items:

`finalCoreDiscount = baseMatrixDiscount + termUplift`

### Maximum CTR Discount Table
CTR is a separate line item and discounted independently based on pre-commit ACV and term.

| Pre-Commit ACV | 1 Year | 2 Year | 3+ Years |
|---|---:|---:|---:|
| $0 - $100K | 0% | 5% | 10% |
| $100K - $250K | 10% | 15% | 20% |
| $250K - $500K | 20% | 25% | 30% |
| $500K - $1M | 30% | 35% | 40% |
| $1M+ | 40% | 45% | 50% |

### Input Model
Required inputs:
- `seats`
- `monthlyCommittedUsagePerUser` (>= `$20`)
- `term` (`1 year`, `2 years`, `3+ years`)

### Derived Core ACV Calculations
Annualized core list pricing:

`listCoreACV = (seats * 40 * 12) + (seats * monthlyCommittedUsagePerUser * 12)`

Core discount:

`finalCoreDiscount = baseMatrixDiscount + termUplift`

Annualized discounted core pricing:

`discountedCoreACV = listCoreACV * (1 - finalCoreDiscount)`

ACV range displayed to reps:

`acvRange = [discountedCoreACV, listCoreACV]`

### Coupled ACV to CTR Output Model
CTR is a separate line item, but it is tightly coupled to ACV through policy bands. Instead of showing two independent ranges, we generate a discrete ACV->CTR point series:

`acvMin = discountedCoreACV`

`acvMax = listCoreACV`

`N = 11  // number of discrete points shown`

For each point `i` from `0` to `N-1`:

`acv_i = acvMin + (i / (N - 1)) * (acvMax - acvMin)`

`maxCtrDiscount_i = lookupCtrDiscount(acv_i, term)`

`minCtrRate_i = 0.25 * (1 - maxCtrDiscount_i)`

Display output as ordered points:

`acvCtrCurvePoints = [{acv, maxCtrDiscount, minCtrRate}, ...]`

Optional rollup summary:

`ctrRateRange = [min(minCtrRate_i), max(minCtrRate_i)]`

### Core Calculation Assumptions
- ACV in this PRD refers to annualized core spend (seat + committed usage only).
- CTR does not change core ACV; it is shown as a separate term/rate line.
- Discount percentages cannot exceed 100% and cannot be negative.
- CTR lookup uses ACV band thresholds exactly as defined in the table.
- Reps should pick a specific ACV point and use the matched CTR at that same point.

---

## Team Members & Tasks

> Team size is 1. One teammate + Cursor agent delivers the full MVP.

| Name | Task | Description |
|------|------|-------------|
| _[Your Name]_ | End-to-end MVP build | Implement inputs, calculations, coupled ACV->CTR output, validation, and scenarios |

### Task Guidelines
- Every task must produce visible UI or visible user behavior.
- Each task should have minimal file overlap with others.
- Teams should integrate against a shared `PricingResult` interface contract.

---

## Base MVP (Phase 2)

> One person creates the app shell and baseline calculation flow.

**What the MVP includes:**
- Single-page UI with required inputs only: seats, usage/user, term
- Hardcoded pricing/discount tables
- Compute outputs for:
  - `listCoreACV`
  - `discountedCoreACV`
  - `acvRange = [discountedCoreACV, listCoreACV]`
  - `acvCtrCurvePoints[]` mapping each ACV point to its corresponding max CTR discount and min CTR rate
- Clear explanation of matrix row/column, term uplift, ACV band transitions, and point-by-point ACV->CTR mapping

**What it does NOT include:**
- Authentication
- CRM sync
- Multi-page reporting dashboards
- Admin rule editor

---

## Feature Slots (Phase 3)

> These are workstreams for one teammate using Cursor agent.

### Workstream 1: Inputs Panel and Guardrails
- **Assigned to:** _[Single teammate + Cursor agent]_
- **Description:** Build form controls for seats, usage/user, and term, plus inline validation messages.
- **Files to modify/create:** `src/App.tsx`, `src/components/InputsPanel.tsx`, `src/lib/validators.ts`, `src/types/pricing.ts`

### Workstream 2: Pricing Engine + Coupled ACV->CTR Series
- **Assigned to:** _[Single teammate + Cursor agent]_
- **Description:** Implement matrix lookup, additive term uplift, list/discounted ACV formulas, and ACV-to-CTR point-series generation.
- **Files to modify/create:** `src/lib/pricingEngine.ts`, `src/lib/ctrTranslator.ts`, `src/lib/discountTables.ts`, `src/types/pricing.ts`

### Workstream 3: Results + Scenario Utilities
- **Assigned to:** _[Single teammate + Cursor agent]_
- **Description:** Present ACV range and ACV->CTR points with clear rationale, plus preset scenarios, reset, and copy-to-clipboard summary.
- **Files to modify/create:** `src/components/ResultsPanel.tsx`, `src/components/DiscountSummary.tsx`, `src/components/ScenarioPresets.tsx`, `src/lib/formatters.ts`, `src/App.tsx`

### Feature 5: Sound Effects
- **Assigned to:** Ali
- **Description:** Play a sound when a card is flipped and a different sound when a pair matches. Can use the Web Audio API or a simple audio element.
- **Files to modify/create:** `App.jsx` or main game component, optional audio files or inline audio using Web Audio API

---

## Success Criteria

- [ ] MVP runs locally
- [ ] Calculator returns deterministic outputs for known inputs
- [ ] Single teammate can complete the MVP using Cursor agent support
- [ ] All features work together without breaking the app
- [ ] Reps can understand why each discount was applied in under 60 seconds
- [ ] Reps can select any ACV point and immediately read the matched CTR floor at that point

### Acceptance Test Scenarios

1) **Small deal, 1-year term**
- Inputs: `300 seats`, `$20` usage/user, `1 year`
- Expected:
  - Base core discount = `0%` (row `$20`, col `0-500`)
  - Term uplift = `0%`
  - Final core discount = `0%`
  - `listCoreACV = $216,000`
  - `discountedCoreACV = $216,000`
  - `acvRange = [$216,000, $216,000]`
  - `acvCtrCurvePoints` has 11 points; all points are `$216,000`
  - Every point maps to ACV band `$100K-$250K` (1 year -> `10%` max CTR discount)
  - Every point has `minCtrRate = $0.225/M`

2) **Mid-market deal, 2-year term**
- Inputs: `750 seats`, `$60` usage/user, `2 years`
- Expected:
  - Base core discount = `25%` (row `$60`, col `500-1,000`)
  - Term uplift = `5%`
  - Final core discount = `30%`
  - `listCoreACV = $900,000`
  - `discountedCoreACV = $630,000`
  - `acvRange = [$630,000, $900,000]`
  - `acvCtrCurvePoints` has 11 points from `$630,000` to `$900,000`
  - Every point maps to ACV band `$500K-$1M` (2 year -> `35%` max CTR discount)
  - Every point has `minCtrRate = $0.1625/M`

3) **Enterprise deal, 3+ years**
- Inputs: `1,500 seats`, `$100` usage/user, `3+ years`
- Expected:
  - Base core discount = `50%` (row `$100`, col `1,000+`)
  - Term uplift = `10%`
  - Final core discount = `60%`
  - `listCoreACV = $2,520,000`
  - `discountedCoreACV = $1,008,000`
  - `acvRange = [$1,008,000, $2,520,000]`
  - `acvCtrCurvePoints` has 11 points from `$1,008,000` to `$2,520,000`
  - Every point maps to ACV band `$1M+` (3+ years -> `50%` max CTR discount)
  - Every point has `minCtrRate = $0.125/M`
  - Proposed CTR rate of `$0.20/M` is compliant

4) **Band-crossing coupling behavior**
- Inputs: `145 seats`, `$20` usage/user, `3+ years`
- Expected:
  - `listCoreACV = $104,400`
  - `discountedCoreACV = $93,960`
  - `acvRange = [$93,960, $104,400]`
  - `acvCtrCurvePoints` crosses ACV bands:
    - lower ACV points in `$0-$100K` at 3+ years -> `10%` max CTR discount (`$0.225/M`)
    - upper ACV points in `$100K-$250K` at 3+ years -> `20%` max CTR discount (`$0.20/M`)
