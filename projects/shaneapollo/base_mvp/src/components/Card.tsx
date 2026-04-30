import React from 'react';
import { Box, Text } from 'ink';

export type CardViewProps = {
  symbol: string;
  faceUp: boolean;
  matched: boolean;
  selected: boolean;
};

export function Card({ symbol, faceUp, matched, selected }: CardViewProps) {
  const revealed = faceUp || matched;
  const borderColor = matched ? 'green' : selected ? 'cyan' : 'gray';
  const textColor = matched ? 'green' : revealed ? 'yellow' : 'white';
  const label = revealed ? symbol : '?';

  return (
    <Box
      borderStyle="round"
      borderColor={borderColor}
      paddingX={1}
      marginRight={1}
    >
      <Text color={textColor} bold={selected} dimColor={!revealed && !selected}>
        {label}
      </Text>
    </Box>
  );
}
