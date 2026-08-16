'use client';

import { Select, GridSystem } from '@/lib/ui';

const { Flex } = GridSystem;

const options = [
  { value: 'a', text: 'Option A' },
  { value: 'b', text: 'Option B' },
];

export function SelectDisabled() {
  return (
    <Flex flexDirection="column" gap="var(--space-16)" width="100%">
      <Select
        placeholder="Disabled"
        options={options}
        value={undefined}
        onChange={() => {}}
        disabled
      />
      <Select
        placeholder="Disabled with value"
        options={options}
        value={options[0]}
        onChange={() => {}}
        disabled
      />
    </Flex>
  );
}
