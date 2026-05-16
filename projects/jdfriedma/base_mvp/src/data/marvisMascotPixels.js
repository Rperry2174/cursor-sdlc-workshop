/**
 * Low-res pixel mascot: bureaucratic pig in a suit (Papers, Please–style palette).
 * Grid: 34×40. Characters map to flat fills — no anti-aliasing; crisp SVG rects.
 *
 * Silhouette: distinct ears, flat snout with nostrils, suit lapels + tie + collar.
 *
 * Keys:
 *   .  transparent
 *   p  muddy pink skin       P  ear inner / cheek shadow
 *   n  snout / muzzle
 *   o  nostrils
 *   e  eyes
 *   s  suit (dark)           S  lapel / edge highlight
 *   w  dingy shirt          t  tie (drab burgundy)
 */

export const MARVIS_MASCOT_WIDTH = 34
export const MARVIS_MASCOT_HEIGHT = 40

export const MARVIS_MASCOT_COLORS = {
  '.': 'transparent',
  p: '#b0a0a0',
  P: '#6a5a58',
  n: '#9a8888',
  o: '#1e1816',
  e: '#0c0a0a',
  s: '#232a30',
  S: '#4a545c',
  w: '#c8c4bc',
  t: '#3a2828',
}

/** @type {string[]} */
export const MARVIS_MASCOT_ROWS = [
  '..........pp...........pp.........',
  '.......ppppp...........ppppp......',
  '.......pPPPp...........pPPPp......',
  '........PPPp..........ppPPPp......',
  '........PPPp..........ppPPPp......',
  '.........ppp.........ppppppp......',
  '...........ppppppppppppp..........',
  '...........ppppppppppppp..........',
  '...........ppppppppppppp..........',
  '..........pppeepppppeeppp.........',
  '..........pppeepppppeeppp.........',
  '..........ppppppppppppppp.........',
  '..........pppnnnnnnnnnppp.........',
  '...........PpnnnnnnnnnpP..........',
  '............PpnnooonnnpP..........',
  '...........PpnnnnnnnnnpP..........',
  '............ppppppppppp...........',
  '..........wwwwwwwwwwwwwww.........',
  '..........wwwwwwwwwwwwwww.........',
  '..........w.............w.........',
  '....sssssssssSwwwwwwsSssssssss....',
  '....sssssssssSwwttwwwSssssssss....',
  '....sssssssssSwwttwwsSssssssss....',
  '....sssssssssSwwttwwsSssssssss....',
  '....sssssssssSwwttwwsSssssssss....',
  '....sssssssssSwwttwwSSssssssss....',
  '....sssssssssswwttwwssssssssss....',
  '....sssssssssswwttwwssssssssss....',
  '....sssssssssswwttwwssssssssss....',
  '....sssssssssswwttwwssssssssss....',
  '....sssssssssswwttwwssssssssss....',
  '....ssssssssssssssssssssssssss....',
  '.....ssssssssssssssssssssssss.....',
  '.....ssssssssssssssssssssssss.....',
  '.....ssssssssssssssssssssssss.....',
  '.....ssssssssssssssssssssssss.....',
  '.....ssssssssssssssssssssssss.....',
  '.....ssssssssssssssssssssssss.....',
  '..................................',
  '..................................',
]

if (import.meta.env?.DEV) {
  MARVIS_MASCOT_ROWS.forEach((row, i) => {
    if (row.length !== MARVIS_MASCOT_WIDTH) {
      console.error(
        `[MarvisMascot] row ${i} length ${row.length}, expected ${MARVIS_MASCOT_WIDTH}`,
      )
    }
  })
  if (MARVIS_MASCOT_ROWS.length !== MARVIS_MASCOT_HEIGHT) {
    console.error(
      `[MarvisMascot] row count ${MARVIS_MASCOT_ROWS.length}, expected ${MARVIS_MASCOT_HEIGHT}`,
    )
  }
}

/** Precomputed SVG rects (one unit square per pixel). */
export const MARVIS_MASCOT_RECTS = (() => {
  const out = []
  MARVIS_MASCOT_ROWS.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const ch = row[x]
      const fill = MARVIS_MASCOT_COLORS[ch]
      if (!fill || fill === 'transparent') continue
      out.push({ x, y, fill, key: `${x}-${y}` })
    }
  })
  return out
})()
