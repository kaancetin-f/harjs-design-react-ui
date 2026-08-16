'use client';

import { Chip, GridSystem } from '@/lib/ui';

const { Flex } = GridSystem;

const items = [
  { text: 'Active', color: 'green' as const },
  { text: 'In review', color: 'blue' as const },
  { text: 'Blocked', color: 'red' as const },
  { text: 'Draft', color: 'gray' as const },
];

export function ChipStatus() {
  return (
    <Flex flexWrap="wrap" alignItems="center" gap="var(--space-12)">
      {items.map((item) => (
        <Chip key={item.text} text={item.text} color={item.color} variant="surface" border={{ radius: 'full' }} />
      ))}
    </Flex>
  );
}
