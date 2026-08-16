'use client';

import { DatePicker, GridSystem } from '@/lib/ui';

const { Flex } = GridSystem;

export function DatePickerDisabled() {
  return (
    <Flex flexDirection="column" gap="var(--space-16)" width="min(100%, 280px)">
      <DatePicker placeholder="Disabled" value="" onChange={() => {}} disabled />
      <DatePicker
        multiple
        direction="row"
        placeholder="Disabled range"
        value={{ start: '', end: '' }}
        onChange={() => {}}
        disabled
      />
    </Flex>
  );
}
