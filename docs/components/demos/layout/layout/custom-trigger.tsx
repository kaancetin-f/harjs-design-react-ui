"use client";

import { useState } from "react";
import { Button, Icon } from "@/lib/ui";
import { LayoutDemoFrame, LayoutShell } from "@/components/demos/layout/layout/shell";

export function LayoutCustomTrigger() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <LayoutDemoFrame>
      <LayoutShell
        name="docs-layout-custom-trigger"
        collapsed={collapsed}
        onCollapse={setCollapsed}
        trigger={null}
        header={
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <Button
              className="layout-desktop-trigger"
              size="sm"
              variant="borderless"
              color="gray"
              shape="square"
              aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
              icon={{ element: <Icon icon="BulletList" size={18} fill="currentColor" /> }}
              onClick={() => setCollapsed((open) => !open)}
            />
            <strong style={{ fontSize: 14 }}>Workspace</strong>
          </span>
        }
        section={
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5 }}>
            Pass <code>trigger={"{null}"}</code> to hide the pin control, then drive{" "}
            <code>collapsed</code> from a header button.
          </p>
        }
      />
    </LayoutDemoFrame>
  );
}
