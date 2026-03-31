const expenses = [
  { category: "Rent", amount: 1650, type: "fixed" },
  { category: "Utilities", amount: 220, type: "fixed" },
  { category: "Groceries", amount: 540, type: "variable" },
  { category: "Dining Out", amount: 360, type: "variable" },
  { category: "Credit Card Payment", amount: 420, type: "debt" },
  { category: "Subscriptions", amount: 98, type: "subscription" }
];

const subscriptionItems = [
  { name: "Streaming Bundle", monthlyCost: 39 },
  { name: "Fitness App", monthlyCost: 19 },
  { name: "Cloud Storage", monthlyCost: 20 },
  { name: "News Subscription", monthlyCost: 20 }
];

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

function appendTextWithGreenCurrency(container, text) {
  const currencyPattern = /(\$[\d,]+(?:\.\d{1,2})?)/g;
  const currencyMatch = /^\$[\d,]+(?:\.\d{1,2})?$/;
  const parts = text.split(currencyPattern);

  parts.forEach((part) => {
    if (!part) {
      return;
    }

    if (currencyMatch.test(part)) {
      const moneySpan = document.createElement("span");
      moneySpan.className = "money";
      moneySpan.textContent = part;
      container.appendChild(moneySpan);
      return;
    }

    container.appendChild(document.createTextNode(part));
  });
}

function getTotalMonthlySpend(data) {
  return data.reduce((sum, item) => sum + item.amount, 0);
}

function getTopCategories(data, count) {
  return [...data].sort((a, b) => b.amount - a.amount).slice(0, count);
}

function getTotalSubscriptions(items) {
  return items.reduce((sum, item) => sum + item.monthlyCost, 0);
}

function getAdvice(data, subscriptionsTotal) {
  const total = getTotalMonthlySpend(data);
  const topVariable = [...data]
    .filter((item) => item.type === "variable")
    .sort((a, b) => b.amount - a.amount)[0];
  const creditCard = data.find((item) => item.type === "debt");
  const advice = [];

  if (subscriptionsTotal >= 80) {
    advice.push(
      `Subscriptions are ${formatCurrency(subscriptionsTotal)}/month. Review services you have not used in 30 days and cancel 1-2 this week.`
    );
  }

  if (topVariable) {
    const reduction = Math.round(topVariable.amount * 0.15);
    advice.push(
      `${topVariable.category} is your largest variable expense. Cutting 15% could save about ${formatCurrency(reduction)} each month.`
    );
  }

  if (creditCard && creditCard.amount / total > 0.12) {
    advice.push(
      `Credit card payments are ${Math.round((creditCard.amount / total) * 100)}% of monthly spend. Focus extra payments on the highest-interest balance first.`
    );
  }

  if (advice.length === 0) {
    advice.push("Spending looks stable. Pick one category to reduce by 5% this month.");
  }

  return advice;
}

function renderSummary() {
  const summaryContainer = document.getElementById("summary");
  const totalSpend = getTotalMonthlySpend(expenses);
  const topCategories = getTopCategories(expenses, 3);
  const subscriptionsTotal = getTotalSubscriptions(subscriptionItems);

  const metrics = [
    { label: "Total Monthly Spend", value: formatCurrency(totalSpend) },
    {
      label: "Top 3 Categories",
      value: topCategories.map((item) => item.category).join(", ")
    },
    { label: "Monthly Subscriptions", value: formatCurrency(subscriptionsTotal) }
  ];

  metrics.forEach((metric) => {
    const metricCard = document.createElement("div");
    metricCard.className = "metric";

    const label = document.createElement("p");
    label.className = "metric-label";
    label.textContent = metric.label;

    const value = document.createElement("p");
    value.className = "metric-value";
    value.textContent = metric.value;
    if (metric.value.startsWith("$")) {
      value.classList.add("money");
    }

    metricCard.appendChild(label);
    metricCard.appendChild(value);
    summaryContainer.appendChild(metricCard);
  });
}

function renderExpenseTable() {
  const tableBody = document.getElementById("expense-table-body");

  expenses.forEach((item) => {
    const row = document.createElement("tr");

    const categoryCell = document.createElement("td");
    categoryCell.textContent = item.category;

    const amountCell = document.createElement("td");
    amountCell.textContent = formatCurrency(item.amount);
    amountCell.className = "money";

    row.appendChild(categoryCell);
    row.appendChild(amountCell);
    tableBody.appendChild(row);
  });
}

function renderAdvice() {
  const adviceList = document.getElementById("advice-list");
  const subscriptionsTotal = getTotalSubscriptions(subscriptionItems);
  const adviceItems = getAdvice(expenses, subscriptionsTotal);

  const encouragementItem = document.createElement("li");
  encouragementItem.textContent = "You can do this! Small changes each month add up.";
  adviceList.appendChild(encouragementItem);

  adviceItems.forEach((text) => {
    const listItem = document.createElement("li");
    appendTextWithGreenCurrency(listItem, text);
    adviceList.appendChild(listItem);
  });
}

renderSummary();
renderExpenseTable();
renderAdvice();
