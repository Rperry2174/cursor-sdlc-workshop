import { introSlides } from './data/introSlides.js'
import { phaseSlides } from './data/phaseSlides.js'
import { projectSlides } from './data/projectSlides.js'

export const allSlides = [...introSlides, ...phaseSlides, ...projectSlides].sort(
  (left, right) => left.id - right.id,
)

export const deckSlides = allSlides.filter((slide) => slide.includeInDeck !== false)

export const slideMap = new Map(allSlides.map((slide) => [slide.slug, slide]))
