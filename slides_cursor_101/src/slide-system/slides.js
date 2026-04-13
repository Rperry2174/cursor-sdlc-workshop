import { cursor101Slides } from './data/cursor101Slides.js'

export const allSlides = [...cursor101Slides].sort((a, b) => a.id - b.id)

export const deckSlides = allSlides.filter((slide) => slide.includeInDeck !== false)

export const slideMap = new Map(allSlides.map((slide) => [slide.slug, slide]))
