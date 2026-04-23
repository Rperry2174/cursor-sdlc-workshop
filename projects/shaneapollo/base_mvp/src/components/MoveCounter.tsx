import React from 'react';
import { Box, Text } from 'ink';

export type MoveCounterProps = {
  moves: number;
};

export function MoveCounter({ moves }: MoveCounterProps) {
  return (
    <Box>
      <Text>Moves: </Text>
      <Text color="yellow" bold>
        {moves}
      </Text>
    </Box>
  );
}
