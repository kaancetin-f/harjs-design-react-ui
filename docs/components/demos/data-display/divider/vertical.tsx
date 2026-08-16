'use client';

import { Divider, GridSystem, Typography } from '@/lib/ui';

const { Flex } = GridSystem;
const { Paragraph } = Typography;

export function DividerVertical() {
  return (
    <Flex alignItems="stretch" height="7rem" width="100%">
      <Flex flexDirection="column" justifyContent="center" flexGrow={1} gap="var(--space-4)">
        <span style={{ fontWeight: 600, color: 'var(--gray-800)' }}>Inbox</span>
        <Paragraph size="sm" color="gray-500">
          12 open
        </Paragraph>
      </Flex>
      <Divider orientation="vertical" />
      <Flex flexDirection="column" justifyContent="center" flexGrow={1} gap="var(--space-4)">
        <span style={{ fontWeight: 600, color: 'var(--gray-800)' }}>Sent</span>
        <Paragraph size="sm" color="gray-500">
          4 today
        </Paragraph>
      </Flex>
      <Divider orientation="vertical">or</Divider>
      <Flex flexDirection="column" justifyContent="center" flexGrow={1} gap="var(--space-4)">
        <span style={{ fontWeight: 600, color: 'var(--gray-800)' }}>Archive</span>
        <Paragraph size="sm" color="gray-500">
          128 kept
        </Paragraph>
      </Flex>
    </Flex>
  );
}
