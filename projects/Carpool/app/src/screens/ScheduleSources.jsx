import { useState } from 'react';
import {
  getSourcesForTeam,
  getSource,
  addScheduleSource,
  removeScheduleSource,
  getTeam,
} from '../data/store.js';
import { syncSource, fetchIcs } from '../data/lifecycle.js';
import { parseIcs } from '../data/ics.js';
import { TopNav } from '../components/TopNav.jsx';

/* ---------- helpers ---------- */

function relTime(iso) {
  if (!iso) return 'never';
  const diffMs = Date.now() - new Date(iso).getTime();
  if (diffMs < 0) return 'in the future';
  const min = Math.round(diffMs / 60000);
  if (min < 1) return 'just now';
  if (min < 60) return `${min} min ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr} hr ago`;
  const day = Math.round(hr / 24);
  return `${day} day${day === 1 ? '' : 's'} ago`;
}

function detectKind(url) {
  const u = (url || '').toLowerCase();
  if (u.includes('gc.com') || u.includes('gamechanger')) return { label: 'GameChanger', icon: '🟢' };
  if (u.includes('teamsnap')) return { label: 'TeamSnap', icon: '🟦' };
  if (u.includes('sportsengine')) return { label: 'SportsEngine', icon: '🟧' };
  if (u.includes('icloud')) return { label: 'Apple Calendar', icon: '🍎' };
  if (u.includes('google.com')) return { label: 'Google Calendar', icon: '🟦' };
  if (u.startsWith('webcal://')) return { label: 'webcal', icon: '📅' };
  return { label: 'ICS feed', icon: '📅' };
}

/* ============================================================
 * ScheduleSources — list view
 * ============================================================ */

export function ScheduleSources({ teamId, ctx }) {
  const team = getTeam(teamId);
  const sources = getSourcesForTeam(teamId);
  const [busyId, setBusyId] = useState(null);

  const sync = async (src) => {
    setBusyId(src.id);
    try {
      const result = await syncSource(src);
      const parts = [];
      if (result.added) parts.push(`${result.added} added`);
      if (result.updated) parts.push(`${result.updated} updated`);
      if (result.cancelled) parts.push(`${result.cancelled} cancelled`);
      ctx.showToast(parts.length ? `Synced — ${parts.join(' · ')}` : 'Already up to date');
    } catch (err) {
      ctx.showToast(`Sync failed: ${err.message}`);
    } finally {
      setBusyId(null);
    }
  };

  const remove = (src) => {
    if (!confirm(`Remove "${src.name}"? Imported events will stay, but won't auto-update.`)) return;
    removeScheduleSource(src.id);
  };

  return (
    <>
      <TopNav title="Schedule sources" onBack={() => ctx.navigate('profile')} />
      <div className="section">
        <div className="card" style={{ background: 'var(--green-50)' }}>
          <div className="caps" style={{ color: 'var(--green-text)' }}>📅 {team?.name}</div>
          <div style={{ fontSize: 14, marginTop: 6, color: 'var(--gray-700)' }}>
            Connect a calendar feed (GameChanger, Apple Calendar, Google Calendar, TeamSnap…) to
            auto-import games and practices. We'll spawn drop-off + pick-up legs for each event so
            parents can claim them.
          </div>
        </div>

        {sources.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: 24 }}>
            <div style={{ fontSize: 36 }}>📭</div>
            <div style={{ fontWeight: 700, marginTop: 8 }}>No feeds connected yet</div>
            <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>
              Add one to stop manually entering every game.
            </div>
          </div>
        )}

        {sources.map((src) => {
          const kind = src.kind === 'sample' ? { label: 'Sample data', icon: '🧪' } : detectKind(src.url);
          const isError = src.last_status === 'error';
          return (
            <div key={src.id} className="card">
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <div style={{ fontSize: 22 }}>{kind.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{src.name}</div>
                  <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>
                    {kind.label}
                    {' · '}
                    {src.last_event_count
                      ? `${src.last_event_count} events`
                      : 'never synced'}
                    {' · '}
                    last sync {relTime(src.last_synced_at)}
                  </div>
                  {src.url && (
                    <div
                      className="muted"
                      style={{
                        fontSize: 11,
                        marginTop: 4,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                      title={src.url}
                    >
                      {src.url}
                    </div>
                  )}
                  {isError && (
                    <div
                      style={{
                        fontSize: 12,
                        marginTop: 6,
                        color: 'var(--red-text)',
                        background: 'var(--red-50)',
                        padding: '6px 8px',
                        borderRadius: 6,
                      }}
                    >
                      ⚠️ {src.last_error || 'Last sync failed'}
                    </div>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ flex: 1, padding: '8px 10px', fontSize: 13 }}
                  onClick={() => sync(src)}
                  disabled={busyId === src.id}
                >
                  {busyId === src.id ? 'Syncing…' : '🔄 Sync now'}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  style={{ width: 'auto', padding: '8px 12px', fontSize: 13, color: 'var(--red-text)' }}
                  onClick={() => remove(src)}
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => ctx.navigate('add_schedule_source', { teamId })}
        >
          + Add a schedule source
        </button>
      </div>
    </>
  );
}

/* ============================================================
 * AddScheduleSource — wizard
 * ============================================================ */

const PRESET_FEEDS = [
  {
    id: 'sample',
    name: 'Tigers Baseball — Spring 2026 (sample)',
    icon: '🧪',
    description: 'Bundled demo schedule. Use this if you don\'t have a real feed handy.',
    kind: 'sample',
  },
];

export function AddScheduleSource({ teamId, prefillUrl, ctx }) {
  const team = getTeam(teamId);

  const [mode, setMode] = useState(prefillUrl ? 'url' : 'url'); // 'sample' | 'url'
  const [name, setName] = useState('');
  const [url, setUrl] = useState(prefillUrl || '');
  const [dropEarly, setDropEarly] = useState(15);
  const [pickLate, setPickLate] = useState(0);

  const [previewing, setPreviewing] = useState(false);
  const [preview, setPreview] = useState(null);
  const [err, setErr] = useState('');

  const usePreset = (preset) => {
    setMode(preset.kind);
    setName(preset.name);
    setUrl('');
    setErr('');
  };

  const runPreview = async () => {
    setErr('');
    setPreview(null);
    setPreviewing(true);
    try {
      let icsText;
      if (mode === 'sample') {
        const res = await fetch('/sample/sample-baseball.ics');
        if (!res.ok) throw new Error('Could not load bundled sample');
        icsText = await res.text();
      } else {
        if (!url.trim()) throw new Error('Paste a calendar URL first');
        icsText = await fetchIcs(url.trim());
      }
      const parsed = parseIcs(icsText, { horizonDays: 120 });
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const eligible = parsed.events.filter(
        (e) => !e.cancelled && new Date(e.start).getTime() >= todayStart.getTime(),
      );
      if (eligible.length === 0) {
        throw new Error("We parsed the feed but didn't find any upcoming events.");
      }
      setPreview({
        ...parsed,
        eligible,
        skippedPast: parsed.events.length - eligible.length,
      });
      if (!name.trim()) {
        setName(parsed.calendar?.name || 'Imported schedule');
      }
    } catch (e) {
      setErr(e.message);
    } finally {
      setPreviewing(false);
    }
  };

  const confirm = async () => {
    const src = addScheduleSource({
      team_id: teamId,
      name: name.trim() || 'Imported schedule',
      kind: mode === 'sample' ? 'sample' : 'webcal',
      url: mode === 'url' ? url.trim() : null,
      default_legs: {
        drop_off_minutes_before: dropEarly,
        pick_up_minutes_after: pickLate,
      },
    });
    try {
      const result = await syncSource(getSource(src.id));
      const parts = [];
      if (result.added) parts.push(`${result.added} events`);
      if (result.updated) parts.push(`${result.updated} updated`);
      if (result.removedPast) parts.push(`${result.removedPast} past removed`);
      ctx.showToast(`Imported ${parts.join(' · ') || '0 events'} from ${src.name}`);
      ctx.navigate('schedule');
      return;
    } catch (e) {
      ctx.showToast(`Saved feed but sync failed: ${e.message}`);
    }
    ctx.navigate('schedule_sources', { teamId });
  };

  const minutesChips = (value, setter, options) => (
    <div className="row" style={{ gap: 6, flexWrap: 'wrap' }}>
      {options.map((min) => (
        <button
          key={min}
          type="button"
          onClick={() => setter(min)}
          className="chip"
          style={{
            padding: '6px 10px',
            borderRadius: 999,
            border: '1px solid var(--gray-200)',
            fontSize: 13,
            fontWeight: 600,
            background: value === min ? 'var(--green-700)' : 'white',
            color: value === min ? 'white' : 'var(--gray-700)',
          }}
        >
          {min === 0 ? 'right at end' : `${min} min`}
        </button>
      ))}
    </div>
  );

  return (
    <>
      <TopNav title="Add schedule source" onBack={() => ctx.navigate('schedule_sources', { teamId })} />
      <div className="section">
        <div className="card" style={{ background: 'var(--green-50)' }}>
          <div className="caps" style={{ color: 'var(--green-text)' }}>📅 {team?.name}</div>
          <div style={{ fontSize: 14, marginTop: 6, color: 'var(--gray-700)' }}>
            Paste a calendar URL or use the bundled sample. Carpool will fetch the events, spawn
            drop-off + pick-up legs, and re-sync whenever you tap "Sync now".
          </div>
        </div>

        {/* Quick presets */}
        <div className="card">
          <div className="caps muted">Quick start</div>
          {PRESET_FEEDS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => usePreset(p)}
              className="list-row"
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '10px 0',
                borderBottom: '1px solid var(--gray-100)',
                background: mode === p.kind ? 'var(--green-50)' : 'transparent',
                borderRadius: 8,
              }}
            >
              <div style={{ fontSize: 26, marginRight: 8 }}>{p.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{p.name}</div>
                <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>
                  {p.description}
                </div>
              </div>
              {mode === p.kind && <div style={{ color: 'var(--green-text)', fontWeight: 800 }}>✓</div>}
            </button>
          ))}
        </div>

        {/* Custom URL */}
        <div className="card">
          <button
            type="button"
            onClick={() => {
              setMode('url');
              setName('');
            }}
            style={{
              display: 'flex',
              gap: 10,
              alignItems: 'center',
              width: '100%',
              padding: '4px 0 10px',
              borderBottom: '1px solid var(--gray-100)',
              marginBottom: 12,
            }}
          >
            <div style={{ fontSize: 22 }}>🔗</div>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>Paste a calendar URL</div>
              <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>
                webcal://, https://… any .ics feed
              </div>
            </div>
            {mode === 'url' && <div style={{ color: 'var(--green-text)', fontWeight: 800 }}>✓</div>}
          </button>

          <label className="field">Calendar URL</label>
          <input
            className="input"
            placeholder="webcal://… or https://…/calendar.ics"
            value={url}
            onChange={(e) => {
              setMode('url');
              setUrl(e.target.value);
            }}
            autoComplete="off"
            spellCheck={false}
          />
          <div className="muted" style={{ fontSize: 11, marginTop: 6 }}>
            <strong>Where to find it:</strong> GameChanger → Team Settings → Subscribe to Calendar.
            Apple Calendar → right-click → Get Info. Google → Settings → Integrate.
          </div>

          <label className="field" style={{ marginTop: 14 }}>
            What should we call this feed?
          </label>
          <input
            className="input"
            placeholder="e.g. Tigers (GameChanger)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Default leg config */}
        <div className="card">
          <div className="caps muted">Default carpool legs</div>
          <div style={{ fontSize: 13, color: 'var(--gray-700)', marginTop: 4, marginBottom: 12 }}>
            We'll create a drop-off and a pick-up leg for every event. You can tweak any of them
            after import.
          </div>
          <label className="field">Drop-off should arrive…</label>
          {minutesChips(dropEarly, setDropEarly, [5, 10, 15, 20, 30])}
          <div className="muted" style={{ fontSize: 11, marginTop: 4 }}>
            …minutes before the event start time.
          </div>
          <label className="field" style={{ marginTop: 14 }}>Pick-up should leave…</label>
          {minutesChips(pickLate, setPickLate, [0, 5, 10, 15])}
          <div className="muted" style={{ fontSize: 11, marginTop: 4 }}>
            …after the event end time.
          </div>
        </div>

        {/* Preview */}
        {!preview && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={runPreview}
            disabled={previewing || (mode === 'url' && !url.trim())}
          >
            {previewing ? 'Fetching feed…' : '👀 Preview events'}
          </button>
        )}

        {err && (
          <div
            className="card"
            style={{ background: 'var(--red-50)', color: 'var(--red-text)', fontSize: 13 }}
          >
            ⚠️ {err}
          </div>
        )}

        {preview && (
          <>
            <div className="card">
              <div className="caps" style={{ color: 'var(--green-text)' }}>
                ✓ Found {preview.eligible.length} event{preview.eligible.length === 1 ? '' : 's'}
              </div>
              {preview.calendar?.name && (
                <div style={{ fontSize: 13, color: 'var(--gray-700)', marginTop: 4 }}>
                  from <strong>{preview.calendar.name}</strong>
                </div>
              )}
              {preview.skippedPast > 0 && (
                <div className="muted" style={{ fontSize: 12, marginTop: 6 }}>
                  Ignoring {preview.skippedPast} past event{preview.skippedPast === 1 ? '' : 's'}.
                </div>
              )}
              <div
                style={{
                  marginTop: 10,
                  maxHeight: 280,
                  overflowY: 'auto',
                  borderRadius: 8,
                  border: '1px solid var(--gray-100)',
                }}
              >
                {preview.eligible.slice(0, 30).map((ev, i) => (
                  <div
                    key={ev.uid + i}
                    style={{
                      padding: '8px 10px',
                      borderBottom: '1px solid var(--gray-100)',
                      fontSize: 13,
                    }}
                  >
                    <div style={{ fontWeight: 600 }}>{ev.title}</div>
                    <div className="muted" style={{ fontSize: 11, marginTop: 2 }}>
                      {new Date(ev.start).toLocaleString([], {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                      {ev.location ? ` · ${ev.location}` : ''}
                    </div>
                  </div>
                ))}
                {preview.eligible.length > 30 && (
                  <div className="muted" style={{ padding: 10, fontSize: 12 }}>
                    + {preview.eligible.length - 30} more…
                  </div>
                )}
              </div>
              {preview.skipped?.length > 0 && (
                <div className="muted" style={{ fontSize: 11, marginTop: 8 }}>
                  Skipped {preview.skipped.length} event{preview.skipped.length === 1 ? '' : 's'} we
                  couldn't parse.
                </div>
              )}
            </div>

            <button type="button" className="btn btn-primary" onClick={confirm}>
              ✓ Import {preview.eligible.length} event{preview.eligible.length === 1 ? '' : 's'}
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setPreview(null)}
              style={{ marginTop: 4 }}
            >
              Change settings & preview again
            </button>
          </>
        )}
      </div>
    </>
  );
}
