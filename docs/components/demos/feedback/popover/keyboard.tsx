"use client";

import { Button, GridSystem, Popover, Typography } from "@/lib/ui";

const { Flex } = GridSystem;
const { Paragraph } = Typography;

export function PopoverKeyboard() {
  return (
    <Flex flexDirection="column" gap="var(--space-12)">
      <Popover
        title="Keyboard"
        message="Escape closes the popover. Tab cycles the actions. Shift+Tab reverses."
        onConfirm={() => undefined}
        config={{ buttons: { okay: "Got it", cancel: "Close" } }}
      >
        <Button variant="outlined" color="purple">
          Open with keyboard
        </Button>
      </Popover>
      <Paragraph size="sm" color="gray-600">
        Focus the trigger, press Enter or Space, then Escape to dismiss.
      </Paragraph>
    </Flex>
  );
}
