"use client";

import { GridSystem, Progress, Typography } from "@/lib/ui";

const { Flex } = GridSystem;
const { Paragraph } = Typography;

const bands = [
  { value: 12, label: "0–25" },
  { value: 38, label: "26–50" },
  { value: 63, label: "51–75" },
  { value: 88, label: "76–100" },
];

export function ProgressStatus() {
  return (
    <Flex flexDirection="column" gap="var(--space-16)" width="100%">
      {bands.map((band) => (
        <Flex
          key={band.value}
          flexDirection="column"
          gap="var(--space-8)"
          width="100%"
        >
          <Paragraph>
            {band.label} · {band.value}%
          </Paragraph>
          <Progress value={band.value} />
        </Flex>
      ))}
    </Flex>
  );
}
