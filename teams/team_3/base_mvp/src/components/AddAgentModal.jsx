import { useState } from 'react';
import './Modal.css';

export default function AddAgentModal({ onAdd, onClose }) {
  const [name, setName] = useState('');
  const [personality, setPersonality] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({
      id: `agent-${Date.now()}`,
      name: name.trim(),
      personality: personality.trim(),
    });
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2 className="modal__title">Add Agent</h2>
          <button className="modal__close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className="modal__form">
          <label className="modal__label">
            Agent Name
            <input
              className="modal__input"
              type="text"
              placeholder="e.g. Orion"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </label>
          <label className="modal__label">
            Personality
            <textarea
              className="modal__textarea"
              placeholder="Define the agent's rules, style, and behavior…"
              value={personality}
              onChange={(e) => setPersonality(e.target.value)}
              rows={4}
            />
          </label>
          <p className="modal__hint">Agent will be placed in <strong>Unassigned</strong> — drag it to a column to start work.</p>
          <div className="modal__actions">
            <button type="button" className="modal__btn modal__btn--cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="modal__btn modal__btn--primary" disabled={!name.trim()}>Add Agent</button>
          </div>
        </form>
      </div>
    </div>
  );
}
