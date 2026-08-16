'use client';

import { Button, GridSystem } from '@/lib/ui';

const { Flex, Box } = GridSystem;

export function GridBox() {
  return (
    <Flex flexDirection="column" gap="var(--space-16)" width="100%">
      <Box direction="flex-start">
        <Button size="sm">Start</Button>
        <Button size="sm" variant="outlined">
          Group
        </Button>
      </Box>
      <Box direction="center">
        <Button size="sm">Center</Button>
        <Button size="sm" variant="outlined">
          Group
        </Button>
      </Box>
      <Box direction="flex-end">
        <Button size="sm">End</Button>
        <Button size="sm" variant="outlined">
          Group
        </Button>
      </Box>
    </Flex>
  );
}
