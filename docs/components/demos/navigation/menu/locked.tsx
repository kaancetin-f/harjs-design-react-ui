"use client";

import { useEffect, useState } from "react";
import { Button, GridSystem, Menu, Typography } from "@/lib/ui";
import { DispatchEvent, SessionStorage } from "../../../../../src/libs/infrastructure/shared/Enums";
import { MenuPreview, menuNestedData } from "./basic";

const { Flex } = GridSystem;
const { Paragraph } = Typography;

export function MenuLocked() {
  const [locked, setLocked] = useState(true);

  const applyLock = (next: boolean) => {
    setLocked(next);
    sessionStorage.setItem(SessionStorage.MenuIsLocked, String(next));
    window.dispatchEvent(new Event(DispatchEvent.MenuLock));
  };

  useEffect(() => {
    setLocked(true);
    sessionStorage.setItem(SessionStorage.MenuIsLocked, "true");
    window.dispatchEvent(new Event(DispatchEvent.MenuLock));
  }, []);

  return (
    <Flex flexDirection="column" gap="var(--space-12)">
      <Flex gap="var(--space-8)">
        <Button variant="outlined" color="gray" size="sm" onClick={() => applyLock(true)}>
          Lock
        </Button>
        <Button variant="outlined" color="gray" size="sm" onClick={() => applyLock(false)}>
          Unlock
        </Button>
      </Flex>
      <MenuPreview width={locked ? "16.5rem" : "3.75rem"}>
        <Menu data={menuNestedData} />
      </MenuPreview>
      <Paragraph size="sm" color="gray-600">
        Locked shows labels and submenus. Unlocked keeps a compact icon rail — the same contract Layout.Sider uses.
      </Paragraph>
    </Flex>
  );
}
