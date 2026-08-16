'use client';

import { GridSystem, Typography } from '@/lib/ui';

const { Flex } = GridSystem;
const { Paragraph } = Typography;

const weights = ['400', '500', '600', '700', '800'] as const;

export function TypographyParagraphFontWeight() {
  return (
    <Flex flexDirection="column" gap="var(--space-8)" width="100%">
      {weights.map((fontWeight) => (
        <Paragraph key={fontWeight} size="md" fontWeight={fontWeight}>
          Weight {fontWeight}
        </Paragraph>
      ))}
    </Flex>
  );
}
