# Product Requirements Document (PRD)

> **Instructions:** This is your project specification. Fill in the sections below to define what you're building.

---

## Project Overview

**Project Name:** Empathy Quest — Cursor Customer POV

**One-line Description:** A single-page, choice-driven “day in the life” roleplay where you step into different customer personas and hit realistic friction moments that mirror common Cursor buyer/user pain points.

**Type:** Web App (static UI in `base_mvp/` — e.g. one `index.html` + CSS + JS, or a tiny React/Vite app if you prefer; **no backend**)

**Reference (internal):** Persona and enablement context from [Notion — persona hub](https://www.notion.so/cursorai/15eda74ef04580cfb13bf1c899ef4a32?v=15eda74ef04580eba7f4000c6c372b37) and [Enablement Hub](https://www.notion.so/cursorai/Enablement-Hub-2fada74ef045804b927bd80a526fb78a). When you have access, paste 2–3 bullets per persona into a `personas_notes.md` (optional) and tune scene copy to match your internal language.

---

## Guidelines

### Keep It Small!
- Your MVP should be buildable in **10 minutes**
- Think "proof of concept" not "production ready"
- If it sounds ambitious, make it simpler
- **Use Cursor to help you plan this!**
- This exercise is about learning the git flow and understanding where Cursor's features fit into the SDLC

### Scope fit for this PRD
- **One browser view** — the story advances in-place (cards or panels). No separate “routes” or multi-page app for MVP.
- **No database, no login, no external APIs** — all text and branching live in a local data structure (e.g. a JSON or JS object in the repo).

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

## Design intent (roleplay / empathy)

### Personas to represent (full game — post-MVP)
Each persona gets a short “day in the life” with **3–6 beats**. Beats should surface **pain** (time lost, uncertainty, team tension, risk) not product pitch.

| Persona (examples — align names to Notion) | Example pain themes to dramatize |
|--------------------------------------------|----------------------------------|
| **Junior IC / new hire** | Unknown codebase, fear of breaking prod, not knowing *what* to ask the tool; tab overload; unclear next step after AI output |
| **Senior IC / polyglot context** | Jumping between services, reproducing bugs, “small change” that touches many files; trust: did the change match intent? |
| **Tech lead / EM** | Review load, style inconsistency, guiding juniors on safe AI use; defining team norms |
| **Staff+ / platform** | Standards, migration strain, inner-source discovery; balancing speed vs. governance |
| **IT / security / enterprise buyer** | Data residency, audit, “what leaves the perimeter,” vendor evaluation friction |

### Story structure (each scene)
1. **Situation** — you are in role; concrete context (ticket, meeting, incident).
2. **Choice** — 2–3 options (what you do next).
3. **Outcome** — friction escalates or resolves imperfectly; **one line** naming the pain (“You lost 45 minutes reconciling two docs nobody owns”).
4. **Reflection (optional in MVP)** — single line: “This maps to what we hear from X.” (Keeps it empathy-first, not a sales deck.)

---

## Base MVP

> Build the minimal working version of your project first.

**What the MVP includes:**
- **One persona** (recommend: **Junior IC on an unfamiliar repo** — easiest to write, very relatable pain).
- **One linear “day”** with **4–6 steps**, each step: short paragraph + **2 choices** → next step.
- **At least 3 steps** must explicitly surface a pain point (e.g. ambiguous ticket, conflicting docs, scary merge, “AI suggested code you don’t understand”).
- **End screen** with 3 bullet “what you felt” + 3 bullet “themes” (e.g. context, trust, time) — still no backend.
- Runs locally via opening the file or `npm run dev` if you use a tiny bundler.

**What it does NOT include (stretch goals):**
- Multiple personas, persona picker, save/progress, sound, art assets, analytics
- “Correct” scoring or gamification beyond a simple stress meter (optional)
- Copy pasted verbatim from Notion (add that in a later iteration once you can access)

---

## Features

> Plan out the features you want to add after the MVP is working. Each feature should be in its own component file to keep things organized.

### Feature 1: Persona picker + second storyline
- **Description:** Dropdown or cards to choose a persona; load a different `scenes` array (same engine). Second persona recommended: **Tech lead** (review queue + team norms pain).
- **Files to create:** e.g. `personas/junior.js`, `personas/lead.js`, `PersonaSelect.jsx` (or equivalent)

### Feature 2: “Pressure” or trust meter
- **Description:** A simple bar that goes up/down based on choices to make tradeoffs visceral (time vs. safety vs. team trust).
- **Files to create:** e.g. `Meter.jsx`, `state.js`

### Feature 3: Debrief mode
- **Description:** After the run, show a structured recap: pain labels → “how teams describe this” → one “Cursor-shaped” habit (e.g. rules, tests, plan mode) **as optional hint text**, still framed as empathy not pitch.
- **Files to create:** e.g. `Debrief.jsx`, `debriefCopy.js`

---

## Success Criteria

- [ ] MVP runs locally
- [ ] At least one PR merged to the original repo
- [ ] Features work without breaking the base app
- [ ] MVP playthrough is **under 3 minutes** so workshop demos stay snappy
- [ ] At least **3 distinct pain themes** appear in the junior IC path (e.g. context overload, trust/verification, time cost)

---

## Appendix: sample MVP beat outline (Junior IC — edit freely)

Use this as `scenes` data; replace copy once you pull exact persona language from Notion.

1. **Morning — ticket:** “Fix checkout timeout.” Two paths in the wiki; both look official.  
   - *Choices:* Pick doc A / Pick doc B / Ask in chat (no one answers yet)  
   - *Pain:* **Ambiguous source of truth / context overload**

2. **You change a timeout constant** based on doc A. Local tests pass.  
   - *Choices:* Open PR now / Search for other timeouts / Run full suite (slow)  
   - *Pain:* **Incomplete mental model of the system**

3. **Review comment:** “This breaks mobile — see RFC-014.” RFC is 12 pages.  
   - *Choices:* Skim RFC / Revert and ask for pairing / Patch quickly  
   - *Pain:* **Time cost + fear of looking slow**

4. **CI fails** on a flaky integration test unrelated to your line.  
   - *Choices:* Re-run / Skip with comment / Dig into test  
   - *Pain:* **Trust in automation; what’s “safe” to merge?**

5. **End:** Debrief bullets — “lost time to conflicting docs,” “uncertainty about blast radius,” “CI noise erodes confidence.”
