import { useState } from 'react';
import IdeaForm from './components/IdeaForm';
import Scorecard from './components/Scorecard';
import RadarChart from './components/RadarChart';
import ReportSummary from './components/ReportSummary';
import { generateReport } from './data/scoringModel';
import './App.css';

/**
 * Main App component
 * Manages form/results state and layout
 */
function App() {
  const [view, setView] = useState('form'); // 'form' or 'results'
  const [report, setReport] = useState(null);

  const handleSubmit = (formData) => {
    const generatedReport = generateReport(formData);
    setReport(generatedReport);
    setView('results');
  };

  const handleReset = () => {
    setView('form');
    setReport(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Startup Stress Tester</h1>
        <p className="app-subtitle">
          Evaluate your startup idea across key dimensions
        </p>
      </header>

      <main className="app-main">
        {view === 'form' ? (
          <IdeaForm onSubmit={handleSubmit} />
        ) : (
          <div className="results-container">
            {/* Results Header */}
            <div className="results-header">
              <div className="results-title-section">
                <h2 className="results-title">{report.startupName || 'Your Startup'}</h2>
                <span className="results-industry">{report.industry}</span>
              </div>
              <button onClick={handleReset} className="reset-btn">
                Test Another Idea
              </button>
            </div>

            {/* Results Grid */}
            <div className="results-grid">
              {/* Left Column: Scorecard */}
              <div className="results-column">
                <Scorecard scores={report.scores} grades={report.grades} />
              </div>

              {/* Right Column: Radar Chart */}
              <div className="results-column">
                <RadarChart scores={report.scores} />
              </div>
            </div>

            {/* Full Width: Report Summary */}
            <div className="results-full-width">
              <ReportSummary report={report} />
            </div>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>Built for the Cursor SDLC Workshop</p>
      </footer>
    </div>
  );
}

export default App;
