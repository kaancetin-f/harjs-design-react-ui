"use client";

import { Button, Popover } from "@/lib/ui";

export function PopoverTitle() {
  return (
    <Popover
      title="Sprint 24"
      message="Design is signed off. API review is next."
    >
      <Button variant="outlined" color="blue">
        Sprint status
      </Button>
    </Popover>
  );
}
