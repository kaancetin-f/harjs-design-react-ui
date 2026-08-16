"use client";

import { Button, Tooltip } from "@/lib/ui";

export function TooltipResponsive() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        maxWidth: "22rem",
      }}
    >
      <Tooltip text="Flips when the left edge has no room" direction="left">
        <Button variant="outlined" color="cyan">
          Left edge
        </Button>
      </Tooltip>
      <Tooltip text="Stays inside the viewport near the right edge" direction="right">
        <Button variant="outlined" color="cyan">
          Right edge
        </Button>
      </Tooltip>
    </div>
  );
}
