"use client";

import { Button, Popover } from "@/lib/ui";

export function PopoverBasic() {
  return (
    <Popover message="Sprint 24 is ready to review.">
      <Button variant="outlined" color="blue">
        Show note
      </Button>
    </Popover>
  );
}
