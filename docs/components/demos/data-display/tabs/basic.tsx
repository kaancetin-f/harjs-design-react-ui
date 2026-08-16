"use client";

import { Tabs } from "@/lib/ui";

export function TabsBasic() {
  return (
    <Tabs
      name="docs-tabs-basic"
      tabs={[
        { title: "Overview", content: "Project overview and status." },
        { title: "Activity", content: "Recent comments and events." },
        { title: "Settings", content: "Workspace preferences." },
      ]}
    />
  );
}
