import React from "react";
import {
  MenuItemVariants,
  NavigationMenuProps,
} from "../../../libs/infrastructure/types";

export interface MenuItemProps {
  item: NavigationMenuProps;
  openMenus: string[];
  selectedKey: string | null;
  isMenuLocked: boolean;
  focusable: boolean;
  idPrefix: string;
  onClick: (item: NavigationMenuProps) => void;
}

interface IProps extends React.HTMLAttributes<HTMLElement> {
  data: NavigationMenuProps[];
  variant?: MenuItemVariants;
  theme?: {
    hover?: {
      backgroundColor?: string;
      textColor?: string;
    };
    selected?: {
      color?: string;
      backgroundColor?: string;
      ringColor?: string;
    };
  };
}

export default IProps;
