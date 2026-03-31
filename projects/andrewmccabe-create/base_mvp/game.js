const STORAGE_KEY = "scary-birds-save-v1";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const screens = {
  title: document.querySelector('[data-screen="title"]'),
  map: document.querySelector('[data-screen="map"]'),
  game: document.querySelector('[data-screen="game"]'),
  result: document.querySelector('[data-screen="result"]'),
  editor: document.querySelector('[data-screen="editor"]'),
};

const ui = {
  playBtn: document.getElementById("playBtn"),
  editorBtn: document.getElementById("editorBtn"),
  mapBackBtn: document.getElementById("mapBackBtn"),
  mapBoard: document.getElementById("mapBoard"),
  mapPaths: document.getElementById("mapPaths"),
  mapDecor: document.getElementById("mapDecor"),
  chapterBanners: document.getElementById("chapterBanners"),
  mapBirdToken: document.getElementById("mapBirdToken"),
  levelGrid: document.getElementById("levelGrid"),
  levelLabel: document.getElementById("levelLabel"),
  status: document.getElementById("status"),
  birdsQueue: document.getElementById("birdsQueue"),
  score: document.getElementById("score"),
  pauseBtn: document.getElementById("pauseBtn"),
  resetBtn: document.getElementById("resetBtn"),
  toMapBtn: document.getElementById("toMapBtn"),
  resultTitle: document.getElementById("resultTitle"),
  resultText: document.getElementById("resultText"),
  starsView: document.getElementById("starsView"),
  retryBtn: document.getElementById("retryBtn"),
  nextBtn: document.getElementById("nextBtn"),
  resultMapBtn: document.getElementById("resultMapBtn"),
  toolSelect: document.getElementById("toolSelect"),
  gridSnap: document.getElementById("gridSnap"),
  rotateLeftBtn: document.getElementById("rotateLeftBtn"),
  rotateRightBtn: document.getElementById("rotateRightBtn"),
  deleteBtn: document.getElementById("deleteBtn"),
  playtestBtn: document.getElementById("playtestBtn"),
  exportBtn: document.getElementById("exportBtn"),
  importBtn: document.getElementById("importBtn"),
  editorMapBtn: document.getElementById("editorMapBtn"),
  jsonBox: document.getElementById("jsonBox"),
  editorHint: document.getElementById("editorHint"),
};

const W = canvas.width;
const H = canvas.height;
const GROUND_Y = H - 56;
const G = 0.39;
const AIR_DRAG = 0.996;
const REST_GROUND = 0.68;
const MAX_PULL = 118;
const WIN_CELEBRATION_FRAMES = 320;
const DEFAULT_SLING = { x: 140, y: GROUND_Y - 95 };

const MATERIALS = {
  wood: { density: 1, strength: 30, hue: 29, score: 80 },
  stone: { density: 1.4, strength: 44, hue: 0, score: 130 },
  glass: { density: 0.8, strength: 18, hue: 196, score: 100 },
};

const BIRDS = {
  red: { radius: 15, mass: 4.2, launchMult: 0.168, color: "#dc2626", label: "Red" },
  blue: { radius: 12, mass: 2.2, launchMult: 0.178, color: "#2563eb", label: "Blue" },
  yellow: { radius: 13, mass: 3.1, launchMult: 0.172, color: "#facc15", label: "Yellow" },
};

const BASE_LEVELS = [
  {
    id: "w1-1",
    name: "1-1 Graveyard Stack",
    sling: { ...DEFAULT_SLING },
    camera: { minX: 0, maxX: W },
    birds: ["red", "red", "blue"],
    starThresholds: [1200, 2200, 3200],
    terrain: [{ type: "ground", y: GROUND_Y }],
    entities: [
      { type: "block", material: "wood", x: 700, y: GROUND_Y - 26, w: 120, h: 26, rot: 0 },
      { type: "block", material: "wood", x: 730, y: GROUND_Y - 54, w: 60, h: 24, rot: 0 },
      { type: "pig", x: 760, y: GROUND_Y - 82, r: 16 },
    ],
  },
  {
    id: "w1-2",
    name: "1-2 Haunted Glass Tower",
    sling: { ...DEFAULT_SLING },
    camera: { minX: 0, maxX: W },
    birds: ["red", "yellow", "blue"],
    starThresholds: [1800, 2800, 3900],
    terrain: [{ type: "ground", y: GROUND_Y }],
    entities: [
      { type: "block", material: "stone", x: 680, y: GROUND_Y - 28, w: 150, h: 28, rot: 0 },
      { type: "block", material: "glass", x: 710, y: GROUND_Y - 58, w: 22, h: 30, rot: 90 },
      { type: "block", material: "glass", x: 778, y: GROUND_Y - 58, w: 22, h: 30, rot: 90 },
      { type: "block", material: "wood", x: 708, y: GROUND_Y - 84, w: 94, h: 22, rot: 0 },
      { type: "pig", x: 756, y: GROUND_Y - 110, r: 16 },
    ],
  },
  {
    id: "w1-3",
    name: "1-3 Crypt of Stone",
    sling: { ...DEFAULT_SLING },
    camera: { minX: 0, maxX: W },
    birds: ["yellow", "blue", "red", "red"],
    starThresholds: [2500, 3700, 4900],
    terrain: [{ type: "ground", y: GROUND_Y }],
    entities: [
      { type: "block", material: "stone", x: 690, y: GROUND_Y - 28, w: 170, h: 28, rot: 0 },
      { type: "block", material: "stone", x: 710, y: GROUND_Y - 62, w: 30, h: 34, rot: 90 },
      { type: "block", material: "stone", x: 810, y: GROUND_Y - 62, w: 30, h: 34, rot: 90 },
      { type: "block", material: "glass", x: 742, y: GROUND_Y - 90, w: 96, h: 20, rot: 0 },
      { type: "pig", x: 790, y: GROUND_Y - 114, r: 17 },
      { type: "pig", x: 744, y: GROUND_Y - 114, r: 15 },
    ],
  },
];

const app = {
  screen: "title",
  save: loadSave(),
  levels: structuredClone(BASE_LEVELS),
  currentLevelIndex: 0,
  currentLevelData: null,
  simulation: null,
  editorLevel: null,
  paused: false,
  draggingBird: false,
  draggingEntityId: null,
  editorSelectedId: null,
  pointerId: null,
  lastFrame: performance.now(),
  audioCtx: null,
  lastOinkAt: 0,
  lastMapHoverAt: 0,
  audioPrimed: false,
};

function loadSave() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { unlocked: 1, best: {} };
    const parsed = JSON.parse(raw);
    return {
      unlocked: Math.max(1, Number(parsed.unlocked) || 1),
      best: parsed.best && typeof parsed.best === "object" ? parsed.best : {},
    };
  } catch {
    return { unlocked: 1, best: {} };
  }
}

function persistSave() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(app.save));
}

function showScreen(name) {
  app.screen = name;
  for (const [key, element] of Object.entries(screens)) {
    element.classList.toggle("hidden", key !== name);
  }
}

function starsString(count) {
  return "★".repeat(count) + "☆".repeat(3 - count);
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function dist(ax, ay, bx, by) {
  return Math.hypot(bx - ax, by - ay);
}

function deepCloneLevel(level) {
  return structuredClone(level);
}

function normalizeBlock(block) {
  const normalized = { ...block };
  if (normalized.rot === 90 || normalized.rot === 270) {
    const w = normalized.w;
    normalized.w = normalized.h;
    normalized.h = w;
  }
  return normalized;
}

function levelToSimulation(level) {
  const sling = level.sling || DEFAULT_SLING;
  const blocks = [];
  const pigs = [];
  for (const entity of level.entities || []) {
    if (entity.type === "block") {
      const b = normalizeBlock(entity);
      const mat = MATERIALS[b.material] || MATERIALS.wood;
      const mass = ((b.w * b.h) / 600) * mat.density;
      blocks.push({
        id: crypto.randomUUID(),
        material: b.material,
        x: b.x,
        y: b.y,
        w: b.w,
        h: b.h,
        vx: 0,
        vy: 0,
        m: Math.max(2, mass),
        hp: mat.strength,
      });
    } else if (entity.type === "pig") {
      pigs.push({
        id: crypto.randomUUID(),
        x: entity.x,
        y: entity.y,
        r: entity.r || 16,
        vx: 0,
        vy: 0,
        m: 2.8,
        hp: 62,
      });
    }
  }

  return {
    levelId: level.id,
    levelName: level.name,
    sling: { ...sling },
    starThresholds: level.starThresholds || [800, 1500, 2300],
    birdsQueue: [...(level.birds || ["red", "red"])],
    activeBird: null,
    particles: [],
    scorePopups: [],
    blocks,
    pigs,
    score: 0,
    launchedBirds: 0,
    shotInProgress: false,
    celebratingWin: false,
    celebrationFrames: 0,
    winBonusApplied: false,
    result: null,
  };
}

function setStatus(text) {
  ui.status.textContent = text;
}

function initAudio() {
  if (!app.audioCtx) {
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtor) return;
    app.audioCtx = new AudioCtor();
  }
  if (app.audioCtx.state === "suspended") {
    app.audioCtx.resume().catch(() => {});
  }
}

function primeAudioIfNeeded() {
  initAudio();
  if (!app.audioCtx || app.audioPrimed) return;
  const now = app.audioCtx.currentTime;
  const osc = app.audioCtx.createOscillator();
  const gain = app.audioCtx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(440, now);
  gain.gain.setValueAtTime(0.00001, now);
  osc.connect(gain);
  gain.connect(app.audioCtx.destination);
  osc.start(now);
  osc.stop(now + 0.02);
  app.audioPrimed = true;
}

function playPigOink() {
  initAudio();
  if (!app.audioCtx) return;
  const ctxAudio = app.audioCtx;
  const now = ctxAudio.currentTime;

  const osc1 = ctxAudio.createOscillator();
  const osc2 = ctxAudio.createOscillator();
  const gain = ctxAudio.createGain();
  const filter = ctxAudio.createBiquadFilter();

  osc1.type = "sawtooth";
  osc2.type = "square";
  osc1.frequency.setValueAtTime(310, now);
  osc1.frequency.exponentialRampToValueAtTime(180, now + 0.14);
  osc2.frequency.setValueAtTime(220, now);
  osc2.frequency.exponentialRampToValueAtTime(130, now + 0.16);

  filter.type = "bandpass";
  filter.frequency.setValueAtTime(800, now);
  filter.Q.value = 1.8;

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.28, now + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);

  osc1.connect(filter);
  osc2.connect(filter);
  filter.connect(gain);
  gain.connect(ctxAudio.destination);

  osc1.start(now);
  osc2.start(now);
  osc1.stop(now + 0.22);
  osc2.stop(now + 0.22);
}

function playVictoryJingle() {
  initAudio();
  if (!app.audioCtx) return;
  const ctxAudio = app.audioCtx;
  const notes = [
    { f: 523.25, t: 0.0, d: 0.18 },
    { f: 659.25, t: 0.2, d: 0.18 },
    { f: 783.99, t: 0.42, d: 0.2 },
    { f: 1046.5, t: 0.68, d: 0.45 },
  ];
  const now = ctxAudio.currentTime;
  for (const note of notes) {
    const osc = ctxAudio.createOscillator();
    const gain = ctxAudio.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(note.f, now + note.t);
    gain.gain.setValueAtTime(0.0001, now + note.t);
    gain.gain.exponentialRampToValueAtTime(0.3, now + note.t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + note.t + note.d);
    osc.connect(gain);
    gain.connect(ctxAudio.destination);
    osc.start(now + note.t);
    osc.stop(now + note.t + note.d + 0.02);
  }
}

function playMapHoverSfx() {
  initAudio();
  if (!app.audioCtx) return;
  const ctxAudio = app.audioCtx;
  const now = ctxAudio.currentTime;
  const osc = ctxAudio.createOscillator();
  const gain = ctxAudio.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(680, now);
  osc.frequency.exponentialRampToValueAtTime(820, now + 0.06);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.05, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
  osc.connect(gain);
  gain.connect(ctxAudio.destination);
  osc.start(now);
  osc.stop(now + 0.09);
}

function maybePlayMapHoverSfx() {
  const now = performance.now();
  if (now - app.lastMapHoverAt < 80) return;
  app.lastMapHoverAt = now;
  playMapHoverSfx();
}

function playMapSelectSfx() {
  initAudio();
  if (!app.audioCtx) return;
  const ctxAudio = app.audioCtx;
  const now = ctxAudio.currentTime;
  const notes = [540, 680, 860];
  for (let i = 0; i < notes.length; i += 1) {
    const osc = ctxAudio.createOscillator();
    const gain = ctxAudio.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(notes[i], now + i * 0.055);
    gain.gain.setValueAtTime(0.0001, now + i * 0.055);
    gain.gain.exponentialRampToValueAtTime(0.08, now + i * 0.055 + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.055 + 0.08);
    osc.connect(gain);
    gain.connect(ctxAudio.destination);
    osc.start(now + i * 0.055);
    osc.stop(now + i * 0.055 + 0.09);
  }
}

function maybePlayOink(cooldownMs = 170) {
  const now = performance.now();
  if (now - app.lastOinkAt < cooldownMs) return;
  app.lastOinkAt = now;
  playPigOink();
}

function updateHud() {
  const sim = app.simulation;
  if (!sim) return;
  ui.levelLabel.textContent = sim.levelName;
  const queue = [];
  if (sim.activeBird && !sim.activeBird.launched) queue.push(sim.activeBird.type);
  queue.push(...sim.birdsQueue);
  const dots = queue
    .map(
      (type, idx) =>
        `<span class="bird-dot bird-${type}${idx === 0 ? " now" : ""}" title="${BIRDS[type].label}"></span>`,
    )
    .join("");
  ui.birdsQueue.innerHTML = `<span class="queue-wrap"><span class="queue-text">Up next:</span>${dots || "-"}</span>`;
  ui.score.textContent = `Score: ${Math.round(sim.score)}`;
}

function starsForScore(score, thresholds) {
  if (score >= thresholds[2]) return 3;
  if (score >= thresholds[1]) return 2;
  if (score >= thresholds[0]) return 1;
  return 0;
}

function computeMapPositions(total) {
  const cols = Math.min(5, Math.max(3, Math.ceil(Math.sqrt(total))));
  const rows = Math.max(1, Math.ceil(total / cols));
  const xMin = 90;
  const xMax = 910;
  const yMin = 70;
  const yMax = 370;
  const yStep = rows <= 1 ? 0 : (yMax - yMin) / (rows - 1);
  const positions = [];

  for (let row = 0; row < rows; row += 1) {
    const remaining = total - positions.length;
    const countThisRow = Math.min(cols, remaining);
    const rowForward = row % 2 === 0;
    const xStep = countThisRow <= 1 ? 0 : (xMax - xMin) / (countThisRow - 1);
    for (let col = 0; col < countThisRow; col += 1) {
      const logicalCol = rowForward ? col : countThisRow - 1 - col;
      positions.push({
        x: xMin + logicalCol * xStep,
        y: yMin + row * yStep,
      });
    }
  }
  return positions;
}

function computeChapters(total) {
  const names = ["Graveyard Marsh", "Moonlit Ruins", "Phantom Ridge"];
  const chapters = [];
  const size = Math.ceil(total / names.length);
  let start = 0;
  for (let i = 0; i < names.length && start < total; i += 1) {
    const end = Math.min(total - 1, start + size - 1);
    chapters.push({
      chapter: `World ${i + 1}`,
      name: names[i],
      start,
      end,
    });
    start = end + 1;
  }
  return chapters;
}

function updateMapScreen() {
  ui.levelGrid.innerHTML = "";
  const points = computeMapPositions(app.levels.length);
  const pathPieces = [];
  const markerPieces = [];
  for (let i = 0; i < points.length - 1; i += 1) {
    const a = points[i];
    const b = points[i + 1];
    const mx = (a.x + b.x) / 2;
    const my = ((a.y + b.y) / 2) - 28;
    pathPieces.push(
      `<path d="M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}" class="map-link-back" />`,
      `<path d="M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}" class="map-link" />`,
    );
  }
  for (const point of points) {
    markerPieces.push(`<circle cx="${point.x}" cy="${point.y}" r="8" class="map-pin" />`);
  }
  ui.mapPaths.innerHTML = `
    <defs>
      <linearGradient id="roadGlow" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#22d3ee" stop-opacity="0.9" />
        <stop offset="50%" stop-color="#a855f7" stop-opacity="0.95" />
        <stop offset="100%" stop-color="#f59e0b" stop-opacity="0.9" />
      </linearGradient>
      <filter id="mapGlow">
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    ${pathPieces.join("")}
    ${markerPieces.join("")}
  `;

  const landmarks = [
    { icon: "🏰", label: "Haunted Keep", x: 88, y: 78, size: "lg", twinkle: "a" },
    { icon: "🪦", label: "Old Graves", x: 18, y: 64, size: "sm", twinkle: "b" },
    { icon: "🎃", label: "Pumpkin Patch", x: 30, y: 28, size: "sm", twinkle: "c" },
    { icon: "🦇", label: "Bat Swarm", x: 56, y: 16, size: "sm", twinkle: "d" },
    { icon: "🌕", label: "Blood Moon", x: 13, y: 18, size: "lg", twinkle: "e" },
    { icon: "👻", label: "Ghost Trail", x: 73, y: 70, size: "sm", twinkle: "f" },
  ];
  ui.mapDecor.innerHTML = landmarks
    .map(
      (l) =>
        `<div class="map-landmark ${l.size} twinkle-${l.twinkle}" style="left:${l.x}%; top:${l.y}%;" title="${l.label}">${l.icon}<span>${l.label}</span></div>`,
    )
    .join("");

  const chapters = computeChapters(app.levels.length);
  ui.chapterBanners.innerHTML = chapters
    .map((chapter) => {
      const slice = points.slice(chapter.start, chapter.end + 1);
      const avgX = slice.reduce((sum, p) => sum + p.x, 0) / slice.length;
      const minY = Math.min(...slice.map((p) => p.y));
      const y = Math.max(48, minY - 42);
      return `<div class="map-banner" style="left:${avgX / 10}%; top:${y / 4.4}%;"><strong>${chapter.chapter}</strong><span>${chapter.name}</span></div>`;
    })
    .join("");

  app.levels.forEach((level, idx) => {
    const unlocked = idx + 1 <= app.save.unlocked;
    const point = points[idx];
    const btn = document.createElement("button");
    btn.type = "button";
    const isCurrent = idx + 1 === app.save.unlocked;
    btn.className = `level-btn${unlocked ? "" : " locked"}${isCurrent ? " current" : ""}`;
    const best = app.save.best[level.id];
    btn.style.left = `${point.x / 10}%`;
    btn.style.top = `${point.y / 4.4}%`;
    btn.innerHTML = `<strong>Level ${idx + 1}</strong><span>${best ? `${starsString(best.stars)}` : unlocked ? "Start" : "Locked"}</span>`;
    btn.title = level.name;
    btn.disabled = !unlocked;
    if (unlocked) {
      btn.addEventListener("mouseenter", () => {
        primeAudioIfNeeded();
        maybePlayMapHoverSfx();
      });
      btn.addEventListener("focus", () => {
        primeAudioIfNeeded();
        maybePlayMapHoverSfx();
      });
    }
    btn.addEventListener("click", () => {
      primeAudioIfNeeded();
      if (unlocked) playMapSelectSfx();
      startLevel(idx);
    });
    ui.levelGrid.appendChild(btn);
  });

  const tokenIdx = Math.min(app.save.unlocked - 1, points.length - 1);
  const tokenPoint = points[Math.max(0, tokenIdx)];
  if (tokenPoint) {
    ui.mapBirdToken.style.left = `${tokenPoint.x / 10}%`;
    ui.mapBirdToken.style.top = `${tokenPoint.y / 4.4}%`;
  }
}

function spawnBird(typeName) {
  const sim = app.simulation;
  const birdDef = BIRDS[typeName];
  if (!sim || !birdDef) return;
  sim.activeBird = {
    id: crypto.randomUUID(),
    type: typeName,
    x: sim.sling.x,
    y: sim.sling.y,
    vx: 0,
    vy: 0,
    r: birdDef.radius,
    m: birdDef.mass,
    launched: false,
    usedAbility: false,
    restedFrames: 0,
  };
  sim.shotInProgress = false;
  setStatus(`Aim ${birdDef.label} bird.`);
  updateHud();
}

function startLevel(index, fromEditor = false) {
  app.currentLevelIndex = index;
  const level = fromEditor ? deepCloneLevel(app.editorLevel) : deepCloneLevel(app.levels[index]);
  app.currentLevelData = level;
  app.simulation = levelToSimulation(level);
  app.paused = false;
  spawnBird(app.simulation.birdsQueue.shift());
  showScreen("game");
}

function finishLevel(win) {
  const sim = app.simulation;
  if (!sim || sim.result) return;
  const stars = win ? starsForScore(sim.score, sim.starThresholds) : 0;
  sim.result = { win, stars, score: Math.round(sim.score) };
  if (win) {
    const levelId = sim.levelId;
    const previous = app.save.best[levelId];
    if (!previous || sim.result.score > previous.score || sim.result.stars > previous.stars) {
      app.save.best[levelId] = { score: sim.result.score, stars: sim.result.stars };
    }
    app.save.unlocked = Math.max(app.save.unlocked, app.currentLevelIndex + 2);
    persistSave();
  }
  ui.resultTitle.textContent = win ? "Level Complete" : "Try Again";
  ui.resultText.textContent = win
    ? `Score ${sim.result.score}. You earned ${sim.result.stars} star${sim.result.stars === 1 ? "" : "s"}.`
    : `Out of birds with ${sim.pigs.length} target${sim.pigs.length === 1 ? "" : "s"} left.`;
  ui.starsView.textContent = starsString(sim.result.stars);
  ui.nextBtn.disabled = !win || app.currentLevelIndex + 1 >= app.levels.length;
  showScreen("result");
  updateMapScreen();
}

function circleRectResolve(circle, rect) {
  const px = clamp(circle.x, rect.x, rect.x + rect.w);
  const py = clamp(circle.y, rect.y, rect.y + rect.h);
  let nx = circle.x - px;
  let ny = circle.y - py;
  const d = Math.hypot(nx, ny);
  if (d >= circle.r || d === 0) return null;
  nx /= d;
  ny /= d;
  return { nx, ny, overlap: circle.r - d };
}

function resolveCircleBox(circle, box, transfer, hitScale) {
  const res = circleRectResolve(circle, box);
  if (!res) return 0;

  circle.x += res.nx * res.overlap;
  circle.y += res.ny * res.overlap;

  const relVx = circle.vx - box.vx;
  const relVy = circle.vy - box.vy;
  const vn = relVx * res.nx + relVy * res.ny;
  if (vn >= 0) return 0;

  const impulse = -(1 + 0.35) * vn;
  const invSum = 1 / circle.m + (transfer ? 1 / box.m : 0);
  const j = impulse / invSum;
  circle.vx += (j * res.nx) / circle.m;
  circle.vy += (j * res.ny) / circle.m;
  if (transfer) {
    box.vx -= (j * res.nx) / box.m;
    box.vy -= (j * res.ny) / box.m;
  }
  return Math.abs(j) * hitScale;
}

function resolveCircleCircle(a, b, hitScale) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const d = Math.hypot(dx, dy);
  const min = a.r + b.r;
  if (d >= min || d === 0) return 0;
  const nx = dx / d;
  const ny = dy / d;
  const overlap = min - d;
  a.x -= (nx * overlap) / 2;
  a.y -= (ny * overlap) / 2;
  b.x += (nx * overlap) / 2;
  b.y += (ny * overlap) / 2;

  const rvx = b.vx - a.vx;
  const rvy = b.vy - a.vy;
  const vn = rvx * nx + rvy * ny;
  if (vn >= 0) return 0;
  const j = (-(1 + 0.42) * vn) / (1 / a.m + 1 / b.m);
  a.vx -= (j * nx) / a.m;
  a.vy -= (j * ny) / a.m;
  b.vx += (j * nx) / b.m;
  b.vy += (j * ny) / b.m;
  return Math.abs(j) * hitScale;
}

function circlesTouch(a, b) {
  return dist(a.x, a.y, b.x, b.y) <= a.r + b.r;
}

function resolveBoxBox(a, b) {
  if (a.x + a.w < b.x || b.x + b.w < a.x || a.y + a.h < b.y || b.y + b.h < a.y) return;
  const overlapX = Math.min(a.x + a.w - b.x, b.x + b.w - a.x);
  const overlapY = Math.min(a.y + a.h - b.y, b.y + b.h - a.y);
  if (overlapX < overlapY) {
    const dir = a.x + a.w / 2 < b.x + b.w / 2 ? -1 : 1;
    a.x += (overlapX * dir) / 2;
    b.x -= (overlapX * dir) / 2;
    const v = (a.vx + b.vx) / 2;
    a.vx = v * 0.84;
    b.vx = v * 0.84;
  } else {
    const dir = a.y + a.h / 2 < b.y + b.h / 2 ? -1 : 1;
    a.y += (overlapY * dir) / 2;
    b.y -= (overlapY * dir) / 2;
    const v = (a.vy + b.vy) / 2;
    a.vy = v * 0.84;
    b.vy = v * 0.84;
  }
}

function groundCircle(o) {
  if (o.y + o.r >= GROUND_Y) {
    o.y = GROUND_Y - o.r;
    o.vy *= -REST_GROUND;
    o.vx *= REST_GROUND;
  }
}

function groundBox(b) {
  if (b.y + b.h >= GROUND_Y) {
    b.y = GROUND_Y - b.h;
    b.vy *= -REST_GROUND;
    b.vx *= REST_GROUND;
  }
}

function spawnDebris(x, y, count) {
  const sim = app.simulation;
  for (let i = 0; i < count; i += 1) {
    sim.particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 6,
      vy: -Math.random() * 3,
      life: 60 + Math.random() * 25,
    });
  }
  if (sim.particles.length > 100) {
    sim.particles.splice(0, sim.particles.length - 100);
  }
}

function useBirdAbility() {
  const sim = app.simulation;
  const b = sim?.activeBird;
  if (!b || !b.launched || b.usedAbility) return;
  if (b.type === "yellow") {
    b.vx *= 1.32;
    b.vy *= 1.32;
    b.usedAbility = true;
    setStatus("Yellow boost!");
  } else if (b.type === "blue") {
    b.usedAbility = true;
    const clones = [-0.35, 0.35].map((angle) => {
      const c = Math.cos(angle);
      const s = Math.sin(angle);
      return {
        id: crypto.randomUUID(),
        type: "blue",
        x: b.x,
        y: b.y,
        vx: b.vx * c - b.vy * s,
        vy: b.vx * s + b.vy * c,
        r: 9,
        m: 1.3,
        launched: true,
        usedAbility: true,
        restedFrames: 0,
      };
    });
    sim.activeBird = b;
    sim.extraBirds = sim.extraBirds || [];
    sim.extraBirds.push(...clones);
    setStatus("Blue split!");
  } else {
    b.usedAbility = true;
  }
}

function spawnNextBirdIfNeeded() {
  const sim = app.simulation;
  if (!sim || sim.result || sim.pigs.length === 0) return;
  const active = [sim.activeBird, ...(sim.extraBirds || [])].filter(Boolean);
  const anyMoving = active.some((b) => Math.hypot(b.vx, b.vy) > 0.25 || b.y + b.r < GROUND_Y - 2);
  if (anyMoving) return;

  if (sim.shotInProgress) {
    sim.shotInProgress = false;
    if (sim.birdsQueue.length > 0) {
      spawnBird(sim.birdsQueue.shift());
    } else {
      finishLevel(false);
    }
  }
}

function updateSim() {
  const sim = app.simulation;
  if (!sim || sim.result || app.paused || app.screen !== "game") return;

  if (sim.celebratingWin) {
    sim.celebrationFrames -= 1;
    if (sim.celebrationFrames % 8 === 0) {
      spawnDebris(130 + Math.random() * (W - 260), 110 + Math.random() * 120, 5);
    }
    if (sim.celebrationFrames <= 0) {
      finishLevel(true);
      return;
    }
  }

  const birds = [sim.activeBird, ...(sim.extraBirds || [])].filter(Boolean);

  for (const b of birds) {
    if (!b || !b.launched) continue;
    b.vy += G;
    b.vx *= AIR_DRAG;
    b.vy *= AIR_DRAG;
    b.x += b.vx;
    b.y += b.vy;
  }
  for (const block of sim.blocks) {
    block.vy += G;
    block.vx *= AIR_DRAG;
    block.vy *= AIR_DRAG;
    block.x += block.vx;
    block.y += block.vy;
  }
  for (const pig of sim.pigs) {
    pig.vy += G;
    pig.vx *= AIR_DRAG;
    pig.vy *= AIR_DRAG;
    pig.x += pig.vx;
    pig.y += pig.vy;
  }

  for (const b of birds) {
    if (!b) continue;
    for (const block of sim.blocks) {
      const damage = resolveCircleBox(b, block, true, 0.2);
      if (damage > 3.5) block.hp -= damage;
    }
    for (const pig of sim.pigs) {
      // Arcade rule: if a launched bird touches a pig, pig is defeated immediately.
      if (b.launched && circlesTouch(b, pig)) {
        pig.hp = 0;
        maybePlayOink(0);
        continue;
      }
      const damage = resolveCircleCircle(b, pig, 0.26);
      if (damage > 2.6) {
        pig.hp -= damage * 2.1;
        maybePlayOink(140);
        // Big direct hits should reliably finish a pig.
        if (damage > 18) pig.hp = 0;
      }
    }
  }

  for (const pig of sim.pigs) {
    for (const block of sim.blocks) {
      const damage = resolveCircleBox(pig, block, true, 0.12);
      if (damage > 9.5) {
        pig.hp -= damage * 0.1;
        block.hp -= damage * 0.35;
      }
    }
  }

  for (let i = 0; i < sim.blocks.length; i += 1) {
    for (let j = i + 1; j < sim.blocks.length; j += 1) {
      resolveBoxBox(sim.blocks[i], sim.blocks[j]);
    }
  }

  for (const b of birds) groundCircle(b);
  for (const pig of sim.pigs) groundCircle(pig);
  for (const block of sim.blocks) groundBox(block);

  const removedBlocks = [];
  sim.blocks = sim.blocks.filter((block) => {
    const dead = block.hp <= 0 || block.y > H + 80;
    if (dead) removedBlocks.push(block);
    return !dead;
  });
  for (const block of removedBlocks) {
    sim.score += MATERIALS[block.material].score;
    spawnDebris(block.x + block.w / 2, block.y + block.h / 2, 7);
  }

  const removedPigs = [];
  sim.pigs = sim.pigs.filter((pig) => {
    const dead = pig.hp <= 0 || pig.y > H + 120 || pig.x < -220 || pig.x > W + 220;
    if (dead) removedPigs.push(pig);
    return !dead;
  });
  for (const pig of removedPigs) {
    sim.score += 1000;
    maybePlayOink(0);
    setStatus("Pig defeated! +1000");
    sim.scorePopups.push({
      x: pig.x,
      y: pig.y - pig.r - 8,
      text: "+1000",
      life: 58,
    });
    spawnDebris(pig.x, pig.y, 11);
  }

  for (const p of sim.particles) {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += G * 0.42;
    p.life -= 1;
  }
  sim.particles = sim.particles.filter((p) => p.life > 0);

  for (const pop of sim.scorePopups) {
    pop.y -= 0.75;
    pop.life -= 1;
  }
  sim.scorePopups = sim.scorePopups.filter((pop) => pop.life > 0);

  if (sim.pigs.length === 0) {
    if (!sim.celebratingWin) {
      sim.celebratingWin = true;
      sim.celebrationFrames = WIN_CELEBRATION_FRAMES;
      if (!sim.winBonusApplied) {
        sim.score += sim.birdsQueue.length * 450;
        sim.winBonusApplied = true;
      }
      setStatus("Level cleared! Spooky celebration!");
      playVictoryJingle();
      spawnDebris(W * 0.45, H * 0.35, 24);
      spawnDebris(W * 0.58, H * 0.3, 24);
    }
    updateHud();
    return;
  }

  if (sim.activeBird?.launched) {
    const speed = Math.hypot(sim.activeBird.vx, sim.activeBird.vy);
    if (speed < 0.15 && sim.activeBird.y + sim.activeBird.r >= GROUND_Y - 2) {
      sim.activeBird.restedFrames += 1;
    } else {
      sim.activeBird.restedFrames = 0;
    }
    if (sim.activeBird.restedFrames > 45) {
      sim.activeBird.vx = 0;
      sim.activeBird.vy = 0;
    }
  }

  if (!sim.celebratingWin) {
    spawnNextBirdIfNeeded();
  }
  updateHud();
}

function drawBird(bird) {
  const def = BIRDS[bird.type];
  const eyeY = bird.y - bird.r * 0.18;
  const eyeX = bird.x + bird.r * 0.28;

  // Body
  ctx.beginPath();
  ctx.fillStyle = def.color;
  ctx.arc(bird.x, bird.y, bird.r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#111827";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Angry brow
  ctx.strokeStyle = "#111827";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(eyeX - 7, eyeY - 5);
  ctx.lineTo(eyeX + 3, eyeY - 1);
  ctx.stroke();

  // Eye
  ctx.beginPath();
  ctx.fillStyle = "#f8fafc";
  ctx.arc(eyeX, eyeY, 3.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.fillStyle = "#111827";
  ctx.arc(eyeX + 1, eyeY, 1.8, 0, Math.PI * 2);
  ctx.fill();

  // Beak
  ctx.beginPath();
  ctx.fillStyle = "#f59e0b";
  ctx.moveTo(bird.x + bird.r * 0.95, bird.y);
  ctx.lineTo(bird.x + bird.r * 0.35, bird.y - 4);
  ctx.lineTo(bird.x + bird.r * 0.35, bird.y + 4);
  ctx.closePath();
  ctx.fill();

  // Spooky tuft
  ctx.strokeStyle = "#0f172a";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(bird.x - 2, bird.y - bird.r);
  ctx.lineTo(bird.x + 1, bird.y - bird.r - 8);
  ctx.lineTo(bird.x + 5, bird.y - bird.r - 2);
  ctx.stroke();
}

function drawTrajectoryDots() {
  const sim = app.simulation;
  const b = sim?.activeBird;
  if (!b || b.launched || !app.draggingBird) return;
  const pullX = sim.sling.x - b.x;
  const pullY = sim.sling.y - b.y;
  const vx0 = pullX * BIRDS[b.type].launchMult;
  const vy0 = pullY * BIRDS[b.type].launchMult;
  ctx.fillStyle = "rgba(15,23,42,0.42)";
  for (let i = 8; i <= 36; i += 4) {
    const t = i / 2.6;
    const x = b.x + vx0 * t;
    const y = b.y + vy0 * t + 0.5 * G * t * t;
    ctx.beginPath();
    ctx.arc(x, y, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawSling() {
  const sim = app.simulation;
  if (!sim?.activeBird) return;
  const b = sim.activeBird;
  ctx.strokeStyle = "#4b2e1f";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(sim.sling.x - 18, GROUND_Y - 10);
  ctx.lineTo(sim.sling.x - 8, sim.sling.y + 6);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(sim.sling.x + 18, GROUND_Y - 10);
  ctx.lineTo(sim.sling.x + 8, sim.sling.y + 6);
  ctx.stroke();
  if (!b.launched || app.draggingBird) {
    ctx.strokeStyle = "#1f2937";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(sim.sling.x, sim.sling.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }
}

function drawScene() {
  ctx.clearRect(0, 0, W, H);
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, "#0b1024");
  g.addColorStop(0.45, "#1f1b4d");
  g.addColorStop(1, "#111827");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  // Moon glow
  ctx.beginPath();
  ctx.fillStyle = "rgba(226, 232, 240, 0.18)";
  ctx.arc(W - 120, 90, 56, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.fillStyle = "#e2e8f0";
  ctx.arc(W - 120, 90, 34, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.fillStyle = "#0b1024";
  ctx.arc(W - 108, 84, 32, 0, Math.PI * 2);
  ctx.fill();

  // Distant hills
  ctx.fillStyle = "#0f172a";
  ctx.beginPath();
  ctx.moveTo(0, GROUND_Y);
  ctx.quadraticCurveTo(140, GROUND_Y - 80, 300, GROUND_Y - 40);
  ctx.quadraticCurveTo(420, GROUND_Y - 10, 560, GROUND_Y - 60);
  ctx.quadraticCurveTo(700, GROUND_Y - 95, W, GROUND_Y - 25);
  ctx.lineTo(W, GROUND_Y);
  ctx.closePath();
  ctx.fill();

  // Tiny bats
  ctx.strokeStyle = "rgba(226,232,240,0.45)";
  ctx.lineWidth = 1.5;
  const batY = 130 + Math.sin(performance.now() * 0.0025) * 5;
  for (let i = 0; i < 4; i += 1) {
    const bx = 220 + i * 60;
    ctx.beginPath();
    ctx.moveTo(bx - 8, batY + i * 2);
    ctx.quadraticCurveTo(bx - 2, batY - 6 + i * 2, bx + 4, batY + i * 2);
    ctx.quadraticCurveTo(bx + 10, batY - 6 + i * 2, bx + 16, batY + i * 2);
    ctx.stroke();
  }

  ctx.fillStyle = "#2f4f2f";
  ctx.fillRect(0, GROUND_Y, W, H - GROUND_Y);
  ctx.fillStyle = "#1f2937";
  ctx.fillRect(0, GROUND_Y, W, 6);

  if (app.screen === "editor" && ui.gridSnap.checked) {
    ctx.strokeStyle = "rgba(15,23,42,0.12)";
    ctx.lineWidth = 1;
    for (let x = 0; x <= W; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }
    for (let y = 0; y <= H; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }
  }

  const sim = app.simulation;
  if (!sim) return;

  for (const block of sim.blocks) {
    const mat = MATERIALS[block.material];
    ctx.fillStyle = `hsl(${mat.hue} 60% 44%)`;
    ctx.fillRect(block.x, block.y, block.w, block.h);
    ctx.strokeStyle = "#111827";
    ctx.lineWidth = 2;
    ctx.strokeRect(block.x, block.y, block.w, block.h);
    if (app.screen === "editor" && block.id === app.editorSelectedId) {
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 3;
      ctx.strokeRect(block.x - 2, block.y - 2, block.w + 4, block.h + 4);
    }
  }

  for (const pig of sim.pigs) {
    // Pig body
    ctx.beginPath();
    ctx.fillStyle = "#6ee7b7";
    ctx.arc(pig.x, pig.y, pig.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#065f46";
    ctx.lineWidth = 2;
    ctx.stroke();
    // Ears
    ctx.beginPath();
    ctx.fillStyle = "#34d399";
    ctx.moveTo(pig.x - 9, pig.y - pig.r + 2);
    ctx.lineTo(pig.x - 3, pig.y - pig.r - 9);
    ctx.lineTo(pig.x + 1, pig.y - pig.r + 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(pig.x + 9, pig.y - pig.r + 2);
    ctx.lineTo(pig.x + 3, pig.y - pig.r - 9);
    ctx.lineTo(pig.x - 1, pig.y - pig.r + 2);
    ctx.fill();
    // Snout
    ctx.beginPath();
    ctx.fillStyle = "#fda4af";
    ctx.ellipse(pig.x, pig.y + 3, 8, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#7f1d1d";
    ctx.beginPath();
    ctx.arc(pig.x - 3, pig.y + 3, 1.2, 0, Math.PI * 2);
    ctx.arc(pig.x + 3, pig.y + 3, 1.2, 0, Math.PI * 2);
    ctx.fill();
    // Eyes
    ctx.fillStyle = "#111827";
    ctx.beginPath();
    ctx.arc(pig.x - 5, pig.y - 4, 1.7, 0, Math.PI * 2);
    ctx.arc(pig.x + 5, pig.y - 4, 1.7, 0, Math.PI * 2);
    ctx.fill();
    if (app.screen === "editor" && pig.id === app.editorSelectedId) {
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(pig.x, pig.y, pig.r + 3, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  drawSling();
  drawTrajectoryDots();

  if (sim.activeBird) drawBird(sim.activeBird);
  for (const extra of sim.extraBirds || []) drawBird(extra);

  for (const p of sim.particles) {
    ctx.fillStyle = `rgba(251,191,36,${Math.max(0, p.life / 90)})`;
    ctx.fillRect(p.x, p.y, 3, 3);
  }

  for (const pop of sim.scorePopups || []) {
    const alpha = Math.max(0, pop.life / 58);
    ctx.fillStyle = `rgba(251, 191, 36, ${alpha})`;
    ctx.strokeStyle = `rgba(15, 23, 42, ${alpha})`;
    ctx.lineWidth = 2;
    ctx.font = "bold 22px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.strokeText(pop.text, pop.x, pop.y);
    ctx.fillText(pop.text, pop.x, pop.y);
    ctx.textAlign = "left";
  }

  if (sim.celebratingWin) {
    const pulse = 0.72 + Math.sin(performance.now() * 0.01) * 0.08;
    ctx.fillStyle = `rgba(15, 23, 42, ${pulse})`;
    ctx.fillRect(0, H / 2 - 60, W, 120);
    ctx.textAlign = "center";
    ctx.fillStyle = "#fef08a";
    ctx.strokeStyle = "#1f2937";
    ctx.lineWidth = 3;
    ctx.font = "bold 40px system-ui, sans-serif";
    ctx.strokeText("LEVEL CLEARED!", W / 2, H / 2 - 8);
    ctx.fillText("LEVEL CLEARED!", W / 2, H / 2 - 8);
    ctx.fillStyle = "#f8fafc";
    ctx.font = "600 20px system-ui, sans-serif";
    ctx.fillText("Prepare for the next nightmare...", W / 2, H / 2 + 28);
    ctx.textAlign = "left";
  }
}

function pointToCanvas(ev) {
  const r = canvas.getBoundingClientRect();
  const sx = canvas.width / r.width;
  const sy = canvas.height / r.height;
  return { x: (ev.clientX - r.left) * sx, y: (ev.clientY - r.top) * sy };
}

function findEntityAt(point) {
  const sim = app.simulation;
  if (!sim) return null;
  for (let i = sim.pigs.length - 1; i >= 0; i -= 1) {
    const pig = sim.pigs[i];
    if (dist(point.x, point.y, pig.x, pig.y) <= pig.r + 4) return pig;
  }
  for (let i = sim.blocks.length - 1; i >= 0; i -= 1) {
    const block = sim.blocks[i];
    if (
      point.x >= block.x &&
      point.x <= block.x + block.w &&
      point.y >= block.y &&
      point.y <= block.y + block.h
    ) {
      return block;
    }
  }
  return null;
}

function toGrid(value) {
  return Math.round(value / 20) * 20;
}

function addEditorEntity(point, tool) {
  const sim = app.simulation;
  if (!sim) return;
  const x = ui.gridSnap.checked ? toGrid(point.x) : point.x;
  const y = ui.gridSnap.checked ? toGrid(point.y) : point.y;
  if (tool === "pig") {
    const pig = { id: crypto.randomUUID(), x, y, r: 16, vx: 0, vy: 0, m: 2.8, hp: 62 };
    sim.pigs.push(pig);
    app.editorSelectedId = pig.id;
  } else {
    const material = tool;
    const block = {
      id: crypto.randomUUID(),
      material,
      x: x - 30,
      y: y - 12,
      w: 60,
      h: 24,
      vx: 0,
      vy: 0,
      m: 4,
      hp: MATERIALS[material].strength,
    };
    sim.blocks.push(block);
    app.editorSelectedId = block.id;
  }
  setStatus("Entity placed.");
}

function serializeCurrentLevelFromSim() {
  const sim = app.simulation;
  return {
    id: app.currentLevelData?.id || "custom",
    name: app.currentLevelData?.name || "Custom Level",
    sling: { ...sim.sling },
    camera: { minX: 0, maxX: W },
    birds: [...(app.currentLevelData?.birds || ["red", "blue", "yellow"])],
    starThresholds: [...(app.currentLevelData?.starThresholds || [1500, 2500, 3500])],
    terrain: [{ type: "ground", y: GROUND_Y }],
    entities: [
      ...sim.blocks.map((b) => ({
        type: "block",
        material: b.material,
        x: Math.round(b.x),
        y: Math.round(b.y),
        w: Math.round(b.w),
        h: Math.round(b.h),
        rot: 0,
      })),
      ...sim.pigs.map((p) => ({
        type: "pig",
        x: Math.round(p.x),
        y: Math.round(p.y),
        r: Math.round(p.r),
      })),
    ],
  };
}

function openEditor(sourceLevel = null) {
  const level = sourceLevel || deepCloneLevel(app.levels[0]);
  app.editorLevel = deepCloneLevel(level);
  app.currentLevelData = deepCloneLevel(level);
  app.simulation = levelToSimulation(level);
  app.editorSelectedId = null;
  app.paused = true;
  setStatus("Editor mode.");
  ui.editorHint.textContent = "Click to place. Select tool from dropdown.";
  showScreen("editor");
  drawScene();
}

function handlePointerDown(ev) {
  primeAudioIfNeeded();
  const point = pointToCanvas(ev);
  if (app.screen === "game") {
    const bird = app.simulation?.activeBird;
    if (!bird || bird.launched || app.simulation.result) return;
    if (dist(point.x, point.y, bird.x, bird.y) <= bird.r + 16) {
      app.draggingBird = true;
      app.pointerId = ev.pointerId;
      bird.vx = 0;
      bird.vy = 0;
      canvas.setPointerCapture(ev.pointerId);
      setStatus("Release to launch.");
    }
  } else if (app.screen === "editor") {
    const tool = ui.toolSelect.value;
    if (tool !== "select") {
      addEditorEntity(point, tool);
      drawScene();
      return;
    }
    const found = findEntityAt(point);
    app.editorSelectedId = found?.id || null;
    app.draggingEntityId = found?.id || null;
    app.pointerId = ev.pointerId;
    if (found) {
      canvas.setPointerCapture(ev.pointerId);
      ui.editorHint.textContent = "Dragging selected entity.";
    }
    drawScene();
  }
}

function handlePointerMove(ev) {
  const point = pointToCanvas(ev);
  if (app.screen === "game" && app.draggingBird) {
    const sim = app.simulation;
    const b = sim.activeBird;
    let dx = point.x - sim.sling.x;
    let dy = point.y - sim.sling.y;
    const length = Math.hypot(dx, dy) || 1;
    const pull = Math.min(length, MAX_PULL);
    dx = (dx / length) * pull;
    dy = (dy / length) * pull;
    b.x = sim.sling.x + dx;
    b.y = sim.sling.y + dy;
    return;
  }
  if (app.screen === "editor" && app.draggingEntityId) {
    const sim = app.simulation;
    const snappedX = ui.gridSnap.checked ? toGrid(point.x) : point.x;
    const snappedY = ui.gridSnap.checked ? toGrid(point.y) : point.y;
    const item = [...sim.blocks, ...sim.pigs].find((e) => e.id === app.draggingEntityId);
    if (!item) return;
    if (Object.hasOwn(item, "w")) {
      item.x = snappedX - item.w / 2;
      item.y = snappedY - item.h / 2;
    } else {
      item.x = snappedX;
      item.y = snappedY;
    }
    drawScene();
  }
}

function handlePointerUp(ev) {
  if (app.screen === "game" && app.draggingBird) {
    app.draggingBird = false;
    const sim = app.simulation;
    const b = sim.activeBird;
    const dx = sim.sling.x - b.x;
    const dy = sim.sling.y - b.y;
    b.vx = dx * BIRDS[b.type].launchMult;
    b.vy = dy * BIRDS[b.type].launchMult;
    b.launched = true;
    sim.shotInProgress = true;
    sim.launchedBirds += 1;
    setStatus("Tap/click to trigger ability.");
  } else if (app.screen === "editor") {
    app.draggingEntityId = null;
    ui.editorHint.textContent = "Click to place. Drag selected entity to move.";
  }
  if (app.pointerId !== null) {
    try {
      canvas.releasePointerCapture(ev.pointerId);
    } catch {
      /* noop */
    }
    app.pointerId = null;
  }
}

function bindEvents() {
  ui.playBtn.addEventListener("click", () => {
    primeAudioIfNeeded();
    updateMapScreen();
    showScreen("map");
  });
  ui.editorBtn.addEventListener("click", () => {
    primeAudioIfNeeded();
    openEditor(app.levels[0]);
  });
  ui.mapBackBtn.addEventListener("click", () => showScreen("title"));
  ui.pauseBtn.addEventListener("click", () => {
    app.paused = !app.paused;
    ui.pauseBtn.textContent = app.paused ? "Resume" : "Pause";
    setStatus(app.paused ? "Paused." : "Unpaused.");
  });
  ui.resetBtn.addEventListener("click", () => startLevel(app.currentLevelIndex));
  ui.toMapBtn.addEventListener("click", () => {
    updateMapScreen();
    showScreen("map");
  });
  ui.retryBtn.addEventListener("click", () => startLevel(app.currentLevelIndex));
  ui.nextBtn.addEventListener("click", () => {
    if (app.currentLevelIndex + 1 < app.levels.length) startLevel(app.currentLevelIndex + 1);
  });
  ui.resultMapBtn.addEventListener("click", () => {
    updateMapScreen();
    showScreen("map");
  });

  ui.rotateLeftBtn.addEventListener("click", () => rotateSelected(-90));
  ui.rotateRightBtn.addEventListener("click", () => rotateSelected(90));
  ui.deleteBtn.addEventListener("click", deleteSelected);
  ui.playtestBtn.addEventListener("click", () => {
    app.editorLevel = serializeCurrentLevelFromSim();
    startLevel(0, true);
  });
  ui.exportBtn.addEventListener("click", () => {
    ui.jsonBox.value = JSON.stringify(serializeCurrentLevelFromSim(), null, 2);
    ui.editorHint.textContent = "Exported current editor level to JSON.";
  });
  ui.importBtn.addEventListener("click", () => {
    try {
      const parsed = JSON.parse(ui.jsonBox.value);
      validateLevel(parsed);
      openEditor(parsed);
      ui.editorHint.textContent = "Imported level JSON.";
    } catch (err) {
      ui.editorHint.textContent = `Import failed: ${err.message}`;
    }
  });
  ui.editorMapBtn.addEventListener("click", () => {
    updateMapScreen();
    showScreen("map");
  });

  canvas.addEventListener("pointerdown", handlePointerDown);
  canvas.addEventListener("pointermove", handlePointerMove);
  canvas.addEventListener("pointerup", handlePointerUp);
  canvas.addEventListener("pointercancel", handlePointerUp);
  canvas.addEventListener("click", () => {
    if (app.screen === "game") {
      primeAudioIfNeeded();
      useBirdAbility();
    }
  });
}

function rotateSelected(delta) {
  const sim = app.simulation;
  const block = sim?.blocks.find((b) => b.id === app.editorSelectedId);
  if (!block) return;
  const cx = block.x + block.w / 2;
  const cy = block.y + block.h / 2;
  const w = block.w;
  block.w = block.h;
  block.h = w;
  block.x = cx - block.w / 2;
  block.y = cy - block.h / 2;
  ui.editorHint.textContent = `Rotated ${delta > 0 ? "right" : "left"}.`;
  drawScene();
}

function deleteSelected() {
  const sim = app.simulation;
  if (!sim || !app.editorSelectedId) return;
  sim.blocks = sim.blocks.filter((b) => b.id !== app.editorSelectedId);
  sim.pigs = sim.pigs.filter((p) => p.id !== app.editorSelectedId);
  app.editorSelectedId = null;
  ui.editorHint.textContent = "Deleted selected entity.";
  drawScene();
}

function validateLevel(level) {
  if (!level || typeof level !== "object") throw new Error("Level must be an object.");
  if (!Array.isArray(level.entities)) throw new Error("Level must include entities array.");
  if (!Array.isArray(level.birds) || level.birds.length === 0) {
    throw new Error("Level must include a non-empty birds array.");
  }
  for (const bird of level.birds) {
    if (!BIRDS[bird]) throw new Error(`Unknown bird type: ${bird}`);
  }
}

function frame() {
  updateSim();
  if (app.screen === "game" || app.screen === "editor") drawScene();
  requestAnimationFrame(frame);
}

bindEvents();
updateMapScreen();
showScreen("title");
frame();
