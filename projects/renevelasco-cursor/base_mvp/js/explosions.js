const Explosions = (function () {
  const PARTICLE_COUNT = 12;
  const PARTICLE_LIFE = 30;
  const PARTICLE_SPEED = 3;

  let particles = [];

  function reset() {
    particles = [];
  }

  function spawn(x, y, color) {
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const angle = (Math.PI * 2 * i) / PARTICLE_COUNT + (Math.random() - 0.5) * 0.5;
      const speed = PARTICLE_SPEED * (0.5 + Math.random() * 0.8);
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: PARTICLE_LIFE + Math.floor(Math.random() * 10),
        maxLife: PARTICLE_LIFE + 10,
        color,
        size: 2 + Math.random() * 2
      });
    }
  }

  function update() {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.96;
      p.vy *= 0.96;
      p.life--;
      if (p.life <= 0) {
        particles.splice(i, 1);
      }
    }
  }

  function draw(ctx) {
    for (const p of particles) {
      const alpha = p.life / p.maxLife;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
    }
    ctx.globalAlpha = 1;
  }

  return { reset, spawn, update, draw };
})();
