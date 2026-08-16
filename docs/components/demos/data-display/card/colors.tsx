'use client';

import { Card, Chip, GridSystem, Typography } from '@/lib/ui';

const { Flex } = GridSystem;
const { Paragraph } = Typography;

const colors = ['blue', 'green', 'orange', 'red', 'purple', 'teal'] as const;

export function CardColors() {
  return (
    <Flex flexWrap="wrap" gap="var(--space-16)" width="100%">
      {colors.map((color) => (
        <div key={color} style={{ flex: '1 1 14rem', minWidth: 0 }}>
          <Card title={color} color={color} variant="surface">
            <Flex flexDirection="column" gap="var(--space-12)">
              <Paragraph>Accent the border and fill without recoloring the body copy.</Paragraph>
              <Chip text="Accent" color={color} variant="surface" size="sm" />
            </Flex>
          </Card>
        </div>
      ))}
    </Flex>
  );
}
