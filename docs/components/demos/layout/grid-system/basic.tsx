'use client';

import { Button, Card, GridSystem } from '@/lib/ui';

const { Flex, Row, Column, Box } = GridSystem;

export function GridBasic() {
  return (
    <Flex flexDirection="column" gap="var(--space-16)" width="100%">
      <Box direction="flex-end">
        <Button size="sm" variant="outlined">
          Cancel
        </Button>
        <Button size="sm">Save</Button>
      </Box>
      <Row>
        <Column size={{ xs: 12, md: 8 }}>
          <Card title="Main">Eight columns from md up. Full width on small screens.</Card>
        </Column>
        <Column size={{ xs: 12, md: 4 }}>
          <Card title="Aside">Four columns from md up.</Card>
        </Column>
      </Row>
    </Flex>
  );
}
