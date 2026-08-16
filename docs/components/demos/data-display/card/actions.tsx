'use client';

import { Button, Card, Chip, GridSystem, Typography } from '@/lib/ui';

const { Flex } = GridSystem;
const { Paragraph } = Typography;

export function CardActions() {
  return (
    <Flex flexWrap="wrap" gap="var(--space-16)" width="100%">
      <div style={{ flex: '1 1 20rem', minWidth: 0 }}>
        <Card
          title="Invoice INV-2041"
          actions={
            <>
              <Button variant="borderless" color="gray" size="sm">
                Remind
              </Button>
              <Button color="blue" size="sm">
                Pay
              </Button>
            </>
          }
        >
          <Flex flexDirection="column" gap="var(--space-12)">
            <Paragraph>Studio North · due 21 Aug 2026</Paragraph>
            <Flex alignItems="center" justifyContent="space-between" gap="var(--space-12)">
              <span style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--gray-800)' }}>
                $2,480.00
              </span>
              <Chip text="Awaiting" color="orange" variant="surface" size="sm" />
            </Flex>
          </Flex>
        </Card>
      </div>
      <div style={{ flex: '1 1 20rem', minWidth: 0 }}>
        <Card
          title="Workspace access"
          actions={
            <Button color="blue" size="sm">
              Invite
            </Button>
          }
        >
          <Flex flexDirection="column" gap="var(--space-12)">
            <Paragraph>12 members can edit. 3 guests have read-only access to the design files.</Paragraph>
            <Flex flexWrap="wrap" gap="var(--space-8)">
              <Chip text="Owners · 2" color="blue" variant="surface" size="sm" />
              <Chip text="Editors · 10" color="gray" variant="outlined" size="sm" />
            </Flex>
          </Flex>
        </Card>
      </div>
    </Flex>
  );
}
