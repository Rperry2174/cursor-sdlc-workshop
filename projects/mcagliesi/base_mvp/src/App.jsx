import { useMemo, useState } from 'react'
import { MATCHES, SEASON_LABEL, SHAPES, shapeLabel } from './data.js'
import './App.css'

function formatDate(iso) {
  return new Date(iso + 'T12:00:00').toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })
}

function result(score) {
  if (score[0] > score[1]) return { label: 'W', cls: 'result--w' }
  if (score[0] < score[1]) return { label: 'L', cls: 'result--l' }
  return { label: 'D', cls: 'result--d' }
}

export default function App() {
  const [matchId, setMatchId] = useState(null)

  const match = useMemo(() => MATCHES.find((m) => m.id === matchId), [matchId])

  if (match) {
    return (
      <div className="wrap">
        <button type="button" className="link-back" onClick={() => setMatchId(null)}>
          ← All matches
        </button>

        <header className="match-head">
          <p className="meta">{match.competition} · {SEASON_LABEL}</p>
          <h1>
            Liverpool {match.score[0]}–{match.score[1]} {match.opponent}
          </h1>
          <p className="meta">
            {formatDate(match.date)} · {match.venue === 'H' ? 'Home' : 'Away'}
          </p>
        </header>

        <h2 className="h2">Tactical timeline</h2>
        <p className="hint">Analyst-authored segments (demo). Not real match data.</p>

        <ol className="segments">
          {match.segments.map((s, i) => (
            <li key={i} className="segment">
              <div className="segment__time">
                {s.start}–{s.end}′
              </div>
              <div className="segment__body">
                <p className="segment__ctx">
                  <strong>{s.context}</strong> · {s.phase}
                </p>
                <p className="segment__shapes">
                  <span>IP: {shapeLabel(s.inShape)}</span>
                  <span>OOP: {shapeLabel(s.outShape)}</span>
                </p>
                <p className="segment__trigger">
                  <em>Trigger:</em> {s.trigger}
                </p>
                <ul>
                  {s.roles.map((r, j) => (
                    <li key={j}>{r}</li>
                  ))}
                </ul>
                <p className={`conf conf--${s.confidence}`}>{s.confidence} confidence</p>
              </div>
            </li>
          ))}
        </ol>

        <section className="glossary">
          <h2 className="h2">Shape glossary (this MVP)</h2>
          <dl>
            {SHAPES.map((sh) => (
              <div key={sh.id} className="glossary__row">
                <dt>{sh.name}</dt>
                <dd>{sh.text}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    )
  }

  return (
    <div className="wrap">
      <header className="home-head">
        <h1>Liverpool tactical timeline</h1>
        <p className="lede">
          Minimal demo from <code>prd.md</code>: match list → segment timeline + shape labels.
        </p>
        <p className="meta">{SEASON_LABEL}</p>
      </header>

      <ul className="match-list">
        {MATCHES.map((m) => (
          <li key={m.id}>
            <button type="button" className="match-row" onClick={() => setMatchId(m.id)}>
              <span className={`result-badge ${result(m.score).cls}`}>
                {result(m.score).label}
              </span>
              <div className="match-row__info">
                <span className="match-row__opp">
                  vs {m.opponent}
                </span>
                <span className="match-row__meta">
                  {m.competition} · {formatDate(m.date)} · {m.score[0]}–{m.score[1]}
                </span>
                <p className="match-row__fp">{m.fingerprint}</p>
              </div>
            </button>
          </li>
        ))}
      </ul>

      <section className="glossary glossary--home">
        <h2 className="h2">Shape glossary</h2>
        <p className="hint">Same definitions used in segment labels above.</p>
        <ul className="shape-chips">
          {SHAPES.map((sh) => (
            <li key={sh.id}>
              <strong>{sh.name}</strong> — {sh.text}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
