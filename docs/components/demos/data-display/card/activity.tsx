"use client";

import { Card, Chip, Divider, GridSystem, Typography } from "@/lib/ui";

const { Flex } = GridSystem;
const { Paragraph } = Typography;

const events = [
  { title: "Deployed aurora-web", meta: "Ada · 12 min ago", chip: { text: "Ship", color: "green" as const } },
  { title: "Opened pull request #418", meta: "Grace · 1h ago", chip: { text: "Review", color: "blue" as const } },
  { title: "Updated billing method", meta: "Alan · Yesterday", chip: { text: "Billing", color: "orange" as const } },
];

export function CardActivity() {
  return (
    <Card title="Activity" actions={<Chip text="Live" color="green" variant="surface" size="sm" />}>
      <Flex flexDirection="column">
        {events.map((event, index) => (
          <div key={event.title}>
            {index > 0 ? <Divider config={{ margin: "0.75rem 0" }} /> : null}
            <Flex alignItems="center" justifyContent="space-between" gap="var(--space-12)">
              <Flex flexDirection="column" gap="var(--space-2)" flexGrow={1}>
                <span style={{ fontWeight: 600, color: "var(--gray-800)", lineHeight: 1.35 }}>{event.title}</span>
                <Paragraph size="sm" color="gray-500">
                  {event.meta}
                </Paragraph>
              </Flex>
              <Chip text={event.chip.text} color={event.chip.color} variant="outlined" size="sm" />
            </Flex>
          </div>
        ))}
      </Flex>
    </Card>
  );
}
