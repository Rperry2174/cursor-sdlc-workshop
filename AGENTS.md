# AGENTS.md

## Cursor Cloud specific instructions

This repo is a **Cursor SDLC Workshop** — a collection of independent frontend-only React+Vite apps with no backend or database. Each app lives in its own directory with its own `package.json` and `package-lock.json`.

### Key services

| Service | Directory | Dev command | Port | Lint |
|---|---|---|---|---|
| SDLC Workshop Slides | `slides-sdlc-workshop/` | `npm run dev` | 5175 | `npm run lint` |
| Cursor 101 Slides | `slides_cursor_101/` | `npm run dev` | 5176 | `npm run lint` |
| LinkedOut Team 1–5 | `linkedout/team_N/` | `npm run dev` | 300N | — |

### Non-obvious notes

- There is **no root `package.json`** — you must `cd` into each app directory to install and run.
- The `slides-sdlc-workshop` and `slides_cursor_101` apps use Vite 7.x (ESM). The `linkedout/team_*` apps use Vite 5.x (CJS, expect a deprecation warning — it's safe to ignore).
- LinkedOut team apps have no `lint` script; only the slide deck apps do.
- The `archive/` and `projects/` directories contain participant work from past workshops. Some have `package.json` files but they are not required for the core workshop to run.
- All apps are purely client-side React; no environment variables, secrets, or external services are needed.
