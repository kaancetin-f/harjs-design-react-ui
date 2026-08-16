'use client';

import { Alert, GridSystem } from '@/lib/ui';

const { Flex } = GridSystem;

const radii = ['0', '4', '8', '16'] as const;

export function AlertRadius() {
  return (
    <Flex flexDirection="column" gap="var(--space-12)" width="100%">
      {radii.map((radius) => (
        <Alert
          key={radius}
          status="information"
          border={{ radius }}
          message={`border.radius = ${radius}`}
        />
      ))}
    </Flex>
  );
}
