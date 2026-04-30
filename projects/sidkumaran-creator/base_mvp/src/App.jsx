import { useState, useEffect, useMemo } from 'react'
import SCHEDULE, {
  getCurrentActivity,
  getMinutesUntil,
  formatCountdown,
  formatTimeDisplay,
} from './data/schedule'
import { suggestSolids } from './data/foods'

const TYPE_EMOJI = {
  'bottle': '🍼',
  'solids': '🥄',
  'nap-start': '😴',
  'nap-end': '☀️',
  'wind-down': '🌙',
  'bedtime': '🛏️',
}

function CurrentActivity({ current, next, now }) {
  if (!current) {
    return (
      <div className="hero">
        <div className="hero-emoji">🌅</div>
        <h1 className="hero-label">Before wake-up</h1>
        {next && (
          <p className="hero-countdown">
            First up at {formatTimeDisplay(next.time)}
          </p>
        )}
      </div>
    )
  }

  const emoji = TYPE_EMOJI[current.type] || '📋'
  const isNapping = current.type === 'nap-start'
  const isBedtime = current.type === 'bedtime'

  let statusText = current.label
  if (isNapping) statusText = current.label.replace(' starts', '')
  if (current.detail) statusText += ` (${current.detail})`

  return (
    <div className="hero">
      <div className="hero-emoji">{emoji}</div>
      <h1 className="hero-label">{statusText}</h1>
      {next ? (
        <p className="hero-countdown">
          Next: {next.label} in{' '}
          <strong>{formatCountdown(getMinutesUntil(now, next.time))}</strong>
        </p>
      ) : isBedtime ? (
        <p className="hero-countdown">Goodnight! See you tomorrow.</p>
      ) : null}
    </div>
  )
}

function SolidsCard({ mealNumber }) {
  const suggestion = useMemo(() => suggestSolids(mealNumber), [mealNumber])

  return (
    <div className="solids-card">
      <h3>🥄 Solids Meal #{mealNumber} — Suggestions</h3>
      <ul>
        {suggestion.foods.map((food) => (
          <li key={food}>
            {food}
            {food === suggestion.newFood && <span className="new-badge">NEW</span>}
          </li>
        ))}
      </ul>
      {suggestion.newFood && (
        <p className="solids-note">
          Introduce only 1 new food per day. Watch for reactions.
        </p>
      )}
    </div>
  )
}

function Timeline({ currentIndex }) {
  return (
    <div className="timeline">
      <h2>Today's Schedule</h2>
      <ul>
        {SCHEDULE.map((item, i) => {
          let status = 'upcoming'
          if (i < currentIndex) status = 'done'
          else if (i === currentIndex) status = 'active'

          return (
            <li key={i} className={`timeline-item ${status}`}>
              <span className="timeline-time">
                {formatTimeDisplay(item.time)}
              </span>
              <span className="timeline-dot" />
              <span className="timeline-label">
                {TYPE_EMOJI[item.type] || ''} {item.label}
                {item.detail ? ` (${item.detail})` : ''}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default function App() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 15_000)
    return () => clearInterval(id)
  }, [])

  const { current, next, index } = getCurrentActivity(now)

  return (
    <div className="app">
      <header>
        <h2 className="app-title">BabyNext</h2>
        <span className="clock">{now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </header>

      <CurrentActivity current={current} next={next} now={now} />

      <SolidsCard mealNumber={1} />
      <SolidsCard mealNumber={2} />

      <Timeline currentIndex={index} />
    </div>
  )
}
