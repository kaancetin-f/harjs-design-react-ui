"use client";

import { LayoutDemoFrame, LayoutShell } from "@/components/demos/layout/layout/shell";

export function LayoutResponsive() {
  return (
    <LayoutDemoFrame>
      <LayoutShell
        name="docs-layout-responsive"
        section={
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5 }}>
            Below 768px the sider leaves the document flow and becomes a drawer. Open it from the header
            menu button, the backdrop, Escape, or the in-panel close control.
          </p>
        }
      />
    </LayoutDemoFrame>
  );
}
