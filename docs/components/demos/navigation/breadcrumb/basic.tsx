"use client";

import { Breadcrumb } from "@/lib/ui";

export function BreadcrumbBasic() {
  return (
    <Breadcrumb
      items={[
        { label: "Home", href: "#home" },
        { label: "Products", href: "#products" },
        { label: "Electronics" },
      ]}
    />
  );
}

export function BreadcrumbCurrent() {
  return (
    <Breadcrumb
      items={[
        { label: "Home", href: "#home" },
        { label: "Products", href: "#products" },
        { label: "iPhone 15" },
      ]}
    />
  );
}
