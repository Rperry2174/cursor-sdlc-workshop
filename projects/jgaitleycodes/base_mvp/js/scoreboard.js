/**
 * Best-score persistence for TypeRush.
 * Stores per-difficulty bests in localStorage under keys like
 * "typerush:best:easy", "typerush:best:medium", etc.
 */
function getBest(difficulty) {
  var raw = localStorage.getItem("typerush:best:" + difficulty);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch (e) { return null; }
}

function saveIfBest(difficulty, wpm, accuracyPct) {
  var prev = getBest(difficulty);
  if (!prev || wpm > prev.wpm) {
    localStorage.setItem("typerush:best:" + difficulty, JSON.stringify({
      wpm: wpm,
      accuracy: accuracyPct
    }));
    return true;
  }
  return false;
}

function resetBest(difficulty) {
  localStorage.removeItem("typerush:best:" + difficulty);
}
