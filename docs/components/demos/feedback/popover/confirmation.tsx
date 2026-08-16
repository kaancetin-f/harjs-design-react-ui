"use client";

import { useState } from "react";
import { Button, GridSystem, Popover, Typography } from "@/lib/ui";

const { Flex } = GridSystem;
const { Paragraph } = Typography;

export function PopoverConfirmation() {
  const [result, setResult] = useState<string>("Waiting");

  return (
    <Flex flexDirection="column" gap="var(--space-12)">
      <Popover
        title="Promote to production?"
        message="Sprint 24 will go live for every workspace."
        onConfirm={(confirm) => {
          setResult(confirm ? "Promoted" : "Kept in staging");
        }}
        config={{ buttons: { okay: "Promote", cancel: "Keep staging" } }}
      >
        <Button variant="outlined" color="green">
          Promote
        </Button>
      </Popover>
      <Paragraph size="sm" color="gray-600">
        {result}
      </Paragraph>
    </Flex>
  );
}
