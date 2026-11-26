'use client';

import { useState } from 'react';
import { DatePicker, GridSystem } from '@/lib/ui';

const { Flex } = GridSystem;

export function DatePickerMin() {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  return (
    <Flex flexDirection="column" gap="var(--space-16)" width="min(100%, 420px)">
      <Flex flexDirection="column" gap="var(--space-8)" width="100%">
        <DatePicker placeholder="Start date" value={start} onChange={setStart} />
        <DatePicker placeholder="End date" value={end} onChange={setEnd} min={start} />
      </Flex>
      <Flex flexDirection="column" gap="var(--space-8)" width="100%">
        <DatePicker
          placeholder="Start date and time"
          value={startTime}
          onChange={setStartTime}
          config={{ isClock: true }}
        />
        <DatePicker
          placeholder="End date and time"
          value={endTime}
          onChange={setEndTime}
          min={startTime}
          config={{ isClock: true }}
        />
      </Flex>
    </Flex>
  );
}
