'use client';

import { Button, GridSystem } from '@/lib/ui';

const { Flex } = GridSystem;

export function ButtonUpperCase() {
  return (
    <Flex flexWrap="wrap" alignItems="center" gap="var(--space-12)">
      <Button color="blue">normal case</Button>
      <Button color="blue" upperCase>
        upper case
      </Button>
      <Button variant="outlined" color="teal" upperCase>
        save changes
      </Button>
    </Flex>
  );
}
