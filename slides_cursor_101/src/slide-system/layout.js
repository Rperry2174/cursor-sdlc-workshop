import { theme } from './theme.js'

export const PIXELS_PER_INCH = 100
export const POINTS_PER_PIXEL = 96 / 72
export const STAGE_FONT_SCALE = theme.scales?.stageText ?? 1

export const STAGE = {
  width: theme.layout.width,
  height: theme.layout.height,
  widthPx: Math.round(theme.layout.width * PIXELS_PER_INCH),
  heightPx: Math.round(theme.layout.height * PIXELS_PER_INCH),
}

export const PAGE = {
  x: theme.layout.contentX,
  y: theme.layout.contentY,
  w: theme.layout.contentW,
  h: 6.45,
}

export const LAYOUT = {
  titleHero: {
    badge: { x: 5.05, y: 0.9, w: 3.2, h: 0.3 },
    title: { x: 1.5, y: 1.7, w: 10.3, h: 0.6 },
    tagline: { x: 2.2, y: 2.6, w: 8.9, h: 0.25 },
    pillY: 4.05,
    pillW: 2.6,
    pillH: 0.52,
    pillGap: 0.35,
    decorationA: { x: 10.65, y: -0.45, w: 1.85, h: 1.85 },
    decorationB: { x: 0.9, y: 5.95, w: 1.45, h: 1.45 },
    decorationC: { x: 10.15, y: 2.35, w: 0.95, h: 0.95 },
  },
  sectionHeader: {
    x: PAGE.x,
    y: 0.28,
    h: 0.34,
    badgeW: 1.4,
    preworkBadgeW: 1.25,
    badgeTextInsetX: 0.08,
    badgeTextY: 0.345,
    badgeTextH: 0.15,
    phaseBadgeOffsetX: 1.58,
    phaseBadgeY: 0.34,
    phaseBadgeW: 5.5,
    phaseBadgeH: 0.16,
  },
  phaseHeader: {
    circle: { x: PAGE.x, size: 0.34 },
    titleOffsetX: 0.46,
    titleY: 0.48,
    subtitleOffsetY: 0.42,
  },
  heroCallout: {
    x: 0.85,
    w: 11.65,
    h: 0.72,
    textX: 1.1,
    textOffsetY: 0.18,
    textW: 11.15,
    textH: 0.28,
  },
  takeaway: {
    title: { x: PAGE.x, y: 0.72, w: PAGE.w, h: 0.26 },
    heroY: 1.15,
    tiles: {
      x: PAGE.x,
      y: 2.1,
      w: PAGE.w,
      columns: 3,
      gap: 0.25,
      h: 2.34,
      hWithDiscovery: 1.9,
    },
    discovery: {
      frame: { x: PAGE.x, y: 4.35, w: PAGE.w, h: 1.2 },
      label: { x: PAGE.x + 0.16, y: 4.48, w: PAGE.w - 0.3, h: 0.16 },
      groupsY: 4.73,
      pillsY: 4.95,
      gap: 0.3,
      padX: 0.16,
    },
    emphasis: {
      y: 5.16,
      h: 0.74,
      yWithDiscovery: 5.82,
      hWithDiscovery: 0.63,
    },
  },
  sdlc: {
    title: { x: PAGE.x, y: 0.56, w: PAGE.w, h: 0.34 },
    flowX: 0.85,
    flowY: 1.22,
    gap: 0.15,
    itemH: 2.95,
    arrowY: 2.6,
    monitor: { x: 9.2, y: 4.72, w: 3.2, h: 1.45 },
    footer: { x: PAGE.x, y: 6.48, w: PAGE.w, h: 0.22 },
  },
  phaseDeepDive: {
    headerPill: { x: 9.55, y: 0.46, w: 2.85, h: 0.42 },
    discoveryTitle: { x: PAGE.x, y: 1.02, w: 4.3, h: 0.22 },
    discovery: { x: PAGE.x, y: 1.34, w: 4.55, h: 0.74, gap: 0.82 },
    connectorArrow: { x: 5.18, y: 3.18, w: 0.42, h: 0.34 },
    connectorLabel: { x: 4.78, y: 3.58, w: 1.3, h: 0.22 },
    painTitle: { x: 5.82, y: 1.02, w: 4.45, h: 0.22 },
    pain: { x: 5.82, y: 1.34, w: 6.28, h: 0.78, gap: 0.84 },
    footer: { y: 5.9, h: 0.78 },
  },
  workflowCompare: {
    title: { x: PAGE.x, y: 0.72, w: PAGE.w, h: 0.28 },
    rowY: 1.38,
    rowGap: 2.38,
    rowLabel: { x: PAGE.x, w: 0.95, h: 0.18 },
    cardX: 1.55,
    cardW: 2.8,
    cardH: 1.58,
    cardGap: 0.82,
    arrowOffsetX: 2.95,
    arrowY: 0.65,
    emphasis: { y: 6.18, h: 0.62 },
  },
  workflowColumns: {
    analogyTimeline: {
      rowY: 1.36,
      rowGap: 2.16,
      row: { x: PAGE.x, w: PAGE.w, h: 1.78 },
      label: { offsetX: 0.18, offsetY: 0.16, w: 2.0, h: 0.14 },
      badge: { offsetX: 1.72, offsetY: 0.16, w: 2.2, h: 0.14 },
      stepX: 0.6,
      stepY: 0.56,
      stepW: 1.58,
      stepH: 0.74,
      stepGap: 1.72,
      stepTextInsetX: 0.08,
      stepTextInsetY: 0.22,
      stepTextW: 1.42,
      stepTextH: 0.26,
      arrowOffsetX: 1.6,
      arrowOffsetY: 0.84,
      insightY: 5.92,
      insightW: 5.55,
      insightH: 0.9,
      insightGapX: 0.4,
      insightRightX: 6.55,
    },
    evolution: {
      colW: 3.72,
      colGap: 0.22,
      colY: 1.3,
      colH: 5.02,
      titleInsetX: 0.18,
      titleY: 1.5,
      titleH: 0.22,
      subtitleY: 1.78,
      subtitleH: 0.18,
      stepInsetX: 0.16,
      stepY: 2.08,
      stepGap: 0.78,
      stepH: 0.66,
      stepTextInsetX: 0.14,
      stepTextInsetY: 0.21,
      stepTextH: 0.22,
      footerInsetX: 0.2,
      footerY: 5.68,
      footerH: 0.38,
      emphasis: { y: 6.42, h: 0.48 },
    },
  },
  browserDemo: {
    title: { x: PAGE.x, y: 0.72, w: PAGE.w, h: 0.26 },
    subtitle: { x: 1.5, y: 1.08, w: 10.3, h: 0.18 },
    frame: { x: 2.0, y: 1.45, w: 9.3, h: 3.95 },
    chromeBarH: 0.36,
    urlBar: { x: 0.64, y: 0.08, h: 0.2, insetRight: 0.18 },
    emphasis: { y: 5.8, h: 0.68 },
  },
}

export function toStagePixels(inches) {
  return inches * PIXELS_PER_INCH
}

export function toStageFontSize(points) {
  return (
    Math.max(points * STAGE_FONT_SCALE, theme.sizes.minText) *
    POINTS_PER_PIXEL
  )
}

export function stageRectStyle(rect) {
  return {
    position: 'absolute',
    left: `${toStagePixels(rect.x)}px`,
    top: `${toStagePixels(rect.y)}px`,
    width: `${toStagePixels(rect.w)}px`,
    height: `${toStagePixels(rect.h)}px`,
  }
}

export function stageTextStyle(rect, fontSize, options = {}) {
  return {
    ...stageRectStyle(rect),
    margin: 0,
    fontSize: `${toStageFontSize(fontSize)}px`,
    lineHeight: options.lineHeight ?? 1.3,
    textAlign: options.align ?? 'left',
    fontWeight: options.bold ? 700 : 400,
    whiteSpace: options.whiteSpace ?? 'pre-wrap',
    color: options.color,
    display: 'flex',
    alignItems: options.vAlign ?? 'flex-start',
    justifyContent:
      options.align === 'center'
        ? 'center'
        : options.align === 'right'
          ? 'flex-end'
          : 'flex-start',
    ...options.style,
  }
}

export function getSectionBadgeWidth(tone) {
  return tone === 'prework'
    ? LAYOUT.sectionHeader.preworkBadgeW
    : LAYOUT.sectionHeader.badgeW
}

export function getTileGridFrames(count, options = {}) {
  const columns = options.columns ?? LAYOUT.takeaway.tiles.columns
  const x = options.x ?? PAGE.x
  const y = options.y ?? LAYOUT.takeaway.tiles.y
  const w = options.w ?? PAGE.w
  const h = options.h ?? LAYOUT.takeaway.tiles.h
  const gap = options.gap ?? LAYOUT.takeaway.tiles.gap
  const tileW = (w - gap * (columns - 1)) / columns

  return Array.from({ length: count }, (_, index) => {
    const column = index % columns
    const row = Math.floor(index / columns)

    return {
      x: x + column * (tileW + gap),
      y: y + row * (h + gap),
      w: tileW,
      h,
    }
  })
}

export function getSdlcBoxWidth() {
  const totalGap = LAYOUT.sdlc.gap * 5
  return (11.5 - totalGap) / 6
}

export function getSdlcPhaseFrame(index) {
  const boxW = getSdlcBoxWidth()

  return {
    x: LAYOUT.sdlc.flowX + index * (boxW + LAYOUT.sdlc.gap),
    y: LAYOUT.sdlc.flowY,
    w: boxW,
    h: LAYOUT.sdlc.itemH,
  }
}

export function getWorkflowCompareStepFrame(rowIndex, stepIndex) {
  const rowY = LAYOUT.workflowCompare.rowY + rowIndex * LAYOUT.workflowCompare.rowGap
  const x =
    LAYOUT.workflowCompare.cardX +
    stepIndex * (LAYOUT.workflowCompare.cardW + LAYOUT.workflowCompare.cardGap)

  return {
    x,
    y: rowY,
    w: LAYOUT.workflowCompare.cardW,
    h: LAYOUT.workflowCompare.cardH,
  }
}

export function getAnalogyTimelineRowFrame(rowIndex) {
  return {
    x: LAYOUT.workflowColumns.analogyTimeline.row.x,
    y: LAYOUT.workflowColumns.analogyTimeline.rowY + rowIndex * LAYOUT.workflowColumns.analogyTimeline.rowGap,
    w: LAYOUT.workflowColumns.analogyTimeline.row.w,
    h: LAYOUT.workflowColumns.analogyTimeline.row.h,
  }
}

export function getAnalogyTimelineStepFrame(stepIndex, rowIndex = 0) {
  const row = getAnalogyTimelineRowFrame(rowIndex)
  return {
    x: LAYOUT.workflowColumns.analogyTimeline.stepX + stepIndex * LAYOUT.workflowColumns.analogyTimeline.stepGap,
    y: row.y + LAYOUT.workflowColumns.analogyTimeline.stepY,
    w: LAYOUT.workflowColumns.analogyTimeline.stepW,
    h: LAYOUT.workflowColumns.analogyTimeline.stepH,
  }
}

export function getAnalogyTimelineTestingArrow(
  rowIndex,
  { targetGapAfterStepIndex = 2, sourceStepIndex = 6 } = {},
) {
  const row = getAnalogyTimelineRowFrame(rowIndex)
  const targetStep = getAnalogyTimelineStepFrame(targetGapAfterStepIndex, rowIndex)
  const sourceStep = getAnalogyTimelineStepFrame(sourceStepIndex, rowIndex)
  const stepGap =
    LAYOUT.workflowColumns.analogyTimeline.stepGap -
    LAYOUT.workflowColumns.analogyTimeline.stepW

  return {
    startX: sourceStep.x + sourceStep.w * 0.58,
    startY: sourceStep.y,
    elbowY: row.y + 0.24,
    targetX: targetStep.x + targetStep.w + stepGap / 2,
    targetY: row.y + 0.54,
  }
}

export function getWorkflowEvolutionColumnFrame(index) {
  return {
    x: PAGE.x + index * (LAYOUT.workflowColumns.evolution.colW + LAYOUT.workflowColumns.evolution.colGap),
    y: LAYOUT.workflowColumns.evolution.colY,
    w: LAYOUT.workflowColumns.evolution.colW,
    h: LAYOUT.workflowColumns.evolution.colH,
  }
}
