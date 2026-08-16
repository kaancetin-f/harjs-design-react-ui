"use client";

import { Menu } from "@/lib/ui";
import { MenuPreview, menuNestedData } from "./basic";

export function MenuNested() {
  return (
    <MenuPreview>
      <Menu data={menuNestedData} />
    </MenuPreview>
  );
}
