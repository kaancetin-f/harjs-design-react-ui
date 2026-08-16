"use client";

import { GridSystem, Progress, Typography } from "@/lib/ui";

const { Flex } = GridSystem;
const { Paragraph } = Typography;

const sizes = ["xs", "sm", "md", "lg", "xl", "2xl"] as const;

export function ProgressSizes() {
  return (
    <Flex flexDirection="column" gap="var(--space-16)" width="100%">
      {sizes.map((size) => (
        <Flex
          key={size}
          flexDirection="column"
          gap="var(--space-8)"
          width="100%"
        >
          <Paragraph>{size}</Paragraph>
          <Progress value={64} size={size} />
        </Flex>
      ))}
    </Flex>
  );
}
