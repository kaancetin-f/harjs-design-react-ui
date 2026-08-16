'use client';

import { useState } from 'react';
import { Button, Drawer, GridSystem, Typography } from '@/lib/ui';

const { Flex } = GridSystem;
const { Paragraph } = Typography;

const sizes = ['sm', 'md', 'lg', '2xl', 'full'] as const;

export function DrawerSize() {
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState<(typeof sizes)[number]>('md');

  return (
    <Flex flexWrap="wrap" alignItems="center" gap="var(--space-8)">
      {sizes.map((value) => (
        <Button
          key={value}
          variant={size === value ? 'filled' : 'outlined'}
          color="blue"
          onClick={() => {
            setSize(value);
            setOpen(true);
          }}
        >
          {value[0].toUpperCase() + value.slice(1)}
        </Button>
      ))}
      <Drawer title={`Size ${size}`} size={size} open={{ get: open, set: setOpen }}>
        <Paragraph>
          `size` sets the panel width. `sm` through `2xl` are fixed. `3xl`–`full` are viewport percentages.
        </Paragraph>
      </Drawer>
    </Flex>
  );
}
