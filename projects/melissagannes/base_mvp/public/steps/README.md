# Per-step diagram assets (optional)

Drop **your** exported SVGs from Figma or Adobe Illustrator here so the app can load them instead of the built-in inline diagrams.

## Paths

```
public/steps/<lessonId>/<stepIndex>.svg
```

- `lessonId` must match [`src/data/lessons.js`](../../src/data/lessons.js) keys: `cat`, `simple-car`, `simple-house`.
- `stepIndex` is **zero-based** (first step = `0.svg`).

## Example

- Cat lesson, 7 steps: `cat/0.svg` … `cat/6.svg`

If a file is **missing**, the UI automatically uses the inline SVG in [`src/components/StepDiagram.jsx`](../../src/components/StepDiagram.jsx).

## SVG tips

- Use `viewBox="0 0 200 200"` to match the inline diagrams.
- Prefer `stroke="currentColor"` and `fill="none"` (or `currentColor`) so the diagram picks up theme colors from the wrapper.
- Avoid embedding remote images or scripts inside SVG files.
