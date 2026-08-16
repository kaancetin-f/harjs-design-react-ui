'use client';

import { useState } from 'react';
import { Chip, GridSystem } from '@/lib/ui';

const { Flex } = GridSystem;

const options = ['Design', 'API', 'Docs', 'QA', 'Infra'];

export function ChipFilters() {
  const [active, setActive] = useState<string[]>(['Design', 'API']);

  const toggle = (option: string) => {
    setActive((prev) => (prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]));
  };

  return (
    <Flex flexWrap="wrap" alignItems="center" gap="var(--space-12)">
      {options.map((option) => {
        const selected = active.includes(option);

        return (
          <button
            key={option}
            type="button"
            onClick={() => toggle(option)}
            style={{ background: 'none', border: 0, padding: 0, cursor: 'pointer' }}
          >
            <Chip
              text={option}
              color="blue"
              variant={selected ? 'filled' : 'outlined'}
              border={{ radius: 'full' }}
            />
          </button>
        );
      })}
    </Flex>
  );
}
