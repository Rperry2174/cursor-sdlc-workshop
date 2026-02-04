# First Month @ Cursor — Action Items

A to-do app for tracking action items during your first month as a salesperson at Cursor.

## Run locally

1. **Install dependencies** (one time):
   ```bash
   cd cursor-sales-todo
   npm install
   ```

2. **Start the dev server**:
   ```bash
   npm run dev
   ```

3. **Open in browser:**  
   Go to **http://localhost:5176** (or the URL Vite prints in the terminal).

## Features

- Pre-loaded first-month action items (onboarding, training, shadowing, outreach, etc.)
- Add new items, mark complete (green), or leave incomplete (red)
- Remove items
- List persists in the browser (localStorage) across refreshes

## Build for production

```bash
npm run build
```

Output is in `dist/`. Serve that folder with any static host.
