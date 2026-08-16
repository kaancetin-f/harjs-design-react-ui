'use client';

import { Button, GridSystem } from '@/lib/ui';

const { Flex } = GridSystem;

export function ButtonGroupVariants() {
  return (
    <Flex flexDirection="column" gap="var(--space-16)" width="100%">
      <Button.Group variant="filled" color="blue" size="md">
        <Button>One</Button>
        <Button>Two</Button>
        <Button>Three</Button>
      </Button.Group>
      <Button.Group variant="outlined" color="teal" size="sm">
        <Button>One</Button>
        <Button>Two</Button>
        <Button>Three</Button>
      </Button.Group>
    </Flex>
  );
}
