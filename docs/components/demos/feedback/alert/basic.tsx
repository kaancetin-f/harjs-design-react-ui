'use client';

import { Alert, GridSystem } from '@/lib/ui';

const { Flex } = GridSystem;

export function AlertBasic() {
  return (
    <Flex flexDirection="column" gap="var(--space-12)" width="100%">
      <Alert status="success" message="Aurora is live. The production slot is yours." />
      <Alert status="warning" message="Two API contracts drifted. Merge stays blocked until review lands." />
    </Flex>
  );
}
