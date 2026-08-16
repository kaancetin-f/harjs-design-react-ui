'use client';

import { Button, GridSystem } from '@/lib/ui';

const { Flex } = GridSystem;

export function ButtonActionBasic() {
  return (
    <Flex flexWrap="wrap" alignItems="center" gap="var(--space-12)">
      <Button.Action title="Actions" _color="blue" color="blue" size="md">
        <Button>Edit</Button>
        <Button>Duplicate</Button>
        <Button>Delete</Button>
      </Button.Action>
      <Button.Action _color="blue" color="blue" size="md">
        <Button>Edit</Button>
        <Button>Duplicate</Button>
        <Button>Delete</Button>
      </Button.Action>
    </Flex>
  );
}
