"use client";

import { type ComponentProps, type ReactNode } from "react";
import { ConfigProvider, Icon, Layout, Menu } from "@/lib/ui";
import { LogoMark } from "@/components/logo-mark";

export const layoutDemoMenuData = [
  {
    key: "dashboard",
    render: "Dashboard",
    icon: <Icon icon="Front" size={16} fill="currentColor" />,
  },
  {
    key: "projects",
    render: "Projects",
    icon: <Icon icon="Document" size={16} fill="currentColor" />,
  },
  {
    key: "settings",
    render: "Settings",
    icon: <Icon icon="Filter" size={16} fill="currentColor" />,
  },
];

export function LayoutDemoFrame({ children, height = 320 }: { children: ReactNode; height?: number }) {
  return (
    <ConfigProvider>
      <div className="layout-demo" style={{ height }}>
        {children}
      </div>
    </ConfigProvider>
  );
}

export function DemoLogo({ mini = false }: { mini?: boolean }) {
  return <LogoMark size={mini ? 22 : 28} />;
}

export function LayoutShell({
  name = "docs-layout-shell",
  theme,
  siderWidth,
  collapsedWidth,
  headerHeight,
  stickyHeader,
  stickySider,
  defaultCollapsed,
  collapsed,
  onCollapse,
  collapsible,
  trigger,
  mode,
  position,
  fullWidth,
  sectionMaxWidth,
  headerActions,
  header,
  footer,
  menu,
  section,
  menuButton,
}: {
  name?: string;
  theme?: ComponentProps<typeof Layout>["theme"];
  siderWidth?: number | string;
  collapsedWidth?: number | string;
  headerHeight?: number | string;
  stickyHeader?: boolean;
  stickySider?: boolean;
  defaultCollapsed?: boolean;
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
  collapsible?: boolean;
  trigger?: ReactNode | null;
  mode?: "push" | "overlay";
  position?: "left" | "right";
  fullWidth?: boolean;
  sectionMaxWidth?: string;
  headerActions?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  menu?: ReactNode;
  section?: ReactNode;
  menuButton?: boolean;
}) {
  return (
    <Layout
      name={name}
      theme={theme}
      siderWidth={siderWidth}
      collapsedWidth={collapsedWidth}
      headerHeight={headerHeight}
      stickyHeader={stickyHeader}
      stickySider={stickySider}
    >
      <Layout.Sider
        defaultCollapsed={defaultCollapsed}
        collapsed={collapsed}
        onCollapse={onCollapse}
        collapsible={collapsible}
        trigger={trigger}
        mode={mode}
        position={position}
        footer="v1.0.0"
        logo={{
          default: <DemoLogo />,
          mini: <DemoLogo mini />,
        }}
      >
        {menu ?? <Menu data={layoutDemoMenuData} />}
      </Layout.Sider>
      <Layout.Content>
        <Layout.Header
          menuButton={menuButton}
          actions={headerActions ?? <span style={{ fontSize: 13 }}>Actions</span>}
        >
          {header ?? <strong style={{ fontSize: 14 }}>Workspace</strong>}
        </Layout.Header>
        <Layout.Section fullWidth={fullWidth} maxWidth={sectionMaxWidth}>
          {section ?? (
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5 }}>
              Page content lives in <code>Layout.Section</code>. Theme tokens cascade from the root <code>Layout</code>{" "}
              via CSS variables.
            </p>
          )}
        </Layout.Section>
        <Layout.Footer>{footer ?? <span style={{ fontSize: 12 }}>© HarJS</span>}</Layout.Footer>
      </Layout.Content>
    </Layout>
  );
}
