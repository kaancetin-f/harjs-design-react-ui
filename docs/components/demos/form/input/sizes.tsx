'use client';

import { Input, GridSystem } from '@/lib/ui';

const { Flex } = GridSystem;

const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;

export function InputSizes() {
  return (
    <Flex flexDirection="column" gap="var(--space-16)" width="100%">
      {sizes.map((size) => (
        <Input key={size} size={size} placeholder={size} />
      ))}
    </Flex>
  );
}
