const BASE_SEAT_PRICE = 40;
const CTR_LIST_RATE = 0.25;
const POINT_COUNT = 11;

const MATRIX = {
  20: { small: 0.0, mid: 0.05, large: 0.1 },
  30: { small: 0.05, mid: 0.05, large: 0.1 },
  40: { small: 0.1, mid: 0.15, large: 0.2 },
  50: { small: 0.15, mid: 0.2, large: 0.25 },
  60: { small: 0.2, mid: 0.25, large: 0.3 },
  70: { small: 0.25, mid: 0.3, large: 0.35 },
  80: { small: 0.3, mid: 0.35, large: 0.4 },
  90: { small: 0.35, mid: 0.4, large: 0.45 },
  100: { small: 0.4, mid: 0.45, large: 0.5 }
};

const TERM_UPLIFT = {
  1: 0.0,
  2: 0.05,
  3: 0.1
};

function currency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

function rate(value) {
  return `$${value.toFixed(4)}/M`;
}

function percent(value) {
  return `${(value * 100).toFixed(0)}%`;
}

function seatTier(seats) {
  if (seats <= 500) return "small";
  if (seats <= 1000) return "mid";
  return "large";
}

function seatTierLabel(tier) {
  const labels = {
    small: "0-500 seats",
    mid: "500-1,000 seats",
    large: "1,000+ seats"
  };
  return labels[tier] || "Unknown tier";
}

function acvBand(acv) {
  if (acv <= 100000) return "tier1";
  if (acv <= 250000) return "tier2";
  if (acv <= 500000) return "tier3";
  if (acv <= 1000000) return "tier4";
  return "tier5";
}

function acvBandLabel(acv) {
  const band = acvBand(acv);
  const labels = {
    tier1: "$0 - $100K",
    tier2: "$100K - $250K",
    tier3: "$250K - $500K",
    tier4: "$500K - $1M",
    tier5: "$1M+"
  };
  return labels[band];
}

function maxCtrDiscount(acv, term) {
  const band = acvBand(acv);
  const termKey = Number(term);

  const table = {
    tier1: { 1: 0.0, 2: 0.05, 3: 0.1 },
    tier2: { 1: 0.1, 2: 0.15, 3: 0.2 },
    tier3: { 1: 0.2, 2: 0.25, 3: 0.3 },
    tier4: { 1: 0.3, 2: 0.35, 3: 0.4 },
    tier5: { 1: 0.4, 2: 0.45, 3: 0.5 }
  };

  return table[band][termKey];
}

function generateAcvCtrCurve(minACV, maxACV, term) {
  const points = [];
  for (let i = 0; i < POINT_COUNT; i += 1) {
    const ratio = POINT_COUNT === 1 ? 0 : i / (POINT_COUNT - 1);
    const acv = maxACV - ratio * (maxACV - minACV);
    const maxDiscount = maxCtrDiscount(acv, term);
    const minCtrRate = CTR_LIST_RATE * (1 - maxDiscount);

    points.push({
      point: i + 1,
      acv,
      acvBand: acvBandLabel(acv),
      maxDiscount,
      minCtrRate
    });
  }
  return points;
}

function calculate(seats, usage, term) {
  const tier = seatTier(seats);
  const tierLabel = seatTierLabel(tier);
  const baseMatrixDiscount = MATRIX[usage][tier];
  const termUplift = TERM_UPLIFT[term];
  const finalCoreDiscount = Math.min(1, baseMatrixDiscount + termUplift);

  const listCoreACV = seats * 12 * (BASE_SEAT_PRICE + usage);
  const discountedCoreACV = listCoreACV * (1 - finalCoreDiscount);
  const minACV = Math.min(listCoreACV, discountedCoreACV);
  const maxACV = Math.max(listCoreACV, discountedCoreACV);

  const acvCtrCurvePoints = generateAcvCtrCurve(minACV, maxACV, term);
  const minCtrRate = Math.min(...acvCtrCurvePoints.map((p) => p.minCtrRate));
  const maxCtrRate = Math.max(...acvCtrCurvePoints.map((p) => p.minCtrRate));

  return {
    seats,
    usage,
    term,
    tier,
    tierLabel,
    baseMatrixDiscount,
    termUplift,
    finalCoreDiscount,
    listCoreACV,
    discountedCoreACV,
    minACV,
    maxACV,
    minCtrRate,
    maxCtrRate,
    acvCtrCurvePoints
  };
}

function termLabel(term) {
  const labels = {
    1: "1 Year",
    2: "2 Years",
    3: "3+ Years"
  };
  return labels[term] || "Unknown";
}

function buildSummary(result) {
  const header = [
    "Cursor Deal Pricing Calculator",
    `Inputs: seats=${result.seats}, usage/user=$${result.usage}, term=${termLabel(result.term)}`,
    `Core discount: ${percent(result.finalCoreDiscount)} (base ${percent(
      result.baseMatrixDiscount
    )} + term ${percent(result.termUplift)})`,
    `ACV range: ${currency(result.minACV)} - ${currency(result.maxACV)}`,
    `CTR floor range: ${rate(result.minCtrRate)} - ${rate(result.maxCtrRate)}`,
    "ACV->CTR points:"
  ];
  const rows = result.acvCtrCurvePoints.map(
    (p) =>
      `P${p.point}: ACV ${currency(p.acv)} | Band ${p.acvBand} | Max CTR discount ${percent(
        p.maxDiscount
      )} | Min CTR ${rate(p.minCtrRate)}`
  );
  return [...header, ...rows].join("\n");
}

function renderResults(result) {
  const results = document.getElementById("results");
  results.innerHTML = `
    <div class="stat">
      <h3>Base Discount</h3>
      <div class="value">${percent(result.baseMatrixDiscount)}</div>
      <div class="muted">Driven by ${result.tierLabel} and $${result.usage} pre-commit/user</div>
    </div>
    <div class="stat">
      <h3>Term Discount</h3>
      <div class="value">${percent(result.termUplift)}</div>
      <div class="muted">Driven by ${termLabel(result.term)}</div>
    </div>
    <div class="stat">
      <h3>Total Discount</h3>
      <div class="value">${percent(result.finalCoreDiscount)}</div>
      <div class="muted">Base + term uplift (additive)</div>
    </div>
    <div class="stat">
      <h3>List Core ACV</h3>
      <div class="value">${currency(result.listCoreACV)}</div>
      <div class="muted">Seat + committed usage annualized</div>
    </div>
    <div class="stat">
      <h3>Discounted Core ACV</h3>
      <div class="value">${currency(result.discountedCoreACV)}</div>
      <div class="muted">After additive core discount</div>
    </div>
    <div class="stat">
      <h3>ACV Range</h3>
      <div class="value">${currency(result.minACV)} - ${currency(result.maxACV)}</div>
      <div class="muted">[discounted core ACV, list core ACV]</div>
    </div>
    <div class="stat">
      <h3>CTR Floor Range</h3>
      <div class="value">${rate(result.minCtrRate)} - ${rate(result.maxCtrRate)}</div>
      <div class="muted">Read each ACV point below for exact paired CTR</div>
    </div>
    <div class="stat">
      <h3>Curve Points</h3>
      <div class="value">${result.acvCtrCurvePoints.length}</div>
      <div class="muted">Ordered from list ACV down to max-discount ACV</div>
    </div>
  `;

  const tbody = document.querySelector("#curve-table tbody");
  const rows = result.acvCtrCurvePoints
    .map(
      (p) => `
      <tr>
        <td>${p.point}</td>
        <td>${currency(p.acv)}</td>
        <td>${p.acvBand}</td>
        <td>${percent(p.maxDiscount)}</td>
        <td>${rate(p.minCtrRate)}</td>
      </tr>
    `
    )
    .join("");
  tbody.innerHTML = rows;
}

function validateInputs(seats, usage, term) {
  if (!Number.isFinite(seats) || seats < 1) {
    return "Seats must be at least 1.";
  }
  if (!MATRIX[usage]) {
    return "Committed usage per user must be one of: $20, $30, ..., $100.";
  }
  if (!(term in TERM_UPLIFT)) {
    return "Term must be 1, 2, or 3+ years.";
  }
  return "";
}

const form = document.getElementById("pricing-form");
const errorEl = document.getElementById("error");
const resetBtn = document.getElementById("reset-btn");
const copySummaryBtn = document.getElementById("copy-summary-btn");

let lastResult = null;

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const seats = Number(document.getElementById("seats").value);
  const usage = Number(document.getElementById("usage").value);
  const term = Number(document.getElementById("term").value);

  const error = validateInputs(seats, usage, term);
  if (error) {
    errorEl.textContent = error;
    return;
  }

  errorEl.textContent = "";
  const result = calculate(seats, usage, term);
  lastResult = result;
  renderResults(result);
});

resetBtn.addEventListener("click", () => {
  document.getElementById("seats").value = 300;
  document.getElementById("usage").value = 20;
  document.getElementById("term").value = 1;
  errorEl.textContent = "";
  const result = calculate(300, 20, 1);
  lastResult = result;
  renderResults(result);
});

copySummaryBtn.addEventListener("click", async () => {
  if (!lastResult) return;
  const summary = buildSummary(lastResult);
  try {
    await navigator.clipboard.writeText(summary);
    copySummaryBtn.textContent = "Copied";
    setTimeout(() => {
      copySummaryBtn.textContent = "Copy Summary";
    }, 1200);
  } catch (error) {
    errorEl.textContent = "Could not copy summary. Your browser may block clipboard access.";
  }
});

const initial = calculate(300, 20, 1);
lastResult = initial;
renderResults(initial);
