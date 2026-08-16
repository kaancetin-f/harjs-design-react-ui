"use client";

import { Button, Popover } from "@/lib/ui";

export function PopoverResponsive() {
  return (
    <div style={{ width: "100%", maxWidth: "16rem" }}>
      <Popover
        fullWidth
        title="Fits the viewport"
        message="The panel clamps to the viewport with a gutter. On a narrow screen it stays on-screen instead of overflowing."
      >
        <Button variant="outlined" color="cyan" fullWidth>
          Open in a narrow column
        </Button>
      </Popover>
    </div>
  );
}
