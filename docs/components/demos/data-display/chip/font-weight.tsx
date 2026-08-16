'use client';

import { Chip, GridSystem } from '@/lib/ui';

const { Flex } = GridSystem;

const weights = ['400', '500', '600', '700', '800'] as const;

export function ChipFontWeight() {
  return (
    <Flex flexWrap="wrap" alignItems="center" gap="var(--space-12)">
      {weights.map((fontWeight) => (
        <Chip key={fontWeight} text={fontWeight} color="blue" variant="outlined" fontWeight={fontWeight} />
      ))}
    </Flex>
  );
}
