'use client';

import { Button, GridSystem } from '@/lib/ui';

const { Flex } = GridSystem;

const variants = [
  'filled',
  'surface',
  'surface-borderless',
  'outlined',
  'dashed',
  'borderless',
] as const;

export function ButtonVariants() {
  return (
    <Flex flexWrap="wrap" alignItems="center" gap="var(--space-12)">
      {variants.map((variant) => (
        <Button key={variant} variant={variant} color="blue">
          {variant}
        </Button>
      ))}
    </Flex>
  );
}
