import { useState, useEffect } from 'react';
import { UNASSIGNED_COLUMN_ID } from '../data';
import './AgentCard.css';

function randomDuration() {
  return Math.floor(Math.random() * (60000 - 5000 + 1)) + 5000;
}

export default function AgentCard({ agent, onDragStart }) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [duration, setDuration] = useState(null);
  const [startTime, setStartTime] = useState(null);

  // Start loading animation when assigned to a real (non-unassigned) column
  useEffect(() => {
    if (!agent.columnId || agent.columnId === UNASSIGNED_COLUMN_ID) {
      setLoading(false);
      setDone(false);
      setProgress(0);
      return;
    }
    const dur = randomDuration();
    setDuration(dur);
    setLoading(true);
    setDone(false);
    setProgress(0);
    setStartTime(Date.now());
  }, [agent.columnId]);

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

  function handleDragStart(e) {
    if (loading) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.effectAllowed = 'move';
    onDragStart(agent.id);
  }

  return (
    <div
      className={`agent-card ${loading ? 'agent-card--loading agent-card--locked' : ''} ${done ? 'agent-card--done' : ''}`}
      draggable={!loading}
      onDragStart={handleDragStart}
    >
      <div className={`agent-card__drag-handle ${loading ? 'agent-card__drag-handle--locked' : ''}`}>
        {loading ? '🔒' : '⠿'}
      </div>
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
    </div>
  );
}
