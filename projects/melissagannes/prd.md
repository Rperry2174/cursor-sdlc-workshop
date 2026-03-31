# Product Requirements Document (PRD)

> **Instructions:** This is your project specification. The sections below describe **StepDraw Jr** as implemented for reviewers.

---

## Project Overview

**Project Name:** StepDraw Jr

**One-line Description:** A single-page web app that teaches kids (ages **6–8**) how to draw **simple pictures** step by step, with **search**, **topic categories**, and **progressive on-screen hints** (SVG) for each step.

**Type:** Web App (single page) — React + Vite, code in `base_mvp/`

---

## Guidelines (workshop)

### Keep It Small!
- The workshop still encourages a **small, local** proof of concept and learning **git flow** with Cursor.
- This project stays **frontend-only**: no database, no sign-in, no backend API.

### Out of scope for this product (by design)
- User accounts or saving progress
- External APIs or hosted data
- Multi-page routing (everything is one screen)
- Full drawing canvas / touch inking (kids draw on paper; the app shows **guides**)

---

## What Shipped (product summary)

### Audience & UX
- Short, kid-friendly copy; **large tap targets**; readable type and contrast (including dark mode via system preference).
- **One step at a time:** step counter, instruction text, cumulative diagram for that lesson.

### Lessons (built-in)
| Category | Default lesson | Steps |
| --- | --- | --- |
| **Animals** | A friendly **cat** | 7 |
| **Cars** | A simple **car** | 6 |
| **Houses** | A cozy **house** | 6 |

Each lesson uses **progressive SVG** diagrams (each step adds to the picture). The **first step** often shows a **light construction** outline (dashed); later steps finalize the drawing. Authoring notes: [`base_mvp/src/data/strokeOrders.md`](projects/melissagannes/base_mvp/src/data/strokeOrders.md).

Optional **Figma / Illustrator** exports: drop files at `base_mvp/public/steps/<lessonId>/<stepIndex>.svg` (e.g. [`public/steps/cat/0.svg`](projects/melissagannes/base_mvp/public/steps/cat/0.svg)). The app loads them via [`StepDiagramLoader.jsx`](projects/melissagannes/base_mvp/src/components/StepDiagramLoader.jsx); if a file is missing, it falls back to inline [`StepDiagram.jsx`](projects/melissagannes/base_mvp/src/components/StepDiagram.jsx). Log PD/CC0 references in [`docs/image-sources.md`](projects/melissagannes/docs/image-sources.md).

**Step hint images** (optional reference photos or art in the right panel): put files under [`base_mvp/public/images/hints/<lessonId>/`](projects/melissagannes/base_mvp/public/images/hints/README.md) as `<stepIndex>.svg` (or `.png` / `.jpg`), or set `hintImage` on a step in `lessons.js`. Loaded by [`StepHintImage.jsx`](projects/melissagannes/base_mvp/src/components/StepHintImage.jsx); if nothing loads, the hint block is omitted.

### Search: “Find something to draw”
- Search box filters lessons by **title**, **keyword** lists (e.g. cat, kitty, car, house), and **words inside step instructions** (e.g. whisker, pencil).
- **Empty search** lists all lessons so kids can tap without typing.
- Choosing a result loads that lesson, syncs the **category** chip, and **resets to step 1**.

### Categories
- **Animals / Cars / Houses** chips switch the active category’s **default lesson** and reset to step 1.

### Navigation & finish
- **Back** and **Next** move between steps.
- On the **last step:** “You did it! Great drawing!” plus **Draw again** (restarts the current lesson from step 1).

---

## Implementation (for reviewers)

| Area | Location |
| --- | --- |
| Lesson & category data, keywords, search helpers | `base_mvp/src/data/lessons.js` |
| North-star stroke order (for authors) | `base_mvp/src/data/strokeOrders.md` |
| Category chips | `base_mvp/src/components/CategoryPicker.jsx` |
| Search UI | `base_mvp/src/components/LessonSearch.jsx` |
| Step diagrams (inline SVG) | `base_mvp/src/components/StepDiagram.jsx` |
| Optional per-step SVG files (public folder) | `base_mvp/public/steps/<lessonId>/<n>.svg`, loaded by `StepDiagramLoader.jsx` |
| Reference / license log | `docs/image-sources.md` |
| Step hint images (panel) | `base_mvp/src/components/StepHintImage.jsx`, `public/images/hints/` |
| Main screen logic | `base_mvp/src/components/LessonView.jsx` |
| App shell | `base_mvp/src/App.jsx`, `App.css`, `index.css` |

**Run locally:** from `base_mvp/`, run `npm install` then `npm run dev`.

---

## Optional future polish (not required for workshop)

- Richer “finish” moment (e.g. light CSS confetti or illustration) in addition to the current message + **Draw again**.
- More lessons: add entries in `lessons.js`, keywords for search, and a matching diagram branch in `StepDiagram.jsx`.

---

## Success Criteria

- [ ] MVP runs locally (`npm run dev` in `base_mvp/`)
- [ ] At least one PR merged to the original repo
- [ ] Features work without breaking the base app
