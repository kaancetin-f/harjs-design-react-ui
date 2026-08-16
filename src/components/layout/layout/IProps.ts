import React from "react";
import { IChildrenProps } from "../../../libs/infrastructure/types/IGlobalProps";

export type LayoutSizeValue = number | string;

export interface ILayoutSlotProps {
  className?: string;
  style?: React.CSSProperties;
}

export interface ILayoutSiderLockButtonTheme {
  background?: string;
  color?: string;
  shadow?: string;
}

export interface ILayoutThemeCommon {
  background?: string;
  borderColor?: string;
  textColor?: string;
  fontSize?: string;
}

export interface ILayoutThemeLayout {
  background?: string;
}

export interface ILayoutThemeSider {
  background?: string;
  borderColor?: string;
  textColor?: string;
  logoDivider?: string;
  lockButton?: ILayoutSiderLockButtonTheme;
}

export interface ILayoutThemeHeader {
  background?: string;
  textColor?: string;
}

export interface ILayoutThemeContent {
  background?: string;
}

export interface ILayoutThemeSection {
  background?: string;
}

export interface ILayoutThemeFooter {
  background?: string;
  textColor?: string;
}

export interface ILayoutTheme {
  common?: ILayoutThemeCommon;
  layout?: ILayoutThemeLayout;
  sider?: ILayoutThemeSider;
  header?: ILayoutThemeHeader;
  content?: ILayoutThemeContent;
  section?: ILayoutThemeSection;
  footer?: ILayoutThemeFooter;
}

export interface ILayoutSlots {
  sider?: ILayoutSlotProps;
  header?: ILayoutSlotProps;
  content?: ILayoutSlotProps;
  section?: ILayoutSlotProps;
  footer?: ILayoutSlotProps;
}

export interface ILayoutProps extends IChildrenProps {
  name?: string;
  className?: string;
  style?: React.CSSProperties;
  /**
   * Force row layout when a Sider is present. Omit to detect a direct
   * `Layout.Sider` child (needed for SSR if the sider appears later).
   */
  hasSider?: boolean;
  siderWidth?: LayoutSizeValue;
  collapsedWidth?: LayoutSizeValue;
  headerHeight?: LayoutSizeValue;
  stickyHeader?: boolean;
  stickySider?: boolean;
  theme?: ILayoutTheme;
  slots?: ILayoutSlots;
}

export interface ILayoutHeaderProps extends IChildrenProps, ILayoutSlotProps {
  actions?: React.ReactNode;
  /** Overlay menu button. Default shows it when a sider exists. */
  menuButton?: boolean;
}

export interface ILayoutSiderProps extends IChildrenProps, ILayoutSlotProps {
  logo?: {
    default: React.ReactElement;
    mini?: React.ReactElement;
    onClick?: () => void;
  };
  footer?: React.ReactNode;
  defaultCollapsed?: boolean;
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
  collapsible?: boolean;
  /** Replace the pin control. `null` hides it (use a header button instead). */
  trigger?: React.ReactNode | null;
  /** `overlay` expands over content instead of pushing it. */
  mode?: "push" | "overlay";
  width?: LayoutSizeValue;
  collapsedWidth?: LayoutSizeValue;
  position?: "left" | "right";
  reverseArrow?: boolean;
}

export interface ILayoutContentProps extends IChildrenProps, ILayoutSlotProps {}

export interface ILayoutSectionProps extends IChildrenProps, ILayoutSlotProps {
  fullWidth?: boolean;
  maxWidth?: string;
}

export interface ILayoutFooterProps extends IChildrenProps, ILayoutSlotProps {}
