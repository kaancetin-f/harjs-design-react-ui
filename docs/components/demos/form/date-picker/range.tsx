'use client';

import { useState } from 'react';
import { DatePicker, GridSystem } from '@/lib/ui';

const { Flex } = GridSystem;

export function DatePickerRange() {
  const [row, setRow] = useState({ start: '', end: '' });
  const [column, setColumn] = useState({ start: '', end: '' });

  return (
    <Flex flexDirection="column" gap="var(--space-16)" width="min(100%, 420px)">
      <DatePicker
        multiple
        direction="row"
        placeholder="Horizontal"
        value={row}
        onChange={setRow}
      />
      <DatePicker
        multiple
        direction="column"
        placeholder="Vertical"
        value={column}
        onChange={setColumn}
      />
    </Flex>
  );
}
