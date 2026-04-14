const Lives = (function () {
  const START_LIVES = 3;
  const INVINCIBLE_FRAMES = 90;

  let count = START_LIVES;
  let invincibleTimer = 0;

  function reset() {
    count = START_LIVES;
    invincibleTimer = 0;
  }

  function getCount() { return count; }
  function isInvincible() { return invincibleTimer > 0; }

  function hit() {
    if (invincibleTimer > 0) return false;
    count--;
    invincibleTimer = INVINCIBLE_FRAMES;
    return true;
  }

  function update() {
    if (invincibleTimer > 0) invincibleTimer--;
  }

  function checkPlayerHit(player, playerW, playerH, enemies, enemyW, enemyH, enemyMovement) {
    if (invincibleTimer > 0) return false;

    const px = player.x;
    const py = player.y;

    const eBullets = enemyMovement.getEnemyBullets();
    const bSize = enemyMovement.getBulletSize();
    for (let i = eBullets.length - 1; i >= 0; i--) {
      const b = eBullets[i];
      if (
        b.x < px + playerW &&
        b.x + bSize.w > px &&
        b.y < py + playerH &&
        b.y + bSize.h > py
      ) {
        eBullets.splice(i, 1);
        return hit();
      }
    }

    for (const e of enemies) {
      if (!e.alive) continue;
      if (!enemyMovement.isDiving(e)) continue;
      if (
        e.x < px + playerW &&
        e.x + enemyW > px &&
        e.y < py + playerH &&
        e.y + enemyH > py
      ) {
        e.alive = false;
        return hit();
      }
    }

    return false;
  }

  function draw(ctx, canvasH) {
    ctx.save();
    const y = canvasH - 20;
    ctx.fillStyle = '#fff';
    ctx.font = '12px "Courier New", monospace';
    ctx.textAlign = 'left';

    for (let i = 0; i < count; i++) {
      const x = 12 + i * 22;
      ctx.beginPath();
      ctx.moveTo(x + 7, y - 8);
      ctx.lineTo(x + 14, y + 4);
      ctx.lineTo(x, y + 4);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  return { reset, getCount, isInvincible, hit, update, checkPlayerHit, draw };
})();
