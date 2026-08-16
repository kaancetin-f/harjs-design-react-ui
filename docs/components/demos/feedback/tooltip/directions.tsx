"use client";

import { Button, GridSystem, Tooltip } from "@/lib/ui";

const { Flex } = GridSystem;

export function TooltipDirections() {
  return (
    <Flex flexWrap="wrap" alignItems="center" gap="var(--space-12)">
      <Tooltip text="Preferred side: top" direction="top">
        <Button variant="outlined" color="blue">
          Top
        </Button>
      </Tooltip>
      <Tooltip text="Preferred side: right" direction="right">
        <Button variant="outlined" color="blue">
          Right
        </Button>
      </Tooltip>
      <Tooltip text="Preferred side: bottom" direction="bottom">
        <Button variant="outlined" color="blue">
          Bottom
        </Button>
      </Tooltip>
      <Tooltip text="Preferred side: left" direction="left">
        <Button variant="outlined" color="blue">
          Left
        </Button>
      </Tooltip>
    </Flex>
  );
}
