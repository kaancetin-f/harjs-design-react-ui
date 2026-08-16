'use client';

import { useState } from 'react';
import { Select, GridSystem } from '@/lib/ui';

const { Flex } = GridSystem;

type Option = { value: string | number | null; text: string };

const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;

const options: Option[] = [
  { value: 'react', text: 'React' },
  { value: 'vue', text: 'Vue' },
  { value: 'svelte', text: 'Svelte' },
];

export function SelectSizes() {
  const [values, setValues] = useState<Record<string, Option | undefined>>({});

  return (
    <Flex flexDirection="column" gap="var(--space-16)" width="100%">
      {sizes.map((size) => (
        <Select
          key={size}
          size={size}
          placeholder={size}
          options={options}
          value={values[size]}
          onChange={(option) => setValues((current) => ({ ...current, [size]: option }))}
        />
      ))}
    </Flex>
  );
}
