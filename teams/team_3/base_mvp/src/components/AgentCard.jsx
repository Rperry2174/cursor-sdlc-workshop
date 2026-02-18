import { useState, useEffect } from 'react';
import './AgentCard.css';

// Returns a random duration in ms between 5s and 60s
function randomDuration() {
  return Math.floor(Math.random() * (60000 - 5000 + 1)) + 5000;
}

export default function AgentCard({ agent, columns, onMove }) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [duration, setDuration] = useState(null);
  const [startTime, setStartTime] = useState(null);

  // When agent is assigned to a column, start the loading timer
  useEffect(() => {
    if (!agent.columnId) return;
    const dur = randomDuration();
    setDuration(dur);
    setLoading(true);
    setDone(false);
    setProgress(0);
    setStartTime(Date.now());
  }, [agent.columnId]);

  // Animate the progress bar
  useEffect(() => {
    if (!loading || !duration || !startTime) return;
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(interval);
        setLoading(false);
        setDone(true);
      }
    }, 200);
    return () => clearInterval(interval);
  }, [loading, duration, startTime]);

  const currentColumn = columns.find((c) => c.id === agent.columnId);

  return (
    <div className={`agent-card ${loading ? 'agent-card--loading' : ''} ${done ? 'agent-card--done' : ''}`}>
      <div className="agent-card__header">
        <div className="agent-avatar">{agent.name[0]}</div>
        <div className="agent-card__name">{agent.name}</div>
        {done && <span className="agent-card__badge agent-card__badge--done">✓ Done</span>}
        {loading && <span className="agent-card__badge agent-card__badge--working">Working…</span>}
      </div>

      <p className="agent-card__personality">{agent.personality}</p>

      {loading && (
        <div className="agent-card__progress-wrap">
          <div className="agent-card__progress-bar" style={{ width: `${progress}%` }} />
          <span className="agent-card__progress-label">{Math.round(progress)}%</span>
        </div>
      )}

      <div className="agent-card__footer">
        <label className="agent-card__move-label">Move to:</label>
        <select
          className="agent-card__select"
          value={agent.columnId || ''}
          onChange={(e) => onMove(agent.id, e.target.value)}
        >
          <option value="" disabled>Select column…</option>
          {columns.map((col) => (
            <option key={col.id} value={col.id}>{col.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
