/** @typedef {'weekly' | 'monthly'} Cadence */

/**
 * @param {string} iso YYYY-MM-DD
 * @returns {Date} Local calendar date (midnight)
 */
export function parseISODate(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/**
 * @param {Date} d
 * @returns {string} YYYY-MM-DD
 */
export function formatISODate(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** @returns {Date} Today at local midnight */
export function todayDate() {
  const t = new Date()
  return new Date(t.getFullYear(), t.getMonth(), t.getDate())
}

export function todayISODate() {
  return formatISODate(todayDate())
}

/** @param {Date} date
 * @param {number} n
 * @returns {Date}
 */
export function addDays(date, n) {
  const x = new Date(date)
  x.setDate(x.getDate() + n)
  return x
}

/**
 * Next due date after last completion. Monthly cadence uses +30 days (see README).
 * @param {string | null} lastDoneAt ISO or null = never done → due "today"
 * @param {Cadence} cadence
 * @returns {string} YYYY-MM-DD
 */
export function nextDueISO(lastDoneAt, cadence) {
  if (!lastDoneAt) return todayISODate()
  const days = cadence === 'weekly' ? 7 : 30
  return formatISODate(addDays(parseISODate(lastDoneAt), days))
}

/**
 * End of current calendar week (Sunday, local), as a date at midnight.
 * @param {Date} [today]
 * @returns {Date}
 */
export function endOfWeekSunday(today = todayDate()) {
  const dow = today.getDay()
  const daysUntilSun = dow === 0 ? 0 : 7 - dow
  return addDays(today, daysUntilSun)
}

/**
 * @param {string} nextDueISOString
 * @param {Date} [today]
 */
export function isDueOnOrBeforeEndOfWeek(nextDueISOString, today = todayDate()) {
  const end = formatISODate(endOfWeekSunday(today))
  return nextDueISOString <= end
}

/**
 * @param {string} nextDueISOString
 */
export function isOverdue(nextDueISOString) {
  return nextDueISOString < todayISODate()
}

/**
 * @param {string} nextDueISOString
 */
export function isDueToday(nextDueISOString) {
  return nextDueISOString === todayISODate()
}

/**
 * @param {{ lastDoneAt: string | null, cadence: Cadence }} r
 * @returns {string}
 */
export function reminderNextDue(r) {
  return nextDueISO(r.lastDoneAt, r.cadence)
}
