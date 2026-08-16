"use client";

import { GridSystem, Progress, Typography } from "@/lib/ui";

const { Flex } = GridSystem;
const { Paragraph } = Typography;

export function ProgressVisibleValue() {
  return (
    <Flex flexDirection="column" gap="var(--space-24)" width="100%">
      <Flex flexDirection="column" gap="var(--space-8)" width="100%">
        <Paragraph>Hidden until hover</Paragraph>
        <Progress value={72} />
      </Flex>
      <Flex flexDirection="column" gap="var(--space-8)" width="100%">
        <Paragraph>Pinned label</Paragraph>
        <Progress value={72} isVisibleValue />
      </Flex>
    </Flex>
  );
}
