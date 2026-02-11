# Hat Try-On

Upload a photo and try on hats with adjustable position and size.

## If the React app won't load

### Option 1: Use the standalone version (no npm needed)

1. **Serve the folder** — Browsers block file:// for security. Run this from the `hat-photo` directory:

   ```bash
   python3 -m http.server 8080
   ```

2. Open **http://localhost:8080/standalone.html** in your browser.

### Option 2: Run the React app

1. Install dependencies (required first time):

   ```bash
   npm install
   ```

2. Start the dev server:

   ```bash
   npm run dev
   ```

3. Open the URL shown (usually http://localhost:5173).

### Common issues

| Problem | Fix |
|--------|-----|
| Blank page / nothing loads | Don't open `index.html` by double-clicking. Use `npm run dev` or `python3 -m http.server` and open the URL. |
| "Cannot find module" | Run `npm install` first. |
| npm not found | Install Node.js: `brew install node` (Mac) or download from nodejs.org. |
