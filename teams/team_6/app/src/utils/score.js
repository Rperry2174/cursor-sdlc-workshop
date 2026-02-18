const POINTS_PER_ITEM = 10
const MAX_SCORE = 100

/**
 * @param {string[]} items
 * @returns {{ score: number, letterGrade: string, itemCount: number, breakdown: string }}
 */
export function calculateScore(items) {
  const valid = items.filter((s) => s.trim().length > 0)
  const raw = valid.length * POINTS_PER_ITEM
  const score = Math.min(raw, MAX_SCORE)
  const letterGrade = score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 60 ? 'D' : 'F'
  const breakdown =
    valid.length === 0
      ? 'No items yet'
      : `${valid.length} item${valid.length === 1 ? '' : 's'} × ${POINTS_PER_ITEM} pts = ${score}`
  return { score, letterGrade, itemCount: valid.length, breakdown }
}
