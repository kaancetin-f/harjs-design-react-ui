'use client';

import { Switch, GridSystem } from '@/lib/ui';

const { Flex } = GridSystem;

export function SwitchDisabled() {
  return (
    <Flex flexWrap="wrap" alignItems="center" gap="var(--space-12)">
      <Switch label="Off" disabled />
      <Switch label="On" defaultChecked disabled />
    </Flex>
  );
}
