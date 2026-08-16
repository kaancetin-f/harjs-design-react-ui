"use client";

import { LayoutDemoFrame, LayoutShell } from "@/components/demos/layout/layout/shell";

export function LayoutOverlay() {
  return (
    <LayoutDemoFrame>
      <LayoutShell
        name="docs-layout-overlay"
        mode="overlay"
        defaultCollapsed
        siderWidth={240}
        collapsedWidth={72}
        section={
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5 }}>
            <code>mode=&quot;overlay&quot;</code> expands the sider over the content instead of pushing it.
            Pin or hover on desktop; below 768px it still uses the mobile drawer.
          </p>
        }
      />
    </LayoutDemoFrame>
  );
}
