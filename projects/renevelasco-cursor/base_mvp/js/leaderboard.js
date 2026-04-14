const Leaderboard = (function () {
  const STORAGE_KEY = 'galaga_leaderboard';
  const MAX_ENTRIES = 5;

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function save(entries) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }

  function getEntries() {
    return load();
  }

  function qualifies(score) {
    if (score <= 0) return false;
    const entries = load();
    if (entries.length < MAX_ENTRIES) return true;
    return score > entries[entries.length - 1].score;
  }

  function addEntry(name, score) {
    const entries = load();
    const displayName = (name || 'AAA').toUpperCase().slice(0, 10);
    entries.push({ name: displayName, score });
    entries.sort((a, b) => b.score - a.score);
    if (entries.length > MAX_ENTRIES) entries.length = MAX_ENTRIES;
    save(entries);
    return entries;
  }

  function drawOnCanvas(ctx, canvasW, startY) {
    const entries = load();
    if (entries.length === 0) return;

    ctx.save();
    ctx.textAlign = 'center';

    ctx.font = 'bold 14px "Courier New", monospace';
    ctx.fillStyle = '#ff0';
    ctx.fillText('TOP SCORES', canvasW / 2, startY);

    ctx.font = '12px "Courier New", monospace';
    const RANK_COLORS = ['#ff0', '#ccc', '#c84', '#888', '#888'];

    for (let i = 0; i < entries.length; i++) {
      const e = entries[i];
      const y = startY + 22 + i * 18;
      ctx.fillStyle = RANK_COLORS[i] || '#888';

      const rank = String(i + 1) + '.';
      const name = e.name.padEnd(10, ' ');
      const score = String(e.score).padStart(7, '0');
      ctx.fillText(rank + ' ' + name + ' ' + score, canvasW / 2, y);
    }

    ctx.restore();
  }

  return { getEntries, qualifies, addEntry, drawOnCanvas };
})();
