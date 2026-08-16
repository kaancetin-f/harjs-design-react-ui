'use client';

import { useState } from 'react';
import { Button, Modal, Typography } from '@/lib/ui';

const { Paragraph } = Typography;

export function ModalClosePopover() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="outlined" color="purple" onClick={() => setOpen(true)}>
        Open with confirm close
      </Button>
      <Modal
        title="Edit draft"
        size="md"
        open={{ get: open, set: setOpen }}
        closePopover={{
          title: 'Discard draft?',
          message: 'Unsaved changes will be lost.',
          onConfirm: (confirm) => {
            if (confirm) setOpen(false);
          },
          config: {
            buttons: { okay: 'Discard', cancel: 'Keep editing' },
          },
        }}
      >
        <Paragraph>
          The header close control opens a Popover first. Confirming Discard runs `open.set(false)`.
        </Paragraph>
      </Modal>
    </>
  );
}
