'use client';

import { Radio, GridSystem } from '@/lib/ui';

const { Flex } = GridSystem;

const variants = [
  'filled',
  'surface',
  'surface-borderless',
  'outlined',
  'dashed',
] as const;

export function RadioVariants() {
  return (
    <Flex flexWrap="wrap" alignItems="center" gap="var(--space-12)">
      {variants.map((variant) => (
        <Radio key={variant} label={variant} variant={variant} defaultChecked />
      ))}
    </Flex>
  );
}
