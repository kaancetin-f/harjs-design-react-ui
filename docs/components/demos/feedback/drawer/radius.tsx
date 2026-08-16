'use client';

import { useState } from 'react';
import { Button, Drawer, GridSystem, Typography } from '@/lib/ui';

const { Flex } = GridSystem;
const { Paragraph } = Typography;

const radii = ['0', '8', '16', '40'] as const;

export function DrawerRadius() {
  const [open, setOpen] = useState(false);
  const [radius, setRadius] = useState<(typeof radii)[number]>('8');

  return (
    <Flex flexWrap="wrap" alignItems="center" gap="var(--space-8)">
      {radii.map((value) => (
        <Button
          key={value}
          variant={radius === value ? 'filled' : 'outlined'}
          color="pink"
          onClick={() => {
            setRadius(value);
            setOpen(true);
          }}
        >
          {value}
        </Button>
      ))}
      <Drawer
        title={`Radius ${radius}`}
        size="md"
        border={{ radius }}
        open={{ get: open, set: setOpen }}
      >
        <Paragraph>Radius applies to the leading corners of the panel.</Paragraph>
      </Drawer>
    </Flex>
  );
}
