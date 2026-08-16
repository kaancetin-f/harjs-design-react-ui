"use client";

import { GridSystem, Progress, Typography } from "@/lib/ui";

const { Flex } = GridSystem;
const { Paragraph } = Typography;

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

export function ProgressColors() {
  return (
    <Flex flexDirection="column" gap="var(--space-16)" width="100%">
      {colors.map((color) => (
        <Flex
          key={color}
          flexDirection="column"
          gap="var(--space-8)"
          width="100%"
        >
          <Paragraph>
            {color} · value 40
          </Paragraph>
          <Progress value={40} color={color} />
        </Flex>
      ))}
    </Flex>
  );
}
