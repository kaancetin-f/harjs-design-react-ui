'use client';

import { Input, GridSystem } from '@/lib/ui';

const { Flex } = GridSystem;

const variants = ['filled', 'outlined', 'dashed', 'borderless'] as const;

export function InputVariants() {
  return (
    <Flex flexDirection="column" gap="var(--space-16)" width="100%">
      {variants.map((variant) => (
        <Input key={variant} variant={variant} placeholder={variant} />
      ))}
    </Flex>
  );
}
