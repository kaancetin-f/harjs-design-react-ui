"use client";

import { Button, GridSystem } from "@/lib/ui";

const { Flex } = GridSystem;

export function ButtonFullWidth() {
  return (
    <Flex flexDirection="column" gap="var(--space-16)" width="100%">
      <Button color="blue" fullWidth>
        Full width
      </Button>
      <Button variant="outlined" color="blue" fullWidth>
        Full width outlined
      </Button>
    </Flex>
  );
}
