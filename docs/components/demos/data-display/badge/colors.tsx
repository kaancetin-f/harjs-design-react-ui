'use client';

import { Badge, GridSystem } from '@/lib/ui';

const { Flex } = GridSystem;

const colors = [
  'pink',
  'red',
  'yellow',
  'orange',
  'cyan',
  'green',
  'blue',
  'purple',
  'gray',
  'teal',
] as const;

export function BadgeColors() {
  return (
    <Flex flexDirection="column" gap="var(--space-12)">
      {colors.map((color) => (
        <Badge key={color} color={color} text={color} />
      ))}
    </Flex>
  );
}
