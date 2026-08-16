'use client';

import { Radio, GridSystem } from '@/lib/ui';

const { Flex } = GridSystem;

export function RadioCardOrientation() {
  return (
    <Flex flexDirection="column" gap="var(--space-16)" width="min(100%, 420px)">
      <Radio.Card
        title="Vertical"
        description="Title and description stack in a column."
        orientation="vertical"
        color="teal"
        defaultChecked
      />
      <Radio.Card
        title="Horizontal"
        description="Title and description sit in a row."
        orientation="horizontal"
        color="purple"
      />
    </Flex>
  );
}
