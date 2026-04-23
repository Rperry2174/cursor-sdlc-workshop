import { useMemo, useState } from 'react';
import './GolfTurfQuote.css';

const RATES = {
  greenPerSqFt: 42,
  fringePerSqFt: 36,
  lawnPerSqFt: 30,
  bunkerPerSqFt: 75,
  chippingPerUnit: 1000,
};

const FRINGE_PCT = { S: 0.2, M: 0.35, L: 0.5 };

const BUNKER_SQFT = { none: 0, S: 150, M: 300, L: 500 };

/** ~5×5 sq ft per chipping station for running “total sq ft” sum (PRD: same price per shape). */
const CHIPPING_SQFT_PER_UNIT = 25;

const ACCESS_OPTIONS = [
  { id: 'great', label: 'Great', sublabel: '1.00×', mult: 1.0 },
  { id: 'good', label: 'Good', sublabel: '1.10×', mult: 1.1 },
  { id: 'okay', label: 'Okay', sublabel: '1.15×', mult: 1.15 },
  { id: 'poor', label: 'Poor', sublabel: '1.25×', mult: 1.25 },
];

function parseNonNeg(value, fallback = 0) {
  const n = Number.parseFloat(String(value).replace(/,/g, ''));
  if (!Number.isFinite(n) || n < 0) return fallback;
  return n;
}

function parseNonNegInt(value, fallback = 0) {
  const n = Number.parseInt(String(value).replace(/,/g, ''), 10);
  if (!Number.isFinite(n) || n < 0) return fallback;
  return n;
}

function formatMoney(n) {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

function formatSqFt(n) {
  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0,
  }).format(n);
}

export default function GolfTurfQuote() {
  const [greenSqFt, setGreenSqFt] = useState('1000');
  const [fringeTier, setFringeTier] = useState('M');
  const [lawnSqFt, setLawnSqFt] = useState('0');
  const [bunkerTier, setBunkerTier] = useState('none');
  const [chippingQty, setChippingQty] = useState('0');
  const [accessId, setAccessId] = useState('great');

  const quote = useMemo(() => {
    const g = parseNonNeg(greenSqFt);
    const fringePct = FRINGE_PCT[fringeTier] ?? FRINGE_PCT.M;
    const fringeSqFt = g * fringePct;
    const lawn = parseNonNeg(lawnSqFt);
    const bunkerSqFt = BUNKER_SQFT[bunkerTier] ?? 0;
    const chipQty = parseNonNegInt(chippingQty);
    const chippingAreaSqFt = chipQty * CHIPPING_SQFT_PER_UNIT;

    const estimatedTotalSqFt = g + fringeSqFt + lawn + bunkerSqFt + chippingAreaSqFt;

    const greenCost = g * RATES.greenPerSqFt;
    const fringeCost = fringeSqFt * RATES.fringePerSqFt;
    const lawnCost = lawn * RATES.lawnPerSqFt;
    const bunkerCost = bunkerSqFt * RATES.bunkerPerSqFt;
    const chippingCost = chipQty * RATES.chippingPerUnit;

    const subtotal = greenCost + fringeCost + lawnCost + bunkerCost + chippingCost;
    const access = ACCESS_OPTIONS.find((o) => o.id === accessId) ?? ACCESS_OPTIONS[0];
    const mult = access.mult;
    const accessAdjustment = subtotal * (mult - 1);
    const total = subtotal + accessAdjustment;

    return {
      estimatedTotalSqFt,
      fringeSqFt,
      bunkerSqFt,
      chipQty,
      greenCost,
      fringeCost,
      lawnCost,
      bunkerCost,
      chippingCost,
      subtotal,
      accessLabel: access.label,
      accessMult: mult,
      accessPct: (mult - 1) * 100,
      accessAdjustment,
      total,
    };
  }, [greenSqFt, fringeTier, lawnSqFt, bunkerTier, chippingQty, accessId]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="gqt">
      <div className="gqt-grid">
        <section className="gqt-card" aria-labelledby="inputs-heading">
          <h2 id="inputs-heading" className="gqt-card-title">
            Job inputs
          </h2>

          <fieldset className="gqt-fieldset">
            <legend className="gqt-legend">Turf areas</legend>
            <label className="gqt-label">
              Golf green (sq ft)
              <input
                className="gqt-input"
                type="number"
                inputMode="decimal"
                min="0"
                step="1"
                value={greenSqFt}
                onChange={(e) => setGreenSqFt(e.target.value)}
              />
            </label>

            <div className="gqt-row-label">Fringe (from green size)</div>
            <div className="gqt-segment" role="group" aria-label="Fringe tier">
              {(['S', 'M', 'L']).map((tier) => (
                <button
                  key={tier}
                  type="button"
                  className={fringeTier === tier ? 'is-active' : ''}
                  onClick={() => setFringeTier(tier)}
                  title={
                    tier === 'S'
                      ? '20% of green sq ft'
                      : tier === 'M'
                        ? '35% of green sq ft'
                        : '50% of green sq ft'
                  }
                >
                  {tier} ({tier === 'S' ? '20%' : tier === 'M' ? '35%' : '50%'})
                </button>
              ))}
            </div>

            <label className="gqt-label">
              Lawn area (sq ft)
              <input
                className="gqt-input"
                type="number"
                inputMode="decimal"
                min="0"
                step="1"
                value={lawnSqFt}
                onChange={(e) => setLawnSqFt(e.target.value)}
              />
            </label>

            <div className="gqt-row-label">Bunker</div>
            <div className="gqt-segment gqt-segment-wrap" role="group" aria-label="Bunker size">
              {[
                { id: 'none', label: 'None' },
                { id: 'S', label: 'S (150)' },
                { id: 'M', label: 'M (300)' },
                { id: 'L', label: 'L (500)' },
              ].map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  className={bunkerTier === id ? 'is-active' : ''}
                  onClick={() => setBunkerTier(id)}
                >
                  {label}
                </button>
              ))}
            </div>

            <label className="gqt-label">
              Chipping areas (count)
              <input
                className="gqt-input"
                type="number"
                inputMode="numeric"
                min="0"
                step="1"
                value={chippingQty}
                onChange={(e) => setChippingQty(e.target.value)}
              />
              <span className="gqt-hint">
                $1,000 per unit. Total sq ft sum uses ~{CHIPPING_SQFT_PER_UNIT} sq ft per unit.
              </span>
            </label>

            <p className="gqt-running">
              <strong>Estimated total sq ft (incl. fringe &amp; chipping est.):</strong>{' '}
              {formatSqFt(quote.estimatedTotalSqFt)} sq ft
            </p>
          </fieldset>

          <fieldset className="gqt-fieldset">
            <legend className="gqt-legend">Site access</legend>
            <p className="gqt-hint gqt-hint-tight">
              Applies to subtotal: +0% / +10% / +15% / +25% (Great → Poor).
            </p>
            <div className="gqt-access-grid" role="radiogroup" aria-label="Site access rating">
              {ACCESS_OPTIONS.map((opt) => (
                <label key={opt.id} className="gqt-access-option">
                  <input
                    type="radio"
                    name="site-access"
                    checked={accessId === opt.id}
                    onChange={() => setAccessId(opt.id)}
                  />
                  <span className="gqt-access-text">
                    {opt.label} <span className="gqt-access-sub">{opt.sublabel}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </section>

        <section className="gqt-card gqt-card-quote" aria-labelledby="quote-heading">
          <div className="gqt-quote-header">
            <h2 id="quote-heading" className="gqt-card-title">
              Quote
            </h2>
            <button type="button" className="gqt-print" onClick={handlePrint}>
              Print / PDF
            </button>
          </div>

          <dl className="gqt-dl">
            <div className="gqt-dl-row">
              <dt>Golf green</dt>
              <dd>{formatMoney(quote.greenCost)}</dd>
            </div>
            <div className="gqt-dl-row gqt-dl-muted">
              <dt>
                Fringe ({formatSqFt(quote.fringeSqFt)} sq ft @ ${RATES.fringePerSqFt})
              </dt>
              <dd>{formatMoney(quote.fringeCost)}</dd>
            </div>
            <div className="gqt-dl-row">
              <dt>Lawn</dt>
              <dd>{formatMoney(quote.lawnCost)}</dd>
            </div>
            <div className="gqt-dl-row">
              <dt>Bunker ({formatSqFt(quote.bunkerSqFt)} sq ft)</dt>
              <dd>{formatMoney(quote.bunkerCost)}</dd>
            </div>
            <div className="gqt-dl-row">
              <dt>Chipping ({quote.chipQty} × ${RATES.chippingPerUnit.toLocaleString()})</dt>
              <dd>{formatMoney(quote.chippingCost)}</dd>
            </div>
            <div className="gqt-dl-row gqt-dl-sub">
              <dt>Subtotal</dt>
              <dd>{formatMoney(quote.subtotal)}</dd>
            </div>
            <div className="gqt-dl-row">
              <dt>
                Access ({quote.accessLabel}, +{quote.accessPct.toFixed(0)}%)
              </dt>
              <dd>{formatMoney(quote.accessAdjustment)}</dd>
            </div>
            <div className="gqt-dl-total">
              <dt>Estimated total</dt>
              <dd>{formatMoney(quote.total)}</dd>
            </div>
          </dl>
          <p className="gqt-disclaimer">
            Indicative estimate only — not a binding bid. Confirm measurements, access, and material
            specs on site. Rates are static for this MVP.
          </p>
        </section>
      </div>
    </div>
  );
}
