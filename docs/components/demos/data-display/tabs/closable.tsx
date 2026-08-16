"use client";

import { useState } from "react";
import { Tabs } from "@/lib/ui";

const initial = [
  { title: "Design", content: "Design notes.", config: { canBeClosed: true } },
  { title: "API", content: "Endpoint draft.", config: { canBeClosed: true } },
  { title: "Docs", content: "Documentation outline.", config: { canBeClosed: true } },
];

export function TabsClosable() {
  const [tabs, setTabs] = useState(initial);

  return (
    <Tabs
      name="docs-tabs-closable"
      tabs={tabs}
      onClose={(index) => setTabs((prev) => prev.filter((_, i) => i !== index))}
    />
  );
}
