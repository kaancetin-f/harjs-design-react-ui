'use client';

import { useState } from 'react';
import { Button, GridSystem, Modal, Typography } from '@/lib/ui';

const { Flex } = GridSystem;
const { Paragraph } = Typography;

export function ModalClose() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="outlined" color="red" onClick={() => setOpen(true)}>
        Open locked overlay
      </Button>
      <Modal
        title="Confirm before leaving"
        size="md"
        disableCloseOnBackdrop
        disableCloseOnEsc
        open={{ get: open, set: setOpen }}
      >
        <Flex flexDirection="column" gap="var(--space-16)">
          <Paragraph>
            Backdrop click and Escape are off. Use the close control in the header, or Done. The close control stays in the header even without a title.
          </Paragraph>
          <Button color="green" onClick={() => setOpen(false)}>
            Done
          </Button>
        </Flex>
      </Modal>
    </>
  );
}
