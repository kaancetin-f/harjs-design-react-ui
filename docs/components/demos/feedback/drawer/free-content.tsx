'use client';

import { useState } from 'react';
import { Button, Drawer, GridSystem, Typography } from '@/lib/ui';

const { Flex } = GridSystem;
const { Paragraph, Title } = Typography;

export function DrawerFreeContent() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="outlined" color="cyan" onClick={() => setOpen(true)}>
        Open flush panel
      </Button>
      <Drawer
        title="Activity"
        size="md"
        config={{ freeContent: true }}
        open={{ get: open, set: setOpen }}
      >
        <div style={{ padding: "var(--space-20)" }}>
          <Flex flexDirection="column" gap="var(--space-16)">
            <Title size="sm">Today</Title>
            <Paragraph>Deploy aurora-web to production. Checks passed in 4 minutes.</Paragraph>
            <Paragraph color="gray-500">Padding is yours when `freeContent` is on.</Paragraph>
          </Flex>
        </div>
      </Drawer>
    </>
  );
}
