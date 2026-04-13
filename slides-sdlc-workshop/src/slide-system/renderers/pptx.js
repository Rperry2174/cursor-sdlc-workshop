import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { getAsset } from '../assets.js'
import { SLIDE_TYPES } from '../blockTypes.js'
import {
  getAnalogyTimelineRowFrame,
  getAnalogyTimelineStepFrame,
  getAnalogyTimelineTestingArrow,
  LAYOUT,
  PAGE,
  getSectionBadgeWidth,
  getSdlcBoxWidth,
  getSdlcPhaseFrame,
  getTileGridFrames,
  getWorkflowEvolutionColumnFrame,
  getWorkflowCompareStepFrame,
} from '../layout.js'
import { deckSlides } from '../slides.js'
import { defineDeckMasters } from './masters.js'
import { scalePptFontSize, theme, toneColor, toPptxColor } from '../theme.js'

function assetPath(assetKey) {
  const asset = getAsset(assetKey)
  if (!asset?.fileUrl) return null

  const resolvedPath = fileURLToPath(asset.fileUrl)
  return existsSync(resolvedPath) ? resolvedPath : null
}

function baseTextOptions(options = {}) {
  const scaledOptions = { ...options }
  if (typeof scaledOptions.fontSize === 'number') {
    scaledOptions.fontSize = scalePptFontSize(scaledOptions.fontSize)
  }

  return {
    fontFace: theme.fonts.body,
    fontSize: scalePptFontSize(theme.sizes.body),
    color: toPptxColor(theme.colors.textPrimary),
    margin: 0,
    fit: 'shrink',
    breakLine: false,
    ...scaledOptions,
  }
}

function addText(slide, text, options = {}) {
  slide.addText(text, baseTextOptions(options))
}

function addRichText(slide, runs, options = {}) {
  slide.addText(
    runs.map((run) => ({
      text: run.text,
      options: baseTextOptions(run.options ?? {}),
    })),
    baseTextOptions(options),
  )
}

function addCard(slide, pptx, x, y, w, h, options = {}) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w,
    h,
    rectRadius: 0.08,
    fill: {
      color: toPptxColor(options.fillColor ?? theme.colors.cardBg),
      transparency: options.fillTransparency ?? 0,
    },
    line: {
      color: toPptxColor(options.lineColor ?? theme.colors.textSecondary),
      transparency: options.lineTransparency ?? 68,
      width: options.lineWidth ?? 1,
    },
  })
}

function addCircle(slide, pptx, x, y, size, fillColor, text, textOptions = {}) {
  slide.addShape(pptx.ShapeType.ellipse, {
    x,
    y,
    w: size,
    h: size,
    fill: { color: toPptxColor(fillColor) },
    line: { color: toPptxColor(fillColor), transparency: 100 },
  })
  addText(slide, text, {
    x,
    y: y + 0.02,
    w: size,
    h: size - 0.02,
    fontSize: 10,
    bold: true,
    align: 'center',
    color: toPptxColor(theme.colors.white),
    ...textOptions,
  })
}

function addSectionHeader(slide, pptx, slideData) {
  if (!slideData.section) return

  const tone = slideData.section.tone
  const accent = toneColor(
    tone === 'section1'
      ? 'plan'
      : tone === 'section2'
        ? 'test'
        : tone === 'section3'
          ? 'design'
          : tone === 'prework'
            ? 'monitor'
            : 'develop',
  )
  const badgeW = getSectionBadgeWidth(tone)

  slide.addShape(pptx.ShapeType.roundRect, {
    x: LAYOUT.sectionHeader.x,
    y: LAYOUT.sectionHeader.y,
    w: badgeW,
    h: LAYOUT.sectionHeader.h,
    rectRadius: 0.14,
    fill: {
      color: toPptxColor(accent),
      transparency: tone === 'prework' ? 65 : 0,
    },
    line: { color: toPptxColor(accent), transparency: 100 },
  })
  addText(slide, slideData.section.badge, {
    x: LAYOUT.sectionHeader.x + LAYOUT.sectionHeader.badgeTextInsetX,
    y: LAYOUT.sectionHeader.badgeTextY,
    w: badgeW - LAYOUT.sectionHeader.badgeTextInsetX * 2,
    h: LAYOUT.sectionHeader.badgeTextH,
    fontSize: 8,
    bold: true,
    color:
      tone === 'prework'
        ? toPptxColor(theme.colors.textPrimary)
        : toPptxColor(theme.colors.white),
    align: 'center',
  })

  if (slideData.phaseBadge) {
    addText(slide, slideData.phaseBadge, {
      x: LAYOUT.sectionHeader.x + badgeW + 0.18,
      y: LAYOUT.sectionHeader.phaseBadgeY,
      w: LAYOUT.sectionHeader.phaseBadgeW,
      h: LAYOUT.sectionHeader.phaseBadgeH,
      fontSize: 8,
      color: toPptxColor(theme.colors.textSecondary),
    })
  }
}

function addPhaseHeader(slide, pptx, slideData, options = {}) {
  if (!slideData.phase) return

  const accent = toneColor(slideData.phase.tone)
  const titleY = options.titleY ?? LAYOUT.phaseHeader.titleY

  addCircle(
    slide,
    pptx,
    LAYOUT.phaseHeader.circle.x,
    titleY - 0.06,
    LAYOUT.phaseHeader.circle.size,
    accent,
    slideData.phase.number,
    {
    fontSize: 9,
    },
  )
  addText(slide, slideData.title, {
    x: PAGE.x + LAYOUT.phaseHeader.titleOffsetX,
    y: titleY,
    w: PAGE.w - LAYOUT.phaseHeader.titleOffsetX,
    h: 0.28,
    fontFace: theme.fonts.heading,
    fontSize: 20,
    bold: true,
  })

  if (slideData.subtitle) {
    addText(slide, slideData.subtitle, {
      x: PAGE.x + LAYOUT.phaseHeader.titleOffsetX,
      y: titleY + LAYOUT.phaseHeader.subtitleOffsetY,
      w: PAGE.w - LAYOUT.phaseHeader.titleOffsetX,
      h: 0.2,
      fontSize: 10.5,
      color: toPptxColor(theme.colors.textSecondary),
    })
  }
}

function addHeroCallout(slide, pptx, hero, y, tone = 'develop') {
  const accent = toneColor(tone)
  addCard(slide, pptx, LAYOUT.heroCallout.x, y, LAYOUT.heroCallout.w, LAYOUT.heroCallout.h, {
    fillColor: accent,
    fillTransparency: 86,
    lineColor: accent,
    lineTransparency: 58,
  })
  addRichText(
    slide,
    [
      { text: hero.lead },
      {
        text: hero.highlight,
        options: {
          bold: true,
          color: toPptxColor(accent),
        },
      },
      { text: hero.tail },
    ],
    {
      x: LAYOUT.heroCallout.textX,
      y: y + LAYOUT.heroCallout.textOffsetY,
      w: LAYOUT.heroCallout.textW,
      h: LAYOUT.heroCallout.textH,
      fontSize: 14,
      align: 'center',
    },
  )
}

function addTileGrid(slide, pptx, tiles, options = {}) {
  const columns = options.columns ?? 3
  const x = options.x ?? PAGE.x
  const y = options.y ?? 1.95
  const gap = options.gap ?? 0.25
  const totalW = options.w ?? PAGE.w
  const tileW = (totalW - gap * (columns - 1)) / columns
  const tileH = options.h ?? 2.0

  tiles.forEach((tile, index) => {
    const column = index % columns
    const row = Math.floor(index / columns)
    const tileX = x + column * (tileW + gap)
    const tileY = y + row * (tileH + gap)
    const accent =
      tile.tone === 'section1'
        ? toneColor('plan')
        : tile.tone === 'section2'
          ? toneColor('test')
          : tile.tone === 'section3'
            ? toneColor('design')
            : tile.tone
              ? toneColor(tile.tone)
              : toneColor('develop')

    addCard(slide, pptx, tileX, tileY, tileW, tileH, {
      fillColor: theme.colors.cardBg,
      lineColor: theme.colors.textSecondary,
      lineTransparency: 72,
    })

    if (tile.number) {
      addText(slide, tile.number, {
        x: tileX + 0.15,
        y: tileY + 0.08,
        w: 0.45,
        h: 0.22,
        fontSize: 18,
        bold: true,
        color: toPptxColor(accent),
      })
    }

    if (tile.icon) {
      addText(slide, tile.icon, {
        x: tileX + 0.15,
        y: tileY + 0.06,
        w: 0.35,
        h: 0.24,
        fontSize: 18,
      })
    }

    if (tile.label) {
      addText(slide, tile.label, {
        x: tileX + 0.15,
        y: tileY + 0.15,
        w: tileW - 0.3,
        h: 0.14,
        fontSize: 8.5,
        bold: true,
        color: toPptxColor(accent),
      })
    }

    if (tile.titleHighlight && !tile.title) {
      addText(slide, tile.titleHighlight, {
        x: tileX + 0.15,
        y: tileY + (tile.label ? 0.42 : tile.number || tile.icon ? 0.42 : 0.2),
        w: tileW - 0.3,
        h: 0.3,
        fontSize: 12.5,
        bold: true,
        color: toPptxColor(accent),
      })
    } else if (tile.title || tile.titleHighlight) {
      addText(slide, tile.title ?? `${tile.titleHighlight ?? ''}`, {
        x: tileX + 0.15,
        y: tileY + (tile.label ? 0.42 : tile.number || tile.icon ? 0.42 : 0.2),
        w: tileW - 0.3,
        h: 0.3,
        fontSize: 12.5,
        bold: true,
      })
      if (tile.titleHighlight && tile.title) {
        addText(slide, tile.titleHighlight, {
          x: tileX + 0.15,
          y: tileY + 0.62,
          w: tileW - 0.3,
          h: 0.24,
          fontSize: 10.5,
          bold: true,
          color: toPptxColor(accent),
        })
      }
      if (tile.titleTail) {
        addText(slide, tile.titleTail, {
          x: tileX + 0.15,
          y: tileY + 0.82,
          w: tileW - 0.3,
          h: 0.18,
          fontSize: 9,
        })
      }
    }

    if (tile.description) {
      addText(slide, tile.description, {
        x: tileX + 0.15,
        y: tileY + 0.72,
        w: tileW - 0.3,
        h: tileH - 0.85,
        fontSize: 9.4,
        color: toPptxColor(theme.colors.textSecondary),
      })
    }

    if (tile.bullets?.length) {
      addText(slide, tile.bullets.map((item) => `• ${item}`).join('\n'), {
        x: tileX + 0.18,
        y: tileY + 0.78,
        w: tileW - 0.36,
        h: tileH - 0.9,
        fontSize: 9.1,
        color: toPptxColor(theme.colors.textSecondary),
      })
    }
  })
}

function addEmphasisBox(slide, pptx, emphasis, y, h = 0.48) {
  if (!emphasis) return

  const tone =
    emphasis.tone === 'orange'
      ? 'test'
      : emphasis.tone === 'purple'
        ? 'design'
        : emphasis.tone === 'green'
          ? 'plan'
          : 'develop'
  const accent = toneColor(tone)

  addCard(slide, pptx, PAGE.x, y, PAGE.w, h, {
    fillColor: accent,
    fillTransparency: 90,
    lineColor: accent,
    lineTransparency: 65,
  })
  addText(slide, `${emphasis.label ?? ''}${emphasis.label ? ' ' : ''}${emphasis.body}`, {
    x: PAGE.x + 0.18,
    y: y + 0.1,
    w: PAGE.w - 0.36,
    h: h - 0.12,
    fontSize: 10.2,
  })
}

function addImageOrPlaceholder(slide, pptx, assetKey, x, y, w, h, options = {}) {
  const imagePath = assetPath(assetKey)
  if (imagePath) {
    slide.addImage({
      path: imagePath,
      x,
      y,
      w,
      h,
      sizing: {
        type: options.fit === 'cover' ? 'cover' : 'contain',
        x,
        y,
        w,
        h,
      },
    })
    return
  }

  addCard(slide, pptx, x, y, w, h, {
    fillColor: theme.colors.cardBg,
    lineColor: theme.colors.textSecondary,
    lineTransparency: 55,
  })
  addText(slide, options.placeholderText ?? `Missing asset: ${assetKey}`, {
    x: x + 0.2,
    y: y + h / 2 - 0.1,
    w: w - 0.4,
    h: 0.2,
    fontSize: 10,
    align: 'center',
    color: toPptxColor(theme.colors.textSecondary),
  })
}

function addToolPills(slide, pptx, items, x, y, w, tone, options = {}) {
  if (!items?.length) return

  const accent = toneColor(tone ?? 'develop')
  const gap = options.gap ?? 0.12
  const pillScale = Math.min(theme.scales?.pptText ?? 1, 1.14)
  let cursorX = x
  let cursorY = y
  const rowH = (options.rowH ?? 0.26) * pillScale

  items.forEach((item) => {
    const pillW = Math.max(0.58, Math.min(2.05, item.length * 0.07 * pillScale + 0.35))
    if (cursorX + pillW > x + w) {
      cursorX = x
      cursorY += rowH + 0.08
    }

    slide.addShape(pptx.ShapeType.roundRect, {
      x: cursorX,
      y: cursorY,
      w: pillW,
      h: rowH,
      rectRadius: 0.1,
      fill: { color: toPptxColor(accent), transparency: 86 },
      line: { color: toPptxColor(accent), transparency: 58, width: 1 },
    })
    addText(slide, item, {
      x: cursorX + 0.06,
      y: cursorY + 0.055 * pillScale,
      w: pillW - 0.12,
      h: 0.12 * pillScale,
      fontSize: 7,
      color: toPptxColor(accent),
      bold: true,
      align: 'center',
    })
    cursorX += pillW + gap
  })
}

function addAnalogyTimelineTestingArrow(slide, pptx, rowIndex, lastStepIndex) {
  const accent = toneColor('test')
  const arrow = getAnalogyTimelineTestingArrow(rowIndex, {
    sourceStepIndex: lastStepIndex,
  })
  const lineWidth = 1.6
  const epsilon = 0.001

  slide.addShape(pptx.ShapeType.line, {
    x: arrow.startX,
    y: arrow.elbowY,
    w: epsilon,
    h: arrow.startY - arrow.elbowY,
    line: { color: toPptxColor(accent), width: lineWidth },
  })
  slide.addShape(pptx.ShapeType.line, {
    x: arrow.targetX,
    y: arrow.elbowY,
    w: arrow.startX - arrow.targetX,
    h: epsilon,
    line: { color: toPptxColor(accent), width: lineWidth },
  })
  slide.addShape(pptx.ShapeType.line, {
    x: arrow.targetX,
    y: arrow.elbowY,
    w: epsilon,
    h: arrow.targetY - arrow.elbowY,
    line: { color: toPptxColor(accent), width: lineWidth },
  })
  addText(slide, '↓', {
    x: arrow.targetX - 0.08,
    y: arrow.targetY - 0.02,
    w: 0.16,
    h: 0.18,
    fontSize: 12,
    bold: true,
    align: 'center',
    color: toPptxColor(accent),
  })
}

function addChecklistGroups(slide, pptx, slideData) {
  let cursorY = 1.25

  slideData.checklistGroups.forEach((group) => {
    const accent =
      group.tone === 'git'
        ? toneColor('develop')
        : group.sectionTone === 'section2'
          ? toneColor('test')
          : group.sectionTone === 'section3'
            ? toneColor('design')
            : toneColor('plan')
    const groupH = group.items.reduce((total, item) => total + (item.codeLines?.length ? 0.78 : 0.42), 0) + 0.24

    if (group.label) {
      addText(slide, group.label, {
        x: PAGE.x,
        y: cursorY,
        w: 2.2,
        h: 0.14,
        fontSize: 7,
        bold: true,
        color: toPptxColor(accent),
      })
      cursorY += 0.18
    }

    addCard(slide, pptx, PAGE.x, cursorY, PAGE.w, groupH, {
      fillColor: group.tone === 'plain' ? theme.colors.darkBg : theme.colors.cardBg,
      fillTransparency: group.tone === 'plain' ? 100 : 0,
      lineColor: accent,
      lineTransparency: 78,
    })

    let itemY = cursorY + 0.12
    group.items.forEach((item) => {
      addCircle(slide, pptx, PAGE.x + 0.12, itemY + 0.02, 0.14, accent, '', { fontSize: 1 })
      slide.addShape(pptx.ShapeType.rect, {
        x: PAGE.x + 0.13,
        y: itemY + 0.03,
        w: 0.12,
        h: 0.12,
        fill: { color: toPptxColor(theme.colors.darkBg) },
        line: { color: toPptxColor(accent), width: 1 },
      })

      addText(slide, item.title, {
        x: PAGE.x + 0.34,
        y: itemY,
        w: 4.1,
        h: 0.18,
        fontSize: 8.8,
        bold: true,
      })
      if (item.detail || item.body) {
        addText(slide, item.detail ?? item.body, {
          x: PAGE.x + 2.95,
          y: itemY,
          w: 8.9,
          h: 0.18,
          fontSize: 8.2,
          color: toPptxColor(theme.colors.textSecondary),
        })
      }

      if (item.codeLines?.length) {
        addCard(slide, pptx, PAGE.x + 0.34, itemY + 0.22, 11.35, 0.42, {
          fillColor: theme.colors.codeBg,
          lineColor: theme.colors.textSecondary,
          lineTransparency: 72,
        })
        addText(slide, `${item.codeComment ? `${item.codeComment}\n` : ''}${item.codeLines.join('\n')}`, {
          x: PAGE.x + 0.46,
          y: itemY + 0.28,
          w: 11.1,
          h: 0.28,
          fontFace: theme.fonts.mono,
          fontSize: 7.2,
          color: toPptxColor('#586e75'),
        })
        itemY += 0.78
      } else {
        itemY += 0.42
      }
    })

    cursorY += groupH + 0.18
  })
}

function renderTitleSlide(slide, pptx, presSlide) {
  addText(presSlide, slide.badge, {
    x: LAYOUT.titleHero.badge.x,
    y: LAYOUT.titleHero.badge.y,
    w: LAYOUT.titleHero.badge.w,
    h: LAYOUT.titleHero.badge.h,
    fontSize: 8,
    bold: true,
    align: 'center',
    color: toPptxColor(theme.colors.white),
    fill: { color: '667EEA' },
    margin: 0.04,
    shape: pptx.ShapeType.roundRect,
  })
  addRichText(
    presSlide,
    [
      { text: slide.titleParts[0], options: { color: '00B894', bold: true, fontSize: 30 } },
      { text: '  &  ', options: { color: toPptxColor(theme.colors.textSecondary), fontSize: 22 } },
      { text: slide.titleParts[2], options: { color: '764BA2', bold: true, fontSize: 30 } },
    ],
    {
      x: LAYOUT.titleHero.title.x,
      y: LAYOUT.titleHero.title.y,
      w: LAYOUT.titleHero.title.w,
      h: LAYOUT.titleHero.title.h,
      align: 'center',
    },
  )
  addText(presSlide, slide.tagline, {
    x: LAYOUT.titleHero.tagline.x,
    y: LAYOUT.titleHero.tagline.y,
    w: LAYOUT.titleHero.tagline.w,
    h: LAYOUT.titleHero.tagline.h,
    fontSize: 13,
    align: 'center',
    color: toPptxColor(theme.colors.textSecondary),
  })

  const pillW = LAYOUT.titleHero.pillW
  slide.pills.forEach((pill, index) => {
    const x = 2.2 + index * (pillW + LAYOUT.titleHero.pillGap)
    addCard(presSlide, pptx, x, LAYOUT.titleHero.pillY, pillW, LAYOUT.titleHero.pillH, {
      fillColor: theme.colors.white,
      lineColor: theme.colors.textSecondary,
      lineTransparency: 82,
    })
    addText(presSlide, `${pill.icon} ${pill.text}`, {
      x: x + 0.15,
      y: LAYOUT.titleHero.pillY + 0.14,
      w: pillW - 0.3,
      h: 0.18,
      fontSize: 9,
      align: 'center',
    })
  })
}

function renderClosingSlide(slide, _pptx, presSlide) {
  addText(presSlide, slide.title, {
    x: 1.5,
    y: 2.6,
    w: 10.3,
    h: 1,
    fontFace: theme.fonts.heading,
    fontSize: 34,
    bold: true,
    align: 'center',
    color: toPptxColor(theme.colors.cursorBlue),
  })
}

function renderTakeawaySlide(slide, pptx, presSlide) {
  if (slide.section) {
    addSectionHeader(presSlide, pptx, slide)
  }
  addText(presSlide, slide.title, {
    x: LAYOUT.takeaway.title.x,
    y: LAYOUT.takeaway.title.y,
    w: LAYOUT.takeaway.title.w,
    h: LAYOUT.takeaway.title.h,
    fontFace: theme.fonts.heading,
    fontSize: 22,
    bold: true,
  })
  addHeroCallout(
    presSlide,
    pptx,
    slide.hero,
    LAYOUT.takeaway.heroY,
    slide.section?.tone === 'section2'
      ? 'test'
      : slide.section?.tone === 'section3'
        ? 'design'
        : 'develop',
  )
  const tileFrames = getTileGridFrames(slide.tiles.length, {
    y: LAYOUT.takeaway.tiles.y,
    h: slide.discovery ? LAYOUT.takeaway.tiles.hWithDiscovery : LAYOUT.takeaway.tiles.h,
  })

  slide.tiles.forEach((tile, index) => {
    const frame = tileFrames[index]
    addTileGrid(presSlide, pptx, [tile], {
      columns: 1,
      x: frame.x,
      y: frame.y,
      w: frame.w,
      h: frame.h,
      gap: 0,
    })
  })

  if (slide.discovery) {
    addCard(
      presSlide,
      pptx,
      LAYOUT.takeaway.discovery.frame.x,
      LAYOUT.takeaway.discovery.frame.y,
      LAYOUT.takeaway.discovery.frame.w,
      LAYOUT.takeaway.discovery.frame.h,
      {
      fillColor: theme.colors.cardBg,
      lineColor: theme.colors.textSecondary,
      lineTransparency: 75,
      },
    )
    addText(presSlide, slide.discovery.label, {
      x: LAYOUT.takeaway.discovery.label.x,
      y: LAYOUT.takeaway.discovery.label.y,
      w: LAYOUT.takeaway.discovery.label.w,
      h: LAYOUT.takeaway.discovery.label.h,
      fontSize: 8.8,
      bold: true,
    })

    const groupW =
      (PAGE.w -
        LAYOUT.takeaway.discovery.padX * 2 -
        LAYOUT.takeaway.discovery.gap * (slide.discovery.groups.length - 1)) /
      slide.discovery.groups.length
    slide.discovery.groups.forEach((group, index) => {
      const x =
        PAGE.x +
        LAYOUT.takeaway.discovery.padX +
        index * (groupW + LAYOUT.takeaway.discovery.gap)
      addText(presSlide, group.label, {
        x,
        y: LAYOUT.takeaway.discovery.groupsY,
        w: groupW,
        h: 0.14,
        fontSize: 7,
        bold: true,
        color: toPptxColor(theme.colors.textSecondary),
      })
      addToolPills(
        presSlide,
        pptx,
        group.items,
        x,
        LAYOUT.takeaway.discovery.pillsY,
        groupW,
        'develop',
      )
    })
  }

  addEmphasisBox(
    presSlide,
    pptx,
    slide.emphasis,
    slide.discovery ? LAYOUT.takeaway.emphasis.yWithDiscovery : LAYOUT.takeaway.emphasis.y,
    slide.discovery ? LAYOUT.takeaway.emphasis.hWithDiscovery : LAYOUT.takeaway.emphasis.h,
  )
}

function renderAgendaSlide(slide, pptx, presSlide) {
  addText(presSlide, slide.title, {
    x: PAGE.x,
    y: 0.7,
    w: PAGE.w,
    h: 0.28,
    fontFace: theme.fonts.heading,
    fontSize: 22,
    bold: true,
  })

  slide.timelineItems.forEach((item, index) => {
    const y = 1.25 + index * 1.1
    const fillColor =
      item.numberVariant === 'green'
        ? toneColor('plan')
        : item.numberVariant === 'orange'
          ? toneColor('test')
          : item.numberVariant === 'purple'
            ? toneColor('design')
            : theme.colors.codeBg
    addCard(presSlide, pptx, PAGE.x, y, PAGE.w, 0.78, {
      fillColor: theme.colors.cardBg,
      lineColor: theme.colors.textSecondary,
      lineTransparency: 78,
    })
    addCircle(presSlide, pptx, PAGE.x + 0.18, y + 0.14, 0.42, fillColor, item.number, {
      color:
        item.numberVariant === 'gray'
          ? toPptxColor(theme.colors.textPrimary)
          : toPptxColor(theme.colors.white),
    })
    addText(presSlide, item.title, {
      x: PAGE.x + 0.8,
      y: y + 0.14,
      w: 4.4,
      h: 0.18,
      fontSize: 12,
      bold: true,
    })
    addText(presSlide, item.description, {
      x: PAGE.x + 0.8,
      y: y + 0.38,
      w: 7.5,
      h: 0.15,
      fontSize: 8.5,
      color: toPptxColor(theme.colors.textSecondary),
    })
    addText(presSlide, item.duration, {
      x: 10.95,
      y: y + 0.28,
      w: 1.1,
      h: 0.16,
      fontSize: 9,
      color: toPptxColor(theme.colors.cursorBlue),
      bold: true,
      align: 'right',
    })
  })
}

function renderSdlcSlide(slide, pptx, presSlide) {
  addText(presSlide, slide.title, {
    x: LAYOUT.sdlc.title.x,
    y: LAYOUT.sdlc.title.y,
    w: LAYOUT.sdlc.title.w,
    h: LAYOUT.sdlc.title.h,
    fontFace: theme.fonts.heading,
    fontSize: 22,
    bold: true,
    align: 'center',
  })

  const highlight = slide.highlight
  const boxW = getSdlcBoxWidth()

  slide.sdlcPhases.forEach((phase, index) => {
    const frame = getSdlcPhaseFrame(index)
    const x = frame.x
    const isActive = highlight === phase.name
    const dimmed = highlight && highlight !== phase.name && highlight !== 'Monitor'
    addCard(presSlide, pptx, x, frame.y, boxW, frame.h, {
      fillColor: theme.colors.cardBg,
      lineColor: isActive ? toneColor(phase.tone) : theme.colors.textSecondary,
      lineTransparency: isActive ? 10 : 80,
      lineWidth: isActive ? 1.5 : 1,
      fillTransparency: dimmed ? 22 : 0,
    })
    addText(presSlide, phase.num, {
      x: x + 0.1,
      y: frame.y + 0.13,
      w: boxW - 0.2,
      h: 0.16,
      fontSize: 7,
      bold: true,
      color: isActive ? toPptxColor(toneColor(phase.tone)) : toPptxColor(theme.colors.textSecondary),
      align: 'center',
    })
    addText(presSlide, phase.name, {
      x: x + 0.08,
      y: frame.y + 0.39,
      w: boxW - 0.16,
      h: 0.2,
      fontSize: 9.5,
      bold: true,
      color: isActive ? toPptxColor(toneColor(phase.tone)) : toPptxColor(theme.colors.cursorBlue),
      align: 'center',
    })
    if (phase.subcategories) {
      let currentY = frame.y + 0.74
      phase.subcategories.forEach((subcategory) => {
        addText(presSlide, subcategory.label, {
          x: x + 0.08,
          y: currentY,
          w: boxW - 0.16,
          h: 0.14,
          fontSize: 6.5,
          bold: true,
          color: toPptxColor(theme.colors.textSecondary),
          align: 'center',
        })
        addToolPills(presSlide, pptx, subcategory.tools, x + 0.06, currentY + 0.18, boxW - 0.12, phase.tone, {
          rowH: 0.22,
        })
        currentY += 0.58
      })
    } else {
      addToolPills(presSlide, pptx, phase.tools, x + 0.06, frame.y + 0.82, boxW - 0.12, phase.tone, {
        rowH: 0.22,
      })
    }

    if (index < slide.sdlcPhases.length - 1) {
      addText(presSlide, '→', {
        x: x + boxW + 0.02,
        y: LAYOUT.sdlc.arrowY,
        w: 0.1,
        h: 0.18,
        fontSize: 14,
        align: 'center',
        color: toPptxColor(theme.colors.textSecondary),
      })
    }
  })

  addCard(
    presSlide,
    pptx,
    LAYOUT.sdlc.monitor.x,
    LAYOUT.sdlc.monitor.y,
    LAYOUT.sdlc.monitor.w,
    LAYOUT.sdlc.monitor.h,
    {
    fillColor: theme.colors.cardBg,
    lineColor: highlight === 'Monitor' ? toneColor('monitor') : theme.colors.textSecondary,
    lineTransparency: highlight === 'Monitor' ? 5 : 68,
    },
  )
  addText(presSlide, slide.monitorPhase.num, {
    x: LAYOUT.sdlc.monitor.x + 0.1,
    y: LAYOUT.sdlc.monitor.y + 0.11,
    w: LAYOUT.sdlc.monitor.w - 0.2,
    h: 0.14,
    fontSize: 7,
    bold: true,
    align: 'center',
    color:
      highlight === 'Monitor'
        ? toPptxColor(toneColor('monitor'))
        : toPptxColor(theme.colors.textSecondary),
  })
  addText(presSlide, slide.monitorPhase.name, {
    x: LAYOUT.sdlc.monitor.x + 0.1,
    y: LAYOUT.sdlc.monitor.y + 0.29,
    w: LAYOUT.sdlc.monitor.w - 0.2,
    h: 0.18,
    fontSize: 9.5,
    bold: true,
    align: 'center',
    color:
      highlight === 'Monitor'
        ? toPptxColor(toneColor('monitor'))
        : toPptxColor(theme.colors.cursorBlue),
  })
  addToolPills(
    presSlide,
    pptx,
    slide.monitorPhase.tools,
    LAYOUT.sdlc.monitor.x + 0.15,
    LAYOUT.sdlc.monitor.y + 0.55,
    LAYOUT.sdlc.monitor.w - 0.3,
    'monitor',
    {
    rowH: 0.21,
    },
  )

  const footer = slide.footerCallout
    ? slide.footerCallout
    : slide.footerText
      ? `${slide.footerText} ${slide.highlight}`
      : null

  if (footer) {
    addText(presSlide, footer, {
      x: LAYOUT.sdlc.footer.x,
      y: LAYOUT.sdlc.footer.y,
      w: LAYOUT.sdlc.footer.w,
      h: LAYOUT.sdlc.footer.h,
      fontSize: 9,
      align: 'center',
      color: toPptxColor(theme.colors.textSecondary),
    })
  }
}

function renderPhaseDeepDive(slide, pptx, presSlide) {
  addPhaseHeader(presSlide, pptx, slide)
  const accent = toneColor(slide.phase.tone)

  if (slide.headerPill) {
    addCard(
      presSlide,
      pptx,
      LAYOUT.phaseDeepDive.headerPill.x,
      LAYOUT.phaseDeepDive.headerPill.y,
      LAYOUT.phaseDeepDive.headerPill.w,
      LAYOUT.phaseDeepDive.headerPill.h,
      {
      fillColor: accent,
      fillTransparency: 88,
      lineColor: accent,
      lineTransparency: 55,
      },
    )
    addText(presSlide, `${slide.headerPill.icon} ${slide.headerPill.text}`, {
      x: LAYOUT.phaseDeepDive.headerPill.x + 0.12,
      y: LAYOUT.phaseDeepDive.headerPill.y + 0.11,
      w: LAYOUT.phaseDeepDive.headerPill.w - 0.24,
      h: 0.18,
      fontSize: 8.8,
      bold: true,
      align: 'center',
      color: toPptxColor(accent),
    })
  }

  addText(presSlide, 'Discovery Questions', {
    x: LAYOUT.phaseDeepDive.discoveryTitle.x,
    y: LAYOUT.phaseDeepDive.discoveryTitle.y,
    w: LAYOUT.phaseDeepDive.discoveryTitle.w,
    h: LAYOUT.phaseDeepDive.discoveryTitle.h,
    fontSize: 13,
    bold: true,
    color: toPptxColor(accent),
  })
  let leftY = LAYOUT.phaseDeepDive.discovery.y
  slide.discoveryQuestions.forEach((question, index) => {
    addCard(
      presSlide,
      pptx,
      LAYOUT.phaseDeepDive.discovery.x,
      leftY,
      LAYOUT.phaseDeepDive.discovery.w,
      LAYOUT.phaseDeepDive.discovery.h,
      {
      fillColor: theme.colors.cardBg,
      lineColor: accent,
      lineTransparency: 72,
      },
    )
    addCircle(
      presSlide,
      pptx,
      LAYOUT.phaseDeepDive.discovery.x + 0.1,
      leftY + 0.14,
      0.26,
      accent,
      String(index + 1),
      {
      fontSize: 8.8,
      },
    )
    addText(presSlide, question, {
      x: LAYOUT.phaseDeepDive.discovery.x + 0.44,
      y: leftY + 0.11,
      w: LAYOUT.phaseDeepDive.discovery.w - 0.6,
      h: LAYOUT.phaseDeepDive.discovery.h - 0.14,
      fontSize: 10.2,
    })
    leftY += LAYOUT.phaseDeepDive.discovery.gap
  })

  addText(presSlide, '→', {
    x: LAYOUT.phaseDeepDive.connectorArrow.x,
    y: LAYOUT.phaseDeepDive.connectorArrow.y,
    w: LAYOUT.phaseDeepDive.connectorArrow.w,
    h: LAYOUT.phaseDeepDive.connectorArrow.h,
    fontSize: 24,
    bold: true,
    align: 'center',
    color: toPptxColor(accent),
  })
  addText(presSlide, slide.connectorLabel ?? '', {
    x: LAYOUT.phaseDeepDive.connectorLabel.x,
    y: LAYOUT.phaseDeepDive.connectorLabel.y,
    w: LAYOUT.phaseDeepDive.connectorLabel.w,
    h: LAYOUT.phaseDeepDive.connectorLabel.h,
    fontSize: 8.4,
    bold: true,
    align: 'center',
    color: toPptxColor(accent),
  })

  addText(presSlide, 'Common Pain Points', {
    x: LAYOUT.phaseDeepDive.painTitle.x,
    y: LAYOUT.phaseDeepDive.painTitle.y,
    w: LAYOUT.phaseDeepDive.painTitle.w,
    h: LAYOUT.phaseDeepDive.painTitle.h,
    fontSize: 13,
    bold: true,
    color: toPptxColor(accent),
  })
  let rightY = LAYOUT.phaseDeepDive.pain.y
  slide.painPoints.forEach((pain) => {
    addCard(
      presSlide,
      pptx,
      LAYOUT.phaseDeepDive.pain.x,
      rightY,
      LAYOUT.phaseDeepDive.pain.w,
      LAYOUT.phaseDeepDive.pain.h,
      {
      fillColor: accent,
      fillTransparency: 92,
      lineColor: accent,
      lineTransparency: 68,
      },
    )
    addText(presSlide, pain.icon, {
      x: LAYOUT.phaseDeepDive.pain.x + 0.16,
      y: rightY + 0.12,
      w: 0.28,
      h: 0.28,
      fontSize: 15,
      align: 'center',
    })
    addText(presSlide, `${pain.label} - ${pain.description}`, {
      x: LAYOUT.phaseDeepDive.pain.x + 0.5,
      y: rightY + 0.11,
      w: LAYOUT.phaseDeepDive.pain.w - 0.68,
      h: LAYOUT.phaseDeepDive.pain.h - 0.16,
      fontSize: 10.1,
    })
    rightY += LAYOUT.phaseDeepDive.pain.gap
  })

  if (slide.footerCallout) {
    addEmphasisBox(
      presSlide,
      pptx,
      {
        tone:
          slide.phase.tone === 'design'
            ? 'purple'
            : slide.phase.tone === 'test'
              ? 'orange'
              : 'green',
        label: 'Takeaway:',
        body: slide.footerCallout,
      },
      LAYOUT.phaseDeepDive.footer.y,
      LAYOUT.phaseDeepDive.footer.h,
    )
  }
}

function renderPhaseDeepDiveSplit(slide, pptx, presSlide) {
  addPhaseHeader(presSlide, pptx, slide)
  const accent = toneColor(slide.phase.tone)

  addText(presSlide, 'Discovery Questions', {
    x: PAGE.x,
    y: 1.15,
    w: 3.2,
    h: 0.16,
    fontSize: 11.5,
    bold: true,
    color: toPptxColor(accent),
  })
  let y = 1.38
  slide.discoveryQuestions.forEach((question) => {
    addCard(presSlide, pptx, PAGE.x, y, 5.5, 0.38, {
      fillColor: theme.colors.cardBg,
      lineColor: theme.colors.textSecondary,
      lineTransparency: 74,
    })
    addText(presSlide, `• ${question}`, {
      x: PAGE.x + 0.16,
      y: y + 0.09,
      w: 5.1,
      h: 0.18,
      fontSize: 8.8,
    })
    y += 0.44
  })

  addText(presSlide, 'Common Pain Points', {
    x: PAGE.x,
    y,
    w: 3.2,
    h: 0.16,
    fontSize: 11.5,
    bold: true,
    color: toPptxColor(accent),
  })
  y += 0.2
  slide.painPoints.forEach((pain) => {
    addCard(presSlide, pptx, PAGE.x, y, 5.5, 0.44, {
      fillColor: accent,
      fillTransparency: 92,
      lineColor: accent,
      lineTransparency: 68,
    })
    addText(presSlide, `${pain.icon} ${pain.label} - ${pain.description}`, {
      x: PAGE.x + 0.15,
      y: y + 0.1,
      w: 5.15,
      h: 0.18,
      fontSize: 8.8,
    })
    y += 0.5
  })

  addCard(presSlide, pptx, 6.45, 1.28, 5.65, 2.15, {
    fillColor: accent,
    fillTransparency: 90,
    lineColor: accent,
    lineTransparency: 55,
  })
  addText(presSlide, `${slide.solution.icon} ${slide.solution.title}`, {
    x: 6.65,
    y: 1.45,
    w: 5.25,
    h: 0.2,
    fontSize: 11,
    bold: true,
    color: toPptxColor(accent),
  })
  slide.solution.steps.forEach((step, index) => {
    addCircle(presSlide, pptx, 6.62, 1.8 + index * 0.34, 0.18, accent, String(index + 1), {
      fontSize: 7.6,
    })
    addText(presSlide, step, {
      x: 6.9,
      y: 1.82 + index * 0.34,
      w: 4.85,
      h: 0.18,
      fontSize: 8.8,
    })
  })

  if (slide.surfaceItems?.length) {
    addCard(presSlide, pptx, 6.45, 3.6, 5.65, 0.56, {
      fillColor: theme.colors.cardBg,
      lineColor: theme.colors.textSecondary,
      lineTransparency: 75,
    })
    addText(presSlide, slide.surfaceLabel, {
      x: 6.6,
      y: 3.78,
      w: 0.8,
      h: 0.12,
      fontSize: 7,
      bold: true,
      color: toPptxColor(theme.colors.textSecondary),
    })
    addToolPills(presSlide, pptx, slide.surfaceItems, 7.35, 3.73, 4.55, slide.phase.tone)
  }

  if (slide.bottomLine) {
    addEmphasisBox(
      presSlide,
      pptx,
      { label: 'Outcome:', body: slide.bottomLine, tone: 'green' },
      4.42,
      0.72,
    )
  }
}

function renderSolutionImpact(slide, pptx, presSlide) {
  addPhaseHeader(presSlide, pptx, slide)
  const accent = toneColor(slide.phase.tone)

  if (slide.media?.asset) {
    addImageOrPlaceholder(presSlide, pptx, slide.media.asset, 10.45, 0.38, 1.45, 0.88, {
      fit: 'contain',
    })
  }

  addCard(presSlide, pptx, PAGE.x, 1.08, 5.85, 2.65, {
    fillColor: accent,
    fillTransparency: 90,
    lineColor: accent,
    lineTransparency: 55,
  })
  addText(presSlide, `${slide.solution.icon} ${slide.solution.title}`, {
    x: PAGE.x + 0.18,
    y: 1.26,
    w: 5.45,
    h: 0.22,
    fontSize: 11.5,
    bold: true,
    color: toPptxColor(accent),
  })
  slide.solution.steps.forEach((step, index) => {
    addCircle(presSlide, pptx, PAGE.x + 0.18, 1.64 + index * 0.48, 0.22, accent, String(index + 1), {
      fontSize: 8,
    })
    addText(presSlide, step, {
      x: PAGE.x + 0.52,
      y: 1.68 + index * 0.48,
      w: 5.0,
      h: 0.22,
      fontSize: 8.6,
    })
  })

  if (slide.surfaceItems?.length) {
    addCard(presSlide, pptx, PAGE.x, 3.92, 5.85, 0.82, {
      fillColor: theme.colors.cardBg,
      lineColor: theme.colors.textSecondary,
      lineTransparency: 75,
    })
    addText(presSlide, slide.surfaceLabel, {
      x: PAGE.x + 0.15,
      y: 4.18,
      w: 0.95,
      h: 0.14,
      fontSize: 8,
      bold: true,
      color: toPptxColor(theme.colors.textSecondary),
    })
    addToolPills(presSlide, pptx, slide.surfaceItems, PAGE.x + 1.0, 4.08, 4.65, slide.phase.tone)
  }

  if (slide.keyShift) {
    addEmphasisBox(
      presSlide,
      pptx,
      { label: 'Key shift:', body: slide.keyShift, tone: 'green' },
      4.95,
      0.9,
    )
  }

  slide.impactCards?.forEach((card, index) => {
    const y = 1.08 + index * 1.22
    addCard(presSlide, pptx, 6.65, y, 5.45, 1.05, {
      fillColor: theme.colors.cardBg,
      lineColor: theme.colors.textSecondary,
      lineTransparency: 76,
    })
    addText(presSlide, card.stat, {
      x: 6.92,
      y: y + 0.14,
      w: 2.1,
      h: 0.28,
      fontSize: 18,
      bold: true,
      color: toPptxColor(accent),
    })
    addText(presSlide, card.label, {
      x: 8.55,
      y: y + 0.19,
      w: 1.45,
      h: 0.16,
      fontSize: 8,
      bold: true,
      color: toPptxColor(theme.colors.textSecondary),
    })
    addText(presSlide, card.body, {
      x: 8.55,
      y: y + 0.43,
      w: 3.2,
      h: 0.34,
      fontSize: 8.6,
    })
  })

  if (slide.bottomLine) {
    addEmphasisBox(
      presSlide,
      pptx,
      { label: 'Bottom line:', body: slide.bottomLine, tone: 'green' },
      4.92,
      0.98,
    )
  }
}

function renderMediaSlide(slide, pptx, presSlide, fullBleed = false) {
  if (slide.phase) {
    addPhaseHeader(presSlide, pptx, slide)
  }
  if (slide.link) {
    addText(presSlide, slide.link.label, {
      x: PAGE.x,
      y: 1.02,
      w: PAGE.w,
      h: 0.14,
      fontSize: 8,
      color: toPptxColor(theme.colors.cursorBlue),
    })
  }

  addImageOrPlaceholder(
    presSlide,
    pptx,
    slide.media.asset,
    fullBleed ? 0.75 : PAGE.x,
    fullBleed ? 1.2 : 1.35,
    fullBleed ? 11.85 : PAGE.w,
    fullBleed ? 5.7 : 5.2,
    {
      fit: slide.media.fit ?? 'contain',
    },
  )
}

function renderContextSplit(slide, pptx, presSlide) {
  addPhaseHeader(presSlide, pptx, slide)
  addImageOrPlaceholder(presSlide, pptx, slide.media.asset, PAGE.x, 1.35, 5.5, 4.4, {
    fit: 'contain',
  })
  addText(presSlide, "A Designer's Day", {
    x: 6.45,
    y: 1.35,
    w: 3.5,
    h: 0.18,
    fontSize: 10,
    bold: true,
    color: toPptxColor(toneColor(slide.phase.tone)),
  })
  slide.contextCards.forEach((card, index) => {
    const y = 1.68 + index * 0.88
    addCard(presSlide, pptx, 6.45, y, 5.55, 0.7, {
      fillColor: theme.colors.cardBg,
      lineColor: theme.colors.textSecondary,
      lineTransparency: 75,
    })
    addText(presSlide, card.label, {
      x: 6.62,
      y: y + 0.14,
      w: 1.0,
      h: 0.16,
      fontSize: 8,
      bold: true,
      color: toPptxColor(toneColor(slide.phase.tone)),
    })
    addText(presSlide, card.body, {
      x: 7.5,
      y: y + 0.14,
      w: 4.25,
      h: 0.28,
      fontSize: 7.9,
    })
  })
  addEmphasisBox(presSlide, pptx, { label: 'The gap:', body: slide.emphasis, tone: 'purple' }, 6.0, 0.52)
}

function renderTwoColumnCycle(slide, pptx, presSlide) {
  addPhaseHeader(presSlide, pptx, slide)
  const accent = toneColor(slide.phase.tone)

  addText(presSlide, slide.leftTitle, {
    x: PAGE.x,
    y: 1.15,
    w: 3.5,
    h: 0.18,
    fontSize: 10,
    bold: true,
    color: toPptxColor(accent),
  })
  addText(presSlide, slide.leftSubtitle, {
    x: PAGE.x,
    y: 1.38,
    w: 4.8,
    h: 0.18,
    fontSize: 8,
    color: toPptxColor(theme.colors.textSecondary),
  })
  slide.cycleSteps.forEach((step, index) => {
    const y = 1.68 + index * 0.86
    addCard(presSlide, pptx, PAGE.x, y, 5.65, 0.72, {
      fillColor: theme.colors.cardBg,
      lineColor: theme.colors.textSecondary,
      lineTransparency: 74,
    })
    addCircle(presSlide, pptx, PAGE.x + 0.14, y + 0.13, 0.22, accent, String(index + 1), {
      fontSize: 7,
    })
    addText(presSlide, step.title, {
      x: PAGE.x + 0.46,
      y: y + 0.12,
      w: 5.0,
      h: 0.16,
      fontSize: 8,
      bold: true,
    })
    if (step.tools?.length) {
      addToolPills(presSlide, pptx, step.tools, PAGE.x + 0.46, y + 0.34, 4.9, slide.phase.tone)
    }
    if (step.quotes?.length) {
      addText(presSlide, step.quotes.join(' '), {
        x: PAGE.x + 0.46,
        y: y + 0.36,
        w: 4.95,
        h: 0.18,
        fontSize: 7.4,
        color: toPptxColor(theme.colors.textSecondary),
      })
    }
  })
  addEmphasisBox(presSlide, pptx, { label: 'Loop:', body: slide.loopBanner, tone: 'green' }, 5.25, 0.52)

  addText(presSlide, slide.media.title, {
    x: 6.5,
    y: 1.15,
    w: 3.8,
    h: 0.18,
    fontSize: 10,
    bold: true,
    color: toPptxColor(accent),
  })
  const asset = getAsset(slide.media.asset)
  if (asset?.kind === 'video') {
    addCard(presSlide, pptx, 6.5, 1.45, 5.55, 3.4, {
      fillColor: theme.colors.cardBg,
      lineColor: accent,
      lineTransparency: 55,
    })
    addText(presSlide, '▶ Video Demo', {
      x: 8.15,
      y: 2.75,
      w: 2.25,
      h: 0.3,
      fontSize: 18,
      bold: true,
      color: toPptxColor(accent),
      align: 'center',
    })
    if (slide.media.href) {
      addText(presSlide, slide.media.href, {
        x: 6.7,
        y: 4.0,
        w: 5.15,
        h: 0.16,
        fontSize: 7.5,
        color: toPptxColor(theme.colors.cursorBlue),
        align: 'center',
      })
    }
  } else {
    addImageOrPlaceholder(presSlide, pptx, slide.media.asset, 6.5, 1.45, 5.55, 3.4, {
      fit: 'contain',
    })
  }
  addEmphasisBox(presSlide, pptx, { label: 'Why it matters:', body: slide.media.caption, tone: 'green' }, 5.1, 0.82)
}

function renderVideoPlaceholder(slide, pptx, presSlide) {
  addPhaseHeader(presSlide, pptx, slide)
  addCard(presSlide, pptx, 1.45, 1.45, 10.45, 4.15, {
    fillColor: theme.colors.cardBg,
    lineColor: theme.colors.textSecondary,
    lineTransparency: 52,
  })
  addText(presSlide, slide.placeholder.icon, {
    x: 5.55,
    y: 2.08,
    w: 1.6,
    h: 0.62,
    fontSize: 34,
    align: 'center',
    color: toPptxColor(theme.colors.textSecondary),
  })
  addText(presSlide, slide.placeholder.title, {
    x: 2.4,
    y: 3.0,
    w: 8.6,
    h: 0.32,
    fontSize: 16,
    bold: true,
    align: 'center',
  })
  addText(presSlide, slide.placeholder.description, {
    x: 2.45,
    y: 3.45,
    w: 8.5,
    h: 0.55,
    fontSize: 10,
    color: toPptxColor(theme.colors.textSecondary),
    align: 'center',
  })
  addEmphasisBox(presSlide, pptx, { label: 'Key message:', body: slide.outcome, tone: 'green' }, 6.0, 0.78)
}

function renderWorkflowCompare(slide, pptx, presSlide) {
  addText(presSlide, slide.title, {
    x: LAYOUT.workflowCompare.title.x,
    y: LAYOUT.workflowCompare.title.y,
    w: LAYOUT.workflowCompare.title.w,
    h: LAYOUT.workflowCompare.title.h,
    fontFace: theme.fonts.heading,
    fontSize: 20,
    bold: true,
  })

  slide.workflowRows.forEach((row, rowIndex) => {
    const rowY = LAYOUT.workflowCompare.rowY + rowIndex * LAYOUT.workflowCompare.rowGap
    addText(presSlide, row.label, {
      x: LAYOUT.workflowCompare.rowLabel.x,
      y: rowY + 0.65,
      w: LAYOUT.workflowCompare.rowLabel.w,
      h: LAYOUT.workflowCompare.rowLabel.h,
      fontSize: 9.2,
      bold: true,
      color: toPptxColor(theme.colors.textSecondary),
      rotate: 270,
    })

    row.steps.forEach((step, index) => {
      const frame = getWorkflowCompareStepFrame(rowIndex, index)
      const x = frame.x
      addCard(presSlide, pptx, x, rowY, frame.w, frame.h, {
        fillColor: theme.colors.cardBg,
        lineColor: row.label === 'Git' ? toneColor('develop') : theme.colors.textSecondary,
        lineTransparency: 78,
      })
      addText(presSlide, step.title, {
        x: x + 0.15,
        y: rowY + 0.16,
        w: 2.5,
        h: 0.2,
        fontSize: 11.5,
        bold: true,
      })
      addText(presSlide, step.subtitle, {
        x: x + 0.15,
        y: rowY + 0.4,
        w: 2.5,
        h: 0.16,
        fontSize: 8.8,
        color: toPptxColor(theme.colors.textSecondary),
      })
      addText(presSlide, step.bullets.map((bullet) => `• ${bullet}`).join('\n'), {
        x: x + 0.18,
        y: rowY + 0.66,
        w: 2.42,
        h: 0.62,
        fontSize: 8.6,
      })
      if (index < row.steps.length - 1) {
        addText(presSlide, '→', {
          x: x + LAYOUT.workflowCompare.arrowOffsetX,
          y: rowY + LAYOUT.workflowCompare.arrowY,
          w: 0.28,
          h: 0.16,
          fontSize: 14,
          align: 'center',
          color: toPptxColor(theme.colors.textSecondary),
        })
      }
    })
  })

  addEmphasisBox(
    presSlide,
    pptx,
    slide.emphasis,
    LAYOUT.workflowCompare.emphasis.y,
    LAYOUT.workflowCompare.emphasis.h,
  )
}

function renderWorkflowColumns(slide, pptx, presSlide) {
  if (slide.variant === 'analogyTimeline') {
    addPhaseHeader(presSlide, pptx, slide)

    slide.timelineRows.forEach((row, rowIndex) => {
      const rowFrame = getAnalogyTimelineRowFrame(rowIndex)
      const rowY = rowFrame.y
      addCard(presSlide, pptx, rowFrame.x, rowY, rowFrame.w, rowFrame.h, {
        fillColor: rowIndex === 0 ? theme.colors.cardBg : theme.colors.codeBg,
        lineColor: rowIndex === 0 ? theme.colors.textSecondary : toneColor('test'),
        lineTransparency: 80,
      })
      addText(presSlide, row.label, {
        x: rowFrame.x + LAYOUT.workflowColumns.analogyTimeline.label.offsetX,
        y: rowY + LAYOUT.workflowColumns.analogyTimeline.label.offsetY,
        w: LAYOUT.workflowColumns.analogyTimeline.label.w,
        h: LAYOUT.workflowColumns.analogyTimeline.label.h,
        fontSize: 8.2,
        bold: true,
        color: rowIndex === 0 ? toPptxColor(theme.colors.textSecondary) : toPptxColor(toneColor('test')),
      })
      addText(presSlide, row.badge, {
        x: rowFrame.x + LAYOUT.workflowColumns.analogyTimeline.badge.offsetX,
        y: rowY + LAYOUT.workflowColumns.analogyTimeline.badge.offsetY,
        w: LAYOUT.workflowColumns.analogyTimeline.badge.w,
        h: LAYOUT.workflowColumns.analogyTimeline.badge.h,
        fontSize: 7.6,
        color: toPptxColor(theme.colors.textSecondary),
      })

      row.steps.forEach((step, index) => {
        const stepFrame = getAnalogyTimelineStepFrame(index, rowIndex)
        const x = stepFrame.x
        const variantTone =
          step.variant === 'danger'
            ? 'deploy'
            : step.variant === 'investment'
              ? 'review'
              : step.variant === 'glow'
                ? 'test'
                : 'develop'
        addCard(presSlide, pptx, stepFrame.x, stepFrame.y, stepFrame.w, stepFrame.h, {
          fillColor: step.variant ? toneColor(variantTone) : theme.colors.cardBg,
          fillTransparency: step.variant ? 86 : 0,
          lineColor: step.variant ? toneColor(variantTone) : theme.colors.textSecondary,
          lineTransparency: step.variant ? 35 : 78,
          lineWidth: step.variant ? 1.4 : 1,
        })
        addText(presSlide, step.label, {
          x: x + LAYOUT.workflowColumns.analogyTimeline.stepTextInsetX,
          y: rowY + LAYOUT.workflowColumns.analogyTimeline.stepTextInsetY,
          w: LAYOUT.workflowColumns.analogyTimeline.stepTextW,
          h: LAYOUT.workflowColumns.analogyTimeline.stepTextH,
          fontSize: 7.8,
          bold: Boolean(step.variant),
          align: 'center',
          color:
            step.variant
              ? toPptxColor(toneColor(variantTone))
              : toPptxColor(theme.colors.textPrimary),
        })
        if (index < row.steps.length - 1) {
          addText(presSlide, '→', {
            x: x + LAYOUT.workflowColumns.analogyTimeline.arrowOffsetX,
            y: rowY + LAYOUT.workflowColumns.analogyTimeline.arrowOffsetY,
            w: 0.12,
            h: 0.12,
            fontSize: 10,
            color: toPptxColor(theme.colors.textSecondary),
          })
        }
      })

      addAnalogyTimelineTestingArrow(presSlide, pptx, rowIndex, row.steps.length - 1)
    })

    slide.insightCards.forEach((card, index) => {
      const x =
        index === 0 ? PAGE.x : LAYOUT.workflowColumns.analogyTimeline.insightRightX
      addCard(
        presSlide,
        pptx,
        x,
        LAYOUT.workflowColumns.analogyTimeline.insightY,
        LAYOUT.workflowColumns.analogyTimeline.insightW,
        LAYOUT.workflowColumns.analogyTimeline.insightH,
        {
        fillColor: toneColor('test'),
        fillTransparency: 92,
        lineColor: toneColor('test'),
        lineTransparency: 62,
        },
      )
      addText(presSlide, card.label, {
        x: x + 0.16,
        y: LAYOUT.workflowColumns.analogyTimeline.insightY + 0.13,
        w: 1.65,
        h: 0.14,
        fontSize: 7.8,
        bold: true,
        color: toPptxColor(toneColor('test')),
      })
      addText(presSlide, card.body, {
        x: x + 0.16,
        y: LAYOUT.workflowColumns.analogyTimeline.insightY + 0.36,
        w: LAYOUT.workflowColumns.analogyTimeline.insightW - 0.32,
        h: 0.42,
        fontSize: 8.6,
      })
    })
    return
  }

  addPhaseHeader(presSlide, pptx, slide)
  slide.workflowColumns.forEach((column, index) => {
    const frame = getWorkflowEvolutionColumnFrame(index)
    const x = frame.x
    const accent = toneColor(column.tone === 'content' ? 'develop' : column.tone)
    addCard(presSlide, pptx, x, frame.y, frame.w, frame.h, {
      fillColor: theme.colors.cardBg,
      lineColor: accent,
      lineTransparency: 70,
    })
    addText(presSlide, column.title, {
      x: x + LAYOUT.workflowColumns.evolution.titleInsetX,
      y: LAYOUT.workflowColumns.evolution.titleY,
      w: frame.w - LAYOUT.workflowColumns.evolution.titleInsetX * 2,
      h: LAYOUT.workflowColumns.evolution.titleH,
      fontSize: 11.2,
      bold: true,
      color: toPptxColor(accent),
      align: 'center',
    })
    addText(presSlide, column.subtitle, {
      x: x + LAYOUT.workflowColumns.evolution.titleInsetX,
      y: LAYOUT.workflowColumns.evolution.subtitleY,
      w: frame.w - LAYOUT.workflowColumns.evolution.titleInsetX * 2,
      h: LAYOUT.workflowColumns.evolution.subtitleH,
      fontSize: 8.2,
      color: toPptxColor(theme.colors.textSecondary),
      align: 'center',
    })
    column.steps.forEach((step, stepIndex) => {
      const y =
        LAYOUT.workflowColumns.evolution.stepY +
        stepIndex * LAYOUT.workflowColumns.evolution.stepGap
      addCard(
        presSlide,
        pptx,
        x + LAYOUT.workflowColumns.evolution.stepInsetX,
        y,
        frame.w - LAYOUT.workflowColumns.evolution.stepInsetX * 2,
        LAYOUT.workflowColumns.evolution.stepH,
        {
        fillColor: stepIndex === column.highlightStep ? accent : theme.colors.white,
        fillTransparency: stepIndex === column.highlightStep ? 88 : 0,
        lineColor: stepIndex === column.highlightStep ? accent : theme.colors.textSecondary,
        lineTransparency: stepIndex === column.highlightStep ? 38 : 80,
        },
      )
      addText(presSlide, step, {
        x:
          x +
          LAYOUT.workflowColumns.evolution.stepInsetX +
          LAYOUT.workflowColumns.evolution.stepTextInsetX,
        y: y + LAYOUT.workflowColumns.evolution.stepTextInsetY,
        w:
          frame.w -
          (LAYOUT.workflowColumns.evolution.stepInsetX +
            LAYOUT.workflowColumns.evolution.stepTextInsetX) *
            2,
        h: LAYOUT.workflowColumns.evolution.stepTextH,
        fontSize: 8.6,
        bold: stepIndex === column.highlightStep,
        align: 'center',
      })
    })
    addText(presSlide, column.footer, {
      x: x + LAYOUT.workflowColumns.evolution.footerInsetX,
      y: LAYOUT.workflowColumns.evolution.footerY,
      w: frame.w - LAYOUT.workflowColumns.evolution.footerInsetX * 2,
      h: LAYOUT.workflowColumns.evolution.footerH,
      fontSize: 8.1,
      color: toPptxColor(theme.colors.textSecondary),
      align: 'center',
    })
  })
  addEmphasisBox(
    presSlide,
    pptx,
    { label: '', body: slide.mainTakeaway, tone: 'green' },
    LAYOUT.workflowColumns.evolution.emphasis.y,
    LAYOUT.workflowColumns.evolution.emphasis.h,
  )
}

function renderBrowserDemo(slide, pptx, presSlide) {
  addSectionHeader(presSlide, pptx, slide)
  addText(presSlide, slide.title, {
    x: LAYOUT.browserDemo.title.x,
    y: LAYOUT.browserDemo.title.y,
    w: LAYOUT.browserDemo.title.w,
    h: LAYOUT.browserDemo.title.h,
    fontFace: theme.fonts.heading,
    fontSize: 22,
    bold: true,
  })
  if (slide.subtitle) {
    addText(presSlide, slide.subtitle, {
      x: LAYOUT.browserDemo.subtitle.x,
      y: LAYOUT.browserDemo.subtitle.y,
      w: LAYOUT.browserDemo.subtitle.w,
      h: LAYOUT.browserDemo.subtitle.h,
      fontSize: 9,
      color: toPptxColor(theme.colors.textSecondary),
      align: 'center',
    })
  }

  const frameX = LAYOUT.browserDemo.frame.x
  const frameY = LAYOUT.browserDemo.frame.y
  const frameW = LAYOUT.browserDemo.frame.w
  const frameH = LAYOUT.browserDemo.frame.h

  addCard(presSlide, pptx, frameX, frameY, frameW, frameH, {
    fillColor: theme.colors.white,
    lineColor: theme.colors.textSecondary,
    lineTransparency: 60,
  })
  presSlide.addShape(pptx.ShapeType.rect, {
    x: frameX,
    y: frameY,
    w: frameW,
    h: LAYOUT.browserDemo.chromeBarH,
    fill: { color: 'F0F0F0' },
    line: { color: 'F0F0F0', transparency: 100 },
  })
  addCircle(presSlide, pptx, frameX + 0.12, frameY + 0.11, 0.08, '#ff5f57', '')
  addCircle(presSlide, pptx, frameX + 0.25, frameY + 0.11, 0.08, '#febc2e', '')
  addCircle(presSlide, pptx, frameX + 0.38, frameY + 0.11, 0.08, '#28c840', '')
  addCard(presSlide, pptx, frameX + 0.64, frameY + 0.08, frameW - 0.82, 0.2, {
    fillColor: theme.colors.white,
    lineColor: theme.colors.textSecondary,
    lineTransparency: 80,
  })
  addText(presSlide, slide.browserMock.url, {
    x: frameX + 0.72,
    y: frameY + 0.14,
    w: frameW - 0.98,
    h: 0.08,
    fontSize: 7,
    color: toPptxColor(theme.colors.textSecondary),
  })

  if (slide.browserMock.variant === 'flappyBird') {
    presSlide.addShape(pptx.ShapeType.rect, {
      x: frameX + 0.02,
      y: frameY + 0.36,
      w: frameW - 0.04,
      h: frameH - 0.38,
      fill: { color: '4EC5F1' },
      line: { color: '4EC5F1', transparency: 100 },
    })
    presSlide.addShape(pptx.ShapeType.rect, {
      x: frameX + 0.02,
      y: frameY + 2.85,
      w: frameW - 0.04,
      h: 1.1,
      fill: { color: '8BC34A' },
      line: { color: '8BC34A', transparency: 100 },
    })
    ;[3.2, 5.25, 7.4].forEach((pipeX, index) => {
      presSlide.addShape(pptx.ShapeType.rect, {
        x: pipeX,
        y: frameY + 0.36,
        w: 0.28,
        h: index === 1 ? 1.65 : index === 2 ? 0.95 : 1.0,
        fill: { color: '4CAF50' },
        line: { color: '388E3C' },
      })
      presSlide.addShape(pptx.ShapeType.rect, {
        x: pipeX,
        y: index === 1 ? frameY + 2.75 : index === 2 ? frameY + 2.35 : frameY + 2.55,
        w: 0.28,
        h: index === 1 ? 1.2 : index === 2 ? 1.55 : 1.35,
        fill: { color: '4CAF50' },
        line: { color: '388E3C' },
      })
    })
    addCircle(presSlide, pptx, 4.05, 2.72, 0.34, '#FDD835', '')
    addText(presSlide, slide.browserMock.score, {
      x: 6.1,
      y: 1.8,
      w: 1.0,
      h: 0.3,
      fontSize: 24,
      bold: true,
      color: toPptxColor(theme.colors.white),
      align: 'center',
    })
  } else {
    presSlide.addShape(pptx.ShapeType.rect, {
      x: frameX + 0.02,
      y: frameY + 0.36,
      w: frameW - 0.04,
      h: frameH - 0.38,
      fill: { color: '000000' },
      line: { color: '000000', transparency: 100 },
    })
    addText(presSlide, 'SCORE', {
      x: 2.35,
      y: 1.95,
      w: 0.65,
      h: 0.1,
      fontFace: 'Courier New',
      fontSize: 7,
      color: 'FFFFFF',
    })
    addText(presSlide, slide.browserMock.score, {
      x: 2.35,
      y: 2.08,
      w: 0.8,
      h: 0.12,
      fontFace: 'Courier New',
      fontSize: 9,
      bold: true,
      color: slide.browserMock.variant === 'pacmanPowerUp' ? 'FFEB3B' : 'FFFFFF',
    })
    if (slide.browserMock.variant === 'pacmanPowerUp') {
      addCard(presSlide, pptx, 5.8, 1.9, 1.8, 0.38, {
        fillColor: '#FFAB00',
        lineColor: '#FF6F00',
        lineTransparency: 0,
      })
      addText(presSlide, slide.browserMock.badge, {
        x: 5.92,
        y: 2.03,
        w: 1.55,
        h: 0.12,
        fontSize: 8.5,
        bold: true,
        align: 'center',
        color: '000000',
      })
      addText(presSlide, slide.browserMock.timer, {
        x: 5.95,
        y: 2.3,
        w: 1.5,
        h: 0.1,
        fontSize: 6,
        align: 'center',
        color: 'FFAB00',
      })
    } else {
      addText(presSlide, 'HIGH SCORE', {
        x: 5.75,
        y: 1.95,
        w: 1.0,
        h: 0.1,
        fontFace: 'Courier New',
        fontSize: 7,
        color: 'FFFFFF',
      })
      addText(presSlide, '5000', {
        x: 6.0,
        y: 2.08,
        w: 0.6,
        h: 0.12,
        fontFace: 'Courier New',
        fontSize: 9,
        bold: true,
        color: 'FFFFFF',
      })
    }
    ;[
      [3.15, 2.3, 0.8, 0.22],
      [4.25, 2.3, 0.7, 0.22],
      [5.35, 2.3, 0.7, 0.22],
      [6.35, 2.3, 0.8, 0.22],
      [3.15, 3.0, 0.4, 0.7],
      [4.0, 3.0, 1.0, 0.22],
      [6.0, 3.0, 1.0, 0.22],
      [7.4, 3.0, 0.4, 0.7],
    ].forEach(([x, y, w, h]) => {
      presSlide.addShape(pptx.ShapeType.rect, {
        x,
        y,
        w,
        h,
        fill: { color: '1A1AFF', transparency: 100 },
        line: { color: '1A1AFF', width: 1.25 },
      })
    })
    addCircle(presSlide, pptx, slide.browserMock.variant === 'pacmanPowerUp' ? 4.6 : 4.15, 3.45, 0.24, '#FFEB3B', '')
    addText(presSlide, slide.browserMock.variant === 'pacmanPowerUp' ? '+20' : '• • • • •', {
      x: slide.browserMock.variant === 'pacmanPowerUp' ? 4.3 : 4.9,
      y: slide.browserMock.variant === 'pacmanPowerUp' ? 3.15 : 3.35,
      w: slide.browserMock.variant === 'pacmanPowerUp' ? 0.55 : 1.0,
      h: 0.12,
      fontFace: 'Courier New',
      fontSize: 8,
      color: slide.browserMock.variant === 'pacmanPowerUp' ? 'FFAB00' : 'FFB8AE',
    })
  }

  addEmphasisBox(
    presSlide,
    pptx,
    slide.emphasis,
    LAYOUT.browserDemo.emphasis.y,
    LAYOUT.browserDemo.emphasis.h,
  )
}

function renderDocPreview(slide, pptx, presSlide) {
  addSectionHeader(presSlide, pptx, slide)
  addText(presSlide, slide.title, {
    x: PAGE.x,
    y: 0.72,
    w: PAGE.w,
    h: 0.26,
    fontFace: theme.fonts.heading,
    fontSize: 22,
    bold: true,
  })
  addText(presSlide, slide.intro, {
    x: PAGE.x,
    y: 1.05,
    w: PAGE.w,
    h: 0.16,
    fontSize: 8.5,
    color: toPptxColor(theme.colors.textSecondary),
  })
  addCard(presSlide, pptx, PAGE.x, 1.35, PAGE.w, 4.65, {
    fillColor: theme.colors.codeBg,
    lineColor: theme.colors.textSecondary,
    lineTransparency: 75,
  })
  addText(presSlide, slide.docLabel, {
    x: 11.25,
    y: 1.48,
    w: 0.7,
    h: 0.12,
    fontSize: 7,
    color: toPptxColor(theme.colors.textSecondary),
    align: 'right',
  })
  addText(presSlide, slide.docLines.join('\n'), {
    x: PAGE.x + 0.2,
    y: 1.62,
    w: PAGE.w - 0.4,
    h: 4.15,
    fontFace: theme.fonts.mono,
    fontSize: 7.1,
    color: '586E75',
  })
  addEmphasisBox(presSlide, pptx, slide.emphasis, 6.18, 0.58)
}

function renderQuote(slide, pptx, presSlide) {
  addText(presSlide, slide.title, {
    x: PAGE.x,
    y: 0.72,
    w: PAGE.w,
    h: 0.24,
    fontFace: theme.fonts.heading,
    fontSize: 20,
    bold: true,
  })
  addCard(presSlide, pptx, 1.1, 1.55, 11.1, 2.7, {
    fillColor: toneColor('develop'),
    fillTransparency: 90,
    lineColor: toneColor('develop'),
    lineTransparency: 65,
  })
  const runs = slide.quoteLines.map((line, index) => ({
    text: `${line}${index < slide.quoteLines.length - 1 ? '\n' : ''}`,
    options: {
      bold: slide.quoteHighlightLines?.includes(index),
      color: slide.quoteHighlightLines?.includes(index)
        ? toPptxColor(toneColor('develop'))
        : toPptxColor(theme.colors.textPrimary),
      fontSize: slide.quoteHighlightLines?.includes(index) ? 18 : 18,
    },
  }))
  addRichText(presSlide, runs, {
    x: 1.45,
    y: 2.08,
    w: 10.4,
    h: 1.2,
    align: 'center',
  })
  if (slide.supportingLines?.length) {
    addText(presSlide, slide.supportingLines.join('\n'), {
      x: 1.7,
      y: 4.65,
      w: 9.9,
      h: 0.45,
      fontSize: 10,
      align: 'center',
      color: toPptxColor(theme.colors.textSecondary),
    })
  }
}

function renderBeforeAfter(slide, pptx, presSlide) {
  addSectionHeader(presSlide, pptx, slide)
  addText(presSlide, slide.title, {
    x: PAGE.x,
    y: 0.72,
    w: PAGE.w,
    h: 0.26,
    fontFace: theme.fonts.heading,
    fontSize: 22,
    bold: true,
  })

  addCard(presSlide, pptx, PAGE.x, 1.4, 5.7, 4.85, {
    fillColor: theme.colors.cardBg,
    lineColor: theme.colors.textSecondary,
    lineTransparency: 76,
  })
  addText(presSlide, slide.beforeAfter.before.title, {
    x: PAGE.x + 0.18,
    y: 1.58,
    w: 3.2,
    h: 0.16,
    fontSize: 10,
    bold: true,
    color: toPptxColor(toneColor('deploy')),
  })
  addText(presSlide, slide.beforeAfter.before.lines.join('\n'), {
    x: PAGE.x + 0.2,
    y: 1.9,
    w: 5.3,
    h: 4.1,
    fontSize: 8.2,
  })

  addCard(presSlide, pptx, 6.7, 1.4, 5.7, 4.85, {
    fillColor: theme.colors.cardBg,
    lineColor: theme.colors.textSecondary,
    lineTransparency: 76,
  })
  addText(presSlide, slide.beforeAfter.after.title, {
    x: 6.88,
    y: 1.58,
    w: 3.0,
    h: 0.16,
    fontSize: 10,
    bold: true,
    color: toPptxColor(toneColor('review')),
  })
  addImageOrPlaceholder(presSlide, pptx, slide.beforeAfter.after.media.asset, 6.92, 1.88, 5.28, 4.05, {
    fit: 'contain',
  })
}

function renderRealWorldPanels(slide, pptx, presSlide) {
  addPhaseHeader(presSlide, pptx, slide)
  slide.panels.forEach((panel, index) => {
    const x = index === 0 ? PAGE.x : 6.55
    addText(presSlide, panel.title, {
      x,
      y: 1.25,
      w: 5.45,
      h: 0.16,
      fontSize: 9.5,
      bold: true,
      color: toPptxColor(toneColor(slide.phase.tone)),
    })
    addImageOrPlaceholder(presSlide, pptx, panel.media.asset, x, 1.5, 5.45, 2.8, {
      fit: 'contain',
    })
    panel.steps.forEach((step, stepIndex) => {
      addCard(presSlide, pptx, x, 4.45 + stepIndex * 0.5, 5.45, 0.4, {
        fillColor: theme.colors.cardBg,
        lineColor: theme.colors.textSecondary,
        lineTransparency: 75,
      })
      addText(presSlide, `${stepIndex + 1}. ${step}`, {
        x: x + 0.14,
        y: 4.58 + stepIndex * 0.5,
        w: 5.1,
        h: 0.14,
        fontSize: 7.8,
      })
    })
  })
  addEmphasisBox(presSlide, pptx, { label: 'Why it matters:', body: slide.banner, tone: 'green' }, 6.1, 0.58)
}

function renderSlideByType(pptx, presSlide, slide) {
  switch (slide.type) {
    case SLIDE_TYPES.titleHero:
      return renderTitleSlide(slide, pptx, presSlide)
    case SLIDE_TYPES.closing:
      return renderClosingSlide(slide, pptx, presSlide)
    case SLIDE_TYPES.takeaway:
      return renderTakeawaySlide(slide, pptx, presSlide)
    case SLIDE_TYPES.agenda:
      return renderAgendaSlide(slide, pptx, presSlide)
    case SLIDE_TYPES.sdlcOverview:
    case SLIDE_TYPES.sdlcHighlight:
      return renderSdlcSlide(slide, pptx, presSlide)
    case SLIDE_TYPES.sectionIntro:
      if (slide.variant === 'bigQuote') {
        addSectionHeader(presSlide, pptx, slide)
        addText(presSlide, slide.title, {
          x: PAGE.x,
          y: 0.72,
          w: PAGE.w,
          h: 0.26,
          fontFace: theme.fonts.heading,
          fontSize: 22,
          bold: true,
        })
        addCard(presSlide, pptx, 1.1, 1.7, 11.1, 2.7, {
          fillColor: toneColor('design'),
          fillTransparency: 90,
          lineColor: toneColor('design'),
          lineTransparency: 65,
        })
        addText(presSlide, slide.quoteLines[0], {
          x: 1.4,
          y: 2.25,
          w: 10.5,
          h: 0.25,
          fontSize: 18,
          align: 'center',
        })
        addText(presSlide, slide.quoteLines[1], {
          x: 1.4,
          y: 2.8,
          w: 10.5,
          h: 0.25,
          fontSize: 18,
          bold: true,
          align: 'center',
          color: toPptxColor(toneColor('design')),
        })
        return
      }
      if (slide.variant === 'projectPicker' || slide.variant === 'threeTiles' || slide.variant === 'rules' || slide.variant === 'skipInfo') {
        if (slide.variant === 'skipInfo') {
          addSectionHeader(presSlide, pptx, slide)
          addText(presSlide, slide.title, {
            x: PAGE.x,
            y: 0.72,
            w: PAGE.w,
            h: 0.26,
            fontFace: theme.fonts.heading,
            fontSize: 22,
            bold: true,
          })
          addEmphasisBox(
            presSlide,
            pptx,
            { label: slide.skipBanner.title, body: slide.skipBanner.subtitle, tone: 'orange' },
            1.2,
            0.56,
          )
          addTileGrid(presSlide, pptx, slide.tiles, {
            columns: 2,
            y: 2.0,
            h: 1.9,
          })
          addEmphasisBox(presSlide, pptx, slide.emphasis, 6.0, 0.58)
          return
        }
        if (slide.variant === 'projectPicker') {
          addSectionHeader(presSlide, pptx, slide)
          addText(presSlide, slide.title, {
            x: PAGE.x,
            y: 0.72,
            w: PAGE.w,
            h: 0.26,
            fontFace: theme.fonts.heading,
            fontSize: 22,
            bold: true,
          })
          addCard(presSlide, pptx, PAGE.x, 1.15, PAGE.w, 0.86, {
            fillColor: toneColor('plan'),
            fillTransparency: 92,
            lineColor: toneColor('plan'),
            lineTransparency: 70,
          })
          addText(presSlide, slide.intro.paragraphs.join('\n'), {
            x: PAGE.x + 0.18,
            y: 1.33,
            w: PAGE.w - 0.36,
            h: 0.46,
            fontSize: 8.3,
          })
          addTileGrid(presSlide, pptx, slide.objectiveTiles, {
            columns: 1,
            x: PAGE.x,
            y: 2.2,
            w: 3.65,
            h: 1.0,
          })
          addText(presSlide, slide.sideHeading, {
            x: 4.05,
            y: 2.2,
            w: 4.5,
            h: 0.16,
            fontSize: 8.5,
            bold: true,
          })
          let categoryY = 2.45
          slide.projectCategories.forEach((category) => {
            addText(presSlide, category.label, {
              x: 4.05,
              y: categoryY,
              w: 3.4,
              h: 0.12,
              fontSize: 7,
              bold: true,
              color: toPptxColor(theme.colors.textSecondary),
            })
            categoryY += 0.16
            category.ideas.forEach((idea) => {
              addCard(presSlide, pptx, 4.05, categoryY, 7.9, 0.4, {
                fillColor: theme.colors.cardBg,
                lineColor: theme.colors.textSecondary,
                lineTransparency: 78,
              })
              addText(presSlide, idea.icon, {
                x: 4.18,
                y: categoryY + 0.1,
                w: 0.22,
                h: 0.14,
                fontSize: 10,
                align: 'center',
              })
              addText(presSlide, idea.name, {
                x: 4.48,
                y: categoryY + 0.08,
                w: 1.8,
                h: 0.14,
                fontSize: 8,
                bold: true,
              })
              addText(presSlide, idea.features, {
                x: 6.0,
                y: categoryY + 0.08,
                w: 5.7,
                h: 0.14,
                fontSize: 6.9,
                color: toPptxColor(theme.colors.textSecondary),
              })
              categoryY += 0.48
            })
          })
          addEmphasisBox(presSlide, pptx, { label: slide.buildYourOwn.title, body: slide.buildYourOwn.description, tone: 'green' }, 6.15, 0.5)
          return
        }
        if (slide.variant === 'threeTiles') {
          addSectionHeader(presSlide, pptx, slide)
          addText(presSlide, slide.title, {
            x: PAGE.x,
            y: 0.72,
            w: PAGE.w,
            h: 0.26,
            fontFace: theme.fonts.heading,
            fontSize: 22,
            bold: true,
          })
          addCard(presSlide, pptx, PAGE.x, 1.15, PAGE.w, 0.72, {
            fillColor: toneColor('test'),
            fillTransparency: 92,
            lineColor: toneColor('test'),
            lineTransparency: 70,
          })
          addText(presSlide, slide.intro.paragraphs[0], {
            x: PAGE.x + 0.18,
            y: 1.33,
            w: PAGE.w - 0.36,
            h: 0.24,
            fontSize: 8.5,
          })
          addTileGrid(presSlide, pptx, slide.tiles, {
            y: 2.2,
            h: 2.2,
          })
          return
        }
        if (slide.variant === 'rules') {
          addSectionHeader(presSlide, pptx, slide)
          addText(presSlide, slide.title, {
            x: PAGE.x,
            y: 0.72,
            w: PAGE.w,
            h: 0.26,
            fontFace: theme.fonts.heading,
            fontSize: 22,
            bold: true,
          })
          addCard(presSlide, pptx, PAGE.x, 1.15, PAGE.w, 0.72, {
            fillColor: toneColor('design'),
            fillTransparency: 92,
            lineColor: toneColor('design'),
            lineTransparency: 70,
          })
          addText(presSlide, slide.intro.paragraphs[0], {
            x: PAGE.x + 0.18,
            y: 1.33,
            w: PAGE.w - 0.36,
            h: 0.24,
            fontSize: 8.5,
          })
          addTileGrid(presSlide, pptx, slide.tiles, {
            columns: 2,
            y: 2.15,
            h: 2.0,
          })
          addEmphasisBox(presSlide, pptx, slide.emphasis, 5.9, 0.58)
          return
        }
      }
      return
    case SLIDE_TYPES.checklist:
      addSectionHeader(presSlide, pptx, slide)
      addText(presSlide, slide.title, {
        x: PAGE.x,
        y: 0.72,
        w: PAGE.w,
        h: 0.26,
        fontFace: theme.fonts.heading,
        fontSize: 22,
        bold: true,
      })
      if (slide.intro) {
        addCard(presSlide, pptx, PAGE.x, 1.05, PAGE.w, 0.7, {
          fillColor:
            slide.section?.tone === 'section2'
              ? toneColor('test')
              : slide.section?.tone === 'section3'
                ? toneColor('design')
                : toneColor('plan'),
          fillTransparency: 92,
          lineColor:
            slide.section?.tone === 'section2'
              ? toneColor('test')
              : slide.section?.tone === 'section3'
                ? toneColor('design')
                : toneColor('plan'),
          lineTransparency: 70,
        })
        addText(presSlide, slide.intro.paragraphs.join('\n'), {
          x: PAGE.x + 0.18,
          y: 1.22,
          w: PAGE.w - 0.36,
          h: 0.3,
          fontSize: 8.2,
        })
      }
      if (slide.exampleLabel) {
        addText(presSlide, slide.exampleLabel, {
          x: PAGE.x,
          y: 1.82,
          w: PAGE.w,
          h: 0.14,
          fontSize: 8,
          color: toPptxColor(theme.colors.textSecondary),
        })
      }
      if (slide.tiles) {
        addTileGrid(presSlide, pptx, slide.tiles, {
          y: 2.05,
          h: 1.2,
        })
      }
      addChecklistGroups(presSlide, pptx, slide)
      if (slide.emphasis) {
        addEmphasisBox(presSlide, pptx, slide.emphasis, slide.tiles ? 6.18 : 6.1, 0.55)
      }
      return
    case SLIDE_TYPES.docPreview:
      return renderDocPreview(slide, pptx, presSlide)
    case SLIDE_TYPES.workflowCompare:
      return renderWorkflowCompare(slide, pptx, presSlide)
    case SLIDE_TYPES.phaseDeepDive:
      return renderPhaseDeepDive(slide, pptx, presSlide)
    case SLIDE_TYPES.phaseDeepDiveSplit:
      return renderPhaseDeepDiveSplit(slide, pptx, presSlide)
    case SLIDE_TYPES.solutionImpact:
      return renderSolutionImpact(slide, pptx, presSlide)
    case SLIDE_TYPES.mediaExample:
      return renderMediaSlide(slide, pptx, presSlide)
    case SLIDE_TYPES.mediaFullBleed:
      return renderMediaSlide(slide, pptx, presSlide, true)
    case SLIDE_TYPES.contextSplit:
      return renderContextSplit(slide, pptx, presSlide)
    case SLIDE_TYPES.twoColumnCycle:
      return renderTwoColumnCycle(slide, pptx, presSlide)
    case SLIDE_TYPES.videoPlaceholder:
      return renderVideoPlaceholder(slide, pptx, presSlide)
    case SLIDE_TYPES.workflowColumns:
      return renderWorkflowColumns(slide, pptx, presSlide)
    case SLIDE_TYPES.browserDemo:
      return renderBrowserDemo(slide, pptx, presSlide)
    case SLIDE_TYPES.beforeAfter:
      return renderBeforeAfter(slide, pptx, presSlide)
    case SLIDE_TYPES.quote:
      return renderQuote(slide, pptx, presSlide)
    case SLIDE_TYPES.realWorldPanels:
      return renderRealWorldPanels(slide, pptx, presSlide)
    default:
      addText(presSlide, slide.title ?? slide.slug ?? 'Slide', {
        x: PAGE.x,
        y: 0.72,
        w: PAGE.w,
        h: 0.26,
        fontFace: theme.fonts.heading,
        fontSize: 22,
        bold: true,
      })
      addText(presSlide, JSON.stringify(slide, null, 2), {
        x: PAGE.x,
        y: 1.2,
        w: PAGE.w,
        h: 5.6,
        fontFace: theme.fonts.mono,
        fontSize: 7,
      })
  }
}

export function renderSlidesToPptx(pptx, slides = deckSlides) {
  slides.forEach((slide) => {
    const presSlide = pptx.addSlide({ masterName: slide.master })
    renderSlideByType(pptx, presSlide, slide)
  })
}

export function buildDeckPresentation(PptxGenJS, slides = deckSlides) {
  const pptx = new PptxGenJS()
  defineDeckMasters(pptx)
  renderSlidesToPptx(pptx, slides)
  return pptx
}
