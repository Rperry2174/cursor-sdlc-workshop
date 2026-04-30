# Product Requirements Document (PRD)

> **Instructions:** This is your project specification. Fill in the sections below to define what you're building.

_Source draft (converted): [Turf quoting tool PRD — Notion](https://www.notion.so/cursorai/Turf-quoting-tool-PRD-334da74ef04580a4a9f8f3b87acff4aa) (Greens on Q — Golf Turf Quoting App, v1.0 draft, March 31, 2026)._

---

## Project Overview

**Project Name:** Greens on Q — Golf Turf Quoting App

**One-line Description:** A web-based tool that estimates golf turf installation cost from a multi-area site breakdown, a flat price table, and a site-access multiplier—so sales and clients can see an itemized total before any full product build (accounts, workflow, or backend).

**Type:** Web App (single-page MVP; responsive web per full-product intent)

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

- **Single screen** implementing the **pricing engine** from the draft (§5): line items and **quote total** using **static** rates in code (no admin editor, no versioning in MVP).
- **Turf area breakdown (inputs):**
  - **Golf Green** — sq ft (numeric).
  - **Fringe** — S / M / L; fringe sq ft **derived** from green sq ft (20% / 35% / 50%).
  - **Lawn Area** — sq ft (numeric).
  - **Bunker** — S / M / L mapping to **150 / 300 / 500** sq ft; priced at **$75/sq ft**.
  - **Chipping areas** — quantity (integer); **$1,000 per unit** (5′ circle or 5×5 sq—same price).
- **Running estimated total sq ft** (display) as the user fills fields (sum of resolved areas).
- **Site access** selector affecting a **multiplier** on the **subtotal** (after line items): Great **1.00×**, Good **1.10×**, Okay **1.15×**, Poor **1.25×** (i.e. access adjustment = subtotal × (multiplier − 1); **quote total = subtotal + access adjustment**—equivalent to subtotal × multiplier).
- **Quote output:** itemized costs (green, fringe, lawn, bunker, chipping), access rating + adjustment, **total**, and a short **disclaimer** (indicative estimate; not a binding bid).
- **Print / PDF** via the browser print dialog is enough for “view quote” in the workshop scope.

**Pricing snapshot (MVP constants — confirm with Greens on Q):**

| Area type      | Rate        | Basis                                      |
|----------------|------------|---------------------------------------------|
| Golf Green     | $42 / sq ft | Entered green sq ft                        |
| Fringe         | $36 / sq ft | Derived fringe sq ft from green × tier %   |
| Lawn Area      | $30 / sq ft | Entered lawn sq ft                         |
| Bunker         | $75 / sq ft | Fixed sq ft by S/M/L                       |
| Chipping area  | $1,000 / unit | Count × unit price                      |

**What it does NOT include (stretch goals — from the full draft):**

- **Accounts & roles** (guest vs registered client, sales rep, admin) and **RBAC**.
- **Quote workflow** (Draft → Pending Review → Sent to Client → Approved / Declined / Expired) and **status** management.
- **Shareable quote URLs**, token links, **email** delivery, **notifications**, **expiry** (30-day) and **5-day reminders**.
- **Client / rep / admin dashboards**, filters, inline edits, “create quote on behalf of client.”
- **Price table management** UI (protected settings), **versioning** for historical quotes, **stored** quotes or any **database**.
- **Payments**, CAD uploads, **CRM**, multi-currency, native mobile app (draft: web-responsive only for v1 product).
- **Address lookup** API (draft: “Address lookup” for project site)—MVP can use plain text fields or omit.

---

## Features

> Plan out the features you want to add after the MVP is working. Each feature should be in its own component file to keep things organized.

### Feature 1: _Client information (quote header)_
- **Description:** Collect **Name**, **Email**, and **Project address** (draft §4.1) as form fields above the calculator; used for display on the quote summary and printout. Keep data **in memory only** for the workshop (no persistence).
- **Files to create:** `src/components/ClientInfoForm.jsx`, optional `src/components/ClientInfoForm.css`

### Feature 2: _Site access selector (dedicated component)_
- **Description:** Isolate **Great / Good / Okay / Poor** access rating with labels and multipliers (draft §4.3) in its own component; wire multiplier into the shared quote state.
- **Files to create:** `src/components/SiteAccessSelector.jsx`

### Feature 3: _Itemized quote breakdown panel_
- **Description:** Dedicated read-only panel listing each line (green, fringe, lawn, bunker, chipping), subtotal, access adjustment, and total—matching draft §5.4; improves clarity and print layout.
- **Files to create:** `src/components/GolfQuoteBreakdown.jsx`, optional `src/components/GolfQuoteBreakdown.css`

---

## Success Criteria

- [ ] MVP runs locally
- [ ] At least one PR merged to the original repo
- [ ] Features work without breaking the base app

---

## Appendix: Draft traceability (Notion)

**Goals & success metrics (draft §2):** Faster quotes (&lt; 5 min), fewer manual errors, client self-service (&gt;40% of quotes started by clients), conversion to Approved.

**Users & roles (draft §3):** Guest client, registered client, sales rep, admin—**out of scope** for workshop MVP; listed for future phases.

**Pricing formula (draft §5.4):**

```text
Golf Green Cost    = Green Sq Ft × $42
Fringe Sq Ft       = Green Sq Ft × (20% | 35% | 50%)   for S | M | L fringe tier
Fringe Cost        = Fringe Sq Ft × $36
Lawn Cost          = Lawn Sq Ft × $30
Bunker Sq Ft       = 150 | 300 | 500   for S | M | L
Bunker Cost        = Bunker Sq Ft × $75
Chipping Cost      = Qty × $1,000

Subtotal           = sum of line item costs
Access adjustment  = Subtotal × (0% | 10% | 15% | 25%)   for Great | Good | Okay | Poor
Quote total        = Subtotal + Access adjustment
```

**Open items (draft §4.2, §4.3, §11):** Confirm S/M/L **fringe/bunker** defaults; confirm **access multipliers** with Greens on Q; email/notification policy and provider (SendGrid vs existing)—**future**.

**Out of scope v1 product (draft §10):** Payment processing, CAD/site maps, multi-currency, native app, CRM integration.
