/**
 * Difficulty selector for TypeRush.
 *
 * Reads the current value from the <select id="difficulty"> element
 * and returns the matching passage from passages.js.
 */
function getSelectedDifficulty() {
  var el = document.getElementById("difficulty");
  return el ? el.value : "medium";
}

function getSelectedPassage() {
  return getPassage(getSelectedDifficulty());
}
