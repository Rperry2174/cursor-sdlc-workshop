function formatDate(yyyyMmDd) {
  if (!yyyyMmDd) {
    return "Register ASAP";
  }
  const date = new Date(`${yyyyMmDd}T00:00:00`);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function sortBySignupOpen(campA, campB) {
  const a = campA.signupOpen ? new Date(campA.signupOpen).getTime() : Number.MAX_SAFE_INTEGER;
  const b = campB.signupOpen ? new Date(campB.signupOpen).getTime() : Number.MAX_SAFE_INTEGER;
  return a - b;
}

function parseDateOrMax(dateString) {
  return dateString ? new Date(`${dateString}T00:00:00`).getTime() : Number.MAX_SAFE_INTEGER;
}

function assignOverlapGroups(sortedCamps) {
  let groupId = -1;
  let currentGroupEnd = -1;

  for (const camp of sortedCamps) {
    const start = parseDateOrMax(camp.signupOpen);
    const end = parseDateOrMax(camp.signupClose);

    if (start <= currentGroupEnd) {
      camp.overlapGroup = groupId;
      currentGroupEnd = Math.max(currentGroupEnd, end);
    } else {
      groupId += 1;
      camp.overlapGroup = groupId;
      currentGroupEnd = end;
    }
  }
}

function parseLocalYmd(yyyyMmDd) {
  const [y, m, d] = yyyyMmDd.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function startOfWeekMonday(date) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

function addDays(date, n) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate() + n);
  return d;
}

function formatShortRange(mondayDate) {
  const sunday = addDays(mondayDate, 6);
  const opts = { month: "short", day: "numeric" };
  const a = mondayDate.toLocaleDateString("en-US", opts);
  const b = sunday.toLocaleDateString("en-US", opts);
  return `${a} – ${b}`;
}

function fridayOfWeek(weekMonday) {
  return addDays(weekMonday, 4);
}

function buildCampColorMap(withDates) {
  const sorted = [...withDates].sort((a, b) => a.sessionStart.localeCompare(b.sessionStart));
  const map = new Map();
  sorted.forEach((camp, i) => {
    map.set(camp, i);
  });
  return map;
}

function barsOverlap(a, b) {
  return !(a.endCol < b.startCol || b.endCol < a.startCol);
}

function assignBarRows(bars) {
  const sorted = [...bars].sort((x, y) => x.startCol - y.startCol || x.endCol - y.endCol);
  const rowEnds = [];
  for (const bar of sorted) {
    let row = 0;
    while (row < rowEnds.length) {
      const taken = rowEnds[row].some((existing) => barsOverlap(existing, bar));
      if (!taken) {
        break;
      }
      row += 1;
    }
    if (row === rowEnds.length) {
      rowEnds.push([]);
    }
    rowEnds[row].push(bar);
    bar.row = row;
  }
  return rowEnds.length;
}

function renderWeekCalendar(filteredCamps) {
  const calEl = document.getElementById("week-calendar");
  calEl.replaceChildren();

  if (!filteredCamps.length) {
    return;
  }

  const withDates = filteredCamps.filter((c) => c.sessionStart && c.sessionEnd);
  if (!withDates.length) {
    return;
  }

  let minStart = null;
  let maxEnd = null;
  for (const c of withDates) {
    const s = parseLocalYmd(c.sessionStart);
    const e = parseLocalYmd(c.sessionEnd);
    if (!minStart || s < minStart) {
      minStart = s;
    }
    if (!maxEnd || e > maxEnd) {
      maxEnd = e;
    }
  }

  const firstMonday = startOfWeekMonday(minStart);
  const lastMonday = startOfWeekMonday(maxEnd);
  const colorMap = buildCampColorMap(withDates);
  const paletteSize = 8;

  const heading = document.createElement("h2");
  heading.className = "calendar-heading";
  heading.textContent = "Summer calendar (Mon–Fri)";
  calEl.appendChild(heading);

  const hint = document.createElement("p");
  hint.className = "calendar-hint";
  hint.textContent =
    "Each row is one week (Mon–Fri). If a camp runs any day that week, its bar spans the full weekday row so you see the whole week at a glance. Demo dates—confirm with providers.";
  calEl.appendChild(hint);

  const calReal = document.createElement("div");
  calReal.className = "cal-real";

  const headerRow = document.createElement("div");
  headerRow.className = "cal-header-row";
  const corner = document.createElement("div");
  corner.className = "cal-corner";
  corner.textContent = "Week of";
  headerRow.appendChild(corner);
  const dowLabels = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  for (const label of dowLabels) {
    const h = document.createElement("div");
    h.className = "cal-dow-head";
    h.textContent = label;
    headerRow.appendChild(h);
  }
  calReal.appendChild(headerRow);

  for (
    let mon = new Date(firstMonday.getTime());
    mon.getTime() <= lastMonday.getTime();
    mon = addDays(mon, 7)
  ) {
    const fri = fridayOfWeek(mon);

    const row = document.createElement("div");
    row.className = "cal-week-row";

    const sidebar = document.createElement("div");
    sidebar.className = "cal-sidebar";
    const opts = { month: "short", day: "numeric" };
    sidebar.textContent = `${mon.toLocaleDateString("en-US", opts)} – ${fri.toLocaleDateString("en-US", opts)}`;
    row.appendChild(sidebar);

    const main = document.createElement("div");
    main.className = "cal-week-main";

    const daynums = document.createElement("div");
    daynums.className = "cal-daynums";
    for (let i = 0; i < 5; i += 1) {
      const d = addDays(mon, i);
      const cell = document.createElement("div");
      cell.className = "cal-daynum";
      cell.textContent = String(d.getDate());
      daynums.appendChild(cell);
    }
    main.appendChild(daynums);

    const bars = [];
    for (const camp of withDates) {
      const cs = parseLocalYmd(camp.sessionStart);
      const ce = parseLocalYmd(camp.sessionEnd);
      const weekMon = new Date(mon.getFullYear(), mon.getMonth(), mon.getDate());
      const weekFri = new Date(fri.getFullYear(), fri.getMonth(), fri.getDate());
      const overlapsWeek = ce >= weekMon && cs <= weekFri;
      if (!overlapsWeek) {
        continue;
      }
      bars.push({ camp, startCol: 0, endCol: 4 });
    }

    const barsArea = document.createElement("div");
    barsArea.className = "cal-bars-area";

    if (!bars.length) {
      const empty = document.createElement("div");
      empty.className = "cal-bars-empty";
      empty.textContent = "No camp this week";
      barsArea.appendChild(empty);
    } else {
      assignBarRows(bars);
      const rowCount = Math.max(...bars.map((b) => b.row)) + 1;
      barsArea.style.gridTemplateRows = `repeat(${rowCount}, minmax(30px, auto))`;

      for (const bar of bars) {
        const el = document.createElement("div");
        el.className = "cal-event-bar";
        const colorIdx = colorMap.get(bar.camp) % paletteSize;
        el.classList.add(`camp-cal-${colorIdx}`);
        el.textContent = bar.camp.name;
        el.title = `${bar.camp.name} (${bar.camp.session})`;
        const gridColStart = bar.startCol + 1;
        const gridColEnd = bar.endCol + 2;
        el.style.gridColumn = `${gridColStart} / ${gridColEnd}`;
        el.style.gridRow = `${bar.row + 1}`;
        barsArea.appendChild(el);
      }
    }

    main.appendChild(barsArea);
    row.appendChild(main);
    calReal.appendChild(row);
  }

  calEl.appendChild(calReal);

  const legTitle = document.createElement("div");
  legTitle.className = "cal-legend-title";
  legTitle.textContent = "Camp colors";
  calEl.appendChild(legTitle);

  const legRow = document.createElement("div");
  legRow.className = "cal-camp-legend";
  const sortedCamps = [...withDates].sort((a, b) => a.sessionStart.localeCompare(b.sessionStart));
  for (const camp of sortedCamps) {
    const item = document.createElement("div");
    item.className = "cal-legend-item";
    const sw = document.createElement("span");
    const idx = colorMap.get(camp) % paletteSize;
    sw.className = `cal-legend-swatch camp-cal-${idx}`;
    item.appendChild(sw);
    const txt = document.createElement("span");
    txt.textContent = camp.name;
    item.appendChild(txt);
    legRow.appendChild(item);
  }
  calEl.appendChild(legRow);
}

function paragraphWithLabel(labelText, valueText) {
  const p = document.createElement("p");
  const strong = document.createElement("strong");
  strong.textContent = `${labelText}:`;
  p.appendChild(strong);
  p.appendChild(document.createTextNode(` ${valueText}`));
  return p;
}

function createCampCard(camp) {
  const article = document.createElement("article");
  article.className = "camp-card";
  article.classList.add(`group-${camp.overlapGroup % 6}`);

  const title = document.createElement("h3");
  title.textContent = camp.name;
  article.appendChild(title);

  const overlapPill = document.createElement("span");
  overlapPill.className = "overlap-pill";
  overlapPill.textContent = `Overlap group ${camp.overlapGroup + 1}`;
  article.appendChild(overlapPill);

  const desc = document.createElement("p");
  desc.className = "camp-description";
  desc.textContent = camp.description || "";
  article.appendChild(desc);

  article.appendChild(paragraphWithLabel("Provider", camp.provider));
  article.appendChild(paragraphWithLabel("Location", camp.location));
  article.appendChild(paragraphWithLabel("Age range", `${camp.minAge}-${camp.maxAge}`));
  article.appendChild(paragraphWithLabel("Session", camp.session));
  article.appendChild(
    paragraphWithLabel(
      "Signup window",
      `${formatDate(camp.signupOpen)} - ${formatDate(camp.signupClose)}`
    )
  );

  const linkP = document.createElement("p");
  const a = document.createElement("a");
  a.href = camp.signupLink;
  a.target = "_blank";
  a.rel = "noreferrer";
  a.textContent = "Signup page";
  linkP.appendChild(a);
  article.appendChild(linkP);

  return article;
}

function renderLegend(campsInView) {
  const legendEl = document.getElementById("legend");
  legendEl.replaceChildren();

  const seen = new Map();
  for (const camp of campsInView) {
    const label = `Overlap group ${camp.overlapGroup + 1}`;
    if (!seen.has(label)) {
      seen.set(label, camp.overlapGroup % 6);
    }
  }

  for (const [label, groupClass] of seen) {
    const item = document.createElement("div");
    item.className = "legend-item";

    const swatch = document.createElement("span");
    swatch.className = `legend-swatch group-${groupClass}`;
    item.appendChild(swatch);

    const text = document.createElement("span");
    text.textContent = `${label} (signup windows overlap)`;
    item.appendChild(text);

    legendEl.appendChild(item);
  }
}

function render() {
  const ageInput = document.getElementById("age");
  const resultsEl = document.getElementById("results");
  const age = Number(ageInput.value || 5);

  const filtered = camps
    .filter((camp) => camp.location === "Pleasant Hill")
    .filter((camp) => age >= camp.minAge && age <= camp.maxAge)
    .sort(sortBySignupOpen);

  assignOverlapGroups(filtered);
  resultsEl.replaceChildren();
  renderWeekCalendar(filtered);
  renderLegend(filtered);

  if (!filtered.length) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = `No matching camps found for age ${age} in Pleasant Hill.`;
    resultsEl.appendChild(empty);
    return;
  }

  for (const camp of filtered) {
    resultsEl.appendChild(createCampCard(camp));
  }
}

render();
