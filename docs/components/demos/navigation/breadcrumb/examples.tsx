"use client";

import { useState } from "react";
import { Breadcrumb, Chip, GridSystem, Icon, Typography } from "@/lib/ui";

const { Flex } = GridSystem;
const { Paragraph } = Typography;

export function BreadcrumbIcon() {
  return (
    <Breadcrumb
      items={[
        {
          label: (
            <>
              <Icon icon="Folder" size={14} />
              Home
            </>
          ),
          href: "#home",
        },
        { label: "Projects", href: "#projects" },
        { label: "Aurora" },
      ]}
    />
  );
}

export function BreadcrumbClickable() {
  return (
    <Breadcrumb
      items={[
        { label: "Home", href: "#home" },
        { label: "Catalog", href: "#catalog" },
        { label: "Audio", href: "#audio" },
        { label: "Headphones" },
      ]}
    />
  );
}

export function BreadcrumbAction() {
  const [activated, setActivated] = useState("none yet");

  return (
    <Flex flexDirection="column" gap="var(--space-12)">
      <Breadcrumb
        items={[
          { label: "Dashboard", onClick: () => setActivated("Dashboard") },
          { label: "Projects", onClick: () => setActivated("Projects") },
          { label: "Project A", onClick: () => setActivated("Project A") },
          { label: "Settings" },
        ]}
      />
      <Paragraph size="sm" color="gray-600">
        Last activated ancestor: {activated}
      </Paragraph>
    </Flex>
  );
}

export function BreadcrumbCustom() {
  return (
    <Breadcrumb
      items={[
        { label: "Home", href: "#home" },
        {
          label: (
            <>
              Products
              <Chip text="12" color="blue" size="xs" />
            </>
          ),
          href: "#products",
        },
        { label: "Cameras" },
      ]}
    />
  );
}

export function BreadcrumbMenu() {
  return (
    <Breadcrumb
      items={[
        { label: "Home", href: "#home" },
        {
          label: "Projects",
          href: "#projects",
          menu: [
            { label: "Aurora", href: "#aurora" },
            { label: "Northwind", href: "#northwind" },
            { label: "Helios", href: "#helios" },
          ],
        },
        { label: "Settings" },
      ]}
    />
  );
}

export function BreadcrumbRealWorld() {
  return (
    <Breadcrumb
      items={[
        { label: "Dashboard", href: "#dashboard" },
        { label: "Projects", href: "#projects" },
        { label: "Project A", href: "#project-a" },
        { label: "Settings" },
      ]}
    />
  );
}
