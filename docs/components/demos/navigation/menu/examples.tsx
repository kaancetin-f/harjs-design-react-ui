"use client";

import { GridSystem, Icon, Menu, Typography } from "@/lib/ui";
import { MenuPreview } from "./basic";

const { Flex } = GridSystem;
const { Paragraph } = Typography;

export function MenuIcons() {
  return (
    <Flex flexDirection="column" gap="var(--space-12)">
      <MenuPreview>
        <Menu
          data={[
            {
              key: "inbox",
              render: "Inbox",
              icon: <Icon icon="Inbox-Fill" size={16} fill="currentColor" />,
            },
            {
              key: "files",
              render: "Files",
              icon: <Icon icon="Folder" size={16} fill="currentColor" />,
            },
            {
              key: "uploads",
              render: "Uploads",
              icon: <Icon icon="CloudUpload-Fill" size={16} fill="currentColor" />,
            },
          ]}
        />
      </MenuPreview>
      <Paragraph size="sm" color="gray-600">
        Items without an icon keep the placeholder so the row stays aligned.
      </Paragraph>
    </Flex>
  );
}

export function MenuRealWorld() {
  return (
    <MenuPreview>
      <Menu
        data={[
          {
            key: "home",
            render: "Dashboard",
            icon: <Icon icon="Front" size={16} fill="currentColor" />,
          },
          {
            key: "workspace",
            type: "group",
            render: "Workspace",
            icon: <Icon icon="Folder" size={16} fill="currentColor" />,
            submenu: [
              { key: "projects", render: "Projects" },
              { key: "members", render: "Members" },
              { key: "billing", render: "Billing" },
            ],
          },
          { key: "divider-app", type: "divider" },
          {
            key: "settings",
            render: "Settings",
            icon: <Icon icon="Filter" size={16} fill="currentColor" />,
          },
        ]}
      />
    </MenuPreview>
  );
}

export function MenuKeyboard() {
  return (
    <Flex flexDirection="column" gap="var(--space-12)">
      <MenuPreview>
        <Menu
          data={[
            { key: "one", render: "Overview" },
            {
              key: "catalog",
              type: "group",
              render: "Catalog",
              submenu: [
                { key: "items", render: "Items" },
                { key: "collections", render: "Collections" },
              ],
            },
            { key: "three", render: "Reports" },
          ]}
        />
      </MenuPreview>
      <Paragraph size="sm" color="gray-600">
        Tab moves into the list. Arrow Up/Down move between visible items. Arrow Right opens a group, Arrow Left
        closes it. Escape closes the open submenu and returns focus to the parent.
      </Paragraph>
    </Flex>
  );
}
