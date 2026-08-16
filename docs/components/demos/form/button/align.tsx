"use client";

import { Button, GridSystem } from "@/lib/ui";

const { Flex } = GridSystem;

export function ButtonAlign() {
  return (
    <Flex flexDirection="column" gap="var(--space-12)" width="100%">
      <Button color="blue" fullWidth align="left" icon={{ element: <ArrowIcon />, position: "start" }}>
        Left
      </Button>
      <Button color="blue" fullWidth align="center" icon={{ element: <ArrowIcon />, position: "start" }}>
        Center
      </Button>
      <Button color="blue" fullWidth align="right" icon={{ element: <ArrowIcon />, position: "start" }}>
        Right
      </Button>
      <Button
        variant="outlined"
        color="blue"
        fullWidth
        align="left"
        icon={{ element: <ArrowIcon />, position: "end" }}
      >
        Icon at the end
      </Button>
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
