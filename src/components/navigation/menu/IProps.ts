import React from "react";
import { MenuItemVariants, NavigationMenuProps } from "../../../libs/infrastructure/types";

interface IProps extends React.HTMLAttributes<HTMLElement> {
  data: NavigationMenuProps[];
  variant?: MenuItemVariants;
  config?: {
    icon?: {
      selectedColor: string;
      selectedBackgroundColor: string;
      selectedBackgroundBorderColor: string;
    };
  };
}

export default IProps;
