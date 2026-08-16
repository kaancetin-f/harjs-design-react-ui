"use client";

import { useState } from "react";
import { Button, Loading } from "@/lib/ui";

export function LoadingBasic() {
  // states
  const [visible, setVisible] = useState(false);

  // methods
  function show() {
    setVisible(true);
    window.setTimeout(() => setVisible(false), 1600);
  }

  return (
    <>
      <Button variant="outlined" color="orange" onClick={show}>
        Show loading
      </Button>
      {visible ? <Loading /> : null}
    </>
  );
}

LoadingBasic.displayName = "LoadingBasic";

