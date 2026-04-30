const SCHEDULE = [
  { time: '7:00',  label: 'Wake + Bottle',    type: 'bottle',  detail: '8 oz' },
  { time: '8:30',  label: 'Solids Meal #1',   type: 'solids' },
  { time: '9:00',  label: 'Nap 1 starts',     type: 'nap-start' },
  { time: '10:30', label: 'Nap 1 ends',       type: 'nap-end' },
  { time: '11:00', label: 'Bottle',           type: 'bottle',  detail: '8 oz' },
  { time: '12:30', label: 'Nap 2 starts',     type: 'nap-start' },
  { time: '14:00', label: 'Nap 2 ends',       type: 'nap-end' },
  { time: '15:00', label: 'Bottle',           type: 'bottle',  detail: '8 oz' },
  { time: '16:00', label: 'Nap 3 starts',     type: 'nap-start' },
  { time: '16:45', label: 'Nap 3 ends',       type: 'nap-end' },
  { time: '17:00', label: 'Solids Meal #2',   type: 'solids' },
  { time: '18:30', label: 'Wind-down',        type: 'wind-down' },
  { time: '19:00', label: 'Bottle / Bedtime', type: 'bedtime', detail: '8 oz' },
]

export function parseTime(timeStr) {
  const [h, m] = timeStr.split(':').map(Number)
  return h * 60 + m
}

export function getCurrentActivity(now) {
  const mins = now.getHours() * 60 + now.getMinutes()

  for (let i = SCHEDULE.length - 1; i >= 0; i--) {
    if (mins >= parseTime(SCHEDULE[i].time)) {
      const current = SCHEDULE[i]
      const next = SCHEDULE[i + 1] || null
      return { current, next, index: i }
    }
  }

  return { current: null, next: SCHEDULE[0], index: -1 }
}

export function getMinutesUntil(now, timeStr) {
  const nowMins = now.getHours() * 60 + now.getMinutes()
  const targetMins = parseTime(timeStr)
  return targetMins - nowMins
}

export function formatCountdown(totalMinutes) {
  if (totalMinutes <= 0) return 'now'
  const h = Math.floor(totalMinutes / 60)
  const m = totalMinutes % 60
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

export function formatTimeDisplay(timeStr) {
  const [h, m] = timeStr.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const hour12 = h % 12 || 12
  return `${hour12}:${String(m).padStart(2, '0')} ${ampm}`
}

export default SCHEDULE
