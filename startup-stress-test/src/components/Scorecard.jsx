import GradeBadge from './GradeBadge';
import { CATEGORY_LABELS, gradeToColor } from '../data/scoringModel';

/**
 * Scorecard component displaying letter grades for all dimensions
 * Shows overall score prominently at top, with category grid below
 */
export default function Scorecard({ scores, grades }) {
  // Categories to display (excluding 'overall' which is shown separately)
  const categories = Object.keys(scores).filter(key => key !== 'overall');

  return (
    <div className="scorecard">
      {/* Overall Score Header */}
      <div className="overall-score-card">
        <div className="overall-score-content">
          <div className="overall-label">Overall Score</div>
          <div className="overall-score-display">
            <span className="overall-number">{scores.overall}</span>
            <span className="overall-max">/100</span>
          </div>
          <GradeBadge grade={grades.overall} size="large" />
        </div>
        <div
          className="overall-score-bar"
          style={{
            background: `linear-gradient(to right, ${gradeToColor(grades.overall)} ${scores.overall}%, transparent ${scores.overall}%)`,
          }}
        />
      </div>

      {/* Category Grid */}
      <div className="score-grid">
        {categories.map(key => (
          <div key={key} className="score-card">
            <div className="score-card-header">
              <span className="score-category">{CATEGORY_LABELS[key]}</span>
              <GradeBadge grade={grades[key]} size="small" />
            </div>
            <div className="score-value-container">
              <span className="score-value">{scores[key]}</span>
              <span className="score-max">/100</span>
            </div>
            <div className="score-bar-container">
              <div
                className="score-bar"
                style={{
                  width: `${scores[key]}%`,
                  backgroundColor: gradeToColor(grades[key]),
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
