'use client';

import { useState } from 'react';
import { DatePicker, GridSystem } from '@/lib/ui';

const { Flex } = GridSystem;

export function DatePickerTime() {
  const [value, setValue] = useState('');

  return (
    <Flex flexDirection="column" gap="var(--space-16)" width="min(100%, 280px)">
      <DatePicker
        placeholder="Date and time"
        value={value}
        onChange={setValue}
        config={{ isClock: true }}
      />
    </Flex>
  );
}
