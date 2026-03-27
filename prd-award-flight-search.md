# PRD: Award Flight Search (point.me-style)

> **Reference:** Inspired by [point.me](https://www.point.me/) — award flight search and booking with points/miles across loyalty programs.

---

## 1. Project Overview


| Field                    | Value                                                                                                                                                                                       |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Project Name**         | Award Flight Search (working title)                                                                                                                                                         |
| **One-line Description** | Identify **what award tickets are available right now** from San Francisco (business class), filter by airline/route, and see costs in USD and points/miles by connecting loyalty accounts. |
| **Type**                 | Web application (responsive)                                                                                                                                                                |
| **Primary User**         | Points/miles collectors who want to see **current** award availability and compare cost across programs.                                                                                    |
| **Primary Goal**         | Show **live/current award availability** — seats that can be booked at the time of search — not historical or estimated-only results.                                                       |


---

## 2. Problem Statement

- Credit card and airline portals show limited award options and often poor redemption value.
- Users must check each loyalty program separately to see **what’s actually available to book right now** and at what cost.
- It’s unclear which award seats are **available at this time** across United, ANA, Delta, Singapore Airlines, Aeroplan, etc., or what they cost in points and USD.

**Goal:** The website **identifies what award tickets are available at this time** — i.e., current/live award availability — from SFO (business class), lets users filter by airline and route, and shows **real** costs in **USD** and **points/miles** by connecting to supported loyalty accounts.

---

## 3. Core User Stories


| #   | As a…           | I want to…                                                                       | So that…                                                                     |
| --- | --------------- | -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| 1   | Points traveler | Search business-class flights from SF to a chosen destination                    | I can see **what award seats are available right now** in one place.         |
| 2   | Points traveler | Filter results by airline, cabin class (e.g. business), and route                | I can focus on programs I use or routes I prefer.                            |
| 3   | Points traveler | See each option’s cost in **points/miles**                                       | I know how many points I need to book.                                       |
| 4   | Points traveler | See each option’s cost in **USD** (cash equivalent)                              | I can compare value and decide whether to use points or pay cash.            |
| 5   | Points traveler | Log in to my loyalty accounts (United, ANA, Delta, Singapore Airlines, Aeroplan) | The app can show my real balances and accurate award pricing for my account. |


---

## 4. Scope & Prioritization

### 4.1 In Scope (Must-Have)

- **Current award availability (core goal)**
  - Results represent **award tickets available at the time of search** — live or near-real-time availability, not just theoretical or stale data. Where only cached/estimated data is possible, this must be clearly labeled.
- **Search**
  - Origin: San Francisco Bay Area (SFO primary; optional: OAK, SJC).
  - Destination: User-selectable (city or airport code).
  - Cabin: **Business class** (and economy if feasible for MVP).
  - One-way and round-trip (round-trip can be Phase 2 if needed).
- **Filters**
  - **Airline** (operating or marketing carrier).
  - **Cabin class** (at least Business).
  - **Route** (e.g. nonstop vs 1 stop; specific connection cities if data allows).
- **Cost display**
  - **Points/miles** per program (e.g. United miles, ANA miles, Delta SkyMiles, Singapore KrisFlyer, Aeroplan).
  - **USD** (cash price or estimated value) for the same itinerary where available.
- **Loyalty account integration (must-have programs)**
  - United (MileagePlus)
  - ANA (Mileage Club)
  - Delta (SkyMiles)
  - Singapore Airlines (KrisFlyer)
  - Aeroplan (Air Canada)
- **Authentication**
  - Secure login to each loyalty program (OAuth or official API where available; otherwise document limitations and use of partner/aggregator APIs or manual balance entry as fallback).

### 4.2 Nice-to-Have (Later Phases)

- Additional loyalty programs (e.g. American AAdvantage, British Airways, Virgin Atlantic, Chase Ultimate Rewards, Amex Membership Rewards, Capital One, etc.).
- First class as a filter.
- Multi-city / complex itineraries.
- Fare alerts and saved searches.
- Step-by-step booking instructions (point.me-style “how to book”).
- Concierge / expert booking service (human-in-the-loop).

---

## 5. Functional Requirements

### 5.1 Search & Results


| ID   | Requirement                                                                                                                                                                                                         | Priority |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| FR-1 | User can set origin (default: SFO), destination, and departure date(s).                                                                                                                                             | P0       |
| FR-2 | User can restrict results to **business class** (and optionally economy).                                                                                                                                           | P0       |
| FR-3 | Results show **currently available** award options: airline(s), route (segments), dates, cabin, and an explicit **availability indicator** (e.g. “Available now” vs “Estimated” / “Cached” where data is not live). | P0       |
| FR-4 | Each result shows **points/miles cost** per supported loyalty program that can book that option.                                                                                                                    | P0       |
| FR-5 | Each result shows **USD** cost (cash fare or estimated value) when available.                                                                                                                                       | P0       |
| FR-6 | User can filter results by: **airline**, **cabin class**, **route** (e.g. nonstop vs connecting).                                                                                                                   | P0       |
| FR-7 | Results are sortable by points, USD, duration, number of stops, etc.                                                                                                                                                | P1       |


### 5.2 Loyalty Integration & Pricing


| ID    | Requirement                                                                                                                                        | Priority |
| ----- | -------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| FR-8  | User can **log in** to each of: United, ANA, Delta, Singapore Airlines, Aeroplan.                                                                  | P0       |
| FR-9  | After login, the app can display **account balance** (points/miles) for that program (if API/partner provides it).                                 | P1       |
| FR-10 | Award pricing (points/miles and USD) reflects **user-specific** pricing where the program supports it (e.g. member vs non-member, regional rules). | P0       |
| FR-11 | If a program cannot be connected (no API, no partner), document fallback: e.g. “Estimated” pricing or manual balance entry.                        | P0       |
| FR-12 | Secure storage and use of credentials or tokens; no plaintext passwords in client; follow each program’s terms and API rules.                      | P0       |


### 5.3 UX & Performance


| ID    | Requirement                                                                                                             | Priority |
| ----- | ----------------------------------------------------------------------------------------------------------------------- | -------- |
| FR-13 | Search runs in a reasonable time (target: < 15 s for a typical query; document if slower due to multiple program APIs). | P1       |
| FR-14 | Clear loading and error states (e.g. “United temporarily unavailable”).                                                 | P0       |
| FR-15 | Responsive layout for desktop and mobile.                                                                               | P1       |


---

## 6. Non-Functional Requirements


| Area               | Requirement                                                                                                                                                                                                                                          |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Security**       | Loyalty credentials/tokens must be handled per program best practices (OAuth where available); no logging of passwords; HTTPS only.                                                                                                                  |
| **Compliance**     | Respect each program’s terms of use and API policies; disclose affiliate/partner relationships if any.                                                                                                                                               |
| **Availability**   | Degrade gracefully when a single program’s API is down (show others, show “Unavailable” for that program).                                                                                                                                           |
| **Data freshness** | Results reflect **what award tickets are available at this time**; use live or near-real-time availability where possible. Clearly distinguish “live availability” vs “cached” or “estimated” when a program doesn’t support real-time availability. |


---

## 7. Loyalty Programs: Must-Have vs Nice-to-Have


| Program                                                           | Integration (Must-Have / Nice-to-Have) | Notes                                                 |
| ----------------------------------------------------------------- | -------------------------------------- | ----------------------------------------------------- |
| **United (MileagePlus)**                                          | Must-have                              | Consider United API or official/partner aggregation.  |
| **ANA (Mileage Club)**                                            | Must-have                              | Often via partner/aggregator; document data source.   |
| **Delta (SkyMiles)**                                              | Must-have                              | Delta may have limited public API; document approach. |
| **Singapore Airlines (KrisFlyer)**                                | Must-have                              | Partner awards (e.g. Star Alliance); document source. |
| **Aeroplan (Air Canada)**                                         | Must-have                              | Star Alliance and partners; document API/partner.     |
| American AAdvantage, BA, Virgin, Chase UR, Amex MR, Cap One, etc. | Nice-to-have                           | Add in later phases.                                  |


*Implementation note:* Many programs do not offer public award-search APIs. Options include: (a) official/partner APIs if available, (b) licensed data from award-search providers, (c) manual/estimated pricing with clear labeling. The PRD assumes the product will use whatever combination of these is legally and contractually viable.

---

## 8. Data & Integrations (Assumptions)

- **Flight/award data:** Sourced from one or more of: direct airline APIs, GDS, or licensed award-search/aggregation providers. Document chosen approach and rate limits.
- **USD pricing:** From same source as award data (cash fare or partner-provided “value”).
- **Auth:** Prefer OAuth or official “login with X” where offered; otherwise document secure credential handling and compliance with each program’s terms.

---

## 9. User Flows (High Level)

1. **First-time / returning**
  - User lands on search page (origin default: SFO, cabin: Business).
  - Optionally: user connects loyalty accounts (United, ANA, Delta, Singapore, Aeroplan) from a “Linked accounts” or “Profile” area.
2. **Search**
  - User enters destination and date(s), clicks Search.
  - System queries supported programs (and any aggregator) and returns combined results.
3. **Results**
  - User sees list/cards of options with airline, route, dates, cabin.
  - Each option shows points/miles (and USD) per program that can book it; “Login to see your price” or balance for connected accounts.
  - User applies filters: airline, cabin, route (nonstop/connecting).
4. **Booking**
  - Out of scope for MVP: user is directed to the appropriate program’s website or to a documented “how to book” flow (point.me-style). No in-app booking required for MVP.

---

## 10. Success Criteria

- The product **identifies what award tickets are available at this time** — results reflect current/live award availability (or are clearly labeled when estimated/cached).
- User can run a **business-class** search from **SF** to at least one destination and see results.
- User can **filter** results by **airline**, **cabin class**, and **route**.
- Each result shows **points/miles** and **USD** where data is available.
- User can **log in** to **United, ANA, Delta, Singapore Airlines, and Aeroplan** (or document why a program is “estimated only”).
- After login, pricing (or clear “estimated” messaging) is shown for connected programs.
- No sensitive credentials stored insecurely; security and compliance approach documented.
- MVP runs in a hosted environment (e.g. staging) and is usable on desktop and mobile.

---

## 11. Out of Scope for Initial Release

- Actual **booking** inside the app (redirect or instructions only).
- First-class-only search; multi-city; fare alerts; concierge.
- Programs beyond the five must-have loyalty programs (in MVP).
- Stored user profiles and persistent “saved searches” (can be Phase 2).

---

## 12. Open Questions / Decisions

- **Data provider:** Which award-search or airline data partner(s) to use (cost, coverage, API constraints)?
- **Auth:** Which programs offer OAuth or official APIs vs. requiring partner/aggregator or “estimated” only?
- **USD source:** Cash fare from same provider, or separate pricing source?
- **Branding:** Final product name and positioning (e.g. “point.me clone” vs. standalone brand).

---

## 13. Appendix: point.me Reference

[point.me](https://www.point.me/) provides:

- Award flight search across 100+ airlines and 30+ loyalty programs.
- **Real-time or near-real-time availability** — showing what award tickets are available at the time of search.
- Comparison of cash vs. points and step-by-step transfer/booking guidance.
- Membership with unlimited searches, fare alerts, and points portfolio tracking.
- Concierge booking for complex or high-value trips.

This PRD focuses on a **subset** of that vision: **search from SF, business class, filter by airline/class/route, costs in USD and points, with login to the five must-have loyalty programs.** Additional programs and features are explicitly deferred to later phases.

---

## 14. Feasibility Assessment & MVP Timeline

### 14.1 Summary


| Question                        | Short answer                                                                                                                                                                                                                                                           |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Can you build this?**         | **UI and flows: yes.** Real live availability + loyalty login for all five programs: **blocked on data/partnerships** — no public APIs exist.                                                                                                                          |
| **Key risk**                    | Award availability and “login to loyalty account” depend on **data providers and/or airline/partner deals**, not on engineering alone.                                                                                                                                 |
| **MVP with Cursor (realistic)** | **1–2 weeks** for a **working demo**: full search/filter UX, results in points + USD, “connect account” UI, using **mock or one real data source**. A **production** MVP with real live data for all five programs is **months**, not weeks, and depends on contracts. |


---

### 14.2 Feasibility by Component


| Component                                                   | Feasibility             | Why                                                                                                                                                                                                                                                                                                                                                                                                        |
| ----------------------------------------------------------- | ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Search UI** (origin SFO, destination, date, cabin)        | ✅ High                  | Standard form + validation; Cursor can scaffold quickly.                                                                                                                                                                                                                                                                                                                                                   |
| **Filters** (airline, class, route)                         | ✅ High                  | Client-side or API-backed filters; straightforward.                                                                                                                                                                                                                                                                                                                                                        |
| **Results list/cards** (airline, route, dates, points, USD) | ✅ High                  | Layout and state management; no dependency on real data.                                                                                                                                                                                                                                                                                                                                                   |
| **“Connect loyalty account” UI**                            | ✅ High                  | Buttons, modals, “Connected” state — all buildable. **Actual** connection to United/ANA/Delta/Singapore/Aeroplan is the blocker (see below).                                                                                                                                                                                                                                                               |
| **Live award availability** (what’s bookable *right now*)   | ⚠️ **Blocked**          | United, Delta, ANA, Singapore Airlines, and Aeroplan **do not offer public APIs** for award seat availability. point.me and similar products use **GDS contracts** (Amadeus, Sabre), **licensed aggregators**, or **proprietary/partner** access. You cannot “just build” this without a data partner or enterprise agreement.                                                                             |
| **Login to United / ANA / Delta / Singapore / Aeroplan**    | ⚠️ **Blocked**          | None of these programs offer public OAuth or “login with X” for third parties to read balance or award pricing. Options in practice: (1) **Partner/white-label** deal (hard to get), (2) **User gives you credentials** (ToS violation for most programs, security and liability risk), (3) **Manual balance entry** + **estimated** pricing (feasible, but not “login to loyalty account” as in the PRD). |
| **Points + USD per result**                                 | ✅ With data; ⚠️ without | If you have a data source (mock or one provider), showing points and USD per result is easy. Without a source, you can show **static award charts** or **estimated** ranges (e.g. “SFO–NRT business: ~60k–80k ANA”) and label as “Estimated.”                                                                                                                                                              |


**Bottom line:** The **product experience** (search → filters → results in points/USD → “connect account”) is **feasible to build**. The **data and auth** (real availability + real “login to see your price”) are **supply-side constrained** — they require partnerships or licensed data, not just engineering.

---

### 14.3 Key Risks


| Risk                                  | Impact                                                                                                                        | Mitigation                                                                                                                                                                                                                                                                                                 |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **No public award-availability APIs** | Cannot show “what’s available right now” for the five programs without a data partner.                                        | (1) **Demo MVP:** Use mock or one real API (e.g. Amadeus Test API, or a single paid award-search API) and clearly label “Demo” / “Sample data.” (2) **Production:** Budget and timeline for **GDS or award-search provider** (e.g. ExpertFlyer, plus travel-data vendors); expect enterprise sales cycles. |
| **No OAuth for loyalty programs**     | Cannot offer “log in to United/Delta/…” in the way the PRD describes.                                                         | (1) **MVP:** “Connect account” = **manual balance entry** + **estimated pricing** from static charts or one data source; label “Estimated – connect at airline to confirm.” (2) **Later:** Pursue **white-label or partner** deals if product gains traction.                                              |
| **ToS and liability**                 | Storing or using user credentials to scrape airline sites is against most programs’ ToS and creates security/compliance risk. | **Do not** implement credential storage for scraping. Use only official APIs, partner APIs, or manual entry + estimates.                                                                                                                                                                                   |
| **Data cost**                         | Real award-availability data is typically **paid** (per-query or subscription).                                               | Factor data-provider cost into unit economics; start with one provider and limited routes for MVP.                                                                                                                                                                                                         |
| **Scope creep**                       | “Working MVP” can mean either “demo that looks and feels right” or “real availability + real pricing.”                        | Define **two MVP paths** (see below) and choose one up front.                                                                                                                                                                                                                                              |


---

### 14.4 Two MVP Paths

**Path A: Demo / UX MVP (achievable in ~1–2 weeks with Cursor)**  

- **Goal:** A working app that demonstrates the full flow and can be used for demos, user testing, or fundraising.  
- **Scope:**  
  - Search from SFO, destination, date, cabin (business).  
  - Filters: airline, cabin, route.  
  - Results: list/cards with airline, route, dates, **points** and **USD** from **mock data or one real/sandbox API**.  
  - “Connect account” UI (no real loyalty login); optional: manual balance entry and “Estimated” pricing.  
  - Clear labeling: “Demo – sample availability” or “Estimated pricing.”
- **Data:** Static JSON, seeded DB, or a single sandbox/paid API (e.g. Amadeus test, or one award-search provider with a dev tier).  
- **Cursor:** Use Cursor to scaffold React/Next.js (or similar), implement search + filters + results + “connect” UI, and wire to mock or one API. **Realistic: 1–2 weeks** for one developer.

**Path B: Production MVP (real availability + real pricing)**  

- **Goal:** Real “what award tickets are available at this time” and real or partner-sourced pricing for the five programs.  
- **Blockers:** Data provider contract(s), and possibly partner deal(s) for “login” or pricing.  
- **Timeline:** **Months**, not weeks: provider evaluation, contracts, integration, and compliance. Engineering with Cursor can still speed up the **app build** once data/APIs are in place, but the **critical path** is data/partnerships.

---

### 14.5 How Quickly Could You Build a “Working” MVP with Cursor?

- **If “working” = Path A (demo with full UX and mock/one data source):**  
**~1–2 weeks** with Cursor for one developer: app runs locally (or deployed), user can search, filter, see results with points and USD, and see “connect account” (with manual/estimated fallback). No real live availability or real loyalty login.
- **If “working” = Path B (real live availability + real loyalty integration):**  
**Not on a 1–2 week timeline.** The **working** part depends on **sourcing data and (if desired) partner auth**; after that, building the app with Cursor might be another **few weeks**. Total: **months** including vendor/partner work.

**Recommendation:** Build **Path A** first with Cursor (1–2 weeks), use it to validate UX and storytelling, then in parallel **research and contact** award-data providers and document which (if any) loyalty programs could support “connect account” via partner APIs. Update the PRD and success criteria to distinguish “Demo MVP” (Path A) from “Production MVP” (Path B) so feasibility and timeline stay clear.