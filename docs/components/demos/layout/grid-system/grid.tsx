'use client';

import { GridSystem } from '@/lib/ui';
import { GridCell } from './cell';

const { Flex, Grid } = GridSystem;

export function CssGrid() {
  return (
    <Flex flexDirection="column" gap="var(--space-20)" width="100%">
      <Grid columns={3} gap="var(--space-12)" width="100%">
        <GridCell>One</GridCell>
        <GridCell>Two</GridCell>
        <GridCell>Three</GridCell>
      </Grid>
      <Grid columns="1fr 2fr 1fr" gap="var(--space-12)" width="100%">
        <GridCell>1fr</GridCell>
        <GridCell>2fr</GridCell>
        <GridCell>1fr</GridCell>
      </Grid>
    </Flex>
  );
}
