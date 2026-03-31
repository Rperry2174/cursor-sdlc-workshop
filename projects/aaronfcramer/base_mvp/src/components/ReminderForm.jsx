import { useState } from 'react'

export default function ReminderForm({ onAdd }) {
  const [title, setTitle] = useState('')
  const [cadence, setCadence] = useState('weekly')
  const [lastDoneAt, setLastDoneAt] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return
    onAdd({
      title: trimmed,
      cadence,
      lastDoneAt: lastDoneAt.trim() || null,
    })
    setTitle('')
    setCadence('weekly')
    setLastDoneAt('')
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label>
        What to do
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Water tomatoes, Fertilize beds"
          autoComplete="off"
        />
      </label>
      <label>
        How often
        <select
          value={cadence}
          onChange={(e) => setCadence(e.target.value)}
          className="form-select"
        >
          <option value="weekly">Weekly (every 7 days)</option>
          <option value="monthly">Monthly (every 30 days)</option>
        </select>
      </label>
      <label>
        Last done (optional)
        <input
          type="date"
          value={lastDoneAt}
          onChange={(e) => setLastDoneAt(e.target.value)}
        />
        <span className="field-hint">
          Leave blank if you have not done it yet — it will show as due now.
        </span>
      </label>
      <button type="submit">Add reminder</button>
    </form>
  )
}
