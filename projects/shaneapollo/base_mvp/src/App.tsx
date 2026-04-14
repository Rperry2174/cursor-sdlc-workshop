import React, { useEffect, useState } from 'react';
import { Box, Text, useApp, useInput } from 'ink';
import { Board, type BoardCard } from './components/Board.js';

const COLS = 4;
const ROWS = 3;
const PAIR_COUNT = (COLS * ROWS) / 2;
const MISMATCH_DELAY_MS = 800;
const SYMBOLS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

type CardState = BoardCard & { id: number };

function buildShuffledDeck(pairCount: number): CardState[] {
  const pool = SYMBOLS.slice(0, pairCount).flatMap((s) => [s, s]);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.map((symbol, id) => ({
    id,
    symbol,
    faceUp: false,
    matched: false,
  }));
}

export function App() {
  const { exit } = useApp();
  const [cards, setCards] = useState<CardState[]>(() =>
    buildShuffledDeck(PAIR_COUNT),
  );
  const [cursor, setCursor] = useState(0);
  const [firstPick, setFirstPick] = useState<number | null>(null);
  const [secondPick, setSecondPick] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);

  const won = cards.every((c) => c.matched);

  useEffect(() => {
    if (firstPick === null || secondPick === null) return;
    setLocked(true);
    const aSym = cards[firstPick].symbol;
    const bSym = cards[secondPick].symbol;
    const isMatch = aSym === bSym;

    const timer = setTimeout(
      () => {
        setCards((prev) =>
          prev.map((c, i) => {
            if (i !== firstPick && i !== secondPick) return c;
            return isMatch
              ? { ...c, matched: true, faceUp: true }
              : { ...c, faceUp: false };
          }),
        );
        setFirstPick(null);
        setSecondPick(null);
        setLocked(false);
      },
      isMatch ? 250 : MISMATCH_DELAY_MS,
    );

    return () => clearTimeout(timer);
  }, [firstPick, secondPick, cards]);

  useInput((input, key) => {
    if (won) {
      exit();
      return;
    }
    if (locked) return;

    if (key.upArrow && cursor >= COLS) {
      setCursor(cursor - COLS);
      return;
    }
    if (key.downArrow && cursor < COLS * (ROWS - 1)) {
      setCursor(cursor + COLS);
      return;
    }
    if (key.leftArrow && cursor % COLS > 0) {
      setCursor(cursor - 1);
      return;
    }
    if (key.rightArrow && cursor % COLS < COLS - 1) {
      setCursor(cursor + 1);
      return;
    }
    if (input === 'q' || key.escape) {
      exit();
      return;
    }
    if (key.return || input === ' ') {
      const c = cards[cursor];
      if (c.matched || c.faceUp) return;

      if (firstPick === null) {
        setFirstPick(cursor);
        setCards((prev) =>
          prev.map((card, i) =>
            i === cursor ? { ...card, faceUp: true } : card,
          ),
        );
      } else if (secondPick === null && cursor !== firstPick) {
        setSecondPick(cursor);
        setCards((prev) =>
          prev.map((card, i) =>
            i === cursor ? { ...card, faceUp: true } : card,
          ),
        );
      }
    }
  });

  return (
    <Box flexDirection="column" padding={1}>
      <Text color="cyan" bold>
        Ink Memory Match
      </Text>

      {won ? (
        <Box flexDirection="column" marginTop={1}>
          <Text color="green" bold>
            You win! Press any key to exit.
          </Text>
        </Box>
      ) : (
        <>
          <Board cards={cards} cursor={cursor} cols={COLS} rows={ROWS} />
          <Box marginTop={1}>
            <Text dimColor>
              Arrows: move · Space/Enter: flip · q or Esc: quit
            </Text>
          </Box>
        </>
      )}
    </Box>
  );
}
