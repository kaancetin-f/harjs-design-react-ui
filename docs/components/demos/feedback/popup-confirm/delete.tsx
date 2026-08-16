"use client";

import { useState } from "react";
import { Button, GridSystem, PopupConfirm, Typography } from "@/lib/ui";

const { Flex } = GridSystem;
const { Paragraph } = Typography;

export function PopupConfirmDelete() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("Sprint 24 is in review.");

  return (
    <Flex flexDirection="column" gap="var(--space-12)">
      <Button variant="outlined" color="red" onClick={() => setOpen(true)}>
        Delete sprint
      </Button>
      <PopupConfirm
        isOpen={open}
        title="Delete this record?"
        message="Sprint 24 will be removed from the board. This cannot be undone."
        status="delete"
        buttons={{
          okay: { children: "Delete" },
          cancel: { children: "Keep sprint" },
        }}
        onConfirm={(confirm) => {
          setOpen(false);
          if (confirm) setStatus("Sprint 24 was deleted.");
        }}
      />
      <Paragraph size="sm" color="gray-600">
        {status}
      </Paragraph>
    </Flex>
  );
}
