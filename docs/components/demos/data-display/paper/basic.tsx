'use client';

import { Chip, GridSystem, Paper, Typography } from '@/lib/ui';

const { Flex } = GridSystem;
const { Paragraph } = Typography;

export function PaperBasic() {
  return (
    <Flex flexDirection="column" gap="var(--space-16)" width="100%">
      <Paper title="Overview">
        <Flex flexDirection="column" gap="var(--space-12)">
          <Paragraph>
            Paper is a content sheet with an optional header. Use it to group related copy without Card
            accents.
          </Paragraph>
          <Flex flexWrap="wrap" alignItems="center" gap="var(--space-8)">
            <Chip text="Surface" color="gray" variant="surface" size="sm" />
            <Chip text="Optional header" color="blue" variant="outlined" size="sm" />
          </Flex>
        </Flex>
      </Paper>
      <Paper>
        A sheet without a header. Keep supporting notes or a short summary here.
      </Paper>
    </Flex>
  );
}
