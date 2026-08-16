"use client";

import { GridSystem, Spinner } from "@/lib/ui";

const { Flex } = GridSystem;

const statuses = [
  "primary",
  "secondary",
  "information",
  "success",
  "warning",
  "danger",
] as const;

export function SpinnerStatus() {
  return (
    <Flex flexWrap="wrap" alignItems="center" gap="var(--space-12)">
      {statuses.map((status) => (
        <Spinner key={status} status={status} />
      ))}
    </Flex>
  );
}
