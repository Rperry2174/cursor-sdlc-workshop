const Score = (function () {
  const ROW_POINTS = [100, 80, 60, 40, 20];

  let current = 0;
  let best = parseInt(sessionStorage.getItem('galaga_best') || '0', 10);

  function reset() {
    current = 0;
  }

  function addKill(enemyRow) {
    const points = ROW_POINTS[enemyRow] || 20;
    current += points;
    if (current > best) {
      best = current;
      sessionStorage.setItem('galaga_best', String(best));
    }
    return points;
  }

  function getCurrent() { return current; }
  function getBest() { return best; }

  function draw(ctx, canvasW) {
    ctx.save();
    ctx.font = 'bold 16px "Courier New", monospace';

    ctx.textAlign = 'left';
    ctx.fillStyle = '#fff';
    ctx.fillText('SCORE', 12, 18);
    ctx.fillStyle = '#ff0';
    ctx.fillText(String(current).padStart(6, '0'), 12, 36);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#fff';
    ctx.fillText('HIGH SCORE', canvasW - 12, 18);
    ctx.fillStyle = '#ff0';
    ctx.fillText(String(best).padStart(6, '0'), canvasW - 12, 36);

    ctx.restore();
  }

  return { reset, addKill, getCurrent, getBest, draw };
})();
