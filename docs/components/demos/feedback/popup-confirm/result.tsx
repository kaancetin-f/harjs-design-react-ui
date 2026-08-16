"use client";

import { useState } from "react";
import { Button, GridSystem, PopupConfirm, Typography } from "@/lib/ui";

const { Flex } = GridSystem;
const { Paragraph } = Typography;

export function PopupConfirmResult() {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState("Waiting");

  return (
    <Flex flexDirection="column" gap="var(--space-12)">
      <Button variant="outlined" color="green" onClick={() => setOpen(true)}>
        Promote
      </Button>
      <PopupConfirm
        isOpen={open}
        title="Promote to production?"
        message="Sprint 24 will go live for every workspace."
        status="success"
        buttons={{
          okay: { children: "Promote" },
          cancel: { children: "Keep staging" },
        }}
        onConfirm={(confirm) => {
          setOpen(false);
          setResult(confirm ? "Promoted" : "Kept in staging");
        }}
      />
      <Paragraph size="sm" color="gray-600">
        {result}
      </Paragraph>
    </Flex>
  );
}
