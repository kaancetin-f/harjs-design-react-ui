'use client';

import { GridSystem, Typography } from '@/lib/ui';

const { Flex } = GridSystem;
const { Title } = Typography;

const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;

export function TypographyTitle() {
  return (
    <Flex flexDirection="column" gap="var(--space-8)" width="100%">
      {sizes.map((size) => (
        <Title key={size} size={size}>
          Heading {size}
        </Title>
      ))}
    </Flex>
  );
}
