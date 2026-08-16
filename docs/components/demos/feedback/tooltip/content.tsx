"use client";

import { Button, Tooltip } from "@/lib/ui";

export function TooltipLongText() {
  return (
    <Tooltip text="The token is scoped to this workspace. Rotate it from Settings if a client is lost or a leak is suspected.">
      <Button variant="outlined" color="blue">
        Long hint
      </Button>
    </Tooltip>
  );
}

export function TooltipMultiple() {
  return (
    <Tooltip
      text={[
        "First information",
        "Second information",
        "Third information",
      ]}
    >
      <Button variant="outlined" color="blue">
        Multiple lines
      </Button>
    </Tooltip>
  );
}
