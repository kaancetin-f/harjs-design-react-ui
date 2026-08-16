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

export function RadioCardVariants() {
  return (
    <Flex flexDirection="column" gap="var(--space-16)" width="min(100%, 420px)">
      {variants.map((variant) => (
        <Radio.Card
          key={variant}
          title={variant}
          description="The whole card selects this option."
          variant={variant}
          color="blue"
        />
      ))}
    </Flex>
  );
}
