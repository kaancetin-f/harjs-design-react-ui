'use client';

import { Badge, GridSystem } from '@/lib/ui';

const { Flex } = GridSystem;

export function BadgeStandalone() {
  return (
    <Flex flexWrap="wrap" alignItems="center" gap="var(--space-12)">
      <Badge count={25} />
      <Badge count={4} status="warning" />
      <Badge count={109} status="primary" />
      <Badge count={25} status="success" />
    </Flex>
  );
}
