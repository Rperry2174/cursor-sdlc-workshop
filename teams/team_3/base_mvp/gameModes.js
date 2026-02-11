/**
 * Game modes for Team 3 Snake. Handles mode selection and boundary logic.
 */
const gameModes = (function () {
  /** @type {'classic' | 'wrap'} */
  const MODE_CLASSIC = 'classic';
  const MODE_WRAP = 'wrap';

  /** Current mode for the active game (set when game starts). */
  let currentMode = MODE_CLASSIC;

  /**
   * Returns the currently selected mode from the UI.
   * @returns {'classic' | 'wrap'}
   */
  function getSelected() {
    const checked = document.querySelector('input[name="gameMode"]:checked');
    return checked?.value === MODE_WRAP ? MODE_WRAP : MODE_CLASSIC;
  }

  /**
   * Sets the mode for the current game (call when starting a game).
   * @param {'classic' | 'wrap'} mode
   */
  function setCurrent(mode) {
    currentMode = mode === MODE_WRAP ? MODE_WRAP : MODE_CLASSIC;
  }

  /** Returns the mode for the active game. */
  function getCurrent() {
    return currentMode;
  }

  /**
   * Applies boundary logic based on mode.
   * Classic: game over if head is out of bounds.
   * Wrap: head wraps to opposite edge.
   * @param {{ x: number, y: number }} head - New head position (may be out of bounds)
   * @param {number} cols - Grid columns
   * @param {number} rows - Grid rows
   * @param {'classic' | 'wrap'} mode
   * @returns {{ gameOver: boolean, head: { x: number, y: number } }}
   */
  function handleBoundary(head, cols, rows, mode) {
    const outOfBounds =
      head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows;

    if (mode === MODE_CLASSIC && outOfBounds) {
      return { gameOver: true, head };
    }

    if (mode === MODE_WRAP && outOfBounds) {
      head.x = ((head.x % cols) + cols) % cols;
      head.y = ((head.y % rows) + rows) % rows;
    }

    return { gameOver: false, head };
  }

  return { getSelected, setCurrent, getCurrent, handleBoundary };
})();
