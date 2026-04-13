export const theme = {
  colors: {
    cursorBlue: '#268bd2',
    cursorDark: '#1f6f9a',
    darkBg: '#ffffff',
    cardBg: '#f7f7f7',
    textPrimary: '#657b83',
    textSecondary: '#93a1a1',
    cyan: '#2aa198',
    green: '#859900',
    orange: '#cb4b16',
    purple: '#6c71c4',
    red: '#dc322f',
    yellow: '#b58900',
    codeBg: '#fdf6e3',
    borderSubtle: 'rgba(101, 123, 131, 0.2)',
    borderStrong: 'rgba(101, 123, 131, 0.35)',
    white: '#ffffff',
    black: '#000000',
  },
  fonts: {
    heading: 'Arial',
    body: 'Arial',
    mono: 'Courier New',
  },
  scales: {
    stageText: 1.22,
    pptText: 1.22,
  },
  sizes: {
    title: 36,
    h1: 32,
    h2: 22,
    h3: 17,
    body: 11,
    small: 9,
    micro: 7,
    pill: 8,
    minText: 10,
    idealText: 12,
  },
  layout: {
    width: 13.333,
    height: 7.5,
    contentX: 0.6,
    contentY: 0.45,
    contentW: 12.1,
    contentH: 6.2,
    titleY: 0.7,
    bodyY: 1.45,
    footerY: 6.8,
  },
}

export const phaseTheme = {
  prework: {
    accent: theme.colors.textSecondary,
    accentSoft: '#e6eaec',
  },
  section1: {
    accent: theme.colors.cyan,
    accentSoft: 'rgba(42, 161, 152, 0.12)',
  },
  section2: {
    accent: theme.colors.orange,
    accentSoft: 'rgba(203, 75, 22, 0.12)',
  },
  section3: {
    accent: theme.colors.purple,
    accentSoft: 'rgba(108, 113, 196, 0.12)',
  },
  plan: {
    accent: theme.colors.cyan,
    accentSoft: 'rgba(42, 161, 152, 0.12)',
  },
  design: {
    accent: theme.colors.purple,
    accentSoft: 'rgba(108, 113, 196, 0.12)',
  },
  develop: {
    accent: theme.colors.cursorBlue,
    accentSoft: 'rgba(38, 139, 210, 0.12)',
  },
  test: {
    accent: theme.colors.orange,
    accentSoft: 'rgba(203, 75, 22, 0.12)',
  },
  review: {
    accent: theme.colors.green,
    accentSoft: 'rgba(133, 153, 0, 0.12)',
  },
  deploy: {
    accent: theme.colors.red,
    accentSoft: 'rgba(220, 50, 47, 0.12)',
  },
  monitor: {
    accent: theme.colors.yellow,
    accentSoft: 'rgba(181, 137, 0, 0.12)',
  },
}

export const pptxTheme = {
  headFontFace: theme.fonts.heading,
  bodyFontFace: theme.fonts.body,
}

export function toPptxColor(color) {
  return color.replace('#', '').toUpperCase()
}

export function toneColor(tone) {
  return phaseTheme[tone]?.accent ?? theme.colors.cursorBlue
}

export function toneSoftColor(tone) {
  return phaseTheme[tone]?.accentSoft ?? 'rgba(38, 139, 210, 0.12)'
}

export function scalePptFontSize(fontSize) {
  return Math.max(
    fontSize * (theme.scales?.pptText ?? 1),
    theme.sizes.minText,
  )
}
