import { useState } from 'react';
import './Modal.css';

export default function AddColumnModal({ onAdd, onClose }) {
  const [name, setName] = useState('');
  const [context, setContext] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({
      id: `col-${Date.now()}`,
      name: name.trim(),
      context: context.trim(),
    });
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2 className="modal__title">Add Column</h2>
          <button className="modal__close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className="modal__form">
          <label className="modal__label">
            Column Name
            <input
              className="modal__input"
              type="text"
              placeholder="e.g. Reviewing"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </label>
          <label className="modal__label">
            Context
            <textarea
              className="modal__textarea"
              placeholder="Describe what agents assigned to this column are doing…"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              rows={4}
            />
          </label>
          <div className="modal__actions">
            <button type="button" className="modal__btn modal__btn--cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="modal__btn modal__btn--primary" disabled={!name.trim()}>Add Column</button>
          </div>
        </form>
      </div>
    </div>
  );
}
