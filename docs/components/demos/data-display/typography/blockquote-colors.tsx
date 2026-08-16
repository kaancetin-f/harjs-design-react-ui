'use client';

import { GridSystem, Typography } from '@/lib/ui';

const { Flex } = GridSystem;
const { Blockquote } = Typography;

const colors = ['blue', 'purple', 'pink', 'red', 'orange', 'yellow', 'green', 'teal', 'cyan', 'gray', 'white'] as const;

export function TypographyBlockquoteColors() {
  return (
    <Flex flexDirection="column" gap="var(--space-12)" width="100%">
      {colors.map((color) => (
        <Blockquote key={color} color={color} cite={color}>
          A quoted passage with a {color} accent bar.
        </Blockquote>
      ))}
    </Flex>
  );
}
