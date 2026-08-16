'use client';

import { Button, GridSystem } from '@/lib/ui';

const { Flex } = GridSystem;

const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;

export function ButtonSizes() {
  return (
    <Flex flexWrap="wrap" alignItems="flex-end" gap="var(--space-12)">
      {sizes.map((size) => (
        <Button key={size} size={size} color="blue">
          {size}
        </Button>
      ))}
    </Flex>
  );
}
