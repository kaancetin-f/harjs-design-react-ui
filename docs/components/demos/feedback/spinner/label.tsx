"use client";

import { GridSystem, Spinner, Typography } from "@/lib/ui";

const { Flex } = GridSystem;
const { Paragraph } = Typography;

export function SpinnerLabel() {
  return (
    <Flex alignItems="center" gap="var(--space-8)">
      <Spinner size="sm" label="Checking the pipeline." />
      <Paragraph>Checking the pipeline.</Paragraph>
    </Flex>
  );
}
