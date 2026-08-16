'use client';

import { GridSystem, Typography } from '@/lib/ui';

const { Flex } = GridSystem;
const { Kbd } = Typography;

export function TypographyKbd() {
  return (
    <Flex flexWrap="wrap" alignItems="center" gap="var(--space-8)">
      <Kbd>⌘</Kbd>
      <Kbd>K</Kbd>
      <Kbd>Shift</Kbd>
      <Kbd>Esc</Kbd>
    </Flex>
  );
}
