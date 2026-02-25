import { useState, useMemo } from 'react';
import { INITIAL_TRIAL_CONTACTS, getMilestones } from './data/trialContacts';
import MilestoneBadges from './components/MilestoneBadges';
import OwnerDisplay from './components/OwnerDisplay';
import FollowUpAlertsPanel from './components/FollowUpAlertsPanel';
import MilestoneFilter, {
  FILTER_ALL,
  FILTER_1W,
  FILTER_2W,
  FILTER_3W,
} from './components/MilestoneFilter';
import AddTrialContactForm from './components/AddTrialContactForm';
import WeeklyTrialUpdate from './components/WeeklyTrialUpdate';
import './App.css';

function filterContacts(contacts, filterValue) {
  if (filterValue === FILTER_ALL) return contacts;
  return contacts.filter((c) => {
    const m = getMilestones(c.startDate);
    if (filterValue === FILTER_1W) return m.week1;
    if (filterValue === FILTER_2W) return m.week2;
    if (filterValue === FILTER_3W) return m.week3;
    return true;
  });
}

export default function App() {
  const [contacts, setContacts] = useState(INITIAL_TRIAL_CONTACTS);
  const [filter, setFilter] = useState(FILTER_ALL);
  const [sentAlerts, setSentAlerts] = useState([]);

  const filteredContacts = useMemo(
    () => filterContacts(contacts, filter),
    [contacts, filter]
  );

  function handleAddContact(newContact) {
    setContacts((prev) => [...prev, newContact]);
  }

  function handleSendSlack(alert) {
    setSentAlerts((prev) => [...prev, alert]);
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Trial Follow-up Tracker</h1>
        <p className="app-subtitle">
          Track trial contacts and get notified at 1-, 2-, and 3-week markers
        </p>
      </header>

      <div className="toolbar">
        <MilestoneFilter value={filter} onChange={setFilter} />
      </div>

      <main className="app-main">
        <section className="contact-list-section">
          <h2>Contacts in trial</h2>
          <ul className="contact-list">
            {filteredContacts.map((contact) => (
              <li key={contact.id} className="contact-card">
                <div className="contact-card__header">
                  <span className="contact-name">{contact.name}</span>
                  <OwnerDisplay owner={contact.owner} />
                </div>
                <div className="contact-card__meta">
                  Started: {contact.startDate}
                </div>
                <MilestoneBadges startDate={contact.startDate} />
              </li>
            ))}
          </ul>
          {filteredContacts.length === 0 && (
            <p className="empty-state">No contacts match this filter.</p>
          )}
        </section>

        <aside className="app-sidebar">
          <WeeklyTrialUpdate contacts={contacts} />
          <AddTrialContactForm onAdd={handleAddContact} />
          <FollowUpAlertsPanel
            contacts={contacts}
            sentAlerts={sentAlerts}
            onSendSlack={handleSendSlack}
          />
        </aside>
      </main>
    </div>
  );
}
