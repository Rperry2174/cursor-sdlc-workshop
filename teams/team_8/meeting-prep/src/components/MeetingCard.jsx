export default function MeetingCard({
  meeting,
  hasAccountData,
  isSelected,
  onClick,
}) {
  const externalAttendees = meeting.attendees.filter((a) => !a.internal);
  const internalAttendees = meeting.attendees.filter((a) => a.internal);

  return (
    <div
      className={`meeting-card ${isSelected ? "selected" : ""} ${
        hasAccountData ? "has-data" : ""
      }`}
      onClick={onClick}
    >
      <div className="meeting-header">
        <h3>{meeting.title}</h3>
        <span className="meeting-time">{meeting.time}</span>
      </div>
      <div className="meeting-attendees">
        {externalAttendees.length > 0 && (
          <div className="attendee-group">
            <span className="attendee-label">External:</span>
            {externalAttendees.map((a, i) => (
              <span key={i} className="attendee external">
                {a.name}
                {a.email && (
                  <span className="attendee-email"> {a.email}</span>
                )}
              </span>
            ))}
          </div>
        )}
        <div className="attendee-group">
          <span className="attendee-label">Internal:</span>
          {internalAttendees.map((a) => (
            <span key={a.email} className="attendee internal">
              {a.name}
            </span>
          ))}
        </div>
      </div>
      <div className="meeting-domain">
        {meeting.externalDomain ? (
          <>
            <span className="domain-badge">{meeting.externalDomain}</span>
            {hasAccountData
              ? isSelected
                ? "Click to collapse"
                : "Click for account intelligence"
              : "Domain found — no usage data"}
          </>
        ) : (
          <span className="domain-unknown">
            {meeting.note || "External domain not resolved"}
          </span>
        )}
      </div>
    </div>
  );
}
