'use client';

import { Button, GridSystem } from '@/lib/ui';

const { Flex } = GridSystem;

const radii = ['0', '2', '4', '6', '8', '12', '16', '20', '40', 'full'] as const;

export function ButtonRadius() {
  return (
    <Flex flexWrap="wrap" alignItems="center" gap="var(--space-12)">
      {radii.map((radius) => (
        <Button key={radius} color="blue" border={{ radius }}>
          {radius}
        </Button>
      ))}
    </Flex>
  );
}
