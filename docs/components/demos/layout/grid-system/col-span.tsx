'use client';

import { GridSystem } from '@/lib/ui';
import { GridCell } from './cell';

const { Grid } = GridSystem;

export function GridColSpan() {
  return (
    <Grid columns={4} gap="var(--space-12)" width="100%">
      <Grid.Item colSpan={2}>
        <GridCell>Span 2</GridCell>
      </Grid.Item>
      <GridCell>One</GridCell>
      <GridCell>Two</GridCell>
      <Grid.Item colSpan={3}>
        <GridCell>Span 3</GridCell>
      </Grid.Item>
      <GridCell>Four</GridCell>
    </Grid>
  );
}
