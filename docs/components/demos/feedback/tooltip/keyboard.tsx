"use client";

import { Button, GridSystem, Tooltip, Typography } from "@/lib/ui";

const { Flex } = GridSystem;
const { Paragraph } = Typography;

export function TooltipKeyboard() {
  return (
    <Flex flexDirection="column" gap="var(--space-12)">
      <Tooltip text="Opens on focus. Escape dismisses. Tab away to close.">
        <Button variant="outlined" color="purple">
          Focus me
        </Button>
      </Tooltip>
      <Paragraph size="sm" color="gray-600">
        Tab to the button. The tooltip opens with keyboard focus. Escape hides it without leaving the page.
      </Paragraph>
    </Flex>
  );
}
