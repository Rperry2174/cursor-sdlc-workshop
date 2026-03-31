# Step hint images (optional)

Add **PNG**, **JPG**, or **SVG** files here so an extra **Step hint** picture appears in the right **Instructions** panel (above the step dots). This is separate from the big canvas diagram.

## Paths the app tries (in order)

For each step, unless `hintImage` is set on that step in `lessons.js`, the app tries:

1. `/images/hints/<lessonId>/<stepIndex>.svg`
2. `/images/hints/<lessonId>/<stepIndex>.png`
3. `/images/hints/<lessonId>/<stepIndex>.jpg`
4. `/images/hints/<lessonId>/<stepIndex>.jpeg`

Example: first step of the cat lesson → `cat/0.svg` (this repo includes SVG copies for the cat lesson as a demo).

## Override in data

In `lessons.js`, any step can set:

```js
{ text: '…', hintImage: '/images/hints/my-photo.png' }
```

## Rights

Use only images you may ship. Log sources in `projects/melissagannes/docs/image-sources.md` when using references.
