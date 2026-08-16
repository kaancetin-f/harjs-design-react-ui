"use client";

import { GridSystem, Progress, Typography } from "@/lib/ui";

const { Flex } = GridSystem;
const { Paragraph } = Typography;

const values = [0, 25, 50, 75, 100];

export function ProgressZero() {
  return (
    <Progress value={0} />
  );
}

export function ProgressComplete() {
  return (
    <Progress value={100} />
  );
}

export function ProgressValues() {
  return (
    <Flex flexDirection="column" gap="var(--space-16)" width="100%">
      {values.map((value) => (
        <Flex
          key={value}
          flexDirection="column"
          gap="var(--space-8)"
          width="100%"
        >
          <Paragraph>{value}%</Paragraph>
          <Progress value={value} />
        </Flex>
      ))}
    </Flex>
  );
}

export function ProgressEdge() {
  return (
    <Flex flexDirection="column" gap="var(--space-16)" width="100%">
      <Flex flexDirection="column" gap="var(--space-8)" width="100%">
        <Paragraph>0%</Paragraph>
        <Progress value={0} isVisibleValue />
      </Flex>
      <Flex flexDirection="column" gap="var(--space-8)" width="100%">
        <Paragraph>100%</Paragraph>
        <Progress value={100} isVisibleValue />
      </Flex>
    </Flex>
  );
}
