import {
  isDueOnOrBeforeEndOfWeek,
  reminderNextDue,
} from '../reminderUtils.js'
import ReminderRow from './ReminderRow.jsx'

export default function DueThisWeek({ reminders, onMarkDone, onRemove }) {
  const dueSoon = reminders.filter((r) =>
    isDueOnOrBeforeEndOfWeek(reminderNextDue(r)),
  )

  if (reminders.length === 0) {
    return (
      <p className="empty">
        No reminders yet. Add one above to see what is due this week.
      </p>
    )
  }

  if (dueSoon.length === 0) {
    return (
      <p className="empty">
        Nothing due through Sunday this week. Check &quot;All reminders&quot;
        below for upcoming dates.
      </p>
    )
  }

  const sorted = [...dueSoon].sort((a, b) =>
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
          showWeekContext
        />
      ))}
    </ul>
  )
}
