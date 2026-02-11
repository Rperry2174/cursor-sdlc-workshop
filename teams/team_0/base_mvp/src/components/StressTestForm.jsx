const DIMENSION_LABELS = {
  tam: 'TAM / Market size',
  risks: 'Risks',
  marketPotential: 'Market potential',
  barriersToEntry: 'Barriers to entry',
  competitiveLandscape: 'Competitive landscape',
}

function StressTestForm({ data, onChange, onGenerateReport }) {
  const update = (key, value) => {
    onChange({ ...data, [key]: value })
  }

  const updateRisks = (index, value) => {
    const next = [...data.risks]
    next[index] = value
    update('risks', next)
  }

  const updateScore = (dimension, value) => {
    const next = { ...data.scores, [dimension]: Number(value) }
    update('scores', next)
  }

  return (
    <form
      className="stress-test-form"
      onSubmit={(e) => {
        e.preventDefault()
        onGenerateReport()
      }}
    >
      <section className="form-section">
        <h2 className="form-section-title">Startup</h2>
        <label>
          <span>Name</span>
          <input
            type="text"
            value={data.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="e.g. Acme SaaS"
          />
        </label>
        <label>
          <span>One-line description</span>
          <input
            type="text"
            value={data.description}
            onChange={(e) => update('description', e.target.value)}
            placeholder="What does it do?"
          />
        </label>
      </section>

      <section className="form-section">
        <h2 className="form-section-title">TAM / SAM / SOM</h2>
        <label>
          <span>TAM (Total Addressable Market)</span>
          <input
            type="text"
            value={data.tam}
            onChange={(e) => update('tam', e.target.value)}
            placeholder="e.g. $50B globally"
          />
        </label>
        <label>
          <span>SAM (Serviceable Addressable Market)</span>
          <input
            type="text"
            value={data.sam}
            onChange={(e) => update('sam', e.target.value)}
            placeholder="e.g. $5B in North America"
          />
        </label>
        <label>
          <span>SOM (Serviceable Obtainable Market)</span>
          <input
            type="text"
            value={data.som}
            onChange={(e) => update('som', e.target.value)}
            placeholder="e.g. $50M in year 3"
          />
        </label>
      </section>

      <section className="form-section">
        <h2 className="form-section-title">Biggest risks</h2>
        {data.risks.map((risk, i) => (
          <label key={i}>
            <span>Risk {i + 1}</span>
            <input
              type="text"
              value={risk}
              onChange={(e) => updateRisks(i, e.target.value)}
              placeholder="e.g. Regulatory change"
            />
          </label>
        ))}
      </section>

      <section className="form-section">
        <h2 className="form-section-title">Market & barriers</h2>
        <label>
          <span>Market potential</span>
          <textarea
            value={data.marketPotential}
            onChange={(e) => update('marketPotential', e.target.value)}
            placeholder="Why is this market attractive? Growth, timing?"
            rows={3}
          />
        </label>
        <label>
          <span>Barriers to entry</span>
          <textarea
            value={data.barriersToEntry}
            onChange={(e) => update('barriersToEntry', e.target.value)}
            placeholder="What keeps competitors out?"
            rows={3}
          />
        </label>
      </section>

      <section className="form-section">
        <h2 className="form-section-title">Competitive landscape</h2>
        <label>
          <span>Competitors</span>
          <input
            type="text"
            value={data.competitors}
            onChange={(e) => update('competitors', e.target.value)}
            placeholder="Who else is in this space?"
          />
        </label>
        <label>
          <span>Differentiation</span>
          <input
            type="text"
            value={data.differentiation}
            onChange={(e) => update('differentiation', e.target.value)}
            placeholder="One sentence: why you win"
          />
        </label>
        <label>
          <span>Traction / validation</span>
          <input
            type="text"
            value={data.traction}
            onChange={(e) => update('traction', e.target.value)}
            placeholder="e.g. Waitlist, pilot, first revenue"
          />
        </label>
      </section>

      <section className="form-section">
        <h2 className="form-section-title">Scores (1–5)</h2>
        <p className="form-hint">1 = weak, 5 = strong. Overall determines verdict.</p>
        {Object.keys(DIMENSION_LABELS).map((dim) => (
          <label key={dim} className="score-row">
            <span>{DIMENSION_LABELS[dim]}</span>
            <select
              value={data.scores[dim]}
              onChange={(e) => updateScore(dim, e.target.value)}
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        ))}
        <label>
          <span>Overall feasibility</span>
          <select
            value={data.scores.overall}
            onChange={(e) => updateScore('overall', e.target.value)}
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Verdict (optional)</span>
          <input
            type="text"
            value={data.verdict}
            onChange={(e) => update('verdict', e.target.value)}
            placeholder="e.g. High / Medium / Low feasibility"
          />
        </label>
      </section>

      <button type="submit" className="generate-btn">
        Generate report
      </button>
    </form>
  )
}

export default StressTestForm
