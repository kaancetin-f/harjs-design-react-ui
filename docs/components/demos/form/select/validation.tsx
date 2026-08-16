'use client';

import { useState } from 'react';
import { Select } from '@/lib/ui';

type Option = { value: string | number | null; text: string };

const options: Option[] = [
  { value: 'react', text: 'React' },
  { value: 'vue', text: 'Vue' },
  { value: 'svelte', text: 'Svelte' },
];

export function SelectValidation() {
  const [value, setValue] = useState<Option | undefined>(undefined);

  return (
    <Select
      placeholder="Framework"
      options={options}
      value={value}
      onChange={setValue}
      validation={!value ? { text: 'This field is required' } : undefined}
    />
  );
}
