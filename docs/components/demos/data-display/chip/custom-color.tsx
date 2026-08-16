'use client';

import { Chip, GridSystem } from '@/lib/ui';

const { Flex } = GridSystem;

const swatches = [
  { text: 'Violet', color: '#ddd6fe' },
  { text: 'Teal', color: '#99f6e4' },
  { text: 'Amber', color: '#fed7aa' },
];

export function ChipCustomColor() {
  return (
    <Flex flexWrap="wrap" alignItems="center" gap="var(--space-12)">
      {swatches.map((item) => (
        <Chip key={item.text} text={item.text} customColor={item.color} variant="borderless" border={{ radius: 'full' }} />
      ))}
    </Flex>
  );
}
