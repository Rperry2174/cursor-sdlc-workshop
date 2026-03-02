---
name: project-planning
description: Guides project planning and code generation for the SDLC workshop. Enforces frontend-only React apps, recommends stubbing over real backends, and ensures projects stay small. Use when planning a project, generating a PRD, scaffolding an MVP, or when the user asks what to build.
---

# Project Planning (SDLC Workshop)

## When to use

Activate whenever:
- A participant is deciding what to build or filling out their PRD
- Generating or scaffolding a base MVP
- Planning features or breaking work into tasks
- The user asks Cursor to build, create, or implement something for the workshop

## Hard constraints

These are non-negotiable for this workshop. If a user's request would violate one, explain why and offer a frontend-only alternative.

### No backends

- **No databases** — no SQLite, no PostgreSQL, no Firebase, no IndexedDB
- **No servers** — no Express, no Flask, no custom API server, no API routes
- **No authentication** — no login, no OAuth, no JWT, no user accounts
- **No external APIs** — no fetch to third-party services, no API keys

### Use React

- All projects **must use React** — scaffold with `npx create-react-app` or Vite (`npm create vite@latest -- --template react`)
- Vite is preferred for speed — it starts faster and hot reloads instantly
- Run with `npm run dev` (Vite) or `npm start` (CRA)
- Keep dependencies minimal — React itself is enough for these projects. Don't add extra libraries unless there's a clear reason.

### Stay small

- The base MVP must be buildable by **one person in 10 minutes**
- Keep the component count low — a handful of components, not a complex tree
- No routing libraries needed — these are single-page apps
- No state management libraries — React's built-in `useState` and `useRef` are plenty

### Scale down ambitious ideas

If a user proposes something too complex, **don't just say no** — suggest a simpler version that captures the same spirit. Keep the fun, lose the complexity.

| They want... | Suggest instead... | Why it works |
|---|---|---|
| Multiplayer battle game with lobbies | Two-player Pong on the same keyboard | Still competitive, no networking needed |
| Spotify clone with playlists and streaming | Soundboard with clickable buttons that play short audio clips | Still about music, instant gratification |
| E-commerce store with cart and checkout | Fake product catalog you can browse and "favorite" | Same visual feel, state lives in a variable |
| Wordle with daily words from a server | Wordle with a hardcoded word list and `Math.random()` | Identical gameplay, zero infrastructure |

**The pattern:** take the core interaction that makes it fun (clicking, competing, creating) and strip away everything that needs a server, accounts, or real-time sync.

## What to do instead of a backend

When a feature "wants" a backend, use these frontend patterns:

### Data that would come from a database
Hardcode it as a JavaScript array or object in a separate file or at the top of a component:

```javascript
// data.js — stub data, no database needed
export const TRIVIA_QUESTIONS = [
  { question: "What is the capital of France?", choices: ["London", "Paris", "Berlin", "Madrid"], answer: 1 },
  { question: "What year did the moon landing happen?", choices: ["1965", "1969", "1971", "1973"], answer: 1 },
];
```

Or put it in a JSON file and import it:

```javascript
import questions from './data/questions.json';
```

### State that would be stored server-side
Use React state for in-session data, or `localStorage` if it should survive a page refresh:

```jsx
const [score, setScore] = useState(0);
const [highScore, setHighScore] = useState(
  () => Number(localStorage.getItem('highScore')) || 0
);
```

### Randomness or dynamic content
Use `Math.random()`, shuffle arrays, or rotate through hardcoded lists. No server needed.

### User input
Use React event handlers and state. That's the whole "backend."

## Modular features

Design features as independent, self-contained components. This is good architecture practice and keeps the codebase clean:

1. **The base MVP should be minimal** — just enough to run and show something. Leave interesting features for later iterations.
2. **Each feature should be its own component** — one component per file keeps things organized and avoids conflicts if collaborating.
3. **Features should be additive** — adding a `<Scoreboard />` component should not require changing how the game loop works in `App.jsx`.

### Good feature pattern
Each feature lives in its own file:
- `Scoreboard.jsx` — displays and tracks scores
- `Settings.jsx` — difficulty slider, theme picker
- `SoundEffects.jsx` — plays sounds on game events
- `Timer.jsx` — countdown or elapsed time display
- `Animations.jsx` — confetti on win, shake on miss

### Bad feature pattern
Putting everything in `App.jsx` or a single shared component — this gets messy fast.

## When generating code

- Use **React with functional components and hooks** (`useState`, `useEffect`, `useRef`)
- Keep it in the `src/` folder with a clean component structure
- Use CSS modules, a single `App.css`, or inline styles — whatever is simplest
- Make it visually presentable — use modern CSS, clean layout, readable fonts
- Include basic responsive design so it looks decent on a projected screen
- Add comments explaining what each section does (these are beginners)
- Keep component files focused — one component per file

## Tone

Remember the audience: these are **sales, field engineering, and account management** professionals, not developers. When explaining technical decisions:
- Keep language simple and direct
- Avoid jargon unless you immediately explain it
- Frame choices in terms of "this keeps it simple" rather than technical tradeoffs
