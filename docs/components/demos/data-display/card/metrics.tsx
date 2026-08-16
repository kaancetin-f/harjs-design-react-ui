'use client';

import { Card, Chip, GridSystem, Typography } from '@/lib/ui';

const { Flex } = GridSystem;
const { Paragraph } = Typography;

const metrics = [
  {
    label: 'Revenue',
    value: '$48,240',
    hint: 'vs last month',
    chip: { text: '+12.4%', color: 'green' as const },
  },
  {
    label: 'Active users',
    value: '3,812',
    hint: 'across 14 workspaces',
    chip: { text: '+6.1%', color: 'blue' as const },
  },
  {
    label: 'Churn',
    value: '1.8%',
    hint: '30-day rolling',
    chip: { text: '−0.4%', color: 'orange' as const },
  },
];

export function CardMetrics() {
  return (
    <Flex flexWrap="wrap" gap="var(--space-16)" width="100%">
      {metrics.map((metric) => (
        <div key={metric.label} style={{ flex: '1 1 12rem', minWidth: 0 }}>
          <Card>
            <Flex flexDirection="column" gap="var(--space-8)">
              <Flex alignItems="center" justifyContent="space-between" gap="var(--space-8)">
                <Paragraph size="sm" color="gray-500">
                  {metric.label}
                </Paragraph>
                <Chip text={metric.chip.text} color={metric.chip.color} variant="surface" size="sm" />
              </Flex>
              <span
                style={{
                  fontSize: '1.75rem',
                  fontWeight: 700,
                  letterSpacing: '-0.04em',
                  lineHeight: 1.15,
                  color: 'var(--gray-800)',
                }}
              >
                {metric.value}
              </span>
              <Paragraph size="sm" color="gray-500">
                {metric.hint}
              </Paragraph>
            </Flex>
          </Card>
        </div>
      ))}
    </Flex>
  );
}
