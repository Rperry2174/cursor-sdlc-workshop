# Ink Memory Match — Base MVP

Terminal Memory Card Match game, rendered with [Ink](https://github.com/vadimdemedes/ink) (React for CLIs).

See `../prd.md` for the full product spec.

## Stack

- Node.js + TypeScript
- Ink (React renderer for terminal UIs)
- `tsx` for running TypeScript directly (no build step)

## Layout

```
base_mvp/
├── src/
│   ├── cli.tsx      # entrypoint (renders <App />)
│   └── App.tsx      # top-level component
├── package.json
├── tsconfig.json
└── .gitignore
```

## Run it

From `base_mvp/`:

```bash
npm install      # first time only
npm start        # runs src/cli.tsx via tsx
```

You should see the starter placeholder screen. Press `Ctrl+C` to quit.

Other scripts:

- `npm run dev` — watch mode (auto-restarts on file changes)
- `npm run typecheck` — type-check without emitting JS

## Next steps (from the PRD)

1. Build the 4×3 board and card state.
2. Add arrow-key navigation + `Space`/`Enter` to flip.
3. Implement match / mismatch / win logic.

Then move on to the planned features: move counter, timer, and difficulty selector.
