import GradeBadge from './GradeBadge';

/**
 * Report Summary component
 * Displays verdict, strengths, weaknesses, risk flags, and recommendations
 */
export default function ReportSummary({ report }) {
  const { verdict, strengths, weaknesses, riskFlags, recommendations } = report;

  return (
    <div className="report-summary">
      {/* Verdict Section */}
      <div className="report-section verdict-section">
        <h3 className="section-heading">Verdict</h3>
        <p className="verdict-text">{verdict}</p>
      </div>

      {/* Strengths Section */}
      {strengths.length > 0 && (
        <div className="report-section strengths-section">
          <h3 className="section-heading">
            <span className="heading-icon">✓</span>
            Strengths
          </h3>
          <ul className="report-list">
            {strengths.map((item, index) => (
              <li key={index} className="report-item strength-item">
                <div className="item-header">
                  <span className="item-category">{item.category}</span>
                  <GradeBadge grade={item.grade} size="small" />
                </div>
                <p className="item-message">{item.message}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Weaknesses Section */}
      {weaknesses.length > 0 && (
        <div className="report-section weaknesses-section">
          <h3 className="section-heading">
            <span className="heading-icon">!</span>
            Weaknesses
          </h3>
          <ul className="report-list">
            {weaknesses.map((item, index) => (
              <li key={index} className="report-item weakness-item">
                <div className="item-header">
                  <span className="item-category">{item.category}</span>
                  <GradeBadge grade={item.grade} size="small" />
                </div>
                <p className="item-message">{item.message}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Risk Flags Section */}
      {riskFlags.length > 0 && (
        <div className="report-section risks-section">
          <h3 className="section-heading">
            <span className="heading-icon">⚠</span>
            Risk Flags
          </h3>
          <ul className="report-list">
            {riskFlags.map((flag, index) => (
              <li
                key={index}
                className={`report-item risk-item risk-${flag.severity}`}
              >
                <div className="item-header">
                  <span className="item-category">{flag.risk}</span>
                  <span className={`severity-badge severity-${flag.severity}`}>
                    {flag.severity}
                  </span>
                </div>
                <p className="item-message">{flag.message}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendations Section */}
      {recommendations.length > 0 && (
        <div className="report-section recommendations-section">
          <h3 className="section-heading">
            <span className="heading-icon">→</span>
            Recommendations
          </h3>
          <ul className="report-list">
            {recommendations.map((rec, index) => (
              <li key={index} className="report-item recommendation-item">
                <div className="item-header">
                  <span className={`priority-badge priority-${rec.priority}`}>
                    {rec.priority}
                  </span>
                </div>
                <p className="item-message">{rec.message}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
