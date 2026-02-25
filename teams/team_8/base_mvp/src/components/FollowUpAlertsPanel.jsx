import { getMilestones } from '../data/trialContacts';
import './FollowUpAlertsPanel.css';

/**
 * Build list of { contact, milestone } for every reached milestone (1w, 2w, 3w).
 */
function getAlertsForContacts(contacts) {
  const alerts = [];
  contacts.forEach((contact) => {
    const m = getMilestones(contact.startDate);
    if (m.week1) alerts.push({ contact, milestone: '1-week' });
    if (m.week2) alerts.push({ contact, milestone: '2-week' });
    if (m.week3) alerts.push({ contact, milestone: '3-week' });
  });
  return alerts;
}

export default function FollowUpAlertsPanel({ contacts, sentAlerts, onSendSlack }) {
  const alerts = getAlertsForContacts(contacts);

  return (
    <section className="follow-up-alerts-panel">
      <h3 className="panel-title">Follow-up alerts (Slack stub)</h3>
      <p className="panel-hint">These would be sent to the owner in Slack. Click to add to “sent” list.</p>

      <ul className="alerts-list">
        {alerts.map(({ contact, milestone }) => {
          const message = `Follow up with ${contact.name} — reached ${milestone} marker. Notify ${contact.owner}.`;
          const alreadySent = sentAlerts.some(
            (a) => a.contactId === contact.id && a.milestone === milestone
          );
          return (
            <li key={`${contact.id}-${milestone}`} className="alert-item">
              <span className="alert-message">{message}</span>
              <button
                type="button"
                className="btn-send"
                onClick={() => onSendSlack({ contactId: contact.id, contactName: contact.name, owner: contact.owner, milestone })}
                disabled={alreadySent}
              >
                {alreadySent ? 'Sent ✓' : 'Send to Slack'}
              </button>
            </li>
          );
        })}
      </ul>

      {sentAlerts.length > 0 && (
        <div className="sent-section">
          <h4>Sent to Slack</h4>
          <ul className="sent-list">
            {sentAlerts.map((a, i) => (
              <li key={i}>
                → {a.owner}: {a.contactName} ({a.milestone})
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
