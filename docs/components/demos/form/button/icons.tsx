"use client";

import { Button, GridSystem } from "@/lib/ui";

const { Flex } = GridSystem;

export function ButtonIcons() {
  return (
    <Flex flexWrap="wrap" alignItems="center" gap="var(--space-12)">
      <Button color="blue" icon={{ element: <ArrowIcon />, position: "start" }}>
        Continue
      </Button>
      <Button variant="outlined" color="blue" icon={{ element: <ArrowIcon />, position: "end" }}>
        Next
      </Button>
      <Button color="blue" shape="square" icon={{ element: <PlusIcon /> }} />
    </Flex>
  );
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}
