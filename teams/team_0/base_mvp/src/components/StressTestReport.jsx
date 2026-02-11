function StressTestReport({ data }) {
  if (!data) {
    return (
      <div className="report report--empty">
        Fill in the form and click “Generate report” to see your stress test.
      </div>
    )
  }

  const risksList = data.risks.filter(Boolean)
  const verdict =
    data.verdict ||
    (data.scores.overall >= 4
      ? 'High feasibility'
      : data.scores.overall >= 3
        ? 'Medium feasibility'
        : 'Low feasibility')
  const verdictLevel = verdict.toLowerCase().includes('high')
    ? 'high'
    : verdict.toLowerCase().includes('low')
      ? 'low'
      : 'medium'

  return (
    <div className="report report--filled">
      <h2 className="report-title">Feasibility report</h2>

      <section className="report-section">
        <h3>{data.name || 'Untitled startup'}</h3>
        {data.description && <p className="report-description">{data.description}</p>}
      </section>

      <section className="report-section">
        <h3>TAM / SAM / SOM</h3>
        <dl className="report-dl">
          {data.tam && (
            <>
              <dt>TAM</dt>
              <dd>{data.tam}</dd>
            </>
          )}
          {data.sam && (
            <>
              <dt>SAM</dt>
              <dd>{data.sam}</dd>
            </>
          )}
          {data.som && (
            <>
              <dt>SOM</dt>
              <dd>{data.som}</dd>
            </>
          )}
        </dl>
        {!data.tam && !data.sam && !data.som && (
          <p className="report-muted">No market size data.</p>
        )}
      </section>

      <section className="report-section">
        <h3>Biggest risks</h3>
        {risksList.length > 0 ? (
          <ul>
            {risksList.map((risk, i) => (
              <li key={i}>{risk}</li>
            ))}
          </ul>
        ) : (
          <p className="report-muted">No risks listed.</p>
        )}
      </section>

      <section className="report-section">
        <h3>Market potential</h3>
        {data.marketPotential ? (
          <p>{data.marketPotential}</p>
        ) : (
          <p className="report-muted">Not specified.</p>
        )}
        <h3>Barriers to entry</h3>
        {data.barriersToEntry ? (
          <p>{data.barriersToEntry}</p>
        ) : (
          <p className="report-muted">Not specified.</p>
        )}
      </section>

      <section className="report-section">
        <h3>Competitive landscape</h3>
        <dl className="report-dl">
          {data.competitors && (
            <>
              <dt>Competitors</dt>
              <dd>{data.competitors}</dd>
            </>
          )}
          {data.differentiation && (
            <>
              <dt>Differentiation</dt>
              <dd>{data.differentiation}</dd>
            </>
          )}
          {data.traction && (
            <>
              <dt>Traction / validation</dt>
              <dd>{data.traction}</dd>
            </>
          )}
        </dl>
        {!data.competitors && !data.differentiation && !data.traction && (
          <p className="report-muted">No competitive data.</p>
        )}
      </section>

      <section className="report-section report-scores">
        <h3>Scores</h3>
        <div className="report-scores-list">
          {data.scores &&
            Object.entries(data.scores).map(([dim, value]) => (
              <div key={dim} className="score-line">
                <span className="score-label">
                  {dim === 'overall' ? 'Overall' : dim.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <span className="score-value">{value}/5</span>
              </div>
            ))}
        </div>
        <p className={`report-verdict report-verdict--${verdictLevel}`}>
          <strong>Verdict:</strong> {verdict}
        </p>
      </section>
    </div>
  )
}

export default StressTestReport
