'use client';

import { useState } from 'react';
import { Button, Drawer, GridSystem, Typography } from '@/lib/ui';

const { Flex } = GridSystem;
const { Paragraph } = Typography;

const placements = ['right', 'left'] as const;

export function DrawerPlacement() {
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState<(typeof placements)[number]>('right');

  return (
    <Flex flexWrap="wrap" alignItems="center" gap="var(--space-8)">
      {placements.map((value) => (
        <Button
          key={value}
          variant={placement === value ? 'filled' : 'outlined'}
          color="teal"
          onClick={() => {
            setPlacement(value);
            setOpen(true);
          }}
        >
          {value[0].toUpperCase() + value.slice(1)}
        </Button>
      ))}
      <Drawer
        title={`${placement === 'left' ? 'Left' : 'Right'} panel`}
        size="md"
        placement={placement}
        open={{ get: open, set: setOpen }}
      >
        <Paragraph>The panel slides from the `{placement}` edge of the viewport.</Paragraph>
      </Drawer>
    </Flex>
  );
}
