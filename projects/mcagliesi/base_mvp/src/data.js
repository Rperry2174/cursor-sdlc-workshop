/** Demo-only placeholder data (not real analysis). */

export const SEASON_LABEL = '2024–25 (sample)'

export const SHAPES = [
  {
    id: '325',
    name: '3-2-5 buildup',
    text: 'Three CBs, double pivot, five high — typical deep buildup vs a high line.',
  },
  {
    id: '235',
    name: '2-3-5 attack',
    text: 'Two build players with a front five pinning the last line.',
  },
  {
    id: '424p',
    name: '4-2-4 press',
    text: 'Front four staggered to cover lanes; second line screens central access.',
  },
  {
    id: '442b',
    name: '4-4-2 block',
    text: 'Two compact banks of four; wide mids tuck to deny half-spaces.',
  },
  {
    id: 'rest32',
    name: '3+2 rest defense',
    text: 'Three defenders + two mids stay goal-side while the attack develops.',
  },
]

function shapeLabel(id) {
  return SHAPES.find((s) => s.id === id)?.name ?? id
}

export const MATCHES = [
  {
    id: 'm1',
    opponent: 'Manchester City',
    competition: 'Premier League',
    venue: 'H',
    date: '2024-11-30',
    score: [2, 0],
    fingerprint: '3-2-5 · 4-2-4 press · rest 3+2',
    segments: [
      {
        start: 0,
        end: 24,
        context: 'Level 0-0',
        phase: 'Buildup',
        inShape: '325',
        outShape: '424p',
        trigger: 'Kickoff plan',
        roles: ['RB inverts as 3rd CB', 'Double pivot staggered'],
        confidence: 'high',
      },
      {
        start: 24,
        end: 45,
        context: 'Level 0-0',
        phase: 'High press',
        inShape: '235',
        outShape: '424p',
        trigger: 'City buildup rhythm',
        roles: ['Front four jump on GK', 'Wide traps'],
        confidence: 'medium',
      },
      {
        start: 45,
        end: 70,
        context: 'Leading 1-0',
        phase: 'Settled attack + rest',
        inShape: '235',
        outShape: 'rest32',
        trigger: 'Goal',
        roles: ['3+2 behind ball in settled attack'],
        confidence: 'high',
      },
      {
        start: 70,
        end: 95,
        context: 'Leading 2-0',
        phase: 'Low block spells',
        inShape: '325',
        outShape: '442b',
        trigger: 'Second goal; game management',
        roles: ['Narrow mids', 'ST splits pivot'],
        confidence: 'medium',
      },
    ],
  },
  {
    id: 'm2',
    opponent: 'Arsenal',
    competition: 'Premier League',
    venue: 'A',
    date: '2024-12-21',
    score: [1, 1],
    fingerprint: '4-4-2 block · counter-press moments',
    segments: [
      {
        start: 0,
        end: 35,
        context: 'Level 0-0',
        phase: 'Buildup',
        inShape: '325',
        outShape: '424p',
        trigger: 'Away plan',
        roles: ['6 drops between CBs'],
        confidence: 'high',
      },
      {
        start: 35,
        end: 55,
        context: 'Trailing 0-1',
        phase: 'Defensive transition',
        inShape: '325',
        outShape: '442b',
        trigger: 'Conceded',
        roles: ['Quick 4-5-1-style drop'],
        confidence: 'medium',
      },
      {
        start: 55,
        end: 90,
        context: 'Level 1-1',
        phase: 'Mixed press / block',
        inShape: '235',
        outShape: '442b',
        trigger: 'Equalizer',
        roles: ['Selective jumps on CB carries'],
        confidence: 'medium',
      },
    ],
  },
  {
    id: 'm3',
    opponent: 'Leverkusen',
    competition: 'Champions League',
    venue: 'H',
    date: '2025-01-21',
    score: [4, 1],
    fingerprint: '2-3-5 · 3-2-5 · high press',
    segments: [
      {
        start: 0,
        end: 30,
        context: 'Level 0-0',
        phase: 'Press + buildup',
        inShape: '325',
        outShape: '424p',
        trigger: 'Opening tempo',
        roles: ['Man-oriented jumps wide'],
        confidence: 'medium',
      },
      {
        start: 30,
        end: 60,
        context: 'Leading 2-0',
        phase: 'Settled attack',
        inShape: '235',
        outShape: 'rest32',
        trigger: 'Two-goal cushion',
        roles: ['Front five pins line', '3+2 rest'],
        confidence: 'high',
      },
      {
        start: 60,
        end: 93,
        context: 'Leading 3-1',
        phase: 'Low block / counters',
        inShape: '325',
        outShape: '442b',
        trigger: 'Second half',
        roles: ['Safer central exits'],
        confidence: 'low',
      },
    ],
  },
]

export { shapeLabel }
