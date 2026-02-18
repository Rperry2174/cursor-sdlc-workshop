import { useState, useEffect, useRef } from 'react'
import './App.css'

function nextId(prefix = 'id') {
  return `${prefix}-${Date.now()}`
}

function getScheduledAt(dateStr, timeStr) {
  if (!dateStr || !timeStr) return null
  const [year, month, day] = dateStr.split('-').map(Number)
  const [hours, minutes] = timeStr.split(':').map(Number)
  return new Date(year, month - 1, day, hours, minutes, 0)
}

function App() {
  const [followUps, setFollowUps] = useState([])
  const [outreachByWeek, setOutreachByWeek] = useState([])
  const [remindedIds, setRemindedIds] = useState(() => new Set())
  const [reminderToast, setReminderToast] = useState(null)
  const notificationPermission = useRef(null)

  // Follow-up form state
  const [followUpDate, setFollowUpDate] = useState('')
  const [followUpTime, setFollowUpTime] = useState('')
  const [followUpTouchPoint, setFollowUpTouchPoint] = useState('1')
  const [followUpNote, setFollowUpNote] = useState('')

  // Outreach form state
  const [outreachWeek, setOutreachWeek] = useState('')
  const [outreachAccount, setOutreachAccount] = useState('')
  const [outreachNotes, setOutreachNotes] = useState('')

  const touchPointLabels = { '1': '1st', '2': '2nd', '3': '3rd' }

  function handleAddFollowUp(e) {
    e.preventDefault()
    if (!followUpDate.trim() || !followUpTime.trim() || !followUpNote.trim()) return
    setFollowUps((prev) => [
      ...prev,
      {
        id: nextId('fu'),
        date: followUpDate.trim(),
        time: followUpTime.trim(),
        touchPoint: followUpTouchPoint,
        note: followUpNote.trim(),
      },
    ])
    setFollowUpDate('')
    setFollowUpTime('')
    setFollowUpTouchPoint('1')
    setFollowUpNote('')
  }

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then((p) => {
        notificationPermission.current = p
      })
    } else if ('Notification' in window) {
      notificationPermission.current = Notification.permission
    }
  }, [])

  // Check for due follow-ups every 30 seconds and show reminders
  useEffect(() => {
    if (followUps.length === 0) return
    const tick = () => {
      const now = new Date()
      followUps.forEach((fu) => {
        if (remindedIds.has(fu.id)) return
        const scheduled = getScheduledAt(fu.date, fu.time)
        if (!scheduled) return
        if (scheduled.getTime() <= now.getTime()) {
          setRemindedIds((prev) => new Set(prev).add(fu.id))
          const touchLabel = touchPointLabels[fu.touchPoint] ?? fu.touchPoint
          const title = 'Follow-up due'
          const body = `${touchLabel} touch · ${fu.date} ${fu.time} — ${fu.note}`
          if ('Notification' in window && notificationPermission.current === 'granted') {
            new Notification(title, { body })
          }
          setReminderToast({ id: fu.id, note: fu.note, date: fu.date, time: fu.time, touchPoint: touchPointLabels[fu.touchPoint] ?? fu.touchPoint })
        }
      })
    }
    tick()
    const id = setInterval(tick, 30 * 1000)
    return () => clearInterval(id)
  }, [followUps, remindedIds])

  function handleAddOutreach(e) {
    e.preventDefault()
    if (!outreachWeek.trim() || !outreachAccount.trim()) return
    const weekLabel = outreachWeek.trim()
    const weekKey = weekLabel.replace(/\s+/g, '-').toLowerCase() || nextId('w')
    const newEntry = {
      id: nextId('o'),
      account: outreachAccount.trim(),
      notes: outreachNotes.trim(),
    }
    setOutreachByWeek((prev) => {
      const existing = prev.find((w) => w.weekLabel === weekLabel)
      if (existing) {
        return prev.map((w) =>
          w.weekLabel === weekLabel
            ? { ...w, entries: [...w.entries, newEntry] }
            : w
        )
      }
      return [...prev, { weekLabel, weekKey, entries: [newEntry] }].sort(
        (a, b) => a.weekLabel.localeCompare(b.weekLabel)
      )
    })
    setOutreachWeek('')
    setOutreachAccount('')
    setOutreachNotes('')
  }

  function dismissReminder() {
    setReminderToast(null)
  }

  // Auto-dismiss in-app toast after 15 seconds
  useEffect(() => {
    if (!reminderToast) return
    const t = setTimeout(() => setReminderToast(null), 15 * 1000)
    return () => clearTimeout(t)
  }, [reminderToast])

  return (
    <div className="app">
      {reminderToast && (
        <div className="reminder-toast" role="alert">
          <div className="reminder-toast-content">
            <strong>Reminder</strong>
            <span className="reminder-toast-meta">
              {reminderToast.touchPoint && `${reminderToast.touchPoint} touch · `}
              {reminderToast.date} at {reminderToast.time}
            </span>
            <p className="reminder-toast-note">{reminderToast.note}</p>
          </div>
          <button
            type="button"
            className="reminder-toast-dismiss"
            onClick={dismissReminder}
            aria-label="Dismiss reminder"
          >
            Dismiss
          </button>
        </div>
      )}
      <header className="app-header">
        <h1>LinkedIn Tracker</h1>
        <p className="tagline">Follow-ups & outreach by week</p>
      </header>

      <main className="app-main">
        <section className="section section-follow-ups">
          <h2>Follow-ups</h2>
          <p className="section-desc">Scheduled by date & time. You’ll get a reminder (and optional browser notification) when the time comes.</p>

          <form className="form form-follow-up" onSubmit={handleAddFollowUp}>
            <label className="form-label">
              Date
              <input
                type="date"
                className="form-input"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                required
              />
            </label>
            <label className="form-label">
              Time
              <input
                type="time"
                className="form-input"
                value={followUpTime}
                onChange={(e) => setFollowUpTime(e.target.value)}
                required
              />
            </label>
            <label className="form-label">
              Touch point
              <select
                className="form-input"
                value={followUpTouchPoint}
                onChange={(e) => setFollowUpTouchPoint(e.target.value)}
                aria-label="Follow-up touch point"
              >
                <option value="1">1st</option>
                <option value="2">2nd</option>
                <option value="3">3rd</option>
              </select>
            </label>
            <label className="form-label form-label-full">
              Note
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Follow up with Jane at Acme"
                value={followUpNote}
                onChange={(e) => setFollowUpNote(e.target.value)}
                required
              />
            </label>
            <button type="submit" className="form-submit">
              Add follow-up
            </button>
          </form>

          <ul className="follow-up-list" aria-label="Follow-up list">
            {followUps.length === 0 ? (
              <li className="list-empty">No follow-ups yet. Add one above.</li>
            ) : (
              followUps.map((item) => (
                <li key={item.id} className="follow-up-item">
                  <span className="follow-up-touch">{touchPointLabels[item.touchPoint] ?? '—'}</span>
                  <span className="follow-up-date">{item.date}</span>
                  <span className="follow-up-time">{item.time}</span>
                  <span className="follow-up-note">{item.note}</span>
                </li>
              ))
            )}
          </ul>
        </section>

        <section className="section section-outreach">
          <h2>Outreach by week</h2>
          <p className="section-desc">Accounts reached out to, with notes</p>

          <form className="form form-outreach" onSubmit={handleAddOutreach}>
            <label className="form-label form-label-full">
              Week
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Week of Feb 17, 2025"
                value={outreachWeek}
                onChange={(e) => setOutreachWeek(e.target.value)}
                required
              />
            </label>
            <label className="form-label form-label-full">
              Account
              <input
                type="text"
                className="form-input"
                placeholder="Company or contact name"
                value={outreachAccount}
                onChange={(e) => setOutreachAccount(e.target.value)}
                required
              />
            </label>
            <label className="form-label form-label-full">
              Notes
              <textarea
                className="form-input form-textarea"
                placeholder="What you did or next steps"
                value={outreachNotes}
                onChange={(e) => setOutreachNotes(e.target.value)}
                rows={2}
              />
            </label>
            <button type="submit" className="form-submit">
              Add outreach
            </button>
          </form>

          {outreachByWeek.length === 0 ? (
            <p className="list-empty">No outreach yet. Add one above.</p>
          ) : (
            outreachByWeek.map((week) => (
              <div key={week.weekKey} className="week-block">
                <h3 className="week-label">{week.weekLabel}</h3>
                <ul className="outreach-list" aria-label={`Outreach for ${week.weekLabel}`}>
                  {week.entries.map((entry) => (
                    <li key={entry.id} className="outreach-item">
                      <strong className="outreach-account">{entry.account}</strong>
                      <span className="outreach-notes">{entry.notes || '—'}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  )
}

export default App
