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

export function BadgeClickable() {
  return (
    <Flex flexWrap="wrap" alignItems="flex-end" gap="var(--space-24)">
      <a href="#badge-clickable">
        <Badge count={5}>
          <Host />
        </Badge>
      </a>
      <a href="#badge-clickable">
        <Badge count={0} config={{ showZero: true }}>
          <Host />
        </Badge>
      </a>
    </Flex>
  );
}
