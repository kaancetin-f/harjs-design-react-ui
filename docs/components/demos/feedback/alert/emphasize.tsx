'use client';

import { Alert, GridSystem } from '@/lib/ui';

const { Flex } = GridSystem;

export function AlertEmphasize() {
  return (
    <Flex flexDirection="column" gap="var(--space-12)" width="100%">
      <Alert status="danger" message="The email field is required." emphasize={['email']} />
      <Alert
        status="warning"
        message="Replace production with staging before you deploy."
        emphasize={['production', 'staging']}
      />
    </Flex>
  );
}
