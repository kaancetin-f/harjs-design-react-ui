"use client";

import { useState } from "react";
import { Input } from "@/lib/ui";

export function InputBasic() {
  const [value, setValue] = useState("");

  return <Input placeholder="Email" value={value} onChange={(e) => setValue(e.target.value)} />;
}
