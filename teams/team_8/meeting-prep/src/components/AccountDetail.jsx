import TeamCard from "./TeamCard";
import UsageTable from "./UsageTable";

export default function AccountDetail({ account }) {
  const activeTeams = account.teams.filter(
    (t) => t.subscriptionStatus === "active"
  );

  const totalTeamARR = activeTeams.reduce(
    (sum, t) => sum + (t.selfServiceARR || 0),
    0
  );
  const totalARR = totalTeamARR + (account.individualPlans.subscriberARR || 0);
  const totalSeats = activeTeams.reduce((sum, t) => sum + (t.seats || 0), 0);

  return (
    <div className="account-detail">
      <div className="account-header-row">
        <div>
          <h2>{account.name}</h2>
          <p className="account-meta">
            {account.industry} &middot; {account.country} &middot;{" "}
            {account.employees} employees &middot;{" "}
            <a
              href={`https://${account.website}`}
              target="_blank"
              rel="noreferrer"
            >
              {account.website}
            </a>
          </p>
        </div>
        <span className={`account-type-badge ${account.type.toLowerCase()}`}>
          {account.type}
        </span>
      </div>

      <div className="kpi-row">
        <div className="kpi-card">
          <span className="kpi-value">${totalARR.toLocaleString()}</span>
          <span className="kpi-label">Total ARR</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-value">{totalSeats}</span>
          <span className="kpi-label">Active Seats</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-value">{activeTeams.length}</span>
          <span className="kpi-label">Active Teams</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-value">
            {account.individualPlans.totalPayingSubscribers || 0}
          </span>
          <span className="kpi-label">Individual Subs</span>
        </div>
      </div>

      {account.individualPlans.planSummary && (
        <div className="individual-plans">
          <div className="plan-badge individual">
            Individual Plans: {account.individualPlans.planSummary}
          </div>
        </div>
      )}

      <div className="teams-grid">
        {activeTeams.map((team) => (
          <TeamCard key={team.teamId} team={team} />
        ))}
      </div>

      <UsageTable metrics={account.usageMetrics} />
    </div>
  );
}
