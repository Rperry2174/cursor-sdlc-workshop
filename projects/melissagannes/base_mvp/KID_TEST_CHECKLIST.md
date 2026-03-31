# Kid test checklist (for a grown-up)

Use this after content or art changes. Goal: spot steps where a child **hesitates**, **asks “what next?”**, or **draws something unlike** the guide.

## Setup

- Paper and pencil (eraser helps for step 1 “light” lines).
- Run the app locally; sit side-by-side so the child reads the screen or you read it aloud.

## For each lesson (cat, car, house)

1. **First run — no hints**  
   Read the on-screen step aloud once. Wait until the child tries before tapping **Next**.

2. **Watch for stalls**  
   If they pause more than ~20 seconds on one step, note the **step number** and what confused them (words vs picture).

3. **Compare to the SVG**  
   Ask: “Does your drawing feel like the picture?” If not, decide whether to **split** that step, **simplify** the sentence, or **adjust** the diagram in `StepDiagram.jsx`.

4. **Second run — same day or later**  
   See if the same step is easier. Track changes in git so you can compare.

## After testing

- Update `src/data/lessons.js` step text if instructions were unclear.
- Tweak `src/components/StepDiagram.jsx` if shapes did not match the words.
- Re-run this checklist when you add a new lesson.

## Sign-off

| Lesson | Tested with (age) | Notes |
| --- | --- | --- |
| Cat | | |
| Car | | |
| House | | |
