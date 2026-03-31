# SubSpend — Base MVP

Minimal subscription list with **monthly total** and **localStorage** (no server).

## Run locally

From this folder:

```bash
open index.html
```

Or serve over HTTP (optional):

```bash
python3 -m http.server 8080
```

Then open [http://localhost:8080](http://localhost:8080).

## Files

| File | Role |
|------|------|
| `index.html` | Form + table + total |
| `styles.css` | Layout and readability |
| `app.js` | Add row, persist, monthly math |
