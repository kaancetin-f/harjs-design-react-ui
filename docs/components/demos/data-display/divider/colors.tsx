'use client';

import { Divider, GridSystem } from '@/lib/ui';

const { Flex } = GridSystem;

const colors = ['gray', 'blue', 'teal', 'orange', 'pink'] as const;

export function DividerColors() {
  return (
    <Flex flexDirection="column" width="100%">
      {colors.map((color) => (
        <Divider key={color} color={color}>
          {color}
        </Divider>
      ))}
    </Flex>
  );
}
