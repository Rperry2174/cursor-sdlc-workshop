# Product Requirements Document (PRD)

> **Instructions:** This is your team's project specification. Fill in the sections below to define what you're building.

---

## Project Overview

**Project Name:** Vocab Vault

**One-line Description:** Look up word definitions, synonyms, and example sentences via a dictionary API (or add your own), save them to a personal vocab list, and revisit your learning—all in one place.

**Type:** Web App (React, Vite, frontend-only)

---

## Guidelines

### Keep It Small!
- Your MVP should be buildable in **10 minutes** by one person
- Think "proof of concept" not "production ready"
- **Use Cursor to help you plan this!** You need a project that has at least 5 features so everyone on your team can pick one and add it
- Feel free to adjust — this exercise is about learning the git flow, collaborating on a team, and understanding where Cursor's features fit into the SDLC

### Tech Stack
- **React + Vite** — scaffold with `npm create vite@latest -- --template react`
- **Free Dictionary API** — no API key required: `https://api.dictionaryapi.dev/api/v2/entries/en/{word}`
- **localStorage** — persist the vocab list (no database)
- **Single page** — no routing needed

### Bad Project Ideas (Too Big!)
- Anything with a database or server
- Anything requiring authentication
- Anything with multiple pages/screens beyond this one-page app

---

## Team Members & Tasks

> **Important:** Each team member MUST have their own task. Tasks should be independent features that can be built in parallel without stepping on each other's toes.

| Name   | Task                  | Description                                               |
|--------|-----------------------|-----------------------------------------------------------|
| Taylor | Lookup UI             | Input field, Look up button, definition display area      |
| Taylor | Loading & error UX    | Spinner, "Word not found" message, optional manual entry |
| Taylor | Vocab list cards      | Styled card layout for each saved word + definition       |
| Taylor | Remove from list      | Delete button per vocab item                              |
| Taylor | Search/filter list    | Filter saved words by typing in a search box              |

### Task Guidelines
- Each task should add something **visible** to the project
- Tasks should be **independent** — no dependencies on other tasks
- Think: new component, new section, new interaction, etc.
- Everyone should be able to work at the same time without conflicts

---

## Base MVP (Phase 2)

> **One person** creates the foundation that everyone else builds on.

**What the MVP includes:**
- Input field to type a word
- "Look up" button that fetches from the Free Dictionary API
- Display the definition (first result: word, part of speech, meaning)
- Display synonyms when the API returns them (from `meanings[].synonyms` or `definitions[].synonyms`)
- Display example sentence: pull from API when available (`meanings[].definitions[].example`), **or** allow user to type their own example in a text field (for when the API has none, or to add a personal sentence)
- "Add to vocab list" button that saves the current word + definition + synonyms + example to state and localStorage
- Simple list showing saved words with definition, synonyms, and example columns (can be unstyled `<ul>` or basic divs—polish comes in features)
- Read from localStorage on load so the list persists across page refreshes
- Minimal styling: readable fonts, basic layout, enough structure for features to plug in

**What it does NOT include:**
- Loading spinner or "searching..." state
- "Word not found" or error handling when the API returns 404
- Styled cards for the vocab list
- Remove/delete functionality
- Search or filter
- Export

---

## Feature Slots (Phase 3)

> These are the features team members will add. Design them to be **independent** so people can work in parallel.

### Feature 1: Lookup UI
- **Assigned to:** Taylor
- **Description:** Input field, "Look up" button, and a dedicated area to display the fetched definition. Show word, part of speech, definition text, **example sentence** (from API when available, else editable input so user can add their own), and **synonyms** (comma-separated). Keep it clean and readable.
- **Files to modify/create:** `LookupInput.jsx` or similar, `DefinitionDisplay.jsx`, wire into `App.jsx` if not already part of the base MVP.

### Feature 2: Loading & error UX
- **Assigned to:** Taylor
- **Description:** While fetching: show a loading spinner or "Looking up..." text. If the API returns 404 or an error: show "Word not found" and optionally a fallback "Add your own definition?" with a text input so the user can still save the word.
- **Files to modify/create:** `LookupInput.jsx` or `DefinitionDisplay.jsx`—add loading state, error state, and optional manual-definition fallback.

### Feature 3: Vocab list cards
- **Assigned to:** Taylor
- **Description:** Display each saved word in a card layout: word as heading, definition, **synonyms**, and **example sentence** (column or section for each). Include readable spacing and maybe a light border or background. Replace the basic list with these cards.
- **Files to modify/create:** `VocabCard.jsx`, `VocabList.jsx` (or update existing list component), add CSS for card styling.

### Feature 4: Remove from list
- **Assigned to:** Taylor
- **Description:** Add a "Remove" or delete button on each vocab item. Clicking it removes the item from the list and updates localStorage.
- **Files to modify/create:** `VocabCard.jsx` or `VocabList.jsx`—add remove handler, pass it down from `App.jsx` or parent that holds the vocab state.

### Feature 5: Search/filter list
- **Assigned to:** Taylor
- **Description:** A search or filter input above the vocab list. Typing filters the displayed words to those that match (by word, definition, synonyms, or example sentence). Show all when the search is empty.
- **Files to modify/create:** `VocabList.jsx` or a new `VocabFilter.jsx`—add filter state and filtered list logic.

---

## API Reference

**Free Dictionary API**
- **Endpoint:** `GET https://api.dictionaryapi.dev/api/v2/entries/en/{word}`
- **No API key** required
- **Example:** `fetch('https://api.dictionaryapi.dev/api/v2/entries/en/serendipity')`
- **Success:** Returns JSON array with `word`, `phonetics`, `meanings` (definitions with optional `example` string, part of speech, `synonyms`, `antonyms`)
- **Example sentence:** When present, at `meanings[i].definitions[j].example` — use the first available, or let the user add their own
- **404:** Word not found—handle gracefully

---

## Success Criteria

- [ ] MVP runs locally
- [ ] Each team member has merged at least one PR
- [ ] All features work together without breaking the app
- [ ] Vocab list persists in localStorage across page refreshes
