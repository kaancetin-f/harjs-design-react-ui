"use client";

import { Tabs } from "@/lib/ui";
import { tabsIconItems } from "./variants";

export function TabsIcons() {
  return <Tabs name="docs-tabs-icons" tabs={tabsIconItems} />;
}
