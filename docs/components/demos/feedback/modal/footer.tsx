"use client";

import { useState } from "react";
import { Button, GridSystem, Modal, Typography } from "@/lib/ui";

const { Flex } = GridSystem;
const { Paragraph } = Typography;

export function ModalFooter() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="outlined" color="orange" onClick={() => setOpen(true)}>
        Open with footer
      </Button>
      <Modal
        title="Publish Aurora"
        size="md"
        open={{ get: open, set: setOpen }}
        footer={
          <Flex gap="var(--space-8)">
            <Button variant="outlined" color="gray" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button color="orange" onClick={() => setOpen(false)}>
              Publish
            </Button>
          </Flex>
        }
      >
        <Paragraph>The production slot is yours. Publishing ships the current draft to harjs.design</Paragraph>
      </Modal>
    </>
  );
}
