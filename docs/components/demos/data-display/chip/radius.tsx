'use client';

import { Chip, GridSystem } from '@/lib/ui';

const { Flex } = GridSystem;

const radii = ['0', '2', '4', '6', '8', '12', '16', '20', '40', 'full'] as const;

const portrait =
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80';

export function ChipRadius() {
  return (
    <Flex flexDirection="column" gap="var(--space-16)" width="100%">
      <Flex flexWrap="wrap" alignItems="center" gap="var(--space-12)">
        {radii.map((radius) => (
          <Chip key={radius} text={radius} color="blue" variant="filled" border={{ radius }} />
        ))}
      </Flex>
      <Flex flexWrap="wrap" alignItems="center" gap="var(--space-12)">
        {radii.map((radius) => (
          <Chip
            key={`image-${radius}`}
            text={radius}
            color="blue"
            variant="surface"
            border={{ radius }}
            image={{ src: portrait, alt: 'Portrait' }}
          />
        ))}
      </Flex>
    </Flex>
  );
}
