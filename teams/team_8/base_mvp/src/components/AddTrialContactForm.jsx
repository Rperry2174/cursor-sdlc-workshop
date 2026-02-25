import { useState } from 'react';
import './AddTrialContactForm.css';

export default function AddTrialContactForm({ onAdd }) {
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [owner, setOwner] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !startDate || !owner.trim()) return;
    onAdd({
      id: String(Date.now()),
      name: name.trim(),
      startDate,
      owner: owner.trim(),
    });
    setName('');
    setStartDate('');
    setOwner('');
  }

  return (
    <form className="add-trial-form" onSubmit={handleSubmit}>
      <h3 className="form-title">Add trial contact</h3>
      <div className="form-row">
        <label htmlFor="contact-name">Name</label>
        <input
          id="contact-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Jamie Smith"
        />
      </div>
      <div className="form-row">
        <label htmlFor="contact-start">Trial start date</label>
        <input
          id="contact-start"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>
      <div className="form-row">
        <label htmlFor="contact-owner">Owner</label>
        <input
          id="contact-owner"
          type="text"
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
          placeholder="Who gets the follow-up alert?"
        />
      </div>
      <button type="submit" className="btn-submit">Add contact</button>
    </form>
  );
}
