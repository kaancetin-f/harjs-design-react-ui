'use client';

import { Alert, Button, GridSystem } from '@/lib/ui';

const { Flex } = GridSystem;

export function AlertChildren() {
  return (
    <Alert status="warning">
      <Flex alignItems="center" justifyContent="space-between" gap="var(--space-12)" flexWrap="wrap">
        <div>
          <strong>Review the API contract.</strong> Two endpoints drifted from the spec.
        </div>
        <Button variant="outlined" color="orange" size="sm">
          Open diff
        </Button>
      </Flex>
    </Alert>
  );
}
