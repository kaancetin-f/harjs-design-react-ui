'use client';

import { GridSystem } from '@/lib/ui';
import { GridCell } from './cell';

const { Grid } = GridSystem;

export function GridRowSpan() {
  return (
    <Grid columns={3} gap="var(--space-12)" width="100%">
      <Grid.Item rowSpan={2}>
        <GridCell>Row 2</GridCell>
      </Grid.Item>
      <GridCell>One</GridCell>
      <GridCell>Two</GridCell>
      <GridCell>Three</GridCell>
      <GridCell>Four</GridCell>
    </Grid>
  );
}
