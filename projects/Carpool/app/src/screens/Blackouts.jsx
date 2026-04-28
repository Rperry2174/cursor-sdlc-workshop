import { useState, useMemo } from 'react';
import {
  getCurrentParent,
  getBlackoutsForParent,
  addBlackout,
  deleteBlackout,
  db,
} from '../data/store.js';
import { applyBlackoutAndFindSubs } from '../data/lifecycle.js';
import { TopNav } from '../components/TopNav.jsx';

const KIND_CHIPS = [
  { id: 'travel', label: '✈️ Travel' },
  { id: 'work', label: '💼 Work trip' },
  { id: 'sick', label: '🤒 Sick' },
  { id: 'other', label: '🗓️ Other' },
];

export function Blackouts({ ctx }) {
  const me = getCurrentParent();
  const items = getBlackoutsForParent(me.id);
  const [kind, setKind] = useState('travel');
  const [start, setStart] = useState(new Date().toISOString().slice(0, 10));
  const [end, setEnd] = useState(new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10));
  const [note, setNote] = useState('');

  const affected = useMemo(() => {
    const data = db();
    return data.carpool_legs.filter((l) => {
      if (l.driver_id !== me.id) return false;
      const d = l.departure_time.slice(0, 10);
      return d >= start && d <= end;
    });
  }, [me.id, start, end]);

  const submit = () => {
    addBlackout({ parent_id: me.id, kind, starts_on: start, ends_on: end, note });
    const r = applyBlackoutAndFindSubs({ parent_id: me.id, starts_on: start, ends_on: end });
    if (r.releasedCount > 0) {
      ctx.showToast(`Blackout saved · sub requests opened for ${r.releasedCount} legs`);
    } else {
      ctx.showToast('Blackout saved');
    }
  };

  return (
    <>
      <TopNav title="Blackout dates" onBack={() => ctx.navigate('profile')} />
      <div className="section">
        <div className="card">
          <div className="caps muted">Add a blackout</div>
          <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {KIND_CHIPS.map((k) => (
              <button
                key={k.id}
                type="button"
                onClick={() => setKind(k.id)}
                style={{
                  padding: '8px 12px',
                  borderRadius: 999,
                  fontSize: 13,
                  fontWeight: 600,
                  background: kind === k.id ? 'var(--green-700)' : 'var(--gray-100)',
                  color: kind === k.id ? 'white' : 'var(--gray-900)',
                }}
              >
                {k.label}
              </button>
            ))}
          </div>

          <div style={{ marginTop: 14, display: 'grid', gap: 10 }}>
            <label className="field">From
              <input className="input" type="date" value={start} onChange={(e) => setStart(e.target.value)} style={{ marginTop: 4 }} />
            </label>
            <label className="field">Until
              <input className="input" type="date" value={end} onChange={(e) => setEnd(e.target.value)} style={{ marginTop: 4 }} />
            </label>
            <label className="field">Note (optional)
              <input className="input" value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Disney trip" style={{ marginTop: 4 }} />
            </label>
          </div>

          {affected.length > 0 && (
            <div
              style={{
                marginTop: 12,
                background: 'var(--yellow-100)',
                color: 'var(--yellow-text)',
                padding: 12,
                borderRadius: 12,
                fontSize: 13,
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: 4 }}>
                ⚠️ {affected.length} of your driving commitments fall in this window
              </div>
              <div>We'll automatically open sub requests for them when you save.</div>
            </div>
          )}

          <button type="button" className="btn btn-primary" style={{ marginTop: 14 }} onClick={submit}>
            Save blackout {affected.length > 0 && `· find ${affected.length} subs`}
          </button>
        </div>

        <div className="caps muted" style={{ margin: '16px 4px 8px' }}>Your blackouts</div>
        {items.length === 0 ? (
          <div className="empty">
            <div className="icon">🌴</div>
            <div className="h3">None yet</div>
            <div>Add dates when you can't drive so the team plans around you.</div>
          </div>
        ) : (
          items.map((b) => (
            <div key={b.id} className="card">
              <div className="row-between">
                <div>
                  <div style={{ fontWeight: 700 }}>
                    {KIND_CHIPS.find((k) => k.id === b.kind)?.label || b.kind}
                  </div>
                  <div className="muted" style={{ fontSize: 13, marginTop: 2 }}>
                    {b.starts_on} → {b.ends_on}
                    {b.note ? ` · ${b.note}` : ''}
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-ghost"
                  style={{ width: 'auto', padding: '6px 10px', fontSize: 12, color: 'var(--red-text)' }}
                  onClick={() => {
                    deleteBlackout(b.id);
                    ctx.showToast('Removed');
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
