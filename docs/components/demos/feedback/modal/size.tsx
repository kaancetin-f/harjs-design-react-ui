'use client';

import { useState } from 'react';
import { Button, GridSystem, Modal, Typography } from '@/lib/ui';

const { Flex } = GridSystem;
const { Paragraph } = Typography;

const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', 'full'] as const;

export function ModalSize() {
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
      <Modal title={`Size ${size}`} size={size} open={{ get: open, set: setOpen }}>
        <Paragraph>
          `size` sets the dialog width. Default is `lg` (640px). `xs` is 320px; `2xl` is 1200px. `full` fills the viewport.
        </Paragraph>
      </Modal>
    </Flex>
  );
}
