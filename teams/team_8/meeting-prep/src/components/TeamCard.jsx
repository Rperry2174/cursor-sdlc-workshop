export default function TeamCard({ team }) {
  return (
    <div className="team-card active">
      <div className="team-card-header">
        <h4>
          {team.name}
          <span className="status-dot active" />
        </h4>
        <span className="status-badge active">{team.subscriptionStatus}</span>
      </div>

      <div className="team-meta">
        <span>
          {team.selfServicePlan === "team" ? "Teams Plan" : "Self Serve"}{" "}
          &middot; {team.pricingModel}
        </span>
        {team.selfServiceARR > 0 && (
          <span className="team-arr">
            ${team.selfServiceARR.toLocaleString()} ARR
          </span>
        )}
      </div>

      <div className="team-stats">
        <div className="stat">
          <span className="stat-value">{team.seats}</span>
          <span className="stat-label">Seats</span>
        </div>
        <div className="stat">
          <span className="stat-value">{team.totalUsers}</span>
          <span className="stat-label">Users</span>
        </div>
        <div className="stat">
          <span className="stat-value">{team.coreUsersL7D ?? "—"}</span>
          <span className="stat-label">WAU</span>
        </div>
        <div className="stat">
          <span className="stat-value">{team.coreUsersL30D ?? "—"}</span>
          <span className="stat-label">MAU</span>
        </div>
      </div>

      <div className="team-usage-summary">
        <div className="usage-row">
          <span className="usage-period">Last 7 days</span>
          <span className="usage-detail">{team.coreUsageL7D}</span>
        </div>
        <div className="usage-row">
          <span className="usage-period">Last 30 days</span>
          <span className="usage-detail">{team.coreUsageL30D}</span>
        </div>
      </div>
    </div>
  );
}
