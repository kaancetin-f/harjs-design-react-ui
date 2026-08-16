"use client";

import { useState } from "react";
import { Button, GridSystem, Popover, Typography } from "@/lib/ui";

const { Flex } = GridSystem;
const { Paragraph } = Typography;

export function PopoverDelete() {
  const [status, setStatus] = useState("Sprint 24 is in review.");

  return (
    <Flex flexDirection="column" gap="var(--space-12)">
      <Popover
        title="Delete sprint?"
        message="Sprint 24 will be removed from the board. This cannot be undone."
        onConfirm={(confirm) => {
          if (confirm) setStatus("Sprint 24 was deleted.");
        }}
        config={{ buttons: { okay: "Delete", cancel: "Cancel" } }}
      >
        <Button variant="outlined" color="red">
          Delete sprint
        </Button>
      </Popover>
      <Paragraph size="sm" color="gray-600">
        {status}
      </Paragraph>
    </Flex>
  );
}
