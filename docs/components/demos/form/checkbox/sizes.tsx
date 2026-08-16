'use client';

import { Checkbox, GridSystem } from '@/lib/ui';

const { Flex } = GridSystem;

const sizes = ['xs', 'sm', 'md'] as const;

export function CheckboxSizes() {
  return (
    <Flex flexWrap="wrap" alignItems="center" gap="var(--space-12)">
      {sizes.map((size) => (
        <Checkbox key={size} label={size} size={size} defaultChecked />
      ))}
    </Flex>
  );
}
