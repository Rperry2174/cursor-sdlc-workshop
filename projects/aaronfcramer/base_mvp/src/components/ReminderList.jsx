import { reminderNextDue } from '../reminderUtils.js'
import ReminderRow from './ReminderRow.jsx'

export default function ReminderList({ reminders, onMarkDone, onRemove }) {
  if (reminders.length === 0) {
    return (
      <p className="empty">No reminders yet. Add your first garden task above.</p>
    )
  }

  const sorted = [...reminders].sort((a, b) =>
    reminderNextDue(a).localeCompare(reminderNextDue(b)),
  )

  return (
    <ul className="reminder-list">
      {sorted.map((r) => (
        <ReminderRow
          key={r.id}
          reminder={r}
          nextDue={reminderNextDue(r)}
          onMarkDone={onMarkDone}
          onRemove={onRemove}
          showWeekContext={false}
        />
      ))}
    </ul>
  )
}
