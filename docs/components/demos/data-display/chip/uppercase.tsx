'use client';

import { Chip, GridSystem } from '@/lib/ui';

const { Flex } = GridSystem;

export function ChipUpperCase() {
  return (
    <Flex flexWrap="wrap" alignItems="center" gap="var(--space-12)">
      <Chip text="in review" color="blue" />
      <Chip text="in review" color="blue" upperCase />
      <Chip text="shipped" color="green" variant="filled" upperCase />
    </Flex>
  );
}
