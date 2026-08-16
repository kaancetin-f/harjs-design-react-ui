"use client";

import { Button, GridSystem, Popover, Typography } from "@/lib/ui";

const { Flex } = GridSystem;
const { Paragraph } = Typography;

export function PopoverContent() {
  return (
    <Popover
      title="Owners"
      content={
        <Flex flexDirection="column" gap="var(--space-8)">
          <Paragraph size="sm">Design — Lina Park</Paragraph>
          <Paragraph size="sm">API — Mateo Ruiz</Paragraph>
          <Paragraph size="sm">Docs — Sam Okonkwo</Paragraph>
        </Flex>
      }
    >
      <Button variant="outlined" color="teal">
        View owners
      </Button>
    </Popover>
  );
}
