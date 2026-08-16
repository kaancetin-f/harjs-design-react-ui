"use client";

import { useState } from "react";
import { Button, PopupConfirm } from "@/lib/ui";

export function PopupConfirmLongMessage() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="outlined" color="orange" onClick={() => setOpen(true)}>
        Review notes
      </Button>
      <PopupConfirm
        isOpen={open}
        title="Promote with open notes?"
        message="Coverage is 94% and the bundle is in budget, but staging is two commits behind main. The changelog still needs the migration note, and QA wants a pass on the empty states before you promote."
        status="warning"
        buttons={{ cancel: {} }}
        onConfirm={() => setOpen(false)}
      />
    </>
  );
}
