/**
 * One fixed puzzle + unique solution (classic easy 9×9).
 * 0 = empty in initial; given cells are locked in the UI.
 */
const PUZZLE = {
  initial: [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9],
  ],
  solution: [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9],
  ],
}

/** @type {boolean[][]} */
const given = PUZZLE.initial.map((row) => row.map((v) => v !== 0))

/** @type {number[][]} */
let board = PUZZLE.initial.map((row) => row.slice())

/** Pencil marks: candidate digits 1–9 per cell (only used when board cell is empty). */
/** @type {Set<number>[][]} */
let notes = createEmptyNotes()

/** @type {{ r: number, c: number } | null} */
let selected = null

/** When true, digit keys toggle pencil marks instead of placing a value. */
let notesMode = false

const gridEl = document.getElementById('grid')
const statusEl = document.getElementById('status')
const notesToggleEl = document.getElementById('notes-toggle')
const notesStateLabelEl = document.getElementById('notes-state-label')

function createEmptyNotes() {
  return Array.from({ length: 9 }, () =>
    Array.from({ length: 9 }, () => new Set()),
  )
}

function clearNotesAt(r, c) {
  notes[r][c].clear()
}

function key(r, c) {
  return `${r},${c}`
}

/**
 * Cells that violate Sudoku rules (duplicate in row, column, or 3×3 box).
 * @param {number[][]} b
 * @returns {Set<string>}
 */
function conflictingCells(b) {
  const bad = new Set()

  for (let r = 0; r < 9; r++) {
    const seen = new Map()
    for (let c = 0; c < 9; c++) {
      const v = b[r][c]
      if (v === 0) continue
      if (!seen.has(v)) {
        seen.set(v, [r, c])
        continue
      }
      const first = seen.get(v)
      bad.add(key(first[0], first[1]))
      bad.add(key(r, c))
    }
  }

  for (let c = 0; c < 9; c++) {
    const seen = new Map()
    for (let r = 0; r < 9; r++) {
      const v = b[r][c]
      if (v === 0) continue
      if (!seen.has(v)) {
        seen.set(v, [r, c])
        continue
      }
      const first = seen.get(v)
      bad.add(key(first[0], first[1]))
      bad.add(key(r, c))
    }
  }

  for (let br = 0; br < 3; br++) {
    for (let bc = 0; bc < 3; bc++) {
      const seen = new Map()
      for (let dr = 0; dr < 3; dr++) {
        for (let dc = 0; dc < 3; dc++) {
          const r = br * 3 + dr
          const c = bc * 3 + dc
          const v = b[r][c]
          if (v === 0) continue
          if (!seen.has(v)) {
            seen.set(v, [r, c])
            continue
          }
          const first = seen.get(v)
          bad.add(key(first[0], first[1]))
          bad.add(key(r, c))
        }
      }
    }
  }

  return bad
}

function matchesSolution(b) {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (b[r][c] !== PUZZLE.solution[r][c]) return false
    }
  }
  return true
}

function setStatus(message, variant) {
  statusEl.textContent = message
  statusEl.className = 'status' + (variant ? ` ${variant}` : '')
}

function render() {
  const conflicts = conflictingCells(board)
  const solved = conflicts.size === 0 && matchesSolution(board)

  gridEl.replaceChildren()

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const cell = document.createElement('div')
      cell.className = 'cell'
      cell.setAttribute('role', 'gridcell')
      cell.tabIndex = given[r][c] ? -1 : 0
      cell.dataset.r = String(r)
      cell.dataset.c = String(c)

      if (c === 2 || c === 5) cell.classList.add('box-right')
      if (r === 2 || r === 5) cell.classList.add('box-bottom')
      {
        const br = Math.floor(r / 3)
        const bc = Math.floor(c / 3)
        cell.classList.add((br + bc) % 2 === 0 ? 'cell-shade-a' : 'cell-shade-b')
      }
      if (given[r][c]) cell.classList.add('given')
      if (selected && selected.r === r && selected.c === c) cell.classList.add('selected')
      if (conflicts.has(key(r, c))) cell.classList.add('conflict')

      const v = board[r][c]
      const inner = document.createElement('div')
      inner.className = 'cell-inner'
      if (v !== 0) {
        inner.textContent = String(v)
      } else if (notes[r][c].size > 0) {
        const ng = document.createElement('div')
        ng.className = 'cell-notes'
        for (let d = 1; d <= 9; d++) {
          const slot = document.createElement('span')
          slot.className =
            'note-slot' + (notes[r][c].has(d) ? '' : ' is-empty')
          slot.textContent = String(d)
          ng.appendChild(slot)
        }
        inner.appendChild(ng)
      }
      cell.appendChild(inner)

      cell.addEventListener('click', () => {
        if (given[r][c]) return
        selected = { r, c }
        render()
      })

      gridEl.appendChild(cell)
    }
  }

  if (solved) {
    setStatus('Solved! Nice work.', 'solved')
  } else if (conflicts.size > 0) {
    setStatus('Conflict: same digit appears twice in a row, column, or 3×3 box.', 'conflict')
  } else {
    setStatus('')
  }
}

function placeDigit(digit) {
  if (!selected || given[selected.r][selected.c]) return
  const { r, c } = selected
  board[r][c] = digit
  clearNotesAt(r, c)
  render()
}

function toggleNote(digit) {
  if (!selected || given[selected.r][selected.c]) return
  const { r, c } = selected
  if (board[r][c] !== 0) return
  const set = notes[r][c]
  if (set.has(digit)) set.delete(digit)
  else set.add(digit)
  render()
}

function clearCell() {
  if (!selected || given[selected.r][selected.c]) return
  const { r, c } = selected
  board[r][c] = 0
  clearNotesAt(r, c)
  render()
}

/** First editable cell in reading order (for initial arrow-key focus). */
function selectFirstEditable() {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (!given[r][c]) {
        selected = { r, c }
        render()
        return
      }
    }
  }
}

/**
 * Move selection by one step in a direction; skip given cells.
 * Stops at grid edge without wrapping.
 */
function moveSelection(dr, dc) {
  if (!selected) {
    selectFirstEditable()
    return
  }
  let r = selected.r + dr
  let c = selected.c + dc
  while (r >= 0 && r < 9 && c >= 0 && c < 9) {
    if (!given[r][c]) {
      selected = { r, c }
      render()
      return
    }
    r += dr
    c += dc
  }
}

function setNotesMode(on) {
  notesMode = on
  notesToggleEl.setAttribute('aria-pressed', String(on))
  if (notesStateLabelEl) notesStateLabelEl.textContent = on ? 'On' : 'Off'
}

notesToggleEl.addEventListener('click', () => {
  setNotesMode(!notesMode)
})

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp') {
    moveSelection(-1, 0)
    e.preventDefault()
    return
  }
  if (e.key === 'ArrowDown') {
    moveSelection(1, 0)
    e.preventDefault()
    return
  }
  if (e.key === 'ArrowLeft') {
    moveSelection(0, -1)
    e.preventDefault()
    return
  }
  if (e.key === 'ArrowRight') {
    moveSelection(0, 1)
    e.preventDefault()
    return
  }
  if (e.key === 'n' || e.key === 'N') {
    if (e.ctrlKey || e.metaKey || e.altKey) return
    setNotesMode(!notesMode)
    e.preventDefault()
    return
  }
  if (e.key >= '1' && e.key <= '9') {
    const d = Number.parseInt(e.key, 10)
    if (notesMode) toggleNote(d)
    else placeDigit(d)
    e.preventDefault()
    return
  }
  if (e.key === 'Backspace' || e.key === 'Delete') {
    clearCell()
    e.preventDefault()
  }
})

document.querySelectorAll('.pad button[data-digit]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const d = btn.getAttribute('data-digit')
    if (!d) return
    const digit = Number.parseInt(d, 10)
    if (notesMode) toggleNote(digit)
    else placeDigit(digit)
  })
})

document.getElementById('clear').addEventListener('click', clearCell)

render()
