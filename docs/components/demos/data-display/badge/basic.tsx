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

export function BadgeBasic() {
  return (
    <Flex flexWrap="wrap" alignItems="flex-end" gap="var(--space-24)">
      <Badge count={5}>
        <Host />
      </Badge>
      <Badge count={0}>
        <Host />
      </Badge>
      <Badge count={0} config={{ showZero: true }}>
        <Host />
      </Badge>
      <Badge count={99}>
        <Host />
      </Badge>
      <Badge count={100}>
        <Host />
      </Badge>
    </Flex>
  );
}
