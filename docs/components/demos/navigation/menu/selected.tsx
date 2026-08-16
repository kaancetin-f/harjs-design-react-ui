"use client";

import { useEffect } from "react";
import { Menu } from "@/lib/ui";
import { DispatchEvent, SessionStorage } from "../../../../../src/libs/infrastructure/shared/Enums";
import { MenuPreview, menuDemoData } from "./basic";

export function MenuSelected() {
  useEffect(() => {
    sessionStorage.setItem(SessionStorage.SelectedMenuItem, "products");
    window.dispatchEvent(new Event(DispatchEvent.SelectedMenuItem));
  }, []);

  return (
    <MenuPreview>
      <Menu data={menuDemoData} />
    </MenuPreview>
  );
}
