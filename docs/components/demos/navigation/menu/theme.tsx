"use client";

import { Menu } from "@/lib/ui";
import { MenuPreview, menuDemoData } from "./basic";

export function MenuTheme() {
  return (
    <MenuPreview>
      <Menu
        data={menuDemoData}
        theme={{
          hover: {
            backgroundColor: "color-mix(in srgb, var(--cyan-500) 12%, transparent)",
            textColor: "var(--cyan-700)",
          },
          selected: {
            color: "var(--white-alpha-100)",
            backgroundColor: "var(--cyan-500)",
            ringColor: "color-mix(in srgb, var(--cyan-500) 35%, transparent)",
          },
        }}
      />
    </MenuPreview>
  );
}
