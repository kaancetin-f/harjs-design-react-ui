'use client';

import { useState } from 'react';
import { Button, GridSystem, Modal, Typography } from '@/lib/ui';

const { Flex } = GridSystem;
const { Paragraph } = Typography;

export function ModalBasic() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="outlined" color="teal" onClick={() => setOpen(true)}>
        Open modal
      </Button>
      <Modal
        title="Release notes"
        description="Sprint 24 status for Aurora."
        size="md"
        open={{ get: open, set: setOpen }}
      >
        <Flex flexDirection="column" gap="var(--space-12)">
          <Paragraph>
            Sprint 24 is on track. Design is signed off, the API review is in progress, and docs are
            catching up.
          </Paragraph>
          <Paragraph color="gray-500">Updated 2 hours ago.</Paragraph>
        </Flex>
      </Modal>
    </>
  );
}
