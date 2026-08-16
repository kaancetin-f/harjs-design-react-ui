"use client";

import { GridSystem, Progress, Typography } from "@/lib/ui";

const { Flex } = GridSystem;
const { Paragraph } = Typography;

const values = [12, 38, 63, 88];

export function ProgressReverse() {
  return (
    <Flex flexDirection="column" gap="var(--space-24)" width="100%">
      <Flex flexDirection="column" gap="var(--space-16)" width="100%">
        <Paragraph>Default inference</Paragraph>
        {values.map((value) => (
          <Progress key={`default-${value}`} value={value} isVisibleValue />
        ))}
      </Flex>
      <Flex flexDirection="column" gap="var(--space-16)" width="100%">
        <Paragraph>Reversed inference</Paragraph>
        {values.map((value) => (
          <Progress key={`reverse-${value}`} value={value} reverse isVisibleValue />
        ))}
      </Flex>
    </Flex>
  );
}
