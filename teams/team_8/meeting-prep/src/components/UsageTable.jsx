export default function UsageTable({ metrics }) {
  if (!metrics) return null;

  const totalModelCost = metrics.topModels?.reduce(
    (s, x) => s + x.costUsd,
    0
  );

  return (
    <div className="usage-table-section">
      <div className="section-header">
        <h3>Usage Intelligence</h3>
        <span className="data-source">Source: anyusage (Jan 26 – Feb 24, 2026)</span>
      </div>

      <table className="usage-table">
        <thead>
          <tr>
            <th>Metric</th>
            <th>Last 30 Days</th>
            <th>Last 90 Days</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Avg Cost / User</td>
            <td className="metric-value">
              {metrics.avgCostPerUser30d != null
                ? `$${metrics.avgCostPerUser30d.toFixed(2)}`
                : "—"}
            </td>
            <td className="metric-value">
              {metrics.avgCostPerUser90d != null
                ? `$${metrics.avgCostPerUser90d.toFixed(2)}`
                : "—"}
            </td>
          </tr>
          <tr>
            <td>Total API Cost</td>
            <td className="metric-value">
              {metrics.totalCost30d != null
                ? `$${metrics.totalCost30d.toFixed(2)}`
                : "—"}
            </td>
            <td className="metric-value">
              {metrics.totalCost90d != null
                ? `$${metrics.totalCost90d.toFixed(2)}`
                : "—"}
            </td>
          </tr>
          <tr>
            <td>Active Users</td>
            <td className="metric-value">
              {metrics.activeUsers30d ?? "—"}
            </td>
            <td className="metric-value">
              {metrics.activeUsers90d ?? "—"}
            </td>
          </tr>
          <tr>
            <td>% Users Blocked</td>
            <td className="metric-value" colSpan={2}>
              <span
                className={
                  metrics.pctUsersBlocked30d > 0 ? "blocked-warning" : "healthy"
                }
              >
                {metrics.pctUsersBlocked30d}%
                {metrics.numUsersBlocked30d > 0 &&
                  ` (${metrics.numUsersBlocked30d} users)`}
              </span>
            </td>
          </tr>
          {(metrics.projectedTeamsAnnual != null || metrics.projectedEnterpriseAnnual != null) && (
            <>
              <tr className="projection-divider">
                <td colSpan={3} className="divider-label">Projected Annual Spend</td>
              </tr>
              {metrics.projectedTeamsAnnual != null && (
                <tr>
                  <td>Teams Plan</td>
                  <td className="metric-value projection" colSpan={2}>
                    ${metrics.projectedTeamsAnnual.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    <span className="projection-detail">
                      ($20 seat + $20 included) × users × 12 + monthly overage × 12
                    </span>
                  </td>
                </tr>
              )}
              {metrics.projectedEnterpriseAnnual != null && (
                <tr>
                  <td>Enterprise Plan</td>
                  <td className="metric-value projection" colSpan={2}>
                    ${metrics.projectedEnterpriseAnnual.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    <span className="projection-detail">
                      $40 seat × users × 12 + (API cost + cursor fee) × 12
                    </span>
                  </td>
                </tr>
              )}
            </>
          )}
        </tbody>
      </table>

      {metrics.spendBreakdown && (
        <>
          <div className="section-header" style={{ marginTop: 20 }}>
            <h3>Spend Breakdown (30d)</h3>
          </div>
          <div className="spend-breakdown-row">
            <div className="spend-bar-container">
              <div
                className="spend-bar included"
                style={{ width: `${metrics.spendBreakdown.included.pct}%` }}
              >
                Included: ${metrics.spendBreakdown.included.cost.toFixed(2)} ({metrics.spendBreakdown.included.pct}%)
              </div>
              <div
                className="spend-bar on-demand"
                style={{ width: `${metrics.spendBreakdown.onDemand.pct}%` }}
              >
                On-demand: ${metrics.spendBreakdown.onDemand.cost.toFixed(2)} ({metrics.spendBreakdown.onDemand.pct}%)
              </div>
            </div>
          </div>
        </>
      )}

      {metrics.topModels && metrics.topModels.length > 0 && (
        <>
          <div className="section-header" style={{ marginTop: 20 }}>
            <h3>Top 5 Models (30d)</h3>
          </div>
          <table className="usage-table models-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Model</th>
                <th>Events</th>
                <th>API Cost</th>
                <th>Share of Cost</th>
              </tr>
            </thead>
            <tbody>
              {metrics.topModels.map((m, i) => {
                const pct = totalModelCost > 0
                  ? ((m.costUsd / totalModelCost) * 100).toFixed(1)
                  : "0.0";
                return (
                  <tr key={i}>
                    <td className="rank">{i + 1}</td>
                    <td className="model-name">{m.model}</td>
                    <td className="metric-value">
                      {m.events.toLocaleString()}
                    </td>
                    <td className="metric-value">${m.costUsd.toFixed(2)}</td>
                    <td className="metric-value">
                      <div className="bar-cell">
                        <div
                          className="bar-fill"
                          style={{ width: `${pct}%` }}
                        />
                        <span>{pct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}

      {metrics.perUserSpend30d && metrics.perUserSpend30d.length > 0 && (
        <>
          <div className="section-header" style={{ marginTop: 20 }}>
            <h3>User Spend Distribution (30d)</h3>
          </div>
          <table className="usage-table user-spend-table">
            <thead>
              <tr>
                <th>User</th>
                <th>API Cost</th>
                <th>Events</th>
                <th>Active Days</th>
                <th>Share</th>
              </tr>
            </thead>
            <tbody>
              {metrics.perUserSpend30d.map((u, i) => {
                const pct =
                  metrics.totalCost30d > 0
                    ? ((u.costUsd / metrics.totalCost30d) * 100).toFixed(1)
                    : "0.0";
                return (
                  <tr key={i}>
                    <td className="user-email">{u.email}</td>
                    <td className="metric-value">${u.costUsd.toFixed(2)}</td>
                    <td className="metric-value">
                      {u.events.toLocaleString()}
                    </td>
                    <td className="metric-value">{u.activeDays}</td>
                    <td className="metric-value">
                      <div className="bar-cell">
                        <div
                          className="bar-fill"
                          style={{ width: `${pct}%` }}
                        />
                        <span>{pct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
