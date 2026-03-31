# StepDraw Jr (base MVP)

Minimal single-page app from `../prd.md`: step-by-step drawing guides for kids (**Animals** / **Cars** / **Houses**), **search**, and progressive SVG hints.

## Run locally

```bash
cd base_mvp
npm install
npm run dev
```

Open the URL Vite prints (often `http://localhost:5173`).

## Layout

| Path | Purpose |
|------|---------|
| `src/data/lessons.js` | Lessons, categories, keywords, search |
| `src/data/strokeOrders.md` | North-star stroke order for authors |
| `KID_TEST_CHECKLIST.md` | How to kid-test new copy or art |
| `src/components/LessonSearch.jsx` | Find something to draw |
| `src/components/CategoryPicker.jsx` | Category chips |
| `src/components/StepDiagram.jsx` | Inline SVG fallback |
| `src/components/StepDiagramLoader.jsx` | Loads `public/steps/<lessonId>/<n>.svg` when present |
| `public/steps/` | Optional Figma/Illustrator exports (see `public/steps/README.md`) |
| `../docs/image-sources.md` | PD/CC0 reference log |
| `public/images/hints/` | Optional per-step reference images (see `README` there) |
| `src/components/StepHintImage.jsx` | Shows hint image in the instructions panel |
| `src/components/LessonView.jsx` | Steps, Back / Next / Draw again |

## Workshop

See `../prd.md` for scope and success criteria.
