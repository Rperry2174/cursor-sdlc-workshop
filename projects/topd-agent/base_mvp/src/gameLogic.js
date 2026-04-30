const ROWS = 9;
const COLS = 9;
const MINE_COUNT = 10;

export { ROWS, COLS, MINE_COUNT };

export function createBoard() {
  const board = [];
  for (let r = 0; r < ROWS; r++) {
    const row = [];
    for (let c = 0; c < COLS; c++) {
      row.push({
        row: r,
        col: c,
        isMine: false,
        isRevealed: false,
        adjacentMines: 0,
      });
    }
    board.push(row);
  }
  return board;
}

/**
 * Place mines randomly, but never on the cell the player clicked first.
 * This guarantees the first click is always safe.
 */
export function placeMines(board, safeRow, safeCol) {
  let placed = 0;
  while (placed < MINE_COUNT) {
    const r = Math.floor(Math.random() * ROWS);
    const c = Math.floor(Math.random() * COLS);
    if (board[r][c].isMine) continue;
    if (r === safeRow && c === safeCol) continue;
    board[r][c].isMine = true;
    placed++;
  }
  computeAdjacentCounts(board);
}

function computeAdjacentCounts(board) {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c].isMine) continue;
      let count = 0;
      for (const [dr, dc] of neighbors()) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && board[nr][nc].isMine) {
          count++;
        }
      }
      board[r][c].adjacentMines = count;
    }
  }
}

/**
 * Flood-fill reveal: when a blank cell (0 adjacent mines) is clicked,
 * automatically reveal all connected blank cells and their numbered borders.
 */
export function revealCell(board, row, col) {
  const cell = board[row][col];
  if (cell.isRevealed) return;

  cell.isRevealed = true;

  if (cell.isMine) return;

  // If this cell has no adjacent mines, reveal all its neighbors too
  if (cell.adjacentMines === 0) {
    for (const [dr, dc] of neighbors()) {
      const nr = row + dr;
      const nc = col + dc;
      if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
        revealCell(board, nr, nc);
      }
    }
  }
}

export function revealAllMines(board) {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c].isMine) {
        board[r][c].isRevealed = true;
      }
    }
  }
}

function neighbors() {
  return [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1],
  ];
}

/**
 * Check if the player has won: all non-mine cells are revealed.
 */
export function checkWin(board) {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = board[r][c];
      if (!cell.isMine && !cell.isRevealed) return false;
    }
  }
  return true;
}

/**
 * Deep-clone the board so React detects state changes.
 */
export function cloneBoard(board) {
  return board.map(row => row.map(cell => ({ ...cell })));
}
