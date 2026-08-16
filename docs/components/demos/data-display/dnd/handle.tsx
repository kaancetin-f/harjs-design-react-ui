"use client";

import { useState } from "react";
import { DnD } from "@/lib/ui";
import { DnDRow, queue } from "./queue";

export function DnDHandle() {
  const [items, setItems] = useState(queue);

  return (
    <DnD
      data={items}
      itemKey={(item) => item.id}
      onChange={setItems}
      config={{ handle: false }}
      renderItem={(item) => <DnDRow title={item.title} hint={item.hint} />}
    />
  );
}
