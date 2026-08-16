'use client';

import { Chip, GridSystem } from '@/lib/ui';

const { Flex } = GridSystem;

const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;

export function ChipSizes() {
  return (
    <Flex flexWrap="wrap" alignItems="center" gap="var(--space-12)">
      {sizes.map((size) => (
        <Chip key={size} text={size} color="blue" size={size} />
      ))}
    </Flex>
  );
}
