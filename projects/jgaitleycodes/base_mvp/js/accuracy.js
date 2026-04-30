/**
 * Accuracy tracker for TypeRush.
 * Counts every keystroke (including backspaces) so players can't game the
 * metric by deleting mistakes.
 *
 * Usage:
 *   const tracker = createAccuracyTracker();
 *   tracker.recordKey(expected, typed);   // call on each keystroke
 *   tracker.getAccuracy();                // returns 0–100
 *   tracker.reset();
 */
function createAccuracyTracker() {
  var totalKeys = 0;
  var correctKeys = 0;

  return {
    recordKey: function (expected, typed) {
      totalKeys++;
      if (typed === expected) correctKeys++;
    },

    getAccuracy: function () {
      if (totalKeys === 0) return 100;
      return Math.round((correctKeys / totalKeys) * 100);
    },

    reset: function () {
      totalKeys = 0;
      correctKeys = 0;
    }
  };
}
