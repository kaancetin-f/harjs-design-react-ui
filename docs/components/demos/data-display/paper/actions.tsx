"use client";

import { Button, Chip, GridSystem, Paper, Typography } from "@/lib/ui";

const { Flex } = GridSystem;
const { Paragraph } = Typography;

export function PaperActions() {
  return (
    <Paper
      title="Workspace access"
      action={
        <Button color="blue" size="sm">
          Invite
        </Button>
      }
    >
      <Flex flexDirection="column" gap="var(--space-12)">
        <Paragraph>12 members can edit. 3 guests have read-only access to the design files.</Paragraph>
        <Flex flexWrap="wrap" gap="var(--space-8)">
          <Chip text="Owners · 2" color="blue" variant="surface" size="sm" />
          <Chip text="Editors · 10" color="gray" variant="outlined" size="sm" />
          <Chip text="Guests · 3" color="gray" variant="borderless" size="sm" />
        </Flex>
      </Flex>
    </Paper>
  );
}
