"use client";

import { Layout } from "@/lib/ui";

function Wireframe({ children }: { children: React.ReactNode }) {
  return <div className="layout-structure-frame">{children}</div>;
}

export function LayoutStructureTop() {
  return (
    <Wireframe>
      <Layout className="is-wireframe" headerHeight={44}>
        <Layout.Header>Header</Layout.Header>
        <Layout.Content>
          <Layout.Section fullWidth>Content</Layout.Section>
        </Layout.Content>
        <Layout.Footer>Footer</Layout.Footer>
      </Layout>
    </Wireframe>
  );
}

export function LayoutStructureHeaderSider() {
  return (
    <Wireframe>
      <Layout className="is-wireframe" name="docs-struct-header-sider" headerHeight={44} siderWidth={96} collapsedWidth={96}>
        <Layout.Header>Header</Layout.Header>
        <Layout>
          <Layout.Sider collapsible={false}>Sider</Layout.Sider>
          <Layout.Content>
            <Layout.Section fullWidth>Content</Layout.Section>
          </Layout.Content>
        </Layout>
      </Layout>
    </Wireframe>
  );
}

export function LayoutStructureHeaderSiderRight() {
  return (
    <Wireframe>
      <Layout className="is-wireframe" name="docs-struct-header-sider-right" headerHeight={44} siderWidth={96} collapsedWidth={96}>
        <Layout.Header>Header</Layout.Header>
        <Layout>
          <Layout.Content>
            <Layout.Section fullWidth>Content</Layout.Section>
          </Layout.Content>
          <Layout.Sider position="right" collapsible={false}>
            Sider
          </Layout.Sider>
        </Layout>
      </Layout>
    </Wireframe>
  );
}

export function LayoutStructureSide() {
  return (
    <Wireframe>
      <Layout className="is-wireframe" name="docs-struct-sider-app" siderWidth={96} collapsedWidth={96} headerHeight={44}>
        <Layout.Sider collapsible={false}>Sider</Layout.Sider>
        <Layout>
          <Layout.Header>Header</Layout.Header>
          <Layout.Content>
            <Layout.Section fullWidth>Content</Layout.Section>
          </Layout.Content>
          <Layout.Footer>Footer</Layout.Footer>
        </Layout>
      </Layout>
    </Wireframe>
  );
}
