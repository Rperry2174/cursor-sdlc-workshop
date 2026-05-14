const DEMO_LOCATION = { lat: 40.7128, lng: -74.006 };
const SEARCH_RADIUS_MILES = 5;
const OVERPASS_URL = "https://overpass-api.de/api/interpreter";
const watchedClassIds = new Set();

/** Local calendar date (fixes UTC-only `toISOString()` date bugs). */
function localDateToday() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const RADIUS_METERS = Math.round(SEARCH_RADIUS_MILES * 1609.34);

const INSTRUCTORS = [
  "Jordan Lee",
  "Alex Rivera",
  "Sam Okonkwo",
  "Morgan Chen",
  "Riley Patel",
  "Casey Nguyen",
];

function createSeedClasses() {
  const today = localDateToday();
  return [
    {
      id: "c1",
      studio: "Downtown Flow",
      type: "Vinyasa Yoga",
      category: "yoga",
      instructor: "Jordan Lee",
      datetime: `${today}T18:00:00`,
      lat: 40.715,
      lng: -74.003,
      status: "open",
      bookingUrl: "https://example.com/book/downtown-flow/vinyasa",
      source: "seed",
    },
    {
      id: "c2",
      studio: "HIIT Foundry",
      type: "HIIT Circuit",
      category: "hiit",
      instructor: "Alex Rivera",
      datetime: `${today}T19:30:00`,
      lat: 40.732,
      lng: -74.001,
      status: "full_waitlist",
      bookingUrl: "https://example.com/book/hiit-foundry/circuit",
      source: "seed",
    },
    {
      id: "c3",
      studio: "Spin House",
      type: "Rhythm Cycling",
      category: "cycling",
      instructor: "Sam Okonkwo",
      datetime: `${today}T20:00:00`,
      lat: 40.75,
      lng: -73.985,
      status: "full_waitlist",
      bookingUrl: "https://example.com/book/spin-house/rhythm",
      source: "seed",
    },
    {
      id: "c4",
      studio: "Tomorrow Pilates",
      type: "Mat Pilates",
      category: "pilates",
      instructor: "Morgan Chen",
      datetime: "2099-12-31T08:00:00",
      lat: 40.713,
      lng: -74.012,
      status: "open",
      bookingUrl: "https://example.com/book/tomorrow-pilates/mat",
      source: "seed",
    },
  ];
}

/** Current list: seed sample or rows built from OpenStreetMap venues near the user. */
let classes = createSeedClasses();
/** "seed" | "osm" — OSM rows still use simulated times / waitlist flags. */
let dataMode = "seed";

const classContainer = document.getElementById("classes");
const statusEl = document.getElementById("status");

function milesBetween(a, b) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const earthMi = 3958.8;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * earthMi * Math.asin(Math.sqrt(h));
}

function isSameDay(classDateTime) {
  return classDateTime.slice(0, 10) === localDateToday();
}

function formatTime(classDateTime) {
  return new Date(classDateTime).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Safe inside double-quoted HTML attributes (e.g. data-watch). */
function escapeAttr(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;");
}

function getSelectedCategories() {
  const checked = document.querySelectorAll('input[name="pref"]:checked');
  return new Set([...checked].map((input) => input.value));
}

function hash32(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function inferCategoryFromName(name, h) {
  const n = name.toLowerCase();
  if (/yoga|vinyasa|ashtanga|hot yoga/.test(n)) return "yoga";
  if (/pilates/.test(n)) return "pilates";
  if (/hiit|crossfit|boot\s*camp|bootcamp|strength/.test(n)) return "hiit";
  if (/cycle|spin|spinning|cycling|rhythm ride/.test(n)) return "cycling";
  const fallback = ["yoga", "pilates", "hiit", "cycling"];
  return fallback[h % 4];
}

function typeLabelForCategory(category) {
  const map = {
    yoga: "Yoga class",
    pilates: "Pilates class",
    hiit: "HIIT class",
    cycling: "Cycling class",
  };
  return map[category] || "Fitness class";
}

function mapsSearchUrl(name, lat, lng) {
  const q = `${name} ${lat},${lng}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}

function buildOverpassQuery(lat, lng, radiusM) {
  return `[out:json][timeout:25];
(
  node["leisure"="fitness_centre"](around:${radiusM},${lat},${lng});
  way["leisure"="fitness_centre"](around:${radiusM},${lat},${lng});
  node["amenity"="gym"](around:${radiusM},${lat},${lng});
  way["amenity"="gym"](around:${radiusM},${lat},${lng});
);
out center tags;`;
}

function parseOverpassElements(json) {
  const venues = [];
  for (const el of json.elements || []) {
    let la;
    let lo;
    if (el.type === "node") {
      la = el.lat;
      lo = el.lon;
    } else if (el.center) {
      la = el.center.lat;
      lo = el.center.lon;
    } else {
      continue;
    }
    const name =
      el.tags?.name || el.tags?.brand || el.tags?.operator || "Fitness studio";
    venues.push({
      id: `osm-${el.type}-${el.id}`,
      name: String(name),
      lat: la,
      lng: lo,
    });
  }
  const seen = new Set();
  return venues.filter((v) => {
    const key = `${v.name}|${v.lat.toFixed(4)}|${v.lng.toFixed(4)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Real-ish: venue name + coordinates from OSM.
 * Simulated: today's times, instructor names, open vs waitlist (no studio API).
 */
function venuesToClasses(venues, userLat, userLng) {
  const todayLocal = localDateToday();
  const sorted = [...venues]
    .map((v) => ({
      ...v,
      distance: milesBetween({ lat: userLat, lng: userLng }, v),
    }))
    .filter((v) => v.distance <= SEARCH_RADIUS_MILES)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 25);

  const rows = [];
  for (const v of sorted) {
    const h = hash32(v.id);
    const category = inferCategoryFromName(v.name, h);
    const type = typeLabelForCategory(category);
    const slots = 2;
    for (let i = 0; i < slots; i += 1) {
      const startHour = 10 + ((h + i * 3) % 10);
      const startMin = [0, 15, 30, 45][(h + i) % 4];
      const status = (h + i) % 3 === 0 ? "full_waitlist" : "open";
      rows.push({
        id: `${v.id}-slot-${i}`,
        studio: v.name,
        type,
        category,
        instructor: INSTRUCTORS[(h + i) % INSTRUCTORS.length],
        datetime: `${todayLocal}T${String(startHour).padStart(2, "0")}:${String(startMin).padStart(2, "0")}:00`,
        lat: v.lat,
        lng: v.lng,
        status,
        bookingUrl: mapsSearchUrl(v.name, v.lat, v.lng),
        source: "osm",
      });
    }
  }
  return rows;
}

async function loadClassesFromNearbyStudios(lat, lng) {
  const query = buildOverpassQuery(lat, lng, RADIUS_METERS);
  const res = await fetch(OVERPASS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `data=${encodeURIComponent(query)}`,
  });
  if (!res.ok) {
    throw new Error(`Overpass returned ${res.status}`);
  }
  const json = await res.json();
  const venues = parseOverpassElements(json);
  return venuesToClasses(venues, lat, lng);
}

function filteredClasses() {
  const selectedCategories = getSelectedCategories();
  return classes
    .filter((cls) => isSameDay(cls.datetime))
    .map((cls) => ({
      ...cls,
      distance: milesBetween(currentLocation, { lat: cls.lat, lng: cls.lng }),
    }))
    .filter((cls) => cls.distance <= SEARCH_RADIUS_MILES)
    .filter((cls) => selectedCategories.has(cls.category))
    .sort((a, b) => a.distance - b.distance);
}

function notifyUser(message) {
  if ("Notification" in window) {
    if (Notification.permission === "granted") {
      new Notification(message);
      return;
    }
    if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification(message);
        } else {
          alert(message);
        }
      });
      return;
    }
  }
  alert(message);
}

function statusPrefix() {
  if (dataMode === "osm") {
    return "Studios near you from OpenStreetMap. Class times and waitlist are demo-only—confirm on the studio's site. ";
  }
  return "";
}

function render() {
  const selectedCategories = getSelectedCategories();
  if (selectedCategories.size === 0) {
    statusEl.textContent =
      statusPrefix() +
      "Pick at least one class type above, or turn a category back on to see classes.";
    classContainer.innerHTML = "<p>No class types selected.</p>";
    return;
  }

  const visible = filteredClasses();
  statusEl.textContent =
    statusPrefix() +
    `Showing ${visible.length} class(es) within ${SEARCH_RADIUS_MILES} miles for today (matching your class types).`;

  if (visible.length === 0) {
    classContainer.innerHTML =
      "<p>No same-day classes match your filters. Try turning on another class type.</p>";
    return;
  }

  classContainer.innerHTML = visible
    .map((cls) => {
      const watched = watchedClassIds.has(cls.id);
      const waitlistButton =
        cls.status === "full_waitlist"
          ? `<button type="button" data-watch="${escapeAttr(cls.id)}">${watched ? "Watching waitlist" : "Notify me if spot opens"}</button>`
          : "";
      const bookLabel =
        cls.status === "open" ? "Book class" : "Open booking page (waitlist)";
      const bookLink = cls.bookingUrl
        ? `<a class="book-link" href="${escapeAttr(cls.bookingUrl)}" target="_blank" rel="noopener noreferrer">${bookLabel}</a>`
        : "";
      return `
        <article class="card">
          <h3>${escapeHtml(cls.type)} - ${escapeHtml(cls.studio)}</h3>
          <div class="instructor">Instructor: ${escapeHtml(cls.instructor ?? "TBA")}</div>
          <div class="meta">
            ${formatTime(cls.datetime)} | ${cls.distance.toFixed(2)} mi away
          </div>
          <div class="${cls.status === "open" ? "open" : "waitlist"}">
            ${cls.status === "open" ? "Spots available" : "Class full (waitlist available)"}
          </div>
          <div class="card-actions">
            ${bookLink}
            ${waitlistButton}
          </div>
        </article>
      `;
    })
    .join("");
}

let currentLocation = DEMO_LOCATION;

document.getElementById("use-demo-location").addEventListener("click", () => {
  currentLocation = DEMO_LOCATION;
  classes = createSeedClasses();
  dataMode = "seed";
  watchedClassIds.clear();
  statusEl.textContent = "Using demo location and sample classes.";
  render();
});

document.getElementById("use-my-location").addEventListener("click", () => {
  if (!navigator.geolocation) {
    statusEl.textContent =
      statusPrefix() + "Geolocation unsupported. Staying on demo location.";
    return;
  }
  statusEl.textContent = "Getting your location…";
  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      currentLocation = { lat, lng };
      statusEl.textContent = "Loading nearby studios from OpenStreetMap…";
      try {
        const next = await loadClassesFromNearbyStudios(lat, lng);
        watchedClassIds.clear();
        if (next.length === 0) {
          classes = createSeedClasses();
          dataMode = "seed";
          statusEl.textContent =
            "No gyms/fitness centres found in OpenStreetMap within 5 miles. Showing sample data instead.";
        } else {
          classes = next;
          dataMode = "osm";
        }
        render();
      } catch (err) {
        classes = createSeedClasses();
        dataMode = "seed";
        statusEl.textContent = `Could not load nearby studios (${err.message}). Showing sample data.`;
        render();
      }
    },
    () => {
      currentLocation = DEMO_LOCATION;
      classes = createSeedClasses();
      dataMode = "seed";
      watchedClassIds.clear();
      statusEl.textContent =
        "Location denied or unavailable. Using demo location and sample classes.";
      render();
    }
  );
});

document.getElementById("simulate-open").addEventListener("click", () => {
  const watchedClosed = classes.find(
    (cls) => watchedClassIds.has(cls.id) && cls.status === "full_waitlist"
  );
  if (!watchedClosed) {
    statusEl.textContent =
      statusPrefix() + "No watched waitlist class to open yet.";
    return;
  }

  watchedClosed.status = "open";
  render();
  notifyUser(`${watchedClosed.type} at ${watchedClosed.studio} now has an open spot.`);
});

classContainer.addEventListener("click", (event) => {
  const id = event.target.getAttribute("data-watch");
  if (!id) return;

  watchedClassIds.add(id);
  statusEl.textContent = statusPrefix() + "Waitlist alert enabled for selected class.";
  render();
});

document.querySelectorAll('input[name="pref"]').forEach((input) => {
  input.addEventListener("change", () => render());
});

render();
