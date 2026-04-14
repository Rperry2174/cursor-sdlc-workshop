import React from 'react';
import { Box } from 'ink';
import { Card } from './Card.js';

export type BoardCard = {
  symbol: string;
  faceUp: boolean;
  matched: boolean;
};

export type BoardProps = {
  cards: BoardCard[];
  cursor: number;
  cols: number;
  rows: number;
};

export function Board({ cards, cursor, cols, rows }: BoardProps) {
  return (
    <Box flexDirection="column" marginTop={1}>
      {Array.from({ length: rows }, (_, r) => (
        <Box key={r} flexDirection="row">
          {Array.from({ length: cols }, (_, c) => {
            const idx = r * cols + c;
            const card = cards[idx];
            return (
              <Card
                key={idx}
                symbol={card.symbol}
                faceUp={card.faceUp}
                matched={card.matched}
                selected={idx === cursor}
              />
            );
          })}
        </Box>
      ))}
    </Box>
  );
}
