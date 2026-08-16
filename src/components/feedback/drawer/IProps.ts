import type { HTMLAttributes } from "react";
import { BorderRadiuses, DrawerPlacement, DrawerSizes, TabProps, ValidationProps } from "../../../libs/infrastructure/types";
import { IBorderProps, IChildrenProps } from "../../../libs/infrastructure/types/IGlobalProps";
import type TabsProps from "../../data-display/tabs/IProps";

type DrawerTabsConfig = Omit<TabsProps, "name" | "tabs" | "activeTab" | "onChange" | "onClose">;

interface IProps<T extends object>
  extends IChildrenProps, Omit<IBorderProps, "border">, Omit<HTMLAttributes<HTMLDivElement>, "title" | "onChange"> {
  title?: string;
  name?: string;
  size?: DrawerSizes;
  placement?: DrawerPlacement;
  tabs?: TabProps[];
  activeTab?: number;
  border?: { radius: Exclude<BorderRadiuses, "full"> };
  open: {
    get: boolean;
    set: React.Dispatch<React.SetStateAction<boolean>>;
  };
  validation?: {
    data: T;
    rules: ValidationProps<T>[];
  };
  onChange?: (currentTab: number) => void;
  onClose?: (closeTab: number) => void;
  disableCloseOnBackdrop?: boolean;
  disableCloseOnEsc?: boolean;
  config?: {
    freeContent?: boolean;
    tabs?: DrawerTabsConfig;
  };
}

export default IProps;
