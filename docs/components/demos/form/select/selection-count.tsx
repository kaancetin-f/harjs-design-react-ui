'use client';

import { useState } from 'react';
import { Chip, Select } from '@/lib/ui';

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

export function SelectSelectionCount() {
  const [value, setValue] = useState<Option[]>([]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <Select
        multiple
        selectionCount
        placeholder="Languages"
        options={options}
        value={value}
        onChange={setValue}
      />
      {value.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
          {value.map((option) => (
            <Chip
              key={String(option.value)}
              text={option.text}
              variant="filled"
              color="gray"
              size="sm"
              border={{ radius: 'full' }}
              onDelete={() => setValue((current) => current.filter((item) => item.value !== option.value))}
            />
          ))}
        </div>
      )}
    </div>
  );
}
