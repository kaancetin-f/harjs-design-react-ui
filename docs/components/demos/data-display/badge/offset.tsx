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

export function BadgeOffset() {
  return (
    <Badge count={5} config={{ offset: [10, 10] }}>
      <Host />
    </Badge>
  );
}
