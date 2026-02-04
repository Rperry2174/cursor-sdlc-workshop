// --- Config ---
const CONFIG = {
  canvas: { width: 760, height: 500 },
  game: {
    durationSeconds: 45,
    targetScore: 100,
    lineSpeed: 5,
  },
  fish: {
    spawnRate: 0.015,
    baseSpeed: 1.2,
    speedVariance: 0.5,
    orangeChance: 0.3,
    orangePoints: 5,
    yellowPoints: 1,
  },
  colors: {
    water: '#4682B4',
    waveLight: '#5A9BD4',
    waveDark: '#3A7BA4',
    fishOrange: '#FF8C00',
    fishYellow: '#FFD700',
    line: '#8B4513',
    hook: '#696969',
    catchFlash: '#FF6347',
  },
};

// --- Canvas & DOM ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = CONFIG.canvas.width;
canvas.height = CONFIG.canvas.height;

const dom = {
  score: document.getElementById('score'),
  timer: document.getElementById('timer'),
  gameOver: document.getElementById('gameOver'),
  gameOverTitle: document.getElementById('gameOverTitle'),
  gameOverMessage: document.getElementById('gameOverMessage'),
};

// --- Game state ---
const state = {
  score: 0,
  timeRemaining: CONFIG.game.durationSeconds,
  running: true,
  lastTime: Date.now(),
};

const line = {
  x: canvas.width / 2,
  y: 0,
  length: 0,
  dropping: false,
  maxLength: CONFIG.canvas.height,
};

const fish = [];

// --- Fish class ---
class Fish {
  constructor() {
    const spawnLeft = Math.random() < 0.5;
    this.x = spawnLeft ? -30 : canvas.width + 30;
    this.y = Math.random() * (canvas.height - 100) + 50;
    this.size = 20 + Math.random() * 15;
    this.speed = CONFIG.fish.baseSpeed + Math.random() * CONFIG.fish.speedVariance;
    this.direction = spawnLeft ? 1 : -1;

    const isOrange = Math.random() < CONFIG.fish.orangeChance;
    this.color = isOrange ? CONFIG.colors.fishOrange : CONFIG.colors.fishYellow;
    this.points = isOrange ? CONFIG.fish.orangePoints : CONFIG.fish.yellowPoints;
  }

  update() {
    this.x += this.speed * this.direction;
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.scale(this.direction, 1);

    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, this.size, this.size / 2, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(-this.size, 0);
    ctx.lineTo(-this.size * 1.5, -this.size / 2);
    ctx.lineTo(-this.size * 1.5, this.size / 2);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(this.size * 0.3, -this.size * 0.2, this.size * 0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(this.size * 0.35, -this.size * 0.2, this.size * 0.08, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  isOffScreen() {
    const margin = 30;
    return (this.direction > 0 && this.x > canvas.width + margin) ||
           (this.direction < 0 && this.x < -margin);
  }

  checkCollision(lineX, lineEndY) {
    const distance = Math.sqrt(
      Math.pow(this.x - lineX, 2) + Math.pow(this.y - lineEndY, 2)
    );
    return distance < this.size;
  }
}

// --- Input ---
function getCanvasMouseX(e) {
  const rect = canvas.getBoundingClientRect();
  return e.clientX - rect.left;
}

canvas.addEventListener('mousedown', (e) => {
  if (!state.running) return;
  line.x = getCanvasMouseX(e);
  line.y = 0;
  line.dropping = true;
  line.length = 0;
});

canvas.addEventListener('mousemove', (e) => {
  if (line.dropping && state.running) line.x = getCanvasMouseX(e);
});

canvas.addEventListener('mouseup', () => {
  line.dropping = false;
  line.length = 0;
});

canvas.addEventListener('mouseleave', () => {
  line.dropping = false;
  line.length = 0;
});

// --- Timer ---
function updateTimer() {
  if (!state.running) return;

  const now = Date.now();
  const deltaSeconds = (now - state.lastTime) / 1000;
  state.lastTime = now;
  state.timeRemaining -= deltaSeconds;

  if (state.timeRemaining <= 0) {
    const remaining = state.timeRemaining;
    state.timeRemaining = 0;
    endGame(remaining);
  }

  dom.timer.textContent = Math.ceil(state.timeRemaining);
}

// --- Game over ---
function endGame(secondsRemaining = 0) {
  state.running = false;
  if (animationId != null) cancelAnimationFrame(animationId);

  const won = state.score >= CONFIG.game.targetScore;
  dom.gameOverTitle.textContent = won ? 'You Win! 🎉' : 'You Lost! 😢';
  dom.gameOverMessage.textContent = won
    ? `You reached ${CONFIG.game.targetScore} points!`
    : `You scored ${state.score} points. You needed ${CONFIG.game.targetScore} to win!`;

  dom.gameOver.style.display = 'block';
}

// --- Drawing helpers ---
function drawWaveLayer(yStep, yOffset, color, lineWidth, amplitude, frequency, phase = 0) {
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  for (let y = yOffset; y < canvas.height; y += yStep) {
    ctx.beginPath();
    for (let x = 0; x <= canvas.width; x += 2) {
      const waveY = y + Math.sin(x * frequency + phase) * amplitude;
      ctx[x === 0 ? 'moveTo' : 'lineTo'](x, waveY);
    }
    ctx.stroke();
  }
}

function drawWaves() {
  ctx.fillStyle = CONFIG.colors.water;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawWaveLayer(40, 0, CONFIG.colors.waveLight, 2, 8, 0.02);
  drawWaveLayer(60, 20, CONFIG.colors.waveDark, 1.5, 6, 0.015, Math.PI / 4);
}

function drawFishingLine() {
  if (!line.dropping || !state.running) return;

  const endY = line.y + line.length;
  ctx.strokeStyle = CONFIG.colors.line;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(line.x, line.y);
  ctx.lineTo(line.x, endY);
  ctx.stroke();

  ctx.fillStyle = CONFIG.colors.hook;
  ctx.beginPath();
  ctx.arc(line.x, endY, 5, 0, Math.PI * 2);
  ctx.fill();
}

function flashCatchFeedback() {
  const originalBorder = canvas.style.borderColor;
  canvas.style.borderColor = CONFIG.colors.catchFlash;
  setTimeout(() => {
    canvas.style.borderColor = originalBorder || CONFIG.colors.water;
  }, 200);
}

// --- Game loop ---
let animationId;

function gameLoop() {
  updateTimer();

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawWaves();

  if (state.running && Math.random() < CONFIG.fish.spawnRate) {
    fish.push(new Fish());
  }

  const lineEndY = line.y + line.length;

  for (let i = fish.length - 1; i >= 0; i--) {
    if (state.running) fish[i].update();
    fish[i].draw();

    if (fish[i].isOffScreen()) {
      fish.splice(i, 1);
      continue;
    }

    if (state.running && line.dropping && fish[i].checkCollision(line.x, lineEndY)) {
      state.score += fish[i].points;
      dom.score.textContent = state.score;
      fish.splice(i, 1);
      flashCatchFeedback();
    }
  }

  if (line.dropping && state.running && line.length < line.maxLength) {
    line.length += CONFIG.game.lineSpeed;
  }

  drawFishingLine();

  if (state.running) {
    animationId = requestAnimationFrame(gameLoop);
  }
}

// --- Start ---
gameLoop();
