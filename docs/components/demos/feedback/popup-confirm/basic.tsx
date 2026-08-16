"use client";

import { useState } from "react";
import { Button, PopupConfirm } from "@/lib/ui";

export function PopupConfirmBasic() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="outlined" color="blue" onClick={() => setOpen(true)}>
        Confirm action
      </Button>
      <PopupConfirm
        isOpen={open}
        title="Promote Sprint 24?"
        message="Production will receive the current staging build."
        status="information"
        buttons={{ cancel: {} }}
        onConfirm={() => setOpen(false)}
      />
    </>
  );
}
