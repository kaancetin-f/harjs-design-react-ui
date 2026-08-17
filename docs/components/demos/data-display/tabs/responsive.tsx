"use client";

import { Tabs, Typography } from "@/lib/ui";

const { Paragraph } = Typography;

const overflowTabs = [
  { title: "Overview", content: "High-level status for the workspace." },
  { title: "Members & roles", content: "People and permission groups." },
  { title: "Integrations", content: "Connected apps and webhooks." },
  { title: "Billing history", content: "Invoices and payment methods." },
  { title: "Audit log", content: "Security and admin events." },
  { title: "Feature flags", content: "Rollouts and experiments." },
  { title: "Notifications", content: "Email and in-app preferences." },
  { title: "API keys", content: "Tokens for service access." },
];

export function TabsResponsive() {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "22rem",
        padding: "var(--space-12)",
        border: "var(--stroke-1) solid var(--gray-200)",
        borderRadius: "var(--radius-8)",
        backgroundColor: "var(--white-100)",
      }}
    >
      <Paragraph size="sm" color="gray-500" style={{ margin: "0 0 var(--space-12)" }}>
        Narrow frame (~22rem). Drag the list or use the edge controls to reveal more tabs.
      </Paragraph>
      <Tabs name="docs-tabs-responsive" tabs={overflowTabs} />
    </div>
  );
}

TabsResponsive.displayName = "TabsResponsive";
