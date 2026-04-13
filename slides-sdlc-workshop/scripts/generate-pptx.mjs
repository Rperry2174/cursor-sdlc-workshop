import { mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import PptxGenJS from 'pptxgenjs'

import { buildDeckPresentation } from '../src/slide-system/renderers/pptx.js'
import { deckSlides } from '../src/slide-system/slides.js'

const outputDir = fileURLToPath(new URL('../outputs/', import.meta.url))
const fileName = fileURLToPath(new URL('../outputs/slides-sdlc-workshop.pptx', import.meta.url))

mkdirSync(outputDir, { recursive: true })

const pres = buildDeckPresentation(PptxGenJS, deckSlides)

console.log(`Rendering ${deckSlides.length} native slides to ${fileName}`)
await pres.writeFile({ fileName })
console.log(`Created ${fileName}`)
