'use client';

import { Chip, GridSystem } from '@/lib/ui';

const { Flex } = GridSystem;

const variants = [
  'filled',
  'surface',
  'surface-borderless',
  'outlined',
  'dashed',
  'borderless',
] as const;

export function ChipVariants() {
  return (
    <Flex flexWrap="wrap" alignItems="center" gap="var(--space-12)">
      {variants.map((variant) => (
        <Chip key={variant} text={variant} color="blue" variant={variant} />
      ))}
    </Flex>
  );
}
