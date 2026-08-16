"use client";

import { useState } from "react";
import { Input } from "@/lib/ui";

export function InputDecimal() {
  const [value, setValue] = useState("");

  return <Input.Decimal locale="tr-TR" placeholder="Amount" value={value} onChange={(e) => setValue(e.target.value)} />;
}
