"use client";

import { GridSystem, Progress, Typography } from "@/lib/ui";

const { Flex } = GridSystem;
const { Paragraph } = Typography;

const sizes = ["xs", "sm", "md", "lg", "xl", "2xl"] as const;
const colors = [
  "gray",
  "white",
  "red",
  "orange",
  "yellow",
  "green",
  "teal",
  "blue",
  "cyan",
  "purple",
  "pink",
] as const;

export function ProgressCircle() {
  return (
    <Flex flexWrap="wrap" alignItems="center" gap="var(--space-20)">
      <Progress type="circle" value={0} isVisibleValue />
      <Progress type="circle" value={36} isVisibleValue />
      <Progress type="circle" value={72} isVisibleValue />
      <Progress type="circle" value={100} isVisibleValue />
    </Flex>
  );
}

export function ProgressCircleSizes() {
  return (
    <Flex flexWrap="wrap" alignItems="center" gap="var(--space-16)">
      {sizes.map((size) => (
        <Flex
          key={size}
          flexDirection="column"
          alignItems="center"
          gap="var(--space-8)"
        >
          <Paragraph>{size}</Paragraph>
          <Progress type="circle" value={64} size={size} isVisibleValue />
        </Flex>
      ))}
    </Flex>
  );
}

export function ProgressCircleColors() {
  return (
    <Flex flexWrap="wrap" alignItems="center" gap="var(--space-16)">
      {colors.map((color) => (
        <Flex
          key={color}
          flexDirection="column"
          alignItems="center"
          gap="var(--space-8)"
        >
          <Paragraph>{color}</Paragraph>
          <Progress
            type="circle"
            value={64}
            color={color}
            isVisibleValue
          />
        </Flex>
      ))}
    </Flex>
  );
}
