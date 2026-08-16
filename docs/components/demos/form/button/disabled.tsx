'use client';

import { Button, GridSystem } from '@/lib/ui';

const { Flex } = GridSystem;

export function ButtonDisabled() {
  return (
    <Flex flexWrap="wrap" alignItems="center" gap="var(--space-12)">
      <Button color="blue" disabled>
        Disabled
      </Button>
      <Button variant="outlined" color="blue" disabled>
        Disabled
      </Button>
      <Button variant="borderless" color="blue" disabled>
        Disabled
      </Button>
    </Flex>
  );
}
