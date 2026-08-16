'use client';

import { Radio, GridSystem } from '@/lib/ui';

const { Flex } = GridSystem;

export function RadioDisabled() {
  return (
    <Flex flexWrap="wrap" alignItems="center" gap="var(--space-12)">
      <Radio label="Unchecked" disabled />
      <Radio label="Checked" defaultChecked disabled />
    </Flex>
  );
}
