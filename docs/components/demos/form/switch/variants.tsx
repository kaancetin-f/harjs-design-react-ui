'use client';

import { Switch, GridSystem } from '@/lib/ui';

const { Flex } = GridSystem;

const variants = ['filled', 'surface', 'surface-borderless'] as const;

export function SwitchVariants() {
  return (
    <Flex flexWrap="wrap" alignItems="center" gap="var(--space-12)">
      {variants.map((variant) => (
        <Switch key={variant} label={variant} variant={variant} defaultChecked />
      ))}
    </Flex>
  );
}
