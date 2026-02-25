import { useState } from "react";
import { MEETINGS, ACCOUNTS } from "./data/meetingData";
import MeetingCard from "./components/MeetingCard";
import AccountDetail from "./components/AccountDetail";
import "./App.css";

function App() {
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  const meetingsWithExternal = MEETINGS.filter(
    (m) => m.externalDomain || m.attendees.some((a) => !a.internal)
  );

  const selectedAccount =
    selectedMeeting && selectedMeeting.externalDomain
      ? ACCOUNTS[selectedMeeting.externalDomain]
      : null;

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>Meeting Prep Dashboard</h1>
          <p className="subtitle">
            February 25, 2026 &middot; jackf@cursor.com &middot;{" "}
            {meetingsWithExternal.length} meetings with external contacts
          </p>
        </div>
        <div className="data-sources">
          <span className="source-badge glean">Glean Calendar</span>
          <span className="source-badge salesforce">Salesforce</span>
          <span className="source-badge databricks">Databricks</span>
        </div>
      </header>

      <main className="app-main">
        <section className="meetings-section">
          <h2>Meetings Today</h2>
          <div className="meetings-list">
            {meetingsWithExternal.map((meeting) => (
              <MeetingCard
                key={meeting.id}
                meeting={meeting}
                hasAccountData={!!ACCOUNTS[meeting.externalDomain]}
                isSelected={selectedMeeting?.id === meeting.id}
                onClick={() =>
                  setSelectedMeeting(
                    selectedMeeting?.id === meeting.id ? null : meeting
                  )
                }
              />
            ))}
          </div>
        </section>

        {selectedAccount && (
          <section className="account-section">
            <AccountDetail
              account={selectedAccount}
              meeting={selectedMeeting}
            />
          </section>
        )}

        {selectedMeeting && !selectedAccount && (
          <section className="account-section">
            <div className="account-detail no-data">
              <h2>No Account Data Available</h2>
              <p>
                {selectedMeeting.note ||
                  "Could not resolve the external domain for this meeting. The attendee email addresses were not fully visible in Glean's calendar data."}
              </p>
              <p className="suggestion">
                Try searching for this account manually in Salesforce or check
                the meeting invite for attendee email addresses.
              </p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
