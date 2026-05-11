# AGENTS.md

## Cursor Cloud specific instructions

### Overview

This is a Cursor SDLC Workshop repository containing multiple independent React/Vite frontend applications. There is no shared root `package.json` — each app must have `npm install` run independently.

### Key services

| Service | Path | Port | Dev command |
|---------|------|------|-------------|
| Workshop Slides | `workshop-slides/` | 5175 | `npm run dev` |
| LinkedOut Team 1 | `linkedout/team_1/` | 3001 | `npm run dev` |
| LinkedOut Team 2 | `linkedout/team_2/` | 3002 | `npm run dev` |
| LinkedOut Team 3 | `linkedout/team_3/` | 3003 | `npm run dev` |
| LinkedOut Team 4 | `linkedout/team_4/` | 3004 | `npm run dev` |
| LinkedOut Team 5 | `linkedout/team_5/` | 3005 | `npm run dev` |

### Lint / Build / Test

- **Lint:** Only `workshop-slides/` has ESLint configured (`npm run lint`). The LinkedOut team apps do not have linting set up.
- **Build:** All apps support `npm run build` (Vite production build).
- **Tests:** No automated test suites exist in this codebase. Verification is done by running the dev server and checking the UI.

### Important notes

- No database, backend, or environment variables are needed — all apps use in-memory mock data.
- No Docker or external services required.
- The `archive/` directory contains past workshop projects; it is not part of the active development scope.
- Package manager is **npm** (lockfiles are `package-lock.json`).
- Workshop Slides uses Vite 7 + React 19; LinkedOut teams use Vite 5 + React 18.
