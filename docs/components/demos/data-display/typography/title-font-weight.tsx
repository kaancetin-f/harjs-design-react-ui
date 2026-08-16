'use client';

import { GridSystem, Typography } from '@/lib/ui';

const { Flex } = GridSystem;
const { Title } = Typography;

const weights = ['400', '500', '600', '700', '800'] as const;

export function TypographyTitleFontWeight() {
  return (
    <Flex flexDirection="column" gap="var(--space-8)" width="100%">
      {weights.map((fontWeight) => (
        <Title key={fontWeight} size="lg" fontWeight={fontWeight}>
          Weight {fontWeight}
        </Title>
      ))}
    </Flex>
  );
}
