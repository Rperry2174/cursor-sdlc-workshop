# Base MVP (minimal)

Implements the core loop from `../prd.md`:

- Short **match list** with a one-line tactical fingerprint
- **Match detail** as a **segment timeline** (time range, game context, phase, in/out-of-possession shape labels, trigger, roles, confidence)
- **Shape glossary** (text only — no diagrams in this MVP)

Data in `src/data.js` is **fictional** demo content.

```bash
npm install
npm run dev
```

Default dev server: [http://localhost:5180](http://localhost:5180) (see `vite.config.js`).
