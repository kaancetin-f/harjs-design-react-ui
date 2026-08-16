"use client";

import { GridSystem, Spinner } from "@/lib/ui";

const { Flex } = GridSystem;

const sizes = ["xs", "sm", "md", "lg", "xl", "2xl"] as const;

export function SpinnerSizes() {
  return (
    <Flex flexWrap="wrap" alignItems="center" gap="var(--space-12)">
      {sizes.map((size) => (
        <Spinner key={size} size={size} />
      ))}
    </Flex>
  );
}
