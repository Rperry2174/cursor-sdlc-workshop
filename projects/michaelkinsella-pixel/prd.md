# Product Requirements Document (PRD)

> **Instructions:** This is your project specification. Fill in the sections below to define what you're building.

---

## Project Overview

**Project Name:** Hangry

**One-line Description:** Learn what’s missing from your kitchen by comparing your “full weekly order” to what you still have, then get a clear list of what to buy next—**eventually** wired into **[Jewel-Osco](https://www.jewelosco.com/)** online ordering; **this workshop build** proves the diff logic locally first.

**Type:** Web App (single page in `base_mvp/`)

---

## Product vision (north star)

You want a workflow like this:

1. **Baseline:** Upload or capture a **receipt (or order)** that represents your **ideal weekly stock** when the fridge/pantry is “full.” The app remembers that as the template order.
2. **Later:** Take a **photo of the fridge** (or pantry); the app **reads what’s visible** and turns it into a structured list of what you still have.
3. **Reorder:** The app **compares** baseline vs current, figures out **what’s missing or low**, and **automates creating that order** in your grocery flow—your store is **[Jewel-Osco](https://www.jewelosco.com/)** (delivery/pickup via their site or app).

That end state needs **computer vision**, **reliable SKU mapping**, and **store integrations**—all out of scope for this repo’s workshop rules (no auth, no database, no required external APIs). Below, the **Base MVP** is a deliberate slice that exercises the *same decision* (“what should I buy?”) with manual inputs so you can ship something small and real.

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
- **Baseline list:** A text area where you paste your “full week” grocery list (one item per line), representing the receipt/order when you’re fully stocked. Store it in memory (e.g., a parsed array in JavaScript)—no database.
- **“What’s in the fridge now” list:** A second text area where you paste a simple list of items you still have (simulating the output of reading a photo—without OCR in the MVP).
- **Shopping list output:** A button that computes **items to order** = **baseline items that are not still present** (simple string match after normalizing: trim, lowercase). Show the result as a bullet list on the same page.
- **Jewel-Osco context:** Short on-page copy that this list is meant to be shopped at **[Jewel-Osco](https://www.jewelosco.com/)**, plus a **“Open Jewel-Osco”** control that opens their site in a new tab (manual handoff—you still search/add items there; no API).
- Basic layout/CSS so the two inputs and the output are easy to read.

**What it does NOT include (stretch goals):**
- Real receipt upload parsing, camera capture, or OCR
- Calling the **[Jewel-Osco](https://www.jewelosco.com/)** (or any) grocery API, or programmatically building a cart
- Accounts, login, or saved history across refreshes (browser refresh can reset state unless you add `localStorage` later as an enhancement)

---

## Features

> Plan out the features you want to add after the MVP is working. Each feature should be in its own component file to keep things organized.

### Feature 1: Baseline receipt normalization
- **Description:** Take pasted receipt or list text and normalize it: split lines, trim whitespace, remove empty lines, optional simple deduplication, and maybe strip leading bullets or numbers so “milk” matches whether it came from a receipt or a quick list.
- **Files to create:** `base_mvp/js/baselineParser.js` — export something like `parseBaseline(text) -> string[]`.

### Feature 2: Fridge “snapshot” helper (still no OCR API)
- **Description:** Improve the “current inventory” side: allow comma-separated input **or** multiple lines; normalize the same way as baseline so the diff is fair. Optional: a “sample fridge” button that fills the field with demo items for testing.
- **Files to create:** `base_mvp/js/inventoryParser.js` — export `parseInventory(text) -> string[]` and reuse shared `normalizeItem(name)` from a tiny `base_mvp/js/stringUtils.js` if helpful.

### Feature 3: Order handoff (manual automation bridge)
- **Description:** Don’t integrate the store yet—add **“Copy order list”** (clipboard) and **“Open Jewel-Osco”** using the default URL **[https://www.jewelosco.com/](https://www.jewelosco.com/)** (optional: let the user override the URL in the UI and persist with `localStorage`). Opens in a new tab so you can search/add items on Jewel-Osco; this is the stand-in for “automates creating that order” until a real integration exists.
- **Files to create:** `base_mvp/js/orderHandoff.js` — build the final multiline string, copy via `navigator.clipboard`, default `storeUrl` to Jewel-Osco, allow override.

---

## Success Criteria

- [ ] MVP runs locally
- [ ] At least one PR merged to the original repo
- [ ] Features work without breaking the base app
