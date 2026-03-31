/**
 * Workshop lessons: see strokeOrders.md for north-star stroke order per drawing.
 *
 * Each step: `{ text: string, hintImage?: string }` — optional `hintImage` is a
 * URL under `public/` (e.g. `/images/hints/simple-car/2.png`) for a reference picture.
 */

export const CATEGORIES = [
  { id: 'animals', label: 'Animals', emoji: '🐾' },
  { id: 'cars', label: 'Cars', emoji: '🚗' },
  { id: 'houses', label: 'Houses', emoji: '🏠' },
]

export const DEFAULT_LESSON_BY_CATEGORY = {
  animals: 'cat',
  cars: 'simple-car',
  houses: 'simple-house',
}

export const LESSONS = {
  cat: {
    id: 'cat',
    categoryId: 'animals',
    title: 'A friendly cat',
    keywords: [
      'cat',
      'kitty',
      'kitten',
      'pet',
      'animal',
      'meow',
      'paw',
    ],
    steps: [
      {
        text:
          'With a light pencil, draw a big circle for the head—about the size of a cookie on your page. Press softly so you can fix bumps.',
      },
      {
        text:
          'Trace the same circle a little darker so it is easy to see. This is the cat’s head.',
      },
      {
        text:
          'On top of the circle, add two pointy ears—each about half as tall as the head is wide, a little apart like letter A without the middle.',
      },
      {
        text:
          'Add two small ovals for eyes (leave space between them), a tiny triangle nose under them, and a little smile line under the nose.',
      },
      {
        text:
          'Under the head, draw a wide oval for the body—about as wide as the head, with a small gap so the neck can breathe.',
      },
      {
        text:
          'Add four short legs: two in front and two in back, like thick letter U’s touching the bottom of the body.',
      },
      {
        text:
          'Finish with a tail that curves up behind the body, and three short whisker lines on each cheek.',
      },
    ],
  },
  'simple-car': {
    id: 'simple-car',
    categoryId: 'cars',
    title: 'A simple car',
    keywords: [
      'car',
      'auto',
      'vehicle',
      'truck',
      'wheels',
      'drive',
      'road',
    ],
    steps: [
      {
        text:
          'Lightly sketch a long, low rectangle for the bottom of the car—like a loaf of bread. Keep the lines soft.',
      },
      {
        text:
          'Trace the bottom shape darker. On top, add a smaller rounded box for the cabin—the driver sits there. Keep the cabin a bit narrower than the body.',
      },
      {
        text:
          'Draw two same-size circles for wheels, one near the front and one near the back, sitting on the ground.',
      },
      {
        text:
          'In the cabin, draw two square-ish windows with a little space between them, like sunglasses.',
      },
      {
        text:
          'Add a straight line under the wheels for the road so the car looks parked.',
      },
      {
        text:
          'Put small circles on the front and back for lights, and a thin line under the bumper if you like.',
      },
    ],
  },
  'simple-house': {
    id: 'simple-house',
    categoryId: 'houses',
    title: 'A cozy house',
    keywords: [
      'house',
      'home',
      'building',
      'roof',
      'door',
      'window',
      'chimney',
    ],
    steps: [
      {
        text:
          'Lightly sketch a big square for the walls—make it as tall as it is wide, like a window frame.',
      },
      {
        text:
          'Trace the square a bit darker so the walls look neat and even.',
      },
      {
        text:
          'On top, draw a triangle roof as wide as the square—point aiming up to the sky.',
      },
      {
        text:
          'In the middle of the walls, draw a tall rectangle door. Add a tiny circle on one side for a doorknob.',
      },
      {
        text:
          'Add two square windows—one on each side of the door—and draw a small cross inside each for panes.',
      },
      {
        text:
          'Put a rectangle chimney on one side of the roof, and a path from the door to the bottom of the page.',
      },
    ],
  },
}

export function getLesson(lessonId) {
  return LESSONS[lessonId]
}

export function getAllLessons() {
  return Object.values(LESSONS)
}

export function searchLessons(query) {
  const q = query.trim().toLowerCase()
  const list = getAllLessons()
  if (!q) return list

  return list.filter((lesson) => {
    if (lesson.title.toLowerCase().includes(q)) return true
    if (
      lesson.keywords.some(
        (word) => word.includes(q) || q.includes(word) || word.startsWith(q),
      )
    ) {
      return true
    }
    return lesson.steps.some((st) => st.text.toLowerCase().includes(q))
  })
}
