import {
  isDueToday,
  isOverdue,
} from '../reminderUtils.js'

export default function ReminderRow({
  reminder,
  nextDue,
  onMarkDone,
  onRemove,
  showWeekContext,
}) {
  const overdue = isOverdue(nextDue)
  const dueToday = isDueToday(nextDue)

  return (
    <li className="reminder-card">
      <div className="reminder-card-main">
        <div className="reminder-title-row">
          <strong>{reminder.title}</strong>
          <span className="reminder-badges">
            {overdue && (
              <span className="badge badge-overdue">Overdue</span>
            )}
            {!overdue && dueToday && (
              <span className="badge badge-due-today">Due today</span>
            )}
            {!overdue &&
              !dueToday &&
              showWeekContext && (
                <span className="badge badge-this-week">This week</span>
              )}
          </span>
        </div>
        <p className="reminder-meta">
          <span className="meta-pill">
            {reminder.cadence === 'weekly' ? 'Weekly' : 'Monthly'}
          </span>
          <span>
            Last done:{' '}
            {reminder.lastDoneAt ? reminder.lastDoneAt : '— never'}
          </span>
          <span>Next due: {nextDue}</span>
        </p>
      </div>
      <div className="reminder-actions">
        <button type="button" className="btn-done" onClick={() => onMarkDone(reminder.id)}>
          Mark done today
        </button>
        <button type="button" className="btn-remove" onClick={() => onRemove(reminder.id)}>
          Remove
        </button>
      </div>
    </li>
  )
}
