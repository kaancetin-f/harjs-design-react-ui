"use client";

import { Tabs } from "@/lib/ui";

export function TabsDisabled() {
  return (
    <Tabs
      name="docs-tabs-disabled"
      tabs={[
        { title: "Overview", content: "Project overview and status." },
        { title: "Activity", content: "Recent comments and events.", disabled: true },
        { title: "Settings", content: "Workspace preferences." },
      ]}
    />
  );
}
