"use client";

import { useState } from "react";
import {
  Button,
  GridSystem,
  NotificationProvider,
  Typography,
  useConfirm,
} from "@/lib/ui";

const { Flex } = GridSystem;
const { Paragraph } = Typography;

function HookButtons() {
  const confirm = useConfirm();
  const [result, setResult] = useState("Waiting");

  return (
    <Flex flexDirection="column" gap="var(--space-12)">
      <Button
        variant="outlined"
        color="red"
        onClick={async () => {
          const ok = await confirm.ask({
            title: "Remove this item?",
            message: "The card leaves the board. Related comments stay in the archive.",
            status: "delete",
            confirmText: "Remove",
            cancelText: "Keep item",
          });
          setResult(ok ? "Removed" : "Kept");
        }}
      >
        Remove via hook
      </Button>
      <Paragraph size="sm" color="gray-600">
        {result}
      </Paragraph>
    </Flex>
  );
}

export function PopupConfirmHook() {
  return (
    <NotificationProvider>
      <HookButtons />
    </NotificationProvider>
  );
}
