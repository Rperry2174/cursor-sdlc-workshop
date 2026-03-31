const STORAGE_KEY = "subspend-subscriptions";

/** @typedef {{ id: string, name: string, amount: number, period: 'monthly' | 'yearly' }} Sub */

function loadSubs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (s) =>
        s &&
        typeof s.id === "string" &&
        typeof s.name === "string" &&
        typeof s.amount === "number" &&
        (s.period === "monthly" || s.period === "yearly")
    );
  } catch {
    return [];
  }
}

/** @param {Sub[]} subs */
function saveSubs(subs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(subs));
}

/** @param {Sub} s */
function monthlyEquivalent(s) {
  return s.period === "yearly" ? s.amount / 12 : s.amount;
}

function formatMoney(n) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

/** @param {Sub[]} subs */
function render(subs) {
  const tbody = document.getElementById("tbody");
  const table = document.getElementById("table");
  const empty = document.getElementById("empty");
  const totalDisplay = document.getElementById("total-display");
  const totalNote = document.getElementById("total-note");

  tbody.replaceChildren();

  if (subs.length === 0) {
    empty.classList.remove("hidden");
    table.hidden = true;
  } else {
    empty.classList.add("hidden");
    table.hidden = false;

    for (const s of subs) {
      const perMonth = monthlyEquivalent(s);
      const tr = document.createElement("tr");

      const tdName = document.createElement("td");
      tdName.textContent = s.name;
      tr.appendChild(tdName);

      const tdPay = document.createElement("td");
      tdPay.className = "mono";
      if (s.period === "yearly") {
        tdPay.textContent = `${formatMoney(s.amount)} / year`;
      } else {
        tdPay.textContent = `${formatMoney(s.amount)} / month`;
      }
      tr.appendChild(tdPay);

      const tdEq = document.createElement("td");
      tdEq.className = "mono";
      if (s.period === "yearly") {
        tdEq.textContent = `${formatMoney(perMonth)} / mo (${formatMoney(s.amount)} ÷ 12)`;
      } else {
        tdEq.textContent = `${formatMoney(perMonth)} / mo`;
      }
      tr.appendChild(tdEq);

      tbody.appendChild(tr);
    }
  }

  const total = subs.reduce((sum, s) => sum + monthlyEquivalent(s), 0);
  totalDisplay.textContent = `${formatMoney(total)} / month`;

  const yearlyCount = subs.filter((s) => s.period === "yearly").length;
  if (subs.length === 0) {
    totalNote.textContent = "";
  } else if (yearlyCount > 0) {
    totalNote.textContent =
      "Yearly prices are converted with ÷ 12 so you can compare everything as a monthly run rate.";
  } else {
    totalNote.textContent = "All amounts are already monthly.";
  }
}

function init() {
  let subs = loadSubs();

  document.getElementById("form").addEventListener("submit", (e) => {
    e.preventDefault();
    const nameEl = document.getElementById("name");
    const amountEl = document.getElementById("amount");
    const periodEl = document.getElementById("period");

    const name = nameEl.value.trim();
    const amount = Number(amountEl.value);
    const period = periodEl.value === "yearly" ? "yearly" : "monthly";

    if (!name || Number.isNaN(amount) || amount < 0) return;

    subs.push({
      id: crypto.randomUUID(),
      name,
      amount,
      period,
    });
    saveSubs(subs);
    render(subs);

    nameEl.value = "";
    amountEl.value = "";
    nameEl.focus();
  });

  render(subs);
}

init();
