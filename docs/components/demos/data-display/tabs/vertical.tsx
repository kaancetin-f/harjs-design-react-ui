'use client';

import { GridSystem, Tabs } from '@/lib/ui';
import { tabsIconItems } from './variants';

const { Flex } = GridSystem;

export function TabsVertical() {
  return (
    <Flex width="100%" height="14rem">
      <Tabs name="docs-tabs-vertical" orientation="vertical" tabs={tabsIconItems} />
    </Flex>
  );
}
