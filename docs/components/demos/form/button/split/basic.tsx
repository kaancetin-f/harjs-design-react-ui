'use client';

import { Button, GridSystem } from '@/lib/ui';

const { Flex } = GridSystem;

export function ButtonSplitBasic() {
  return (
    <Flex flexWrap="wrap" alignItems="center" gap="var(--space-12)">
      <Button.Split color="blue" size="md">
        Save
        <Button>Save as draft</Button>
        <Button>Save and publish</Button>
        <Button>Export</Button>
      </Button.Split>
      <Button.Split variant="outlined" color="teal" size="md">
        Publish
        <Button>Publish later</Button>
        <Button>Schedule</Button>
      </Button.Split>
    </Flex>
  );
}
