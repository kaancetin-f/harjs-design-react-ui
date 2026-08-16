"use client";

import { Button, GridSystem, Icon, Input, Popover, Typography } from "@/lib/ui";
import { LayoutDemoFrame, LayoutShell } from "@/components/demos/layout/layout/shell";

const { Flex } = GridSystem;
const { Paragraph } = Typography;

const notifications = [
  { id: "brief", title: "Lina approved the Q3 brief", time: "2m ago", unread: true },
  { id: "deploy", title: "Staging deploy finished", time: "1h ago", unread: true },
  { id: "comment", title: "New comment on Atlas", time: "Yesterday", unread: false },
];

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="7" cy="7" r="4.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10.5 10.5 13.5 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function SearchField() {
  return (
    <Input size="sm" placeholder="Search projects…" aria-label="Search projects">
      <Input.Icon position="start">
        <SearchIcon />
      </Input.Icon>
    </Input>
  );
}

function HeaderSearchField() {
  return (
    <div className="layout-header-search">
      <SearchField />
    </div>
  );
}

function HeaderSearchButton() {
  return (
    <div className="layout-header-search-button">
      <Popover title="Search" content={<SearchField />}>
        <Button
          size="sm"
          variant="borderless"
          color="gray"
          shape="square"
          aria-label="Search projects"
          icon={{ element: <SearchIcon /> }}
        />
      </Popover>
    </div>
  );
}

function HeaderNotifications() {
  return (
    <div className="layout-header-notify">
      <Popover
        title="Notifications"
        content={
          <Flex flexDirection="column">
            {notifications.map((item, index) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  gap: 8,
                  padding: "8px 0",
                  borderTop: index === 0 ? undefined : "1px solid var(--gray-200)",
                }}
              >
                <span
                  aria-hidden
                  style={{
                    width: 6,
                    height: 6,
                    marginTop: 6,
                    borderRadius: "50%",
                    flexShrink: 0,
                    background: item.unread ? "var(--blue-500)" : "transparent",
                  }}
                />
                <div style={{ minWidth: 0 }}>
                  <Paragraph size="sm" style={{ margin: 0 }}>
                    {item.title}
                  </Paragraph>
                  <Paragraph size="xs" color="gray-600" style={{ margin: 0 }}>
                    {item.time}
                  </Paragraph>
                </div>
              </div>
            ))}
          </Flex>
        }
      >
        <Button
          size="sm"
          variant="borderless"
          color="gray"
          shape="square"
          aria-label="Open notifications"
          icon={{ element: <Icon icon="Inbox-Fill" size={16} fill="currentColor" /> }}
        />
      </Popover>
      <span className="layout-header-notify-dot" aria-hidden />
    </div>
  );
}

function HeaderProfile() {
  return (
    <Popover
      title="Kaan"
      content={
        <Flex flexDirection="column" gap="var(--space-8)">
          <Paragraph size="sm" color="gray-600" style={{ margin: 0 }}>
            kaan@harjs.design
          </Paragraph>
          <Button
            align="left"
            size="sm"
            variant="borderless"
            color="gray"
            fullWidth
            icon={{
              element: <Icon icon="Filter" size={14} fill="currentColor" />,
              position: "start",
            }}
          >
            Settings
          </Button>
          <Button
            align="left"
            size="sm"
            variant="borderless"
            color="gray"
            fullWidth
            icon={{
              element: <Icon icon="Export" size={14} fill="currentColor" />,
              position: "start",
            }}
          >
            Sign out
          </Button>
        </Flex>
      }
    >
      <Button size="sm" shape="circle" color="blue" aria-label="Open account menu">
        KA
      </Button>
    </Popover>
  );
}

export function LayoutHeaderActions() {
  return (
    <LayoutDemoFrame>
      <LayoutShell
        name="docs-layout-header-actions"
        header={
          <>
            <strong style={{ fontSize: 14 }}>Workspace</strong>
            <HeaderSearchField />
          </>
        }
        headerActions={
          <div className="layout-header-toolbar">
            <HeaderSearchButton />
            <HeaderNotifications />
            <HeaderProfile />
          </div>
        }
        section={
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5 }}>
            Search jumps to a project. The inbox lists mentions and deploys. The avatar opens account settings.
          </p>
        }
      />
    </LayoutDemoFrame>
  );
}
