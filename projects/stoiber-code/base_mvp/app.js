(function () {
  "use strict";

  var KEY = "pixel-pace-mvp";
  var LABELS = [
    "Couch Potato",
    "Warming Up",
    "Steady Runner",
    "Marathon Mind",
  ];

  function tier(n) {
    if (n <= 0) return 0;
    if (n <= 4) return 1;
    if (n <= 14) return 2;
    return 3;
  }

  function formatPaceMinPerMile(paceMin) {
    if (!isFinite(paceMin) || paceMin <= 0) return "—";
    var whole = Math.floor(paceMin);
    var sec = Math.round((paceMin - whole) * 60);
    if (sec >= 60) {
      whole += 1;
      sec -= 60;
    }
    if (sec === 60) {
      whole += 1;
      sec = 0;
    }
    return whole + ":" + String(sec).padStart(2, "0");
  }

  function paceMinPerMile(distanceMi, durationMin) {
    if (!(distanceMi > 0) || !(durationMin > 0)) return NaN;
    return durationMin / distanceMi;
  }

  function normalizeRuns(arr) {
    if (!Array.isArray(arr)) return [];
    return arr.filter(function (r) {
      return (
        r &&
        typeof r.distance === "number" &&
        r.distance > 0 &&
        typeof r.durationMin === "number" &&
        r.durationMin > 0
      );
    });
  }

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return { runs: [], legacyTotal: 0 };
      var o = JSON.parse(raw);
      if (Array.isArray(o.runs)) {
        return {
          runs: normalizeRuns(o.runs),
          legacyTotal:
            typeof o.legacyTotal === "number" && o.legacyTotal > 0
              ? Math.floor(o.legacyTotal)
              : 0,
        };
      }
      if (typeof o.totalRuns === "number" && o.totalRuns > 0) {
        return { runs: [], legacyTotal: Math.floor(o.totalRuns) };
      }
      return { runs: [], legacyTotal: 0 };
    } catch (e) {
      return { runs: [], legacyTotal: 0 };
    }
  }

  function save(state) {
    var payload = { runs: state.runs };
    if (state.legacyTotal > 0) payload.legacyTotal = state.legacyTotal;
    localStorage.setItem(KEY, JSON.stringify(payload));
  }

  function totalRuns(state) {
    return state.runs.length + state.legacyTotal;
  }

  function updateAverages(state) {
    var runs = state.runs;
    var distEl = document.getElementById("avgDist");
    var timeEl = document.getElementById("avgTime");
    var paceEl = document.getElementById("avgPace");
    if (!runs.length) {
      distEl.textContent = "—";
      timeEl.textContent = "—";
      paceEl.textContent = "—";
      return;
    }
    var totalDist = 0;
    var totalMin = 0;
    for (var i = 0; i < runs.length; i++) {
      totalDist += runs[i].distance;
      totalMin += runs[i].durationMin;
    }
    var n = runs.length;
    distEl.textContent = String(Math.round((totalDist / n) * 100) / 100);
    timeEl.textContent = String(Math.round((totalMin / n) * 100) / 100);
    var overallPace = totalDist > 0 ? totalMin / totalDist : NaN;
    paceEl.textContent = formatPaceMinPerMile(overallPace);
  }

  function paint(state) {
    var n = totalRuns(state);
    var t = tier(n);
    var wrap = document.getElementById("runner");
    wrap.setAttribute("data-tier", String(t));
    var img = document.getElementById("runnerImg");
    img.src = "assets/tier-" + t + ".png";
    img.alt = LABELS[t] + " runner";
    document.getElementById("tierLabel").textContent = LABELS[t];
    document.getElementById("totalRuns").textContent = String(n);
    updateAverages(state);
  }

  function readInputs() {
    var d = parseFloat(document.getElementById("distance").value);
    var m = parseFloat(document.getElementById("durationMin").value);
    return { distance: d, durationMin: m };
  }

  function updatePacePreview() {
    var v = readInputs();
    var p = paceMinPerMile(v.distance, v.durationMin);
    document.getElementById("pacePreview").textContent = formatPaceMinPerMile(p);
  }

  function setFormErr(msg) {
    var el = document.getElementById("formErr");
    if (!msg) {
      el.hidden = true;
      el.textContent = "";
      return;
    }
    el.hidden = false;
    el.textContent = msg;
  }

  var state = load();
  paint(state);
  updatePacePreview();

  document.getElementById("distance").addEventListener("input", updatePacePreview);
  document.getElementById("durationMin").addEventListener("input", updatePacePreview);

  document.getElementById("resetBtn").addEventListener("click", function () {
    if (
      !window.confirm(
        "Clear all logged runs and reset your runner to tier 0? This cannot be undone."
      )
    ) {
      return;
    }
    state = { runs: [], legacyTotal: 0 };
    save(state);
    paint(state);
    document.getElementById("runForm").reset();
    setFormErr("");
    updatePacePreview();
  });

  document.getElementById("runForm").addEventListener("submit", function (e) {
    e.preventDefault();
    setFormErr("");

    var v = readInputs();
    if (!(v.distance > 0) || !isFinite(v.distance)) {
      setFormErr("Enter a distance greater than zero.");
      return;
    }
    if (!(v.durationMin > 0) || !isFinite(v.durationMin)) {
      setFormErr("Enter time in minutes (greater than zero).");
      return;
    }

    var pace = paceMinPerMile(v.distance, v.durationMin);
    state.runs.push({
      distance: Math.round(v.distance * 100) / 100,
      durationMin: Math.round(v.durationMin * 100) / 100,
      paceMinPerMile: Math.round(pace * 100) / 100,
      at: new Date().toISOString(),
    });
    save(state);
    paint(state);

    document.getElementById("distance").value = "";
    document.getElementById("durationMin").value = "";
    updatePacePreview();
  });
})();
