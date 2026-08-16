'use client';

import { GridSystem } from '@/lib/ui';
import { GridCell } from './cell';

const { Flex } = GridSystem;

export function GridFlex() {
  return (
    <Flex flexDirection="column" gap="var(--space-20)" width="100%">
      <Flex gap="var(--space-12)" width="100%">
        <GridCell>One</GridCell>
        <GridCell>Two</GridCell>
        <GridCell>Three</GridCell>
      </Flex>
      <Flex justifyContent="space-between" alignItems="center" gap="var(--space-12)" width="100%">
        <GridCell fit>Start</GridCell>
        <GridCell fit>Between</GridCell>
        <GridCell fit>End</GridCell>
      </Flex>
      <Flex flexWrap="wrap" gap="var(--space-12)" width="100%">
        <GridCell fit>Wrap</GridCell>
        <GridCell fit>Gap 12</GridCell>
        <GridCell fit>One</GridCell>
        <GridCell fit>Two</GridCell>
        <GridCell fit>Three</GridCell>
        <GridCell fit>Four</GridCell>
      </Flex>
    </Flex>
  );
}
