'use client';

import { Badge, GridSystem, Icon } from '@/lib/ui';

const { Flex } = GridSystem;

export function BadgeIcons() {
  return (
    <Flex flexWrap="wrap" alignItems="center" gap="var(--space-12)">
      <Badge text="Ready" status="success" icon={{ element: <Icon icon="CheckCircle" size={12} /> }} />
      <Badge
        text="Hold"
        status="warning"
        icon={{ element: <Icon icon="Warning" size={12} />, position: 'end' }}
      />
      <Badge status="danger" aria-label="Failed" icon={{ element: <Icon icon="XCircle" size={12} /> }} />
    </Flex>
  );
}
