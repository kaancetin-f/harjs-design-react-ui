"use client";

import { Breadcrumb, GridSystem, Icon } from "@/lib/ui";

const { Flex } = GridSystem;

export function BreadcrumbSeparator() {
  return (
    <Flex flexDirection="column" gap="var(--space-16)">
      <Breadcrumb
        separator=">"
        items={[
          { label: "Home", href: "#home" },
          { label: "Products", href: "#products" },
          { label: "Phones" },
        ]}
      />
      <Breadcrumb
        separator={<Icon icon="CaretRight" size={12} />}
        items={[
          { label: "Home", href: "#home" },
          { label: "Products", href: "#products" },
          { label: "Phones" },
        ]}
      />
    </Flex>
  );
}
