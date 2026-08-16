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

export function CheckboxCardVariants() {
  return (
    <Flex flexDirection="column" gap="var(--space-16)" width="min(100%, 420px)">
      {variants.map((variant) => (
        <Checkbox.Card
          key={variant}
          title={variant}
          description="The whole card toggles this option."
          variant={variant}
          color="blue"
        />
      ))}
    </Flex>
  );
}
