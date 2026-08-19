'use client';

import { Badge, GridSystem } from '@/lib/ui';

const { Flex } = GridSystem;

function Host() {
  return (
    <span
      style={{
        display: 'block',
        width: 40,
        height: 40,
        borderRadius: 'var(--radius-8)',
        background: 'var(--gray-200)',
      }}
    />
  );
}

export function BadgeSizes() {
  return (
    <Flex flexWrap="wrap" alignItems="flex-end" gap="var(--space-24)">
      <Badge count={5} size="sm">
        <Host />
      </Badge>
      <Badge count={5} size="md">
        <Host />
      </Badge>
      <Badge count={5} size="lg">
        <Host />
      </Badge>
    </Flex>
  );
}
