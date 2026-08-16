'use client';

import { useState } from 'react';
import { Select } from '@/lib/ui';

type Option = { value: string | number | null; text: string };

const options: Option[] = [
  { value: 'ts', text: 'TypeScript' },
  { value: 'js', text: 'JavaScript' },
  { value: 'py', text: 'Python' },
  { value: 'go', text: 'Go' },
  { value: 'rs', text: 'Rust' },
  { value: 'rb', text: 'Ruby' },
  { value: 'kt', text: 'Kotlin' },
  { value: 'sw', text: 'Swift' },
];

export function SelectMultiple() {
  const [value, setValue] = useState<Option[]>([]);

  return (
    <Select
      multiple
      placeholder="Languages"
      options={options}
      value={value}
      onChange={setValue}
    />
  );
}
