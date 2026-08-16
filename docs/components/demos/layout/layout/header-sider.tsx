"use client";

import { Layout, Menu } from "@/lib/ui";
import {
  DemoLogo,
  LayoutDemoFrame,
  layoutDemoMenuData,
} from "@/components/demos/layout/layout/shell";

export function LayoutHeaderSider() {
  return (
    <LayoutDemoFrame>
      <Layout name="docs-layout-header-sider" siderWidth={220} headerHeight={56}>
        <Layout.Header actions={<span style={{ fontSize: 13, color: "var(--gray-500)" }}>Docs</span>}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
            <DemoLogo mini />
            <strong style={{ fontSize: 14 }}>Documentation</strong>
          </span>
        </Layout.Header>
        <Layout>
          <Layout.Sider collapsible>
            <Menu data={layoutDemoMenuData.map((item) => ({ ...item, key: `docs-sider-${item.key}` }))} />
          </Layout.Sider>
          <Layout.Content>
            <Layout.Section>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, maxWidth: "42rem" }}>
                Full-width header with a sider below — the documentation-site pattern. Nested{" "}
                <code>Layout</code> becomes a row when it contains a sider.
              </p>
            </Layout.Section>
          </Layout.Content>
        </Layout>
      </Layout>
    </LayoutDemoFrame>
  );
}
