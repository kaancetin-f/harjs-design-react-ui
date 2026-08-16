"use client";

import { GridSystem, Menu } from "@/lib/ui";
import { MenuPreview, menuDemoData } from "./basic";

const { Flex } = GridSystem;

export function MenuVariants() {
  return (
    <Flex flexDirection="column" gap="var(--space-16)">
      <MenuPreview>
        <Menu data={menuDemoData} variant="vertical" />
      </MenuPreview>
      <MenuPreview width="100%">
        <Menu data={menuDemoData} variant="horizontal" />
      </MenuPreview>
    </Flex>
  );
}
