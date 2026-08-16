'use client';

import { Card, Chip, GridSystem, Typography } from '@/lib/ui';

const { Flex } = GridSystem;
const { Paragraph } = Typography;

const items = [
  {
    status: 'primary',
    title: 'Deploy queued',
    body: 'aurora-web is waiting for the production slot. ETA 4 minutes.',
    chip: { text: 'Primary', color: 'blue' },
  },
  {
    status: 'success',
    title: 'Checks passed',
    body: '12 jobs finished. Coverage is 94% and the bundle is within budget.',
    chip: { text: 'Success', color: 'green' },
  },
  {
    status: 'warning',
    title: 'Review needed',
    body: 'Two API contracts drifted. Merge is blocked until the review lands.',
    chip: { text: 'Warning', color: 'orange' },
  },
  {
    status: 'danger',
    title: 'Payment failed',
    body: 'INV-2041 was declined. Update the billing method to keep the workspace.',
    chip: { text: 'Danger', color: 'red' },
  },
] as const;

export function CardStatus() {
  return (
    <Flex flexWrap="wrap" gap="var(--space-16)" width="100%">
      {items.map((item) => (
        <div key={item.status} style={{ flex: '1 1 16rem', minWidth: 0 }}>
          <Card title={item.title} status={item.status}>
            <Flex flexDirection="column" gap="var(--space-12)">
              <Paragraph>{item.body}</Paragraph>
              <Chip text={item.chip.text} color={item.chip.color} variant="surface" size="sm" />
            </Flex>
          </Card>
        </div>
      ))}
    </Flex>
  );
}
