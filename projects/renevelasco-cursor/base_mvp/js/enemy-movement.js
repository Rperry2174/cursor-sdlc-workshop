const EnemyMovement = (function () {
  const SWAY_SPEED = 0.015;
  const SWAY_RANGE = 30;
  const DIVE_SPEED = 3;
  const DIVE_CHANCE = 0.004;
  const MAX_DIVERS = 2;
  const ENEMY_BULLET_SPEED = 4;
  const ENEMY_BULLET_W = 3;
  const ENEMY_BULLET_H = 10;

  let swayOffset = 0;
  let swayAngle = 0;
  let divers = [];
  let enemyBullets = [];

  function reset() {
    swayOffset = 0;
    swayAngle = 0;
    divers = [];
    enemyBullets = [];
  }

  function update(enemies, frameCount, canvasW, canvasH, wave) {
    const waveNum = wave || 1;
    const swayMult = 1 + (waveNum - 1) * 0.3;
    const diveMult = 1 + (waveNum - 1) * 0.6;
    const maxDivers = MAX_DIVERS + (waveNum - 1);

    swayAngle += SWAY_SPEED * swayMult;
    const newOffset = Math.sin(swayAngle) * SWAY_RANGE;
    const delta = newOffset - swayOffset;
    swayOffset = newOffset;

    for (const e of enemies) {
      if (!e.alive) continue;
      if (divers.some(d => d.enemy === e)) continue;
      e.x += delta;
    }

    const aliveInFormation = enemies.filter(
      e => e.alive && !divers.some(d => d.enemy === e)
    );
    if (aliveInFormation.length > 0 && divers.length < maxDivers) {
      if (Math.random() < DIVE_CHANCE * diveMult) {
        const pick = aliveInFormation[Math.floor(Math.random() * aliveInFormation.length)];
        divers.push({
          enemy: pick,
          homeX: pick.x,
          homeY: pick.y,
          phase: 'diving',
          hasFired: false
        });
      }
    }

    for (let i = divers.length - 1; i >= 0; i--) {
      const d = divers[i];
      const e = d.enemy;

      if (!e.alive) {
        divers.splice(i, 1);
        continue;
      }

      if (d.phase === 'diving') {
        e.y += DIVE_SPEED;
        e.x += Math.sin(frameCount * 0.1) * 1.5;

        if (!d.hasFired && e.y > canvasH * 0.4) {
          enemyBullets.push({ x: e.x + 14, y: e.y + 22 });
          d.hasFired = true;
        }

        if (e.y > canvasH + 20) {
          d.phase = 'returning';
          e.x = d.homeX + swayOffset;
          e.y = -30;
        }
      } else if (d.phase === 'returning') {
        const targetY = d.homeY;
        const targetX = d.homeX + swayOffset;
        const dx = targetX - e.x;
        const dy = targetY - e.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 3) {
          e.x = targetX;
          e.y = targetY;
          divers.splice(i, 1);
        } else {
          e.x += (dx / dist) * DIVE_SPEED;
          e.y += (dy / dist) * DIVE_SPEED;
        }
      }
    }

    for (let i = enemyBullets.length - 1; i >= 0; i--) {
      enemyBullets[i].y += ENEMY_BULLET_SPEED;
      if (enemyBullets[i].y > canvasH) {
        enemyBullets.splice(i, 1);
      }
    }
  }

  function drawBullets(ctx) {
    ctx.fillStyle = '#f44';
    for (const b of enemyBullets) {
      ctx.fillRect(b.x, b.y, ENEMY_BULLET_W, ENEMY_BULLET_H);
    }
    ctx.fillStyle = 'rgba(255, 68, 68, 0.3)';
    for (const b of enemyBullets) {
      ctx.fillRect(b.x - 1, b.y - 4, ENEMY_BULLET_W + 2, 4);
    }
  }

  function isDiving(enemy) {
    return divers.some(d => d.enemy === enemy);
  }

  function getEnemyBullets() {
    return enemyBullets;
  }

  function getBulletSize() {
    return { w: ENEMY_BULLET_W, h: ENEMY_BULLET_H };
  }

  return { reset, update, drawBullets, isDiving, getEnemyBullets, getBulletSize };
})();
