import { useEffect, useState } from 'react'
import DueThisWeek from './components/DueThisWeek.jsx'
import ReminderForm from './components/ReminderForm.jsx'
import ReminderList from './components/ReminderList.jsx'
import { todayISODate } from './reminderUtils.js'
import './App.css'

const STORAGE_KEY = 'plot-garden-reminders'

function newId() {
  return crypto.randomUUID()
}

function isValidReminder(r) {
  return (
    r &&
    typeof r.id === 'string' &&
    typeof r.title === 'string' &&
    r.title.length > 0 &&
    (r.cadence === 'weekly' || r.cadence === 'monthly') &&
    (r.lastDoneAt === null ||
      r.lastDoneAt === undefined ||
      typeof r.lastDoneAt === 'string')
  )
}

function normalizeReminder(r) {
  return {
    id: r.id,
    title: r.title,
    cadence: r.cadence,
    lastDoneAt: r.lastDoneAt || null,
  }
}

function loadReminders() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const data = JSON.parse(raw)
    if (!Array.isArray(data)) return []
    return data.filter(isValidReminder).map(normalizeReminder)
  } catch {
    return []
  }
}

function saveReminders(reminders) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders))
  } catch {
    /* ignore quota / private mode */
  }
}

export default function App() {
  const [reminders, setReminders] = useState(() => loadReminders())

  useEffect(() => {
    saveReminders(reminders)
  }, [reminders])

  function handleAdd({ title, cadence, lastDoneAt }) {
    setReminders((prev) => [
      ...prev,
      { id: newId(), title, cadence, lastDoneAt },
    ])
  }

  function handleMarkDone(id) {
    const done = todayISODate()
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, lastDoneAt: done } : r)),
    )
  }

  function handleRemove(id) {
    setReminders((prev) => prev.filter((r) => r.id !== id))
  }

  return (
    <div className="app">
      <h1>Plot — Garden Tracker</h1>
      <p className="subtitle">
        Reminders for what to do in the garden each week or month. Your list is
        saved in this browser only.
      </p>
      <p className="hint">
        Add a task, pick weekly or monthly, then mark it done when you finish —
        the next due date moves forward automatically.
      </p>
      <ReminderForm onAdd={handleAdd} />
      <section className="list-section" aria-labelledby="due-heading">
        <h2 id="due-heading">Due this week</h2>
        <p className="section-lede">
          Includes anything overdue or due on or before this Sunday.
        </p>
        <DueThisWeek
          reminders={reminders}
          onMarkDone={handleMarkDone}
          onRemove={handleRemove}
        />
      </section>
      <section className="list-section" aria-labelledby="all-heading">
        <h2 id="all-heading">All reminders</h2>
        <p className="section-lede">Sorted by next due date.</p>
        <ReminderList
          reminders={reminders}
          onMarkDone={handleMarkDone}
          onRemove={handleRemove}
        />
      </section>
    </div>
  )
}
