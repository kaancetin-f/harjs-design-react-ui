"use client";

import { Button, Popover } from "@/lib/ui";

export function PopoverFullWidth() {
  return (
    <Popover
      fullWidth
      title="Full-width trigger"
      message="fullWidth stretches the trigger wrapper, not the floating panel."
    >
      <Button variant="outlined" color="blue" fullWidth>
        Open along the row
      </Button>
    </Popover>
  );
}
