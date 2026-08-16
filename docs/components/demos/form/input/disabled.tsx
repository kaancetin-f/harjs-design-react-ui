'use client';

import { Input, GridSystem } from '@/lib/ui';

const { Flex } = GridSystem;

export function InputDisabled() {
  return (
    <Flex flexDirection="column" gap="var(--space-16)" width="100%">
      <Input placeholder="Disabled" disabled />
      <Input placeholder="Disabled value" value="Read only value" disabled />
    </Flex>
  );
}
