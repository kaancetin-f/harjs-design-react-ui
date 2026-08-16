'use client';

import { GridSystem, Typography } from '@/lib/ui';

const { Flex } = GridSystem;
const { Blockquote } = Typography;

const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;

export function TypographyBlockquoteSizes() {
  return (
    <Flex flexDirection="column" gap="var(--space-12)" width="100%">
      {sizes.map((size) => (
        <Blockquote key={size} size={size} cite={`size ${size}`}>
          Quoted copy at {size}.
        </Blockquote>
      ))}
    </Flex>
  );
}
