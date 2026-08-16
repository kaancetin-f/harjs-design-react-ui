'use client';

import { GridSystem, Typography } from '@/lib/ui';

const { Flex } = GridSystem;
const { Kbd } = Typography;

const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;

export function TypographyKbdSizes() {
  return (
    <Flex flexWrap="wrap" alignItems="flex-end" gap="var(--space-8)">
      {sizes.map((size) => (
        <Kbd key={size} size={size}>
          ⌘
        </Kbd>
      ))}
    </Flex>
  );
}
