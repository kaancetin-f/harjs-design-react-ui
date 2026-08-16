'use client';

import { useState } from 'react';
import { DatePicker, GridSystem } from '@/lib/ui';

const { Flex } = GridSystem;

export function DatePickerValidation() {
  const [value, setValue] = useState('');

  return (
    <Flex flexDirection="column" gap="var(--space-16)" width="min(100%, 280px)">
      <DatePicker
        placeholder="Select date"
        value={value}
        onChange={setValue}
        validation={!value ? { text: 'This field is required' } : undefined}
      />
    </Flex>
  );
}
