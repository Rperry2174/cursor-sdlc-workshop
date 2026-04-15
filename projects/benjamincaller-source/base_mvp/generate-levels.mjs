#!/usr/bin/env node
const GRID = 6, TARGET_ROW = 2, MAX_SOLVE = 50;

function solve(vehicles) {
  const encode = vehs => vehs.map(v => `${v.row},${v.col}`).join('|');
  const initial = vehicles.map(v => ({ ...v }));
  const queue = [{ vehs: initial, moves: 0 }];
  const seen = new Set([encode(initial)]);
  while (queue.length) {
    const { vehs, moves } = queue.shift();
    if (vehs.find(v => v.isTarget).col + vehs.find(v => v.isTarget).size >= GRID) return moves;
    if (moves >= MAX_SOLVE) continue;
    for (let vi = 0; vi < vehs.length; vi++) {
      const grid = Array.from({ length: GRID }, () => Array(GRID).fill(false));
      vehs.forEach((v, i) => { if (i !== vi) for (let j = 0; j < v.size; j++) { const r = v.orient === 'v' ? v.row + j : v.row, c = v.orient === 'h' ? v.col + j : v.col; grid[r][c] = true; } });
      const v = vehs[vi];
      const tryM = (nr, nc) => { const nv = vehs.map((x, i) => i === vi ? { ...x, row: nr, col: nc } : { ...x }); const k = encode(nv); if (!seen.has(k)) { seen.add(k); queue.push({ vehs: nv, moves: moves + 1 }); } };
      if (v.orient === 'h') { for (let d = -1; v.col + d >= 0 && !grid[v.row][v.col + d]; d--) tryM(v.row, v.col + d); for (let d = 1; v.col + v.size - 1 + d < GRID && !grid[v.row][v.col + v.size - 1 + d]; d++) tryM(v.row, v.col + d); }
      else { for (let d = -1; v.row + d >= 0 && !grid[v.row + d][v.col]; d--) tryM(v.row + d, v.col); for (let d = 1; v.row + v.size - 1 + d < GRID && !grid[v.row + v.size - 1 + d][v.col]; d++) tryM(v.row + d, v.col); }
    }
  }
  return -1;
}

function randInt(lo, hi) { return lo + Math.floor(Math.random() * (hi - lo)); }

function generateBoard(minVeh, maxVeh) {
  const grid = Array.from({ length: GRID }, () => Array(GRID).fill(false));
  const vehicles = [];
  const occ = (r, c, s, o) => { for (let i = 0; i < s; i++) { const rr = o === 'v' ? r + i : r, cc = o === 'h' ? c + i : c; if (rr < 0 || rr >= GRID || cc < 0 || cc >= GRID || grid[rr][cc]) return true; } return false; };
  const place = (r, c, s, o) => { for (let i = 0; i < s; i++) { const rr = o === 'v' ? r + i : r, cc = o === 'h' ? c + i : c; grid[rr][cc] = true; } };

  const tc = randInt(0, 3);
  place(TARGET_ROW, tc, 2, 'h');
  vehicles.push({ row: TARGET_ROW, col: tc, size: 2, orient: 'h', isTarget: true });

  const bc = randInt(Math.max(tc + 2, 2), GRID);
  if (bc < GRID) {
    const bs = Math.random() < 0.5 ? 2 : 3;
    const minR = Math.max(0, TARGET_ROW - bs + 1);
    const starts = [];
    for (let r = minR; r <= Math.min(GRID - bs, TARGET_ROW); r++) if (!occ(r, bc, bs, 'v')) starts.push(r);
    if (starts.length) { const sr = starts[randInt(0, starts.length)]; place(sr, bc, bs, 'v'); vehicles.push({ row: sr, col: bc, size: bs, orient: 'v', isTarget: false }); }
  }

  const num = randInt(minVeh, maxVeh + 1);
  let att = 0;
  while (vehicles.length < num && att < 300) {
    att++;
    const s = Math.random() < 0.65 ? 2 : 3;
    const o = Math.random() < 0.5 ? 'h' : 'v';
    const r = randInt(0, o === 'v' ? GRID - s + 1 : GRID);
    const c = randInt(0, o === 'h' ? GRID - s + 1 : GRID);
    if (!occ(r, c, s, o)) { place(r, c, s, o); vehicles.push({ row: r, col: c, size: s, orient: o, isTarget: false }); }
  }
  return vehicles;
}

const buckets = [
  { label: 'Beginner',     minMoves: 5,  maxMoves: 9,  minVeh: 5,  maxVeh: 9,  target: 20 },
  { label: 'Intermediate', minMoves: 10, maxMoves: 18, minVeh: 7,  maxVeh: 11, target: 20 },
  { label: 'Advanced',     minMoves: 19, maxMoves: 50, minVeh: 9,  maxVeh: 13, target: 20 },
];

const all = [];
for (const b of buckets) {
  const found = [];
  let att = 0;
  process.stderr.write(`${b.label} (${b.minMoves}-${b.maxMoves} moves)...`);
  while (found.length < b.target && att < 800_000) {
    att++;
    const v = generateBoard(b.minVeh, b.maxVeh);
    const m = solve(v);
    if (m >= b.minMoves && m <= b.maxMoves) {
      const d = v.map(x => [x.row, x.col, x.size, x.orient, x.isTarget]);
      const sig = d.map(x => x.join(',')).sort().join(';');
      if (!found.some(f => f.sig === sig)) found.push({ d, m, sig });
    }
  }
  found.sort((a, b2) => a.m - b2.m);
  process.stderr.write(` ${found.length}/${b.target} in ${att}\n`);
  all.push(...found.map(f => ({ v: f.d, par: f.m, d: b.label })));
}

process.stderr.write(`Total: ${all.length}\n`);
process.stdout.write(JSON.stringify(all, null, 2) + '\n');
