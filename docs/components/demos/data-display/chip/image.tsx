'use client';

import { Chip, GridSystem } from '@/lib/ui';

const { Flex } = GridSystem;

const portraits = {
  ada: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
  alan: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
  grace: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
};

export function ChipImage() {
  return (
    <Flex flexDirection="column" gap="var(--space-16)" width="100%">
      <Flex flexWrap="wrap" alignItems="center" gap="var(--space-12)">
        <Chip
          text="Ada Lovelace"
          color="blue"
          variant="surface"
          border={{ radius: 'full' }}
          image={{ src: portraits.ada, alt: 'Ada Lovelace' }}
        />
        <Chip
          text="Alan Turing"
          color="teal"
          variant="outlined"
          border={{ radius: 'full' }}
          image={{ src: portraits.alan, alt: 'Alan Turing', position: 'end' }}
        />
        <Chip
          text="Pair"
          color="purple"
          variant="filled"
          border={{ radius: 'full' }}
          image={[
            { src: portraits.ada, alt: 'Ada', position: 'start' },
            { src: portraits.grace, alt: 'Grace', position: 'end' },
          ]}
        />
      </Flex>
      <Flex flexWrap="wrap" alignItems="center" gap="var(--space-12)">
        <Chip
          text="Grace Hopper"
          color="orange"
          variant="surface"
          size="sm"
          border={{ radius: '8' }}
          image={{ src: portraits.grace, alt: 'Grace Hopper' }}
        />
        <Chip
          text="Staff engineer"
          color="blue"
          variant="outlined"
          size="xl"
          border={{ radius: '12' }}
          image={{ src: portraits.ada, alt: 'Ada Lovelace' }}
        />
      </Flex>
    </Flex>
  );
}
