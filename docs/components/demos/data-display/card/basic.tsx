"use client";

import { Button, Card, Chip, GridSystem, Typography } from "@/lib/ui";

const { Flex } = GridSystem;
const { Paragraph } = Typography;

export function CardBasic() {
  return (
    <Card
      title="Aurora Release"
      actions={
        <Button variant="borderless" color="blue" size="sm">
          Open
        </Button>
      }
    >
      <Flex flexDirection="column" gap="var(--space-12)">
        <Paragraph>
          Sprint 24 is on track. Design is signed off, API review is in progress, and docs are catching up.
        </Paragraph>
        <Flex flexWrap="wrap" alignItems="center" gap="var(--space-8)">
          <Chip text="In review" color="blue" variant="surface" size="sm" />
          <Chip text="8 tasks" color="gray" variant="outlined" size="sm" />
          <Chip text="Updated 2h ago" color="gray" variant="borderless" size="sm" />
        </Flex>
      </Flex>
    </Card>
  );
}
