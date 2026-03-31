const STORAGE_KEY = "flickshot-save-v1";

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
const G = 0.42;
const AIR_DRAG = 0.996;
const REST_GROUND = 0.68;
const MAX_PULL = 124;
const DEFAULT_SLING = { x: 140, y: GROUND_Y - 95 };

const MATERIALS = {
  wood: { density: 1, strength: 30, hue: 29, score: 80 },
  stone: { density: 1.4, strength: 44, hue: 0, score: 130 },
  glass: { density: 0.8, strength: 18, hue: 196, score: 100 },
};

const BIRDS = {
  red: { radius: 15, mass: 4.2, launchMult: 0.18, color: "#dc2626", label: "Red" },
  blue: { radius: 12, mass: 2.2, launchMult: 0.21, color: "#2563eb", label: "Blue" },
  yellow: { radius: 13, mass: 3.1, launchMult: 0.19, color: "#facc15", label: "Yellow" },
};

const BASE_LEVELS = [
  {
    id: "w1-1",
    name: "1-1 Starter Stack",
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
    name: "1-2 Glass Tower",
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
    name: "1-3 Stone Nest",
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
        hp: 40,
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
    blocks,
    pigs,
    score: 0,
    launchedBirds: 0,
    shotInProgress: false,
    result: null,
  };
}

function setStatus(text) {
  ui.status.textContent = text;
}

function updateHud() {
  const sim = app.simulation;
  if (!sim) return;
  ui.levelLabel.textContent = sim.levelName;
  ui.birdsQueue.textContent = `Birds: ${sim.birdsQueue.map((b) => BIRDS[b].label[0]).join(" ") || "-"}`;
  ui.score.textContent = `Score: ${Math.round(sim.score)}`;
}

function starsForScore(score, thresholds) {
  if (score >= thresholds[2]) return 3;
  if (score >= thresholds[1]) return 2;
  if (score >= thresholds[0]) return 1;
  return 0;
}

function updateMapScreen() {
  ui.levelGrid.innerHTML = "";
  app.levels.forEach((level, idx) => {
    const unlocked = idx + 1 <= app.save.unlocked;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `level-btn${unlocked ? "" : " locked"}`;
    const best = app.save.best[level.id];
    btn.innerHTML = `<strong>${level.name}</strong><span>${best ? `${starsString(best.stars)} · ${best.score}` : "Not cleared"}</span>`;
    btn.disabled = !unlocked;
    btn.addEventListener("click", () => startLevel(idx));
    ui.levelGrid.appendChild(btn);
  });
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
    b.vx *= 1.6;
    b.vy *= 1.6;
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
      if (damage > 0) block.hp -= damage;
    }
    for (const pig of sim.pigs) {
      const damage = resolveCircleCircle(b, pig, 0.26);
      if (damage > 0) pig.hp -= damage;
    }
  }

  for (const pig of sim.pigs) {
    for (const block of sim.blocks) {
      const damage = resolveCircleBox(pig, block, true, 0.12);
      if (damage > 0) {
        pig.hp -= damage * 0.5;
        block.hp -= damage * 0.4;
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
    const dead = pig.hp <= 0 || pig.y > H + 50 || pig.x < -60;
    if (dead) removedPigs.push(pig);
    return !dead;
  });
  for (const pig of removedPigs) {
    sim.score += 1000;
    spawnDebris(pig.x, pig.y, 11);
  }

  for (const p of sim.particles) {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += G * 0.42;
    p.life -= 1;
  }
  sim.particles = sim.particles.filter((p) => p.life > 0);

  if (sim.pigs.length === 0) {
    sim.score += sim.birdsQueue.length * 450;
    finishLevel(true);
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

  spawnNextBirdIfNeeded();
  updateHud();
}

function drawBird(bird) {
  const def = BIRDS[bird.type];
  ctx.beginPath();
  ctx.fillStyle = def.color;
  ctx.arc(bird.x, bird.y, bird.r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#1f2937";
  ctx.lineWidth = 2;
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
  g.addColorStop(0, "#7dd3fc");
  g.addColorStop(1, "#bfdbfe");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = "#4d7c0f";
  ctx.fillRect(0, GROUND_Y, W, H - GROUND_Y);
  ctx.fillStyle = "#3f6212";
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
    ctx.beginPath();
    ctx.fillStyle = "#86efac";
    ctx.arc(pig.x, pig.y, pig.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#166534";
    ctx.lineWidth = 2;
    ctx.stroke();
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
    const pig = { id: crypto.randomUUID(), x, y, r: 16, vx: 0, vy: 0, m: 2.8, hp: 40 };
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
    updateMapScreen();
    showScreen("map");
  });
  ui.editorBtn.addEventListener("click", () => openEditor(app.levels[0]));
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
    if (app.screen === "game") useBirdAbility();
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
