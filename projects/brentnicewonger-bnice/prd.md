# Product Requirements Document (PRD)

---

## Project Overview

**Project Name:** Cursor ROI Calculator for Financial Services & Insurance

**One-line Description:** A tabbed ROI calculator that quantifies the revenue, cost savings, and risk reduction that large FS&I engineering organizations realize by adopting Cursor across the SDLC.

**Type:** Single-page Web App (React + Vite)

---

## Guidelines

- Single-page app — no database, no auth, no APIs
- All calculations run client-side with simple formulas
- Inputs are sliders and number fields; outputs are dollar figures and percentages
- Tailored to Financial Services & Insurance personas (CTO, VP Eng, CISO)

---

## Base MVP

> A tabbed single-page app with all five ROI calculators, each containing 3–4 input fields and a real-time dollar-value output.

**What the MVP includes:**
- Tab navigation across 5 SDLC workflow calculators
- Each tab has 3–4 slider/number inputs for key value drivers
- Real-time ROI output (annual savings in dollars) per tab
- Clean, professional dark theme appropriate for enterprise demos
- A combined "Total ROI" summary visible across all tabs

**What it does NOT include (stretch goals):**
- PDF/export of results
- Charts or data visualizations
- Company-specific presets or saved scenarios
- Comparison view (before/after Cursor)

---

## ROI Calculators & Value Drivers

### Tab 1: Code Generation

Cursor accelerates feature development via Agent mode, Tab completions, and multi-model reasoning.

| Value Driver | Input | Formula Basis |
|:-------------|:------|:--------------|
| **Developer productivity gain** | % of coding time saved (default 30%) | Developers spend ~50% of time writing code; savings = devs × avg salary × code-time % × productivity gain |
| **Reduced time-to-market** | Weeks saved per release cycle (default 2) | Earlier revenue capture = releases/yr × revenue-per-release × (weeks saved / cycle length) |
| **Avoided incremental hires** | Hires avoided due to throughput gain (default 2) | Savings = hires avoided × fully loaded cost |
| **Reduced rework / churn** | % reduction in code rework (default 20%) | Rework costs = devs × salary × % time on rework × reduction |

**Revenue / Cost / Risk mapping:**
- *Generate Revenue* — faster time-to-market
- *Reduce Costs* — fewer hires, less rework
- *Mitigate Risk* — higher code quality from AI-assisted generation

---

### Tab 2: Automated Code Review (BugBot)

BugBot reviews every PR automatically, catching issues before human reviewers spend time.

| Value Driver | Input | Formula Basis |
|:-------------|:------|:--------------|
| **Review cycle time reduction** | Hours saved per PR review (default 1.5 hrs) | Savings = PRs/month × hours saved × blended hourly rate |
| **Defect escape reduction** | % fewer bugs reaching production (default 25%) | Avoided cost = production incidents/yr × avg incident cost × reduction % |
| **Senior engineer time reclaimed** | Hours/week freed from reviews (default 5) | Savings = senior devs × hours reclaimed × senior hourly rate × 52 weeks |
| **Compliance audit readiness** | Hours saved on audit prep per quarter (default 40) | Savings = 4 quarters × hours saved × compliance team hourly rate |

**Revenue / Cost / Risk mapping:**
- *Generate Revenue* — senior engineers refocused on high-value work
- *Reduce Costs* — faster review cycles, less QA overhead
- *Mitigate Risk* — fewer production defects, audit-ready review trails

---

### Tab 3: Automated Unit Test Generation

Cursor generates comprehensive unit tests, boosting coverage without manual effort.

| Value Driver | Input | Formula Basis |
|:-------------|:------|:--------------|
| **Code coverage increase** | Coverage gain in percentage points (default 25%) | Risk reduction proxy — maps to fewer escaped defects |
| **Test writing time saved** | Hours saved per developer per week (default 3) | Savings = devs × hours saved × hourly rate × 52 weeks |
| **Reduced QA cycle time** | % reduction in QA cycle (default 20%) | Savings = QA team size × avg salary × QA-cycle-time % × reduction |
| **Production incident reduction** | % fewer incidents from better coverage (default 15%) | Avoided cost = incidents/yr × avg incident cost × reduction % |

**Revenue / Cost / Risk mapping:**
- *Generate Revenue* — ship faster with confidence
- *Reduce Costs* — less manual test writing, shorter QA cycles
- *Mitigate Risk* — higher coverage catches regressions before production

---

### Tab 4: Automated Security Review (BugBot Security)

Proactive vulnerability detection on every PR, critical for regulated FS&I environments.

| Value Driver | Input | Formula Basis |
|:-------------|:------|:--------------|
| **Vulnerability detection speed** | Days earlier vulnerabilities are caught (default 14) | Risk reduction = exposure window reduction × probability × avg breach cost |
| **Compliance cost savings** | Hours saved on security compliance per year (default 200) | Savings = hours saved × security engineer hourly rate |
| **Avoided breach costs** | Estimated probability reduction of breach (default 10%) | Avoided cost = annual breach probability × avg FS&I breach cost ($5.9M) × reduction % |
| **Security team leverage** | % of manual security reviews automated (default 40%) | Savings = security team size × avg salary × % automated |

**Revenue / Cost / Risk mapping:**
- *Generate Revenue* — faster security approvals unblock releases
- *Reduce Costs* — fewer manual security reviews, lower compliance overhead
- *Mitigate Risk* — earlier vulnerability detection, reduced breach exposure (critical for FS&I regulatory requirements: SOC 2, PCI-DSS, SOX)

---

### Tab 5: Automated CI/CD Triage

Cursor diagnoses and fixes failing pipelines, reducing mean time to resolution.

| Value Driver | Input | Formula Basis |
|:-------------|:------|:--------------|
| **MTTR reduction** | Minutes saved per CI/CD failure (default 30) | Savings = failures/month × minutes saved × (devs blocked × hourly rate / 60) |
| **Developer context-switch reduction** | Interruptions avoided per week (default 3) | Savings = devs × interruptions avoided × context-switch cost ($15–25 per switch) × 52 weeks |
| **Deployment frequency increase** | Additional deploys per month (default 4) | Revenue proxy = faster feature delivery value |
| **Downtime cost avoidance** | Hours of downtime avoided per year (default 10) | Savings = downtime hours × revenue-per-hour-at-risk |

**Revenue / Cost / Risk mapping:**
- *Generate Revenue* — faster deployments, less downtime
- *Reduce Costs* — less developer time wasted on pipeline debugging
- *Mitigate Risk* — more reliable deployments reduce outage risk

---

## Additional ROI Areas (Future Tabs)

These are high-impact Cursor use cases not yet included but worth considering:

| Area | Why It Matters for FS&I |
|:-----|:------------------------|
| **Developer Onboarding** | Ramp time reduction from months to weeks — critical at scale (reduce 40-60% onboarding time) |
| **Legacy Code Modernization** | FS&I carries massive COBOL/mainframe debt; Cursor accelerates migration |
| **Incident Response** | AI-assisted debugging during production incidents reduces MTTR |
| **Documentation Generation** | Auto-generated docs improve knowledge transfer and regulatory compliance |

---

## Features

> Enhancements to add after the MVP is working.

### Feature 1: Executive Summary Dashboard
- **Description:** A summary view showing total ROI across all 5 tabs, broken out by Revenue / Cost Savings / Risk Reduction, with a single "Total Annual Value" number
- **Files to create:** `src/components/SummaryDashboard.jsx`

### Feature 2: Interactive Charts
- **Description:** Bar or donut charts visualizing the ROI breakdown per calculator and the combined total — makes the output presentation-ready
- **Files to create:** `src/components/ROIChart.jsx`

### Feature 3: PDF Export
- **Description:** "Download as PDF" button that exports the current calculator inputs and results as a branded one-pager for sharing with prospects
- **Files to create:** `src/components/ExportButton.jsx`, `src/utils/pdfGenerator.js`

---

## Success Criteria

- [ ] MVP runs locally
- [ ] All 5 calculator tabs render with working inputs and real-time output
- [ ] ROI values update instantly as inputs change
- [ ] At least one PR merged to the original repo
- [ ] Features work without breaking the base app
