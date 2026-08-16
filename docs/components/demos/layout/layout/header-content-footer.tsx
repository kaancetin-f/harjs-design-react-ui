"use client";

import { Layout, Menu } from "@/lib/ui";
import { LayoutDemoFrame, layoutDemoMenuData } from "@/components/demos/layout/layout/shell";

export function LayoutHeaderContentFooter() {
  return (
    <LayoutDemoFrame height={280}>
      <Layout name="docs-layout-hcf" headerHeight={56}>
        <Layout.Header actions={<span style={{ fontSize: 13, color: "var(--gray-500)" }}>Account</span>}>
          <strong style={{ fontSize: 14, flexShrink: 0 }}>HarJS</strong>
          <Menu
            variant="horizontal"
            data={layoutDemoMenuData.map((item) => ({ ...item, key: `hcf-${item.key}` }))}
          />
        </Layout.Header>
        <Layout.Content>
          <Layout.Section>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, maxWidth: "42rem" }}>
              Top navigation with header, content, and footer. No sider — the first-level menu sits in the header.
            </p>
          </Layout.Section>
        </Layout.Content>
        <Layout.Footer>
          <span style={{ fontSize: 12, color: "var(--gray-500)" }}>© HarJS</span>
        </Layout.Footer>
      </Layout>
    </LayoutDemoFrame>
  );
}
