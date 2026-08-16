'use client';

import { useState } from 'react';
import { Select, GridSystem } from '@/lib/ui';

const { Flex } = GridSystem;

type Option = { value: string | number | null; text: string };

const variants = ['filled', 'outlined', 'dashed', 'borderless'] as const;

const options: Option[] = [
  { value: 'react', text: 'React' },
  { value: 'vue', text: 'Vue' },
  { value: 'svelte', text: 'Svelte' },
];

export function SelectVariants() {
  const [values, setValues] = useState<Record<string, Option | undefined>>({});

  return (
    <Flex flexDirection="column" gap="var(--space-16)" width="100%">
      {variants.map((variant) => (
        <Select
          key={variant}
          variant={variant}
          placeholder={variant}
          options={options}
          value={values[variant]}
          onChange={(option) => setValues((current) => ({ ...current, [variant]: option }))}
        />
      ))}
    </Flex>
  );
}
