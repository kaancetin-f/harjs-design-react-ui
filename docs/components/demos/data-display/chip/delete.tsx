'use client';

import { useState } from 'react';
import { Chip, GridSystem } from '@/lib/ui';

const { Flex } = GridSystem;

const initial = ['Design', 'API', 'Docs'];

export function ChipDelete() {
  const [tags, setTags] = useState(initial);

  return (
    <Flex flexWrap="wrap" alignItems="center" gap="var(--space-12)">
      {tags.map((tag) => (
        <Chip
          key={tag}
          text={tag}
          color="blue"
          onDelete={() => setTags((prev) => prev.filter((item) => item !== tag))}
        />
      ))}
    </Flex>
  );
}
