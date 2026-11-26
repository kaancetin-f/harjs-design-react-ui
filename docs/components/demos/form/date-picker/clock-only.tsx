'use client';

import { useState } from 'react';
import { DatePicker, GridSystem } from '@/lib/ui';

const { Flex } = GridSystem;

export function DatePickerClockOnly() {
  const [value, setValue] = useState('');
  const [range, setRange] = useState({ start: '', end: '' });

  return (
    <Flex flexDirection="column" gap="var(--space-16)" width="min(100%, 420px)">
      <DatePicker
        placeholder="Time"
        value={value}
        onChange={setValue}
        config={{ isOnlyClock: true }}
      />
      <DatePicker
        multiple
        direction="row"
        placeholder="Time range"
        value={range}
        onChange={setRange}
        config={{ isOnlyClock: true }}
      />
    </Flex>
  );
}
