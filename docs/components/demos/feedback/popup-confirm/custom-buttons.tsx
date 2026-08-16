"use client";

import { useState } from "react";
import { Button, PopupConfirm } from "@/lib/ui";

export function PopupConfirmCustomButtons() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="outlined" color="teal" onClick={() => setOpen(true)}>
        Custom labels
      </Button>
      <PopupConfirm
        isOpen={open}
        title="Save draft?"
        message="Keep the current copy in drafts before you leave."
        status="save"
        buttons={{
          okay: { children: "Save draft", color: "green" },
          cancel: { children: "Discard", color: "red" },
        }}
        onConfirm={() => setOpen(false)}
      />
    </>
  );
}
