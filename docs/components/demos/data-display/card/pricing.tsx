'use client';

import { Button, Card, Chip, GridSystem, Typography } from '@/lib/ui';

const { Flex } = GridSystem;
const { Paragraph } = Typography;

const features = ['Unlimited projects', 'SSO and audit log', 'Priority support', 'Workspace roles'];

export function CardPricing() {
  return (
    <Flex flexWrap="wrap" gap="var(--space-16)" width="100%" alignItems="stretch">
      <div style={{ flex: '1 1 16rem', minWidth: 0 }}>
        <Card title="Starter" color="gray-500">
          <Flex flexDirection="column" gap="var(--space-16)">
            <Flex alignItems="baseline" gap="var(--space-8)">
              <span style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.04em', color: 'var(--gray-800)' }}>
                $12
              </span>
              <Paragraph size="sm" color="gray-500">
                / month
              </Paragraph>
            </Flex>
            <Paragraph>For small teams getting a design system off the ground.</Paragraph>
            <Flex flexDirection="column" gap="var(--space-8)">
              {['3 projects', 'Community support', 'Basic roles'].map((item) => (
                <Paragraph key={item} size="sm">
                  {item}
                </Paragraph>
              ))}
            </Flex>
            <Button variant="outlined" color="gray" fullWidth>
              Continue
            </Button>
          </Flex>
        </Card>
      </div>
      <div style={{ flex: '1 1 16rem', minWidth: 0 }}>
        <Card
          title="Studio"
          color="blue"
          variant="surface"
          actions={<Chip text="Popular" color="blue" variant="filled" size="sm" />}
        >
          <Flex flexDirection="column" gap="var(--space-16)">
            <Flex alignItems="baseline" gap="var(--space-8)">
              <span style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.04em', color: 'var(--gray-800)' }}>
                $48
              </span>
              <Paragraph size="sm" color="gray-500">
                / month
              </Paragraph>
            </Flex>
            <Paragraph>Everything in Starter, plus the controls a growing product team needs.</Paragraph>
            <Flex flexDirection="column" gap="var(--space-8)">
              {features.map((item) => (
                <Paragraph key={item} size="sm">
                  {item}
                </Paragraph>
              ))}
            </Flex>
            <Button color="blue" fullWidth>
              Start trial
            </Button>
          </Flex>
        </Card>
      </div>
    </Flex>
  );
}
