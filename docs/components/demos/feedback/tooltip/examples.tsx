"use client";

import { Button, GridSystem, Icon, Input, Tooltip, Typography } from "@/lib/ui";

const { Flex } = GridSystem;
const { Paragraph } = Typography;

export function TooltipButton() {
  return (
    <Tooltip text="Save the current draft">
      <Button color="blue">Save</Button>
    </Tooltip>
  );
}

export function TooltipIcon() {
  return (
    <Tooltip text="Open the column manager">
      <Button
        variant="outlined"
        color="blue"
        shape="square"
        aria-label="Open the column manager"
        icon={{ element: <Icon icon="Info" /> }}
      />
    </Tooltip>
  );
}

export function TooltipForm() {
  return (
    <Flex alignItems="center" gap="var(--space-8)">
      <Input placeholder="Workspace slug" />
      <Tooltip text="Lowercase letters, numbers, and hyphens. Used in the public URL.">
        <Button
          variant="outlined"
          color="gray"
          shape="square"
          aria-label="About workspace slug"
          icon={{ element: <Icon icon="Info" /> }}
        />
      </Tooltip>
    </Flex>
  );
}

export function TooltipRealWorld() {
  return (
    <Flex flexDirection="column" gap="var(--space-8)" width="22rem">
      <Flex alignItems="center" gap="var(--space-8)">
        <Paragraph size="sm">Retention window</Paragraph>
        <Tooltip text="How long completed jobs stay in the archive before they are removed.">
          <Button
            variant="borderless"
            color="gray"
            shape="square"
            size="sm"
            aria-label="What this field is for"
            icon={{ element: <Icon icon="Info" /> }}
          />
        </Tooltip>
      </Flex>
      <Input placeholder="30 days" />
    </Flex>
  );
}
