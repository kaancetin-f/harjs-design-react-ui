'use client';

import { Chip, GridSystem } from '@/lib/ui';

const { Flex } = GridSystem;

export function ChipBasic() {
  return (
    <Flex flexWrap="wrap" alignItems="center" gap="var(--space-12)">
      <Chip text="Design" color="blue" />
      <Chip text="API" color="green" variant="filled" />
      <Chip text="Docs" color="orange" variant="surface" />
      <Chip text="Review" color="purple" variant="dashed" />
    </Flex>
  );
}
