/**
 * High scores for Team 3 Snake. Persists top N scores in localStorage.
 */
const highScores = (function () {
  const STORAGE_KEY = 'snake-team3-highscores';
  const MAX = 10;

  function get() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw == null) return [];
      const list = JSON.parse(raw);
      if (!Array.isArray(list)) return [];
      return list
        .filter(entry => typeof entry.score === 'number')
        .sort((a, b) => (b.score - a.score))
        .slice(0, MAX);
    } catch {
      return [];
    }
  }

  function save(list) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, MAX)));
    } catch (_) {}
  }

  /**
   * Add a score. Returns { added: boolean, rank: number | null }.
   */
  function add(score) {
    if (typeof score !== 'number' || score < 0) return { added: false, rank: null };
    const list = get();
    const newEntry = { score, date: Date.now() };
    list.push(newEntry);
    list.sort((a, b) => b.score - a.score);
    const trimmed = list.slice(0, MAX);
    save(trimmed);
    const rank = trimmed.findIndex(e => e.score === score && e.date === newEntry.date) + 1;
    const added = rank >= 1 && rank <= MAX;
    return { added, rank: added ? rank : null };
  }

  /**
   * Get 1-based rank for a score if it would appear in the list; otherwise null.
   */
  function getRank(score) {
    const list = get();
    if (list.length === 0) return 1;
    let rank = 1;
    for (const entry of list) {
      if (score > entry.score) return rank;
      if (score === entry.score) return rank;
      rank++;
    }
    return rank <= MAX ? rank : null;
  }

  return { get, add, getRank };
})();
