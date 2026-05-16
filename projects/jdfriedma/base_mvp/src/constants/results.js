/** Gross WPM and forward-keystroke accuracy thresholds for pass/fail. */

export const MIN_WPM = 30
export const MIN_ACCURACY_PCT = 80

/**
 * @param {number | null} finalWpm gross WPM at end of run
 * @param {number} correct forward correct keystrokes
 * @param {number} total forward keystrokes
 * @returns {boolean}
 */
export function isPass(finalWpm, correct, total) {
  if (finalWpm == null || Number.isNaN(finalWpm)) return false
  if (total <= 0) return false
  const accuracyPct = (correct / total) * 100
  return finalWpm >= MIN_WPM && accuracyPct >= MIN_ACCURACY_PCT
}

export function roundOne(n) {
  return Math.round(n * 10) / 10
}

/**
 * @param {number} correct
 * @param {number} total
 * @returns {number | null}
 */
export function accuracyPercent(correct, total) {
  if (total <= 0) return null
  return roundOne((correct / total) * 100)
}
