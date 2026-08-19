'use client';

import { Badge, Card, GridSystem, Typography } from '@/lib/ui';

const { Flex } = GridSystem;
const { Paragraph } = Typography;

export function BadgeRibbon() {
  return (
    <Flex flexDirection="column" gap="var(--space-16)" width="100%">
      <Badge.Ribbon text="Hippies">
        <Card title="Pushes open the window">
          <Paragraph>And raises the spyglass.</Paragraph>
        </Card>
      </Badge.Ribbon>
      <Badge.Ribbon text="Hippies" status="information">
        <Card title="Pushes open the window">
          <Paragraph>And raises the spyglass.</Paragraph>
        </Card>
      </Badge.Ribbon>
      <Badge.Ribbon text="Hippies" status="success" placement="start">
        <Card title="Pushes open the window">
          <Paragraph>And raises the spyglass.</Paragraph>
        </Card>
      </Badge.Ribbon>
    </Flex>
  );
}
