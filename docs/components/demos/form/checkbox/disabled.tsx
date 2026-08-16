'use client';

import { Checkbox, GridSystem } from '@/lib/ui';

const { Flex } = GridSystem;

export function CheckboxDisabled() {
  return (
    <Flex flexWrap="wrap" alignItems="center" gap="var(--space-12)">
      <Checkbox label="Unchecked" disabled />
      <Checkbox label="Checked" defaultChecked disabled />
    </Flex>
  );
}
