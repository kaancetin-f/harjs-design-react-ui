'use client';

import { GridSystem, Typography } from '@/lib/ui';

const { Flex } = GridSystem;
const { Paragraph } = Typography;

const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;

export function TypographyParagraph() {
  return (
    <Flex flexDirection="column" gap="var(--space-8)" width="100%">
      {sizes.map((size) => (
        <Paragraph key={size} size={size}>
          Body copy {size}
        </Paragraph>
      ))}
    </Flex>
  );
}
