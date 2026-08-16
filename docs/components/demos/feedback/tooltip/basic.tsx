"use client";

import { Button, Tooltip } from "@/lib/ui";

export function TooltipBasic() {
  return (
    <Tooltip text="This is a tooltip">
      <Button variant="outlined" color="blue">
        Hover me
      </Button>
    </Tooltip>
  );
}
