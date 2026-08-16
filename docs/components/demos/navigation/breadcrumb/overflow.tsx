"use client";

import { Breadcrumb, GridSystem, Typography } from "@/lib/ui";

const { Flex } = GridSystem;
const { Paragraph } = Typography;

export function BreadcrumbLong() {
  return (
    <Flex flexDirection="column" gap="var(--space-12)">
      <Breadcrumb
        maxItems={4}
        items={[
          { label: "Home", href: "#home" },
          { label: "Products", href: "#products" },
          { label: "Electronics", href: "#electronics" },
          { label: "Mobile", href: "#mobile" },
          { label: "Smartphones", href: "#smartphones" },
          { label: "Apple", href: "#apple" },
          { label: "iPhone 15 Pro" },
        ]}
      />
      <Paragraph size="sm" color="gray-600">
        The ellipsis opens a menu of hidden pages. Pick a crumb to jump without expanding the trail.
      </Paragraph>
    </Flex>
  );
}

export function BreadcrumbResponsive() {
  return (
    <div style={{ width: "100%", maxWidth: "16rem" }}>
      <Breadcrumb
        items={[
          { label: "Workspace settings and billing", href: "#workspace" },
          { label: "Access control and SSO", href: "#access" },
          { label: "Active directory mapping" },
        ]}
      />
    </div>
  );
}
