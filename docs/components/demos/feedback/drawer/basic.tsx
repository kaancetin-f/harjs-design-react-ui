'use client';

import { useState } from 'react';
import { Button, Drawer, GridSystem, Typography } from '@/lib/ui';

const { Flex } = GridSystem;
const { Paragraph } = Typography;

export function DrawerBasic() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="outlined" color="teal" onClick={() => setOpen(true)}>
        Open drawer
      </Button>
      <Drawer title="Release notes" size="md" open={{ get: open, set: setOpen }}>
        <Flex flexDirection="column" gap="var(--space-12)">
          <Paragraph>
            Sprint 24 is on track. Design is signed off, the API review is in progress, and docs are catching up.
          </Paragraph>
          <Paragraph color="gray-500">Updated 2 hours ago.</Paragraph>
        </Flex>
      </Drawer>
    </>
  );
}
