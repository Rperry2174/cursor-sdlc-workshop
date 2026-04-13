import { MASTER_NAMES } from '../blockTypes.js'
import { pptxTheme, theme, toPptxColor } from '../theme.js'

export function defineDeckMasters(pptx) {
  pptx.theme = pptxTheme
  pptx.layout = 'LAYOUT_WIDE'

  const footerBand = {
    rect: {
      x: 0,
      y: 7.1,
      w: '100%',
      h: 0.25,
      fill: { color: toPptxColor(theme.colors.codeBg) },
      line: { color: toPptxColor(theme.colors.codeBg) },
    },
  }

  const footerText = {
    text: {
      text: 'Cursor SDLC Workshop',
      options: {
        x: 0.6,
        y: 7.06,
        w: 3.2,
        h: 0.18,
        fontFace: theme.fonts.body,
        fontSize: 8,
        color: toPptxColor(theme.colors.textSecondary),
        margin: 0,
      },
    },
  }

  pptx.defineSlideMaster({
    title: MASTER_NAMES.TITLE_SLIDE,
    background: { color: toPptxColor(theme.colors.darkBg) },
    margin: [0.4, 0.55, 0.35, 0.55],
    objects: [
      footerBand,
      footerText,
    ],
  })

  pptx.defineSlideMaster({
    title: MASTER_NAMES.PHASE_SLIDE,
    background: { color: toPptxColor(theme.colors.darkBg) },
    margin: [0.4, 0.55, 0.35, 0.55],
    objects: [
      footerBand,
      footerText,
      {
        rect: {
          x: 0.55,
          y: 0.38,
          w: 12.2,
          h: 0.02,
          fill: { color: toPptxColor(theme.colors.textSecondary), transparency: 55 },
          line: { color: toPptxColor(theme.colors.textSecondary), transparency: 100 },
        },
      },
    ],
  })

  pptx.defineSlideMaster({
    title: MASTER_NAMES.SECTION_INTRO,
    background: { color: toPptxColor(theme.colors.darkBg) },
    margin: [0.4, 0.55, 0.35, 0.55],
    objects: [
      footerBand,
      footerText,
      {
        rect: {
          x: 0.55,
          y: 0.38,
          w: 12.2,
          h: 0.02,
          fill: { color: toPptxColor(theme.colors.textSecondary), transparency: 55 },
          line: { color: toPptxColor(theme.colors.textSecondary), transparency: 100 },
        },
      },
    ],
  })

  pptx.defineSlideMaster({
    title: MASTER_NAMES.CONTENT_SLIDE,
    background: { color: toPptxColor(theme.colors.darkBg) },
    margin: [0.4, 0.55, 0.35, 0.55],
    objects: [
      footerBand,
      footerText,
    ],
  })

  pptx.defineSlideMaster({
    title: MASTER_NAMES.IMAGE_SLIDE,
    background: { color: toPptxColor(theme.colors.darkBg) },
    margin: [0.35, 0.45, 0.3, 0.45],
    objects: [
      footerBand,
      footerText,
    ],
  })
}
