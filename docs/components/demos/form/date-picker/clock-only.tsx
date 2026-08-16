'use client';

import { useState } from 'react';
import { DatePicker, GridSystem } from '@/lib/ui';

const { Flex } = GridSystem;

export function DatePickerClockOnly() {
  const [value, setValue] = useState('');

  return (
    <Flex flexDirection="column" gap="var(--space-16)" width="min(100%, 280px)">
      <DatePicker
        placeholder="Time"
        value={value}
        onChange={setValue}
        config={{ isOnlyClock: true }}
      />
    </Flex>
  );
}
