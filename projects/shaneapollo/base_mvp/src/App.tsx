import React from 'react';
import { Box, Text } from 'ink';

export function App() {
  return (
    <Box flexDirection="column" padding={1}>
      <Text color="cyan">Ink Memory Match</Text>
      <Text dimColor>Starter placeholder — press Ctrl+C to exit.</Text>
      <Box marginTop={1}>
        <Text>Next: build the 4×3 board and keyboard navigation.</Text>
      </Box>
    </Box>
  );
}
