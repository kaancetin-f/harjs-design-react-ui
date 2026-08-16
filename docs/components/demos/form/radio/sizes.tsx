'use client';

import { Radio, GridSystem } from '@/lib/ui';

const { Flex } = GridSystem;

const sizes = ['xs', 'sm', 'md'] as const;

export function RadioSizes() {
  return (
    <Flex flexWrap="wrap" alignItems="center" gap="var(--space-12)">
      {sizes.map((size) => (
        <Radio key={size} label={size} size={size} defaultChecked />
      ))}
    </Flex>
  );
}
