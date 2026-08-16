'use client';

import { useState } from 'react';
import { Button, Drawer, GridSystem, Typography } from '@/lib/ui';

const { Flex } = GridSystem;
const { Paragraph } = Typography;

export function DrawerClose() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="outlined" color="red" onClick={() => setOpen(true)}>
        Open locked overlay
      </Button>
      <Drawer
        title="Confirm before leaving"
        size="md"
        disableCloseOnBackdrop
        disableCloseOnEsc
        open={{ get: open, set: setOpen }}
      >
        <Flex flexDirection="column" gap="var(--space-16)">
          <Paragraph>
            Backdrop click and Escape are off. Use the close control in the header.
          </Paragraph>
          <Button color="green" onClick={() => setOpen(false)}>
            Done
          </Button>
        </Flex>
      </Drawer>
    </>
  );
}
