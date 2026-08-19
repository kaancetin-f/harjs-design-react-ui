'use client';

import { Badge, GridSystem, Icon } from '@/lib/ui';

const { Flex } = GridSystem;

function Host() {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
        borderRadius: 'var(--radius-8)',
        background: 'var(--gray-200)',
        color: 'var(--gray-700)',
      }}
    >
      <Icon icon="Inbox-Fill" size={18} />
    </span>
  );
}

export function BadgeDot() {
  return (
    <Flex flexWrap="wrap" alignItems="center" gap="var(--space-24)">
      <Badge dot>
        <Host />
      </Badge>
      <Badge dot>
        <a href="#badge-dot" style={{ color: 'var(--blue-600)' }}>
          Link
        </a>
      </Badge>
    </Flex>
  );
}
