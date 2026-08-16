'use client';

import { Divider, GridSystem } from '@/lib/ui';

const { Flex } = GridSystem;

const variants = ['fade', 'solid', 'dashed'] as const;

export function DividerVariants() {
  return (
    <Flex flexDirection="column" width="100%">
      {variants.map((variant) => (
        <Divider key={variant} variant={variant}>
          {variant}
        </Divider>
      ))}
    </Flex>
  );
}
