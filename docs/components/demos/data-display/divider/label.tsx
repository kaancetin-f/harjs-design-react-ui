'use client';

import { Divider, GridSystem } from '@/lib/ui';

const { Flex } = GridSystem;

const aligns = ['start', 'center', 'end'] as const;

export function DividerLabel() {
  return (
    <Flex flexDirection="column" width="100%">
      {aligns.map((align) => (
        <Divider key={align} align={align}>
          {align}
        </Divider>
      ))}
    </Flex>
  );
}
