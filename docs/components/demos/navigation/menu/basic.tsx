"use client";

import type { CSSProperties, ReactNode } from "react";
import { Icon, Menu } from "@/lib/ui";

export const menuPreviewStyle: CSSProperties = {
  width: "16.5rem",
  maxWidth: "100%",
  padding: "var(--space-8)",
  border: "var(--stroke-1) solid var(--gray-200)",
  borderRadius: "var(--radius-8)",
  // white-alpha sabit beyaz kalır; dark modda yüzey token kullan.
  backgroundColor: "var(--white-100)",
};

export function MenuPreview({
  children,
  width = "16.5rem",
}: {
  children: ReactNode;
  width?: string;
}) {
  return <div style={{ ...menuPreviewStyle, width }}>{children}</div>;
}

export const menuDemoData = [
  {
    key: "dashboard",
    render: "Dashboard",
    icon: <Icon icon="Front" size={16} fill="currentColor" />,
  },
  {
    key: "products",
    render: "Products",
    icon: <Icon icon="Document" size={16} fill="currentColor" />,
  },
  {
    key: "settings",
    render: "Settings",
    icon: <Icon icon="Filter" size={16} fill="currentColor" />,
  },
];

export const menuNestedData = [
  {
    key: "dashboard",
    render: "Dashboard",
    icon: <Icon icon="Front" size={16} fill="currentColor" />,
  },
  {
    key: "products",
    type: "group" as const,
    render: "Products",
    icon: <Icon icon="Folder" size={16} fill="currentColor" />,
    submenu: [
      {
        key: "electronics",
        type: "group" as const,
        render: "Electronics",
        submenu: [
          { key: "phones", render: "Phones" },
          { key: "laptops", render: "Laptops" },
        ],
      },
      { key: "apparel", render: "Apparel" },
      { key: "quarterly", render: "Quarterly analytics reports" },
    ],
  },
  { key: "divider-1", type: "divider" as const },
  {
    key: "settings",
    render: "Settings",
    icon: <Icon icon="Filter" size={16} fill="currentColor" />,
  },
];

export function MenuBasic() {
  return (
    <MenuPreview>
      <Menu data={menuDemoData} />
    </MenuPreview>
  );
}
