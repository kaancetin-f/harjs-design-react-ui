'use client';

import { Badge, GridSystem } from '@/lib/ui';

const { Flex } = GridSystem;

const items = [
  { status: 'success', text: 'Success' },
  { status: 'danger', text: 'Error' },
  { status: 'secondary', text: 'Default' },
  { status: 'information', text: 'Processing' },
  { status: 'warning', text: 'Warning' },
] as const;

export function BadgeStatus() {
  return (
    <Flex flexDirection="column" gap="var(--space-12)">
      {items.map((item) => (
        <Badge key={item.status} status={item.status} text={item.text} />
      ))}
    </Flex>
  );
}
