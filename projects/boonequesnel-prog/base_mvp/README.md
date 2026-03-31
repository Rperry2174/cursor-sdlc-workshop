# Greens on Q (Base MVP)

Single-page React app: enter golf green, fringe tier, lawn, bunker size, and chipping count; pick site access; get an itemized estimate from the static price table in `src/components/GolfTurfQuote.jsx`.

## Run locally

From this folder:

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Build

```bash
npm run build
npm run preview
```

## Notes

- All calculations run in the browser — no backend, no API calls (workshop constraints).
- PRD: `../prd.md` (Notion source: [Turf quoting tool PRD](https://www.notion.so/cursorai/Turf-quoting-tool-PRD-334da74ef04580a4a9f8f3b87acff4aa)).
