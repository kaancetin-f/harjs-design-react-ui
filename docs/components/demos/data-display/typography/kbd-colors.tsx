'use client';

import { GridSystem, Typography } from '@/lib/ui';

const { Flex } = GridSystem;
const { Kbd } = Typography;

const colors = ['blue', 'purple', 'pink', 'red', 'orange', 'yellow', 'green', 'teal', 'cyan', 'gray', 'white'] as const;

export function TypographyKbdColors() {
  return (
    <Flex flexWrap="wrap" alignItems="center" gap="var(--space-8)">
      {colors.map((color) => (
        <Kbd key={color} color={color}>
          ⌘
        </Kbd>
      ))}
    </Flex>
  );
}
