/**
 * Passage bank for TypeRush, keyed by difficulty.
 *
 * Easy   ≈ 15 common words, no punctuation tricks
 * Medium ≈ 30 words with commas and periods
 * Hard   ≈ 50 words with mixed case, numbers, and symbols
 */
var PASSAGES = {
  easy:
    "The sun rose over the calm lake and birds began to sing their morning songs in the tall green trees nearby.",

  medium:
    "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump! A wizard's job is to vex chumps quickly in fog.",

  hard:
    "Dr. Smith-Jones earned $4,250 on 03/15 for her 2nd consulting gig — \"Quite impressive,\" remarked CEO @Parker. The ROI jumped +18.7% (year-over-year), beating Q3's forecast of ~12%. Needless to say, the board's 5-star review wasn't surprising; it was *well* deserved!"
};

function getPassage(difficulty) {
  return PASSAGES[difficulty] || PASSAGES.medium;
}
