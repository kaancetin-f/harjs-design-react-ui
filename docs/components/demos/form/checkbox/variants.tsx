'use client';

import { Checkbox, GridSystem } from '@/lib/ui';

const { Flex } = GridSystem;

const variants = [
  'filled',
  'surface',
  'surface-borderless',
  'outlined',
  'dashed',
] as const;

export function CheckboxVariants() {
  return (
    <Flex flexWrap="wrap" alignItems="center" gap="var(--space-12)">
      {variants.map((variant) => (
        <Checkbox key={variant} label={variant} variant={variant} defaultChecked />
      ))}
    </Flex>
  );
}
