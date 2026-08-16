"use client";

import { LayoutDemoFrame, LayoutShell, layoutDemoMenuData } from "@/components/demos/layout/layout/shell";
import { Menu } from "@/lib/ui";

export function LayoutTheme() {
  return (
    <LayoutDemoFrame>
      <LayoutShell
        theme={{
          common: {
            background: "#eef2ff",
          },
          sider: {
            background: "#242629",
            borderColor: "#3a3d40",
            textColor: "#f7f8f8",
            lockButton: {
              background: "#303336",
              color: "#d0d4d8",
              shadow: "0 8px 24px -14px rgba(0, 0, 0, 0.45)",
            },
          },
          header: {
            background: "#ffffff",
            textColor: "#0f172a",
          },
          content: {
            background: "#f8fafc",
          },
          footer: {
            background: "#ffffff",
            textColor: "#64748b",
          },
        }}
        menu={
          <Menu
            data={layoutDemoMenuData}
            theme={{
              selected: {
                color: "#ffffff",
                backgroundColor: "#4f46e5",
                ringColor: "rgba(79, 70, 229, 0.35)",
              },
            }}
          />
        }
      />
    </LayoutDemoFrame>
  );
}
