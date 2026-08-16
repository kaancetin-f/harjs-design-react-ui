"use client";

import { LayoutDemoFrame, LayoutShell } from "@/components/demos/layout/layout/shell";
import { Menu } from "@/lib/ui";
import { SessionStorage } from "../../../../../src/libs/infrastructure/shared/Enums";
import { layoutDemoMenuData } from "./shell";

if (typeof window !== "undefined") {
  sessionStorage.setItem(SessionStorage.SelectedMenuItem, "dashboard");
}

export function LayoutSelectedColors() {
  return (
    <LayoutDemoFrame>
      <LayoutShell
        theme={{
          sider: {
            background: "#fff",
            borderColor: "var(--gray-200)",
          },
        }}
        menu={
          <Menu
            data={layoutDemoMenuData}
            theme={{
              selected: {
                color: "#0369a1",
                backgroundColor: "#0284c7",
                ringColor: "rgba(2, 132, 199, 0.25)",
              },
            }}
          />
        }
      />
    </LayoutDemoFrame>
  );
}
