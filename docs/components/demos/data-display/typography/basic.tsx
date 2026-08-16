'use client';

import { GridSystem, Typography } from '@/lib/ui';

const { Flex } = GridSystem;
const { Title, Paragraph, Blockquote, Kbd } = Typography;

export function TypographyBasic() {
  return (
    <Flex flexDirection="column" gap="var(--space-16)" width="100%">
      <Title size="lg">Product updates</Title>
      <Paragraph>
        Press <Kbd>⌘</Kbd> <Kbd>K</Kbd> to search headings, body copy, quotes, and keys.
      </Paragraph>
      <Blockquote cite="Ada Lovelace">
        The Analytical Engine weaves algebraic patterns, just as the Jacquard loom weaves flowers and leaves.
      </Blockquote>
    </Flex>
  );
}
