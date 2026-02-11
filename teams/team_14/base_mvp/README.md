# Base MVP

This folder is where your project code lives.

## Current MVP Shell

This folder now contains a runnable, static web app shell for the pricing calculator:
- `index.html`
- `styles.css`
- `app.js`

### What the shell does
- Takes inputs: seats, monthly committed usage per user, term
- Computes:
  - list core ACV
  - discounted core ACV
  - ACV range
  - coupled `ACV -> CTR` point series (11 points)
  - CTR floor range summary from those points
- Shows the results in a single-page UI with copy-summary action

### Run locally

From this folder:

```bash
python3 -m http.server 4173
```

Then open:

`http://localhost:4173`

## Phase 2: Design (One Person)

**One team member** creates the base MVP here. This is the foundation everyone else builds on.

### What to Build
- A minimal, working version of your project
- Should run locally and do *something* visible
- Keep it simple — 10 minutes max!

### Good Examples
- A Chrome extension with one button that does one thing
- A web page with basic HTML/CSS/JS
- A simple CLI script

### Instructions

1. Tell Cursor to read the `prd.md` in your team folder
2. Tell Cursor to generate the base MVP here
3. Tell Cursor to run it locally and verify it works

### After You're Done

> **Ask Cursor:** "Commit all my changes with the message '[Team] - Base MVP scaffold', push to my fork, and open a PR to the original repo"

Once the PR is merged, your teammates can build on top of it!
